#!/usr/bin/env python3
"""Batch converter for Volvo product pages using the 1521725 template."""

import argparse
import json
import re
from pathlib import Path
from typing import Dict, List

from bs4 import BeautifulSoup  # type: ignore

BASE_TEMPLATE_PATH = Path('templates/volvo-engine-base.html')
CATEGORY_CONFIGS: Dict[str, Dict[str, object]] = {
    'engine': {
        'dir': 'volvo/engine',
        'category_label': 'Engine Components',
        'category_url': '/pages/categories/volvo-engine-components.html',
        'description_template': (
            "Volvo {part_label_lower} (Part {part_number}) keeps D-series engines within spec on {application}. "
            "Each batch is machined to OEM drawings, bench-tested for leaks, and held in our Mumbai warehouse so field techs can bolt it in without rework."
        ),
        'features': [
            'CNC tolerances within ±10 μm maintain compression, fuel, and oil sealing.',
            'Heat-treated alloy survives repeated 500°C thermal cycles.',
            'Every lot gets dye-penetrant plus pressure testing prior to dispatch.',
            'Laser-etched batch code lets fleets trace metallurgy and QC reports.',
        ],
        'faqs': [
            {
                'q': 'Where is this Volvo engine part used?',
                'a': 'It fits OEM engine assemblies on FM/FH/B-series platforms. Share your VIN or PES number and we will cross-check the EPC before shipping. '
            },
            {
                'q': 'Is ECU programming required?',
                'a': 'Mechanical parts drop in. If sensors need calibration we provide torque and tightening sequence so EMS recognizes the new part.',
            },
            {
                'q': 'What QC is performed?',
                'a': 'We verify geometry on a CMM, run oil/air leak tests, and record the inspection data under each batch code.',
            },
            {
                'q': 'Do you export engine components?',
                'a': 'Yes—weekly air freight lots leave Mumbai with HS codes and fumigation certificates.',
            },
        ],
        'structured_category': 'Engine Components',
    },
    'braking': {
        'dir': 'volvo/braking',
        'category_label': 'Brake & Air Systems',
        'category_url': '/pages/categories/volvo-brake-and-air.html',
        'description_template': (
            "Volvo {part_label_lower} (Part {part_number}) maintains safe braking pressure on {application}. "
            "Valve seats, diaphragms, and sealing faces follow OEM tolerances so stopping distances stay predictable after service."
        ),
        'features': [
            'Bodies and chambers leak-tested at operating pressure.',
            'Elastomers matched to factory Shore hardness to resist cracking.',
            'Port threads protected with caps plus corrosion inhibitor.',
            'Serial numbers on every unit for downstream QC tracing.',
        ],
        'faqs': [
            {
                'q': 'Is calibration required?',
                'a': 'Most brake hardware is plug-and-play. If stroke/bias needs setting we supply adjustment notes with the invoice.',
            },
            {
                'q': 'Compatible with ABS/EBS?',
                'a': 'Yes—components follow Volvo specs so ECU logic sees correct pressures.',
            },
            {
                'q': 'How do you pack air-system parts?',
                'a': 'Ports are blocked, assemblies are braced with foam, and desiccant keeps moisture away.',
            },
            {
                'q': 'Can you ship multi-axle kits?',
                'a': 'We palletize labelled kits for fleet overhauls so workshops can service several trucks at once.',
            },
        ],
        'structured_category': 'Brake & Air Systems',
    },
    'suspension': {
        'dir': 'volvo/suspension',
        'category_label': 'Suspension & Ride Control',
        'category_url': '/pages/categories/volvo-suspension-and-ride-control.html',
        'description_template': (
            "Volvo {part_label_lower} (Part {part_number}) absorbs axle shock on {application}. "
            "We match OEM rubber hardness, shot-peen metal inserts, and preload each batch so the chassis returns to factory ride height."
        ),
        'features': [
            'OEM-grade rubber compounds keep ride height stable.',
            'Shot-peened inserts resist fatigue on mining and construction duty cycles.',
            'Press-fit bores honed for squeak-free alignment.',
            'Ships with torque markings and anti-corrosion wrap.',
        ],
        'faqs': [
            {
                'q': 'Which chassis does it fit?',
                'a': 'It suits FMX/FH suspension sets—share the VIN or axle code for exact confirmation.',
            },
            {
                'q': 'Do I need special tools?',
                'a': 'Standard hydraulic presses/torque tools work; we can share torque specs on request.',
            },
            {
                'q': 'How is it packaged?',
                'a': 'Bushings get VCI wrap and dust caps; larger components are foam-braced to prevent distortion.',
            },
            {
                'q': 'Do you export?',
                'a': 'Yes, weekly export lots leave with HS codes and inspection photos.',
            },
        ],
        'structured_category': 'Suspension & Ride Control',
    },
    'transmission': {
        'dir': 'volvo/transmission',
        'category_label': 'Transmission & Driveline',
        'category_url': '/pages/categories/volvo-transmission-and-driveline.html',
        'description_template': (
            "Volvo {part_label_lower} (Part {part_number}) keeps I-Shift/AT gearboxes shifting cleanly on {application}. "
            "We hone sealing lands, balance rotating parts, and test every lot so the driveline goes back on road without chatter."
        ),
        'features': [
            'Hardened bearing surfaces handle torsional spikes.',
            'Spline and gear profiles ground to OEM backlash tolerances.',
            'Dynamic runout and leak tests before packing.',
            'Grease caps and VCI wrap keep components install-ready.',
        ],
        'faqs': [
            {
                'q': 'Which transmissions use this part?',
                'a': 'It fits I-Shift/I-See gearboxes; send the transmission code to double-check.',
            },
            {
                'q': 'Is calibration needed?',
                'a': 'Mechanical drops rarely need calibration. If actuator shims are required we include the shim data.',
            },
            {
                'q': 'How do you pack driveline parts?',
                'a': 'Parts are dipped in anti-corrosion oil, capped, and wrapped in VCI paper.',
            },
            {
                'q': 'Do you supply export paperwork?',
                'a': 'Yes—HS codes, COO, and pre-dispatch photos come with every overseas shipment.',
            },
        ],
        'structured_category': 'Transmission & Driveline',
    },
}

DEFAULT_ORDER: List[str] = list(CATEGORY_CONFIGS.keys())


def read_template() -> str:
    if not BASE_TEMPLATE_PATH.exists():
        raise FileNotFoundError('Missing Volvo base template (templates/volvo-engine-base.html).')
    return BASE_TEMPLATE_PATH.read_text(encoding='utf-8')


def slug_part_label(raw_title: str, part_number: str) -> str:
    label = raw_title.replace(part_number, '').strip()
    if label.lower().startswith('volvo'):
        label = label[5:].strip()
    return label or 'Component'


def extract_metadata(html_text: str, part_number: str) -> dict:
    soup = BeautifulSoup(html_text, 'html.parser')
    h1 = soup.find('h1')
    raw_title = h1.get_text(strip=True) if h1 else f'Volvo Part {part_number}'
    part_label = slug_part_label(raw_title, part_number)

    ptc_number = None
    ptc_match = re.search(r'PTC\s+Number[: ]+([A-Za-z0-9-]+)', soup.get_text(' '))
    if ptc_match:
        ptc_number = ptc_match.group(1).strip()
    if not ptc_number:
        ptc_number = f'PTC{part_number}'

    table_data = {}
    table = soup.find('table')
    if table:
        cells = [c.get_text(strip=True) for c in table.find_all('td')]
        for i in range(0, len(cells) - 1, 2):
            table_data[cells[i]] = cells[i + 1]

    application = table_data.get('Application') or 'Volvo heavy vehicles (confirm with VIN)'
    alternate = table_data.get('Alternate Part Numbers') or '—'
    measurements = table_data.get('Measurements') or '—'

    return {
        'part_label': part_label,
        'ptc_number': ptc_number,
        'application': application,
        'alternate': alternate,
        'measurements': measurements,
    }


def build_copy(category_key: str, part_label: str, part_number: str, application: str) -> dict:
    cfg = CATEGORY_CONFIGS[category_key]
    part_label_lower = part_label.lower()
    description = cfg['description_template'].format(part_label_lower=part_label_lower, part_number=part_number, application=application)
    meta_description = f"Order Volvo {part_label_lower} {part_number} for {cfg['category_label'].lower()}. Ready stock in Mumbai with pan-India dispatch and WhatsApp quotes."
    keywords = f"Volvo {part_number}, {part_label_lower} {part_number}, {cfg['category_label'].lower()}, {part_number} India, volvo parts Mumbai"
    return {
        'description': description,
        'meta_description': meta_description,
        'keywords': keywords,
        'features': cfg['features'],
        'faqs': cfg['faqs'],
    }


def render_html(context: dict) -> str:
    soup = BeautifulSoup(read_template(), 'html.parser')
    part_number = context['part_number']
    base_url = f"https://partstrading.com/volvo/{context['category_key']}/{part_number}"

    canonical = soup.find('link', {'rel': 'canonical'})
    if canonical:
        canonical['href'] = base_url + '.html'
    for link in soup.find_all('link', rel='alternate'):
        href = link.get('href', '')
        if '/volvo/' in href and href.endswith('.html'):
            link['href'] = base_url + '.html'
        elif '/products/' in href:
            link['href'] = re.sub(r'/products/[^/]+\.html', f"/products/{part_number}.html", href)

    meta_keywords = soup.find('meta', {'name': 'keywords'})
    if meta_keywords:
        meta_keywords['content'] = context['keywords']
    if soup.title:
        soup.title.string = context['page_title']
    meta_desc = soup.find('meta', {'name': 'description'})
    if meta_desc:
        meta_desc['content'] = context['meta_description']

    for og_url in soup.find_all('meta', {'property': 'og:url'}):
        og_url['content'] = base_url
    for og_title in soup.find_all('meta', {'property': 'og:title'}):
        og_title['content'] = context['og_title']
    for og_desc in soup.find_all('meta', {'property': 'og:description'}):
        og_desc['content'] = context['meta_description']
    for tw_url in soup.find_all('meta', {'property': 'twitter:url'}):
        tw_url['content'] = base_url
    for tw_title in soup.find_all('meta', {'property': 'twitter:title'}):
        tw_title['content'] = context['og_title']
    for tw_desc in soup.find_all('meta', {'property': 'twitter:description'}):
        tw_desc['content'] = context['meta_description']

    ld_script = soup.find('script', {'type': 'application/ld+json'})
    if ld_script and ld_script.string:
        data = json.loads(ld_script.string)
        data['name'] = f"Volvo {context['part_label']}"
        data['mpn'] = part_number
        data['sku'] = part_number
        data['description'] = context['structured_description']
        data['url'] = base_url
        data['brand']['name'] = 'Volvo'
        data['brand']['url'] = base_url
        data['category'] = context['structured_category']
        data['additionalProperty'][1]['value'] = context['ptc_number']
        breadcrumb = data.get('breadcrumb', {})
        items = breadcrumb.get('itemListElement', []) if isinstance(breadcrumb, dict) else []
        if len(items) >= 4:
            items[3]['name'] = f"Volvo {context['part_label']} {part_number}"
            items[3]['item'] = base_url
        if 'mainEntity' in data:
            data['mainEntity']['name'] = f"Volvo {context['part_label']} {part_number} Product Page"
            data['mainEntity']['description'] = context['structured_description']
        ld_script.string = json.dumps(data, indent=4)

    sku_crumb = soup.find('li', {'class': 'text-yellow-600 font-semibold'})
    if sku_crumb:
        sku_crumb.string = part_number
    h1 = soup.find('h1')
    if h1:
        h1.string = f"Volvo {context['part_label']} {part_number}"

    part_p = soup.find(string=re.compile('Part Number'))
    if part_p and part_p.parent.name == 'p':
        part_p.parent.string = f"Part Number: {part_number}"
    ptc_p = soup.find(string=re.compile('PTC Number'))
    if ptc_p and ptc_p.parent.name == 'p':
        ptc_p.parent.string = f"PTC Number: {context['ptc_number']}"

    desc_p = soup.find('p', {'class': 'text-gray-700 leading-relaxed'})
    if desc_p:
        desc_p.string = context['description']

    feature_spans = soup.select('ul.space-y-3 span.text-gray-700')
    for span, text in zip(feature_spans, context['features']):
        span.string = text

    spec_table = soup.find('table')
    if spec_table:
        cells = spec_table.find_all('td')
        for i in range(0, len(cells), 2):
            label = cells[i].get_text(strip=True)
            if label == 'Application':
                cells[i + 1].string = context['application']
            elif label == 'Alternate Part Numbers':
                cells[i + 1].string = context['alternate']
            elif label == 'Measurements':
                cells[i + 1].string = context['measurements']
            elif label == 'Category':
                cells[i + 1].string = context['category_label']

    collapsed = soup.find('p', {'class': 'text-sm text-gray-700 mb-4 text-center'})
    if collapsed:
        collapsed.clear()
        collapsed.append('Part: ')
        span = soup.new_tag('span')
        span['class'] = 'font-semibold'
        span.string = part_number
        collapsed.append(span)
        collapsed.append(' • Ready to dispatch')

    quote_btn = soup.find('button', {'id': 'submit-quote-btn'})
    if quote_btn:
        quote_btn['onclick'] = f"submitQuote('{part_number}', 'Volvo {context['part_label']} {part_number}', 'Volvo', '{context['category_label']}')"
    whatsapp_float = soup.find('a', {'class': 'whatsapp-float'})
    if whatsapp_float:
        whatsapp_float['onclick'] = f"requestQuoteOnWhatsApp('{part_number}', 'Volvo {context['part_label']} {part_number}', 'Volvo', '{context['category_label']}', '{context['application']}')"

    faq_section = soup.find('div', class_='mt-12 bg-white rounded-xl shadow-lg p-8')
    if faq_section:
        content_wrapper = faq_section.find('div', {'class': 'space-y-4'})
        if content_wrapper:
            content_wrapper.clear()
            for qa in context['faqs']:
                qa_html = BeautifulSoup(f'''<div class="border-b border-gray-200 pb-4" x-data="{{open: false}}">
<button @click="open = !open" class="w-full text-left flex justify-between items-center py-2 hover:text-yellow-600 transition-colors">
  <h3 class="font-semibold text-gray-900">{qa['q']}</h3>
  <svg class="w-5 h-5 transform transition-transform" :class="{{'rotate-180': open}}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
  </svg>
</button>
<div x-show="open" x-transition class="mt-2 text-gray-700">{qa['a']}</div>
</div>''', 'html.parser')
                content_wrapper.append(qa_html)

    html_output = str(soup)
    html_output = html_output.replace('Scania', 'Volvo')
    html_output = html_output.replace('Hydraulic Systems & Connectors', context['category_label'])
    html_output = html_output.replace('/pages/categories/scania-hydraulic-systems-and-connectors.html', context['category_url'])
    html_output = html_output.replace('https://partstrading.com/scania/hydraulics/302624', base_url)
    html_output = html_output.replace('/scania/hydraulics/302624.html', f"/volvo/{context['category_key']}/{part_number}.html")
    html_output = html_output.replace('PTS2624', context['ptc_number'])
    return html_output


def process_category(category_key: str) -> int:
    cfg = CATEGORY_CONFIGS[category_key]
    dir_path = Path(cfg['dir'])
    if not dir_path.exists():
        print(f"[skip] Directory missing: {dir_path}")
        return 0
    processed = 0
    for html_path in sorted(dir_path.glob('*.html')):
        name = html_path.name
        if any(marker in name for marker in ('-modern', '-sku')):
            continue
        part_number = html_path.stem
        source_html = html_path.read_text(encoding='utf-8')
        metadata = extract_metadata(source_html, part_number)
        copy = build_copy(category_key, metadata['part_label'], part_number, metadata['application'])
        context = {
            'category_key': category_key,
            'category_label': cfg['category_label'],
            'category_url': cfg['category_url'],
            'structured_category': cfg['structured_category'],
            'part_number': part_number,
            'part_label': metadata['part_label'],
            'ptc_number': metadata['ptc_number'],
            'application': metadata['application'],
            'alternate': metadata['alternate'],
            'measurements': metadata['measurements'],
            'description': copy['description'],
            'structured_description': copy['description'],
            'meta_description': copy['meta_description'],
            'keywords': copy['keywords'],
            'features': copy['features'],
            'faqs': copy['faqs'],
            'page_title': f"Volvo {metadata['part_label']} {part_number} | {cfg['category_label']} | PTC",
            'og_title': f"Volvo {metadata['part_label']} {part_number}",
        }
        html_output = render_html(context)
        html_path.write_text(html_output, encoding='utf-8')
        processed += 1
    print(f"Converted {processed} Volvo {category_key} pages.")
    return processed


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Convert Volvo product pages to the modern template.')
    parser.add_argument('--categories', nargs='+', choices=sorted(CATEGORY_CONFIGS.keys()), help='Categories to process (default: all).')
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    categories = args.categories or DEFAULT_ORDER
    total = 0
    for category_key in categories:
        total += process_category(category_key)
    print(f"Total Volvo pages converted: {total}")


if __name__ == '__main__':
    main()
