#!/usr/bin/env python3
"""
retheme_product_pages.py
Fixes the body theme on all product pages under the brand directories
to match the canonical site design (bg-gray-50, no yellow gradient, clean layout).

USAGE
-----
  python3 retheme_product_pages.py            # dry run
  python3 retheme_product_pages.py --write    # write changes

WHAT IT FIXES
-------------
  1. Body class: bg-gradient-to-b from-yellow-50 to-white → bg-gray-50 text-gray-900 font-sans antialiased
  2. Body style padding-top (inline CSS block) → removed
  3. Main content div margin-top: 6rem → removed (sticky nav handles spacing)
  4. CSS imports: ../../assets/css/tailwind.min.css → /assets/css/tailwind.css (absolute, canonical)
  5. CSS imports: ../../assets/css/styles.css → removed (custom styles conflict with canonical design)
  6. CSS imports: ../../assets/css/aos.css → removed (AOS not used in canonical theme)
  7. JS imports: ../../assets/js/alpine.min.js → /assets/js/alpine.min.js (stamp_chrome already fixed these, skip)
  8. JS imports: ../../assets/js/aos.min.js → removed (not needed)
  9. Removes the AOS init script block
"""

import re
import sys
import argparse
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parent

BRAND_DIRS = [
    "cat", "komatsu", "hitachi", "volvo",
    "kobelco", "john-deere", "jcb", "scania",
]

# ─── Replacements ─────────────────────────────────────────────────────────────

def fix_body_class(html: str) -> str:
    """Replace old yellow gradient body class with canonical gray-50."""
    return re.sub(
        r'<body\b[^>]*class="[^"]*bg-gradient-to-b from-yellow-50[^"]*"[^>]*>',
        '<body class="bg-gray-50 text-gray-900 font-sans antialiased">',
        html, count=1
    )


def fix_body_padding(html: str) -> str:
    """Remove the inline CSS block that adds padding-top to body."""
    # Removes the specific padding-top rule injected into <style> blocks
    # Pattern: body {\n    padding-top: Xrem;\n}  (with optional media query)
    html = re.sub(
        r'\s*body\s*\{\s*\n?\s*padding-top:\s*[\d.]+rem;\s*\n?\s*\}',
        '',
        html
    )
    # Also remove the mobile variant
    html = re.sub(
        r'\s*@media\s*\(max-width:\s*768px\)\s*\{\s*\n?\s*body\s*\{\s*\n?\s*padding-top:\s*[\d.]+rem;\s*\n?\s*\}\s*\n?\s*\}',
        '',
        html
    )
    return html


def fix_nav_top(html: str) -> str:
    """Remove the 'nav { top: 0 !important; }' hack."""
    html = re.sub(
        r'\s*/\*\s*Ensure nav is at top\s*\*/\s*\n?\s*nav\s*\{\s*\n?\s*top:\s*0\s*!important;\s*\n?\s*\}',
        '',
        html
    )
    return html


def fix_content_margin(html: str) -> str:
    """Remove the large margin-top from the main content wrapper div."""
    # Targets: style="margin-top: 6rem;"  or  style="margin-top:6rem"
    html = re.sub(
        r'(<div\b[^>]*)\s+style="margin-top:\s*[\d.]+rem;"',
        r'\1',
        html, count=1
    )
    return html


def fix_css_imports(html: str) -> str:
    """Replace relative/old CSS imports with canonical absolute paths."""
    # tailwind.min.css or tailwind.css with relative path → /assets/css/tailwind.css
    html = re.sub(
        r'<link[^>]+href="[^"]*assets/css/tailwind(?:\.min)?\.css"[^>]*>',
        '<link rel="stylesheet" href="/assets/css/tailwind.css">',
        html
    )
    # Remove AOS css
    html = re.sub(
        r'\s*<link[^>]+href="[^"]*assets/css/aos\.css"[^>]*>\n?',
        '\n',
        html
    )
    # Remove styles.css (causes visual drift from canonical design)
    html = re.sub(
        r'\s*<link[^>]+href="[^"]*assets/css/styles\.css"[^>]*>\n?',
        '\n',
        html
    )
    return html


def fix_js_imports(html: str) -> str:
    """Fix relative JS paths and remove AOS."""
    # alpine.min.js: relative path → absolute (stamp_chrome may have already done this,
    # but catch any remaining relative references in the head)
    html = re.sub(
        r'<script[^>]+src="[^"]*assets/js/alpine\.min\.js"[^>]*></script>',
        '<script src="/assets/js/alpine.min.js" defer></script>',
        html, count=1
    )
    # Remove AOS script
    html = re.sub(
        r'\s*<script[^>]+src="[^"]*assets/js/aos\.min\.js"[^>]*></script>\n?',
        '\n',
        html
    )
    # Remove AOS init script block (AOS.init(...))
    html = re.sub(
        r'\s*<script>\s*(?:document\.addEventListener\(["\']DOMContentLoaded["\'],\s*function\s*\(\)\s*\{)?\s*AOS\.init\([^)]*\);?\s*(?:\}\);\s*)?</script>\n?',
        '\n',
        html
    )
    return html


def fix_font_import(html: str) -> str:
    """Remove Playfair Display font (not used in canonical design)."""
    html = re.sub(
        r'Playfair\+Display:[^&"]*&?',
        '',
        html
    )
    # Clean up any resulting double & or trailing & in font URLs
    html = re.sub(r'&(?=display=swap)', '', html)
    return html


def remove_exit_modal(html: str) -> str:
    """Remove the exit-intent modal CSS and HTML if present."""
    # Remove modal CSS block
    html = re.sub(
        r'\s*#exitModal\{[^}]+\}[^<]*\.exit-modal-close[^<]*</style>',
        '</style>',
        html
    )
    # Remove modal HTML div
    html = re.sub(
        r'\s*<div[^>]+id=["\']exitModal["\'][^>]*>[\s\S]*?</div>\s*(?=\s*<script)',
        '\n',
        html
    )
    return html


def apply_all_fixes(html: str) -> str:
    html = fix_body_class(html)
    html = fix_body_padding(html)
    html = fix_nav_top(html)
    html = fix_content_margin(html)
    html = fix_css_imports(html)
    html = fix_js_imports(html)
    html = fix_font_import(html)
    html = remove_exit_modal(html)
    return html


# ─── File walker ──────────────────────────────────────────────────────────────

def iter_product_pages():
    for brand in BRAND_DIRS:
        d = SITE_ROOT / brand
        if d.is_dir():
            yield from d.rglob("*.html")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Retheme product pages to canonical design.")
    parser.add_argument("--write", action="store_true", help="Write changes (default: dry run)")
    args = parser.parse_args()

    changed = unchanged = skipped = 0

    for path in iter_product_pages():
        try:
            original = path.read_text(encoding="utf-8")
        except Exception as e:
            print(f"[ERR] {path}: {e}")
            skipped += 1
            continue

        # Only process pages that still have the old yellow body class
        if "bg-gradient-to-b from-yellow-50" not in original:
            unchanged += 1
            continue

        fixed = apply_all_fixes(original)

        if fixed == original:
            unchanged += 1
            continue

        changed += 1
        if args.write:
            path.write_text(fixed, encoding="utf-8")
        else:
            if changed <= 3:
                print(f"[WOULD CHANGE] {path.relative_to(SITE_ROOT)}")

    action = "Written" if args.write else "Would change"
    print(f"\n{'='*60}")
    print(f"  {action}    : {changed:,}")
    print(f"  Already OK  : {unchanged:,}")
    print(f"  Errors      : {skipped:,}")
    print(f"  Total       : {changed + unchanged + skipped:,}")
    print(f"{'='*60}")
    if not args.write and changed > 0:
        print("  Run with --write to apply changes.")


if __name__ == "__main__":
    main()
