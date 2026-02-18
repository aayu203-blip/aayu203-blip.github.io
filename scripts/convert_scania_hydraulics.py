#!/usr/bin/env python3
import json
import re
from pathlib import Path

from bs4 import BeautifulSoup  # type: ignore

BASE_TEMPLATE_PATH = Path('templates/scania-hydraulics-base.html')
SCANIA_HYD_DIR = Path('scania/hydraulics')
RELATED_CARDS = [
    {"sku": "1422152", "title": "Hydraulic Return Pipe", "category": "Hydraulic Systems & Connectors", "url": "/scania/hydraulics/1422152.html"},
    {"sku": "1453761", "title": "Pressure Hose Assembly", "category": "Hydraulic Systems & Connectors", "url": "/scania/hydraulics/1453761.html"},
    {"sku": "1483544", "title": "Load Sensing Valve", "category": "Hydraulic Systems & Connectors", "url": "/scania/hydraulics/1483544.html"},
    {"sku": "1464824", "title": "Pilot Line Tube", "category": "Hydraulic Systems & Connectors", "url": "/scania/hydraulics/1464824.html"},
    {"sku": "1500068", "title": "Relief Valve Plug", "category": "Hydraulic Systems & Connectors", "url": "/scania/hydraulics/1500068.html"},
    {"sku": "1426555", "title": "Banjo Bolt Kit", "category": "Hydraulic Systems & Connectors", "url": "/scania/hydraulics/1426555.html"},
]

def read_template() -> str:
    if not BASE_TEMPLATE_PATH.exists():
        raise FileNotFoundError(f"Template not found: {BASE_TEMPLATE_PATH}")
    return BASE_TEMPLATE_PATH.read_text(encoding='utf-8')


def slug_part_label(raw_title: str, part_number: str) -> str:
    label = raw_title.replace(part_number, '').strip()
    if label.lower().startswith('scania'):
        label = label[6:].strip()
    return label or 'Hydraulic Component'


def extract_source_metadata(html_text: str, part_number: str) -> dict:
    soup = BeautifulSoup(html_text, 'html.parser')
    h1 = soup.find('h1')
    raw_title = h1.get_text(strip=True) if h1 else f'Scania Part {part_number}'
    part_label = slug_part_label(raw_title, part_number)

    ptc_number = None
    ptc_match = re.search(r'PTC\s+Number[: ]+([A-Za-z0-9-]+)', soup.get_text(" "))
    if ptc_match:
        ptc_number = ptc_match.group(1).strip()
    if not ptc_number or ptc_number == 'PTS2624':
        ptc_number = f'PTC{part_number}'

    table_data = {}
    table = soup.find('table')
    if table:
        cells = [c.get_text(strip=True) for c in table.find_all('td')]
        for i in range(0, len(cells) - 1, 2):
            key = cells[i]
            value = cells[i + 1]
            table_data[key] = value

    application = table_data.get('Application') or 'All Scania hydraulic kits (confirm with VIN)'
    alternate = table_data.get('Alternate Part Numbers') or '—'
    measurements = table_data.get('Measurements') or '—'

    return {
        'part_label': part_label,
        'ptc_number': ptc_number,
        'application': application,
        'alternate': alternate,
        'measurements': measurements,
    }


def build_copy(part_label: str, part_number: str, application: str) -> dict:
    part_label_lower = part_label.lower()
    description = (
        f"Scania {part_label_lower} (Part {part_number}) keeps high-pressure hydraulic circuits stable on {application}. "
        "Every piece we stock is machined to OEM flare geometry, batch-tested for leaks, and stored climate-controlled at our Mumbai warehouse so it drops in without rework."
    )
    meta_description = (
        f"Order Scania {part_label_lower} {part_number} for OEM hydraulic performance. Ready stock in Mumbai with pan-India dispatch and WhatsApp quotes."
    )
    keywords = f"Scania {part_number}, {part_label_lower} {part_number}, scania hydraulic fittings, {part_number} India, scania parts Mumbai"
    features = [
        "Precision-machined sealing faces follow Scania OEM drawings for a drop-in hydraulic fit.",
        "Corrosion-resistant zinc-nickel plating handles humid yards, salt spray, and dirty job sites.",
        "Every lot is hydro-tested to 1.5× working pressure and batch-coded so you can trace QC records.",
        "Ships with clean, capped threads or ports so technicians can install without extra prep on site."
    ]
    faqs = [
        {
            'question': f"Where is Scania {part_label_lower} {part_number} used?",
            'answer': f"It's spec'd for Scania hydraulic kits ({application}). Share your VIN or kit number and we’ll confirm the match before dispatch.",
        },
        {
            'question': "What pressure rating does this part handle?",
            'answer': "Each unit is validated at OEM working pressure with a 1.5× safety factor during our hydro test run.",
        },
        {
            'question': "How do I confirm it fits my truck?",
            'answer': "WhatsApp us your VIN, kit number, or a photo of the existing fitting. Our Scania desk cross-checks every request against the EPC before shipping.",
        },
        {
            'question': "Do you ship hydraulic connectors internationally?",
            'answer': "Yes. We dispatch daily across India and consolidate weekly air freight lots to the Middle East, Africa, and Southeast Asia with full HS-code paperwork.",
        },
    ]
    return {
        'description': description,
        'meta_description': meta_description,
        'keywords': keywords,
        'features': features,
        'faqs': faqs,
    }


def render_related_cards() -> str:
    card_html = []
    for card in RELATED_CARDS:
        html = f'''<div class="group bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200 hover:shadow-lg hover:shadow-yellow-200/50 transition-all duration-300 hover:-translate-y-1">
<div class="flex items-center justify-between mb-4">
  <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
    <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
    </svg>
  </div>
  <span class="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Scania</span>
</div>
<h4 class="font-bold text-gray-900 mb-2 text-lg">{card['title']}</h4>
<p class="text-sm text-gray-600 mb-2 font-medium">Part: {card['sku']}</p>
<p class="text-sm text-gray-500 mb-4">{card['category']}</p>
<a class="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium text-sm group-hover:underline" href="{card['url']}">
  View Details
  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
  </svg>
</a>
</div>'''
        card_html.append(html)
    return "".join(card_html)


def render_html(context: dict) -> str:
    soup = BeautifulSoup(read_template(), 'html.parser')
    part_number = context['part_number']
    part_label = context['part_label']
    base_url = f"https://partstrading.com/scania/hydraulics/{part_number}"
    canonical_link = soup.find('link', {'rel': 'canonical'})
    if canonical_link:
        canonical_link['href'] = base_url + '.html'
    for link in soup.find_all('link', rel='alternate'):
        href = link.get('href', '')
        if '/scania/hydraulics/' in href:
            link['href'] = base_url + '.html'
        else:
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
        data['name'] = f"Scania {part_label}"
        data['mpn'] = part_number
        data['sku'] = part_number
        data['description'] = context['structured_description']
        data['url'] = base_url
        data['brand']['name'] = 'Scania'
        data['brand']['url'] = base_url
        data['additionalProperty'][1]['value'] = context['ptc_number']
        data['breadcrumb']['itemListElement'][3]['name'] = f"Scania {part_label} {part_number}"
        data['breadcrumb']['itemListElement'][3]['item'] = base_url
        data['mainEntity']['name'] = f"Scania {part_label} {part_number} Product Page"
        data['mainEntity']['description'] = context['structured_description']
        ld_script.string = json.dumps(data, indent=4)

    sku_breadcrumb = soup.find('li', {'class': 'text-yellow-600 font-semibold'})
    if sku_breadcrumb:
        sku_breadcrumb.string = part_number
    h1 = soup.find('h1')
    if h1:
        h1.string = f"Scania {part_label} {part_number}"
    part_p = soup.find(attrs={'data-part-number': True})
    if part_p:
        part_p.string = f"Part Number: {part_number}"
    ptc_p = soup.find(attrs={'data-ptc-number': True})
    if ptc_p:
        ptc_p.string = f"PTC Number: {context['ptc_number']}"
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
                cells[i + 1].string = context['measurements'] or '-'

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
        quote_btn['onclick'] = f"submitQuote('{part_number}', 'Scania {part_label} {part_number}', 'Scania', 'Hydraulic Systems & Connectors')"
        quote_panel = quote_btn.find_parent('div', class_='premium-quote-panel')
        if quote_panel:
            cta_title = quote_panel.find('h3')
            if cta_title:
                cta_title.string = f"Scania {part_label} {part_number}"
            cta_part = quote_panel.find('p', string=re.compile(r'Part #', re.IGNORECASE))
            if cta_part:
                cta_part.string = f"Part #{part_number}"
    whatsapp_float = soup.find('a', {'class': 'whatsapp-float'})
    if whatsapp_float:
        whatsapp_float['onclick'] = f"requestQuoteOnWhatsApp('{part_number}', 'Scania {part_label} {part_number}', 'Scania', 'Hydraulic Systems & Connectors', '{context['application']}')"

    faq_section = soup.find('div', class_='mt-12 bg-white rounded-xl shadow-lg p-8')
    if faq_section:
        content_wrapper = faq_section.find('div', {'class': 'space-y-4'})
        if content_wrapper:
            content_wrapper.clear()
            for qa in context['faqs']:
                qa_html = BeautifulSoup(f'''<div class="border-b border-gray-200 pb-4" x-data="{{open: false}}">
<button @click="open = !open" class="w-full text-left flex justify-between items-center py-2 hover:text-yellow-600 transition-colors">
  <h3 class="font-semibold text-gray-900">{qa['question']}</h3>
  <svg class="w-5 h-5 transform transition-transform" :class="{{'rotate-180': open}}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
  </svg>
</button>
<div x-show="open" x-transition class="mt-2 text-gray-700">{qa['answer']}</div>
</div>''', 'html.parser')
                content_wrapper.append(qa_html)

    related_grid = soup.find('div', {'class': 'grid grid-cols-1 md:grid-cols-3 gap-6'})
    if related_grid:
        related_grid.clear()
        related_grid.append(BeautifulSoup(render_related_cards(), 'html.parser'))

    html_output = str(soup)
    html_output = html_output.replace('https://partstrading.com/scania/hydraulics/302624', base_url)
    html_output = html_output.replace('/scania/hydraulics/302624.html', f'/scania/hydraulics/{part_number}.html')
    html_output = html_output.replace('PTS2624', context['ptc_number'])
    return html_output


def main():
    if not BASE_TEMPLATE_PATH.exists():
        raise SystemExit('Base template missing; create templates/scania-hydraulics-base.html first.')
    processed = 0
    # Load enriched data if available
    enriched_data = {}
    try:
        with open('enriched_product_data.json', 'r') as f:
            enriched_data = json.load(f)
            print("Loaded enriched data.")
    except Exception as e:
        print(f"No enriched data found or error loading: {e}")

    for html_path in sorted(SCANIA_HYD_DIR.glob('*.html')):
        name = html_path.name
        if '-modern' in name or '-sku' in name or name == '302624.html':
            continue
        part_number = html_path.stem
        source_html = html_path.read_text(encoding='utf-8')
        metadata = extract_source_metadata(source_html, part_number)
        copy = build_copy(metadata['part_label'], part_number, metadata['application'])
        context = {
            'part_number': part_number,
            'part_label': metadata['part_label'],
            'ptc_number': metadata['ptc_number'],
            'application': metadata['application'],
            'alternate': metadata['alternate'],
            'measurements': metadata['measurements'],
            'description': copy['description'],
            'meta_description': copy['meta_description'],
            'structured_description': copy['description'],
            'keywords': copy['keywords'],
            'features': copy['features'],
            'faqs': copy['faqs'],
            'page_title': f"Scania {metadata['part_label']} {part_number} | Hydraulic Systems & Connectors | PTC",
            'og_title': f"Scania {metadata['part_label']} {part_number} | Hydraulic Connectors",
        }


        # --- AI ENRICHMENT OVERRIDE ---
        if part_number in enriched_data:
            print(f"  [AI] Applying enriched data for {part_number}")
            ed = enriched_data[part_number]
            if 'description' in ed: context['description'] = ed['description']
            if 'features' in ed: context['features'] = ed['features']
            if 'application' in ed: context['application'] = ed['application']
            if 'part_label' in ed: context['part_label'] = ed['part_label']
            if 'measurements' in ed: context['measurements'] = ed['measurements']
        # ------------------------------

        html_output = render_html(context)
        html_path.write_text(html_output, encoding='utf-8')
        processed += 1
    print(f"Converted {processed} Scania hydraulics pages.")


if __name__ == '__main__':
    main()
