#!/usr/bin/env python3
import re
from pathlib import Path
from xml.etree import ElementTree as ET

def remove_duplicate_schemas(html: str) -> str:
    # Keep first Product schema and first BreadcrumbList schema
    schema_blocks = list(re.finditer(r'<script type="application/ld\+json">[\s\S]*?</script>', html))
    kept = []
    seen_product = False
    seen_breadcrumb = False
    for m in schema_blocks:
        block = m.group(0)
        if '"@type": "Product"' in block:
            if not seen_product:
                kept.append(block)
                seen_product = True
            else:
                html = html.replace(block, '', 1)
        elif '"@type": "BreadcrumbList"' in block:
            if not seen_breadcrumb:
                kept.append(block)
                seen_breadcrumb = True
            else:
                html = html.replace(block, '', 1)
        else:
            # keep other schema blocks
            pass
    return html

def clean_legacy_meta(html: str) -> str:
    # Remove legacy/ignored meta tags
    legacy_names = [
        'rating','revisit-after','coverage','distribution','target','ICBM',
        'geo.region','geo.placename','geo.position','HandheldFriendly','MobileOptimized',
    ]
    for name in legacy_names:
        html = re.sub(rf'<meta[^>]*name="{re.escape(name)}"[^>]*/?>\n?', '', html)
    # Remove duplicate robots, keep first
    robots = re.findall(r'<meta[^>]*name="robots"[^>]*/?>', html)
    if len(robots) > 1:
        for tag in robots[1:]:
            html = html.replace(tag, '')
    # Remove keywords entirely
    html = re.sub(r'<meta[^>]*name="keywords"[^>]*/?>\n?', '', html)
    # Fix OG spacing issues
    html = html.replace('SuspensionParts', 'Suspension Parts')
    return html

def sync_titles(html: str) -> str:
    t = re.search(r'<title>([^<]+)</title>', html)
    if not t:
        return html
    title = t.group(1).strip()
    # og:title
    if 'property="og:title"' in html:
        html = re.sub(r'<meta[^>]*property="og:title"[^>]*content="[^"]*"[^>]*/?>',
                      f'<meta content="{title}" property="og:title"/>', html)
    # twitter:title
    if 'property="twitter:title"' in html:
        html = re.sub(r'<meta[^>]*property="twitter:title"[^>]*content="[^"]*"[^>]*/?>',
                      f'<meta content="{title}" property="twitter:title"/>', html)
    return html

def ensure_canonical(html: str, full_url: str) -> str:
    if 'rel="canonical"' in html:
        html = re.sub(r'<link[^>]*rel="canonical"[^>]*>', f'<link href="{full_url}" rel="canonical"/>', html)
    else:
        # insert early in <head>
        html = html.replace('<head>', f'<head>\n<link href="{full_url}" rel="canonical"/>', 1)
    return html

def build_hreflang_block(part_no: str, english_path: str) -> str:
    langs = {
        'en': f'https://partstrading.com/{english_path}',
        'ta': f'https://ta.partstrading.com/pages/products/{part_no}.html',
        'id': f'https://id.partstrading.com/pages/products/{part_no}.html',
        'hi': f'https://hi.partstrading.com/pages/products/{part_no}.html',
        'ar': f'https://ar.partstrading.com/pages/products/{part_no}.html',
        'fr': f'https://fr.partstrading.com/pages/products/{part_no}.html',
        'es': f'https://es.partstrading.com/pages/products/{part_no}.html',
        'ru': f'https://ru.partstrading.com/pages/products/{part_no}.html',
        'zh-CN': f'https://cn.partstrading.com/pages/products/{part_no}.html',
        'kn': f'https://kn.partstrading.com/pages/products/{part_no}.html',
        'ml': f'https://ml.partstrading.com/pages/products/{part_no}.html',
        'te': f'https://te.partstrading.com/pages/products/{part_no}.html',
    }
    lines = [f'<link rel="alternate" hreflang="{hl}" href="{url}" />' for hl, url in langs.items()]
    lines.append(f'<link rel="alternate" hreflang="x-default" href="https://partstrading.com/{english_path}" />')
    return '<!-- International Hreflang Tags -->\n' + "\n".join(lines)

def add_or_replace_hreflang(html: str, block: str) -> str:
    if 'hreflang=' in html:
        # Replace existing block near top of head
        html = re.sub(r'<!-- International Hreflang Tags -->[\s\S]*?(?=<meta|<link|</head>)', block + '\n', html, count=1)
    else:
        html = html.replace('<head>', '<head>\n' + block + '\n', 1)
    return html

def process_product_file(html_path: Path, site_root: Path) -> str:
    html = html_path.read_text(encoding='utf-8')
    original = html
    rel_path = html_path.relative_to(site_root).as_posix()
    part_no = html_path.stem

    # 1) Schema dedupe
    html = remove_duplicate_schemas(html)
    # 2) Meta cleanup
    html = clean_legacy_meta(html)
    # 3) Title/OG/Twitter sync
    html = sync_titles(html)
    # 4) Canonical
    full_url = f'https://partstrading.com/{rel_path}'
    html = ensure_canonical(html, full_url)
    # 5) Hreflang reciprocity
    if rel_path.startswith('volvo/') or rel_path.startswith('scania/'):
        hreflang_block = build_hreflang_block(part_no, rel_path)
        html = add_or_replace_hreflang(html, hreflang_block)
    return html if html != original else None


def update_sitemap(site_root: Path):
    # Ensure product URLs present (English only)
    sitemap_file = site_root / 'sitemap-main.xml'
    if not sitemap_file.exists():
        return
    try:
        tree = ET.parse(sitemap_file)
        root = tree.getroot()
        ns = {'sm': root.tag.split('}')[0].strip('{')}
        urls = set()
        for url in root.findall('sm:url', ns):
            loc = url.find('sm:loc', ns)
            if loc is not None and loc.text:
                urls.add(loc.text)
        # Collect english product URLs
        new_urls = []
        for html_path in list(site_root.glob('volvo/**/*.html')) + list(site_root.glob('scania/**/*.html')):
            rel = html_path.relative_to(site_root).as_posix()
            loc = f'https://partstrading.com/{rel}'
            if loc not in urls:
                u = ET.SubElement(root, f'{{{ns["sm"]}}}url')
                l = ET.SubElement(u, f'{{{ns["sm"]}}}loc')
                l.text = loc
                new_urls.append(loc)
        if new_urls:
            tree.write(sitemap_file, encoding='utf-8', xml_declaration=True)
    except Exception:
        pass


def main():
    site_root = Path(__file__).parent
    targets = list(site_root.glob('volvo/**/*.html')) + list(site_root.glob('scania/**/*.html'))
    changed = 0
    for p in targets:
        out = process_product_file(p, site_root)
        if out is not None:
            p.write_text(out, encoding='utf-8')
            changed += 1
            if changed % 200 == 0:
                print(f'Processed {changed} files...')
    update_sitemap(site_root)
    print(f'\n✅ Final SEO polish applied to {changed} product pages')

if __name__ == '__main__':
    main()
