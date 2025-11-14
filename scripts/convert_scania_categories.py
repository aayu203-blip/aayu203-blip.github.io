#!/usr/bin/env python3
"""Batch-convert Scania product pages to the modern template for multiple categories."""

import argparse
import json
import re
from pathlib import Path
from typing import Dict, List

from bs4 import BeautifulSoup  # type: ignore

BASE_TEMPLATE_PATH = Path('templates/scania-hydraulics-base.html')
CATEGORY_CONFIGS: Dict[str, Dict[str, object]] = {
    'engine': {
        'dir': 'scania/engine',
        'category_label': 'Engine Components',
        'category_url': '/pages/categories/scania-engine-components.html',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) stabilizes combustion loads on {application}. "
            "We machine every contact face to OEM drawings, test oil galleries for leaks, and shelf them climate-controlled in Mumbai so technicians can bolt in without rework."
        ),
        'features': [
            'Machined to Scania OEM tolerances so housings and covers bolt up without shims.',
            'Heat-treated alloys handle repeated hot/cold cycles on long-haul and mining duty.',
            'Oil and coolant passages are leak-checked before every batch leaves our bench.',
            'Each lot is laser batch-coded so you can pull QC data whenever you need it.',
        ],
        'faqs': [
            {
                'q': 'Where is this Scania engine part used?',
                'a': 'It fits Scania P/G/R/S-series engine assemblies. Share your VIN or PES number and we’ll confirm the EPC match before dispatch.',
            },
            {
                'q': 'Do I need ECU programming after installing?',
                'a': 'Most mechanical swaps drop in. If a sensor or actuator needs calibration we include torque values and adaptation steps in the quote reply.',
            },
            {
                'q': 'What testing is performed before shipping?',
                'a': 'Every lot is CMM-measured, leak-tested, and signed off on a QC sheet that we can share with your service team.',
            },
            {
                'q': 'Can you ship engine components internationally?',
                'a': 'Yes—daily India dispatch plus weekly export lots with HS codes, fumigation certificates, and pre-dispatch photos.',
            },
        ],
        'structured_category': 'Engine Components',
    },
    'transmission': {
        'dir': 'scania/transmission',
        'category_label': 'Transmission & Driveline',
        'category_url': '/pages/categories/scania-transmission-and-driveline.html',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) keeps gearboxes shifting cleanly on {application}. "
            "We hone sealing lands, balance rotating parts, and batch-test every lot under load so your driveline goes back on road without chatter."
        ),
        'features': [
            'Ground spline and gear profiles keep backlash within Scania spec.',
            'Hardened bearing surfaces shrug off torsional spikes from loaded drivetrains.',
            'Assemblies are spun for runout and leak-checked before we pack them.',
            'Splines and ports ship capped with VCI wrap so installs stay clean and quick.',
        ],
        'faqs': [
            {
                'q': 'Which Scania gearboxes use this part?',
                'a': 'It covers GRS/GRSO/I-Shift families. Send your VIN or gearbox code so we can confirm the EPC match before dispatch.',
            },
            {
                'q': 'Is calibration needed after replacement?',
                'a': 'Most mechanical drops do not. If clutch packs or actuators need shimming we include shim data and torque notes.',
            },
            {
                'q': 'How do you pack driveline parts?',
                'a': 'Components are dipped in anti-corrosion oil, capped, and cushioned so sealing faces arrive blemish-free.',
            },
            {
                'q': 'Do you supply export paperwork?',
                'a': 'Yes—HS codes, certificates of origin, and pre-dispatch photos are available for every shipment.',
            },
        ],
        'structured_category': 'Transmission & Driveline',
    },
    'suspension': {
        'dir': 'scania/suspension',
        'category_label': 'Suspension & Ride Control',
        'category_url': '/pages/categories/scania-suspension-and-ride-control.html',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) absorbs axle shock on {application}. "
            "We match OEM rubber hardness, shot-peen metal inserts, and pre-stress every batch so the truck returns to factory ride height."
        ),
        'features': [
            'OEM-grade rubber and metal pairs keep ride height and damping consistent.',
            'Shot-peened, stress-relieved inserts resist cracking on rough haul roads.',
            'Press-fit bores are honed for quiet alignment and longer bushing life.',
            'Parts ship with torque markings plus VCI wrap so they drop in without extra prep.',
        ],
        'faqs': [
            {
                'q': 'Which chassis does this suspension component fit?',
                'a': 'It suits Scania chassis codes once we verify your VIN or axle code against the EPC.',
            },
            {
                'q': 'Do I need special tools to install it?',
                'a': 'Standard hydraulic presses and torque tools work. We can share orientation diagrams and torque charts on request.',
            },
            {
                'q': 'How is the part protected during shipping?',
                'a': 'Bushings are capped and foam-braced so the rubber doesn’t flatten or pick up shop debris in transit.',
            },
            {
                'q': 'Do you support export orders?',
                'a': 'Yes—daily domestic dispatch plus consolidated export shipments with HS codes and inspection notes.',
            },
        ],
        'structured_category': 'Suspension & Ride Control',
    },
    'exterior': {
        'dir': 'scania/exterior',
        'category_label': 'Body & Exterior',
        'category_url': '/pages/categories/scania-body-and-exterior.html',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) refreshes cab appearance and aerodynamics on {application}. "
            "We colour-match primers, keep mounting holes indexed, and ship panels in protective crates so they bolt straight on."
        ),
        'features': [
            'Injection-moulded or pressed to OEM dimensions so gaps and shut lines stay true.',
            'Neutral primer finish saves prep time—scuff, paint, and install.',
            'Reinforced mounting bosses handle cab flex and repeated service.',
            'Panels ship with peel film, corner protectors, and foam cradles to prevent transit scuffs.',
        ],
        'faqs': [
            {
                'q': 'Does this panel match factory paint?',
                'a': 'Panels arrive in primer. Share your paint code and we’ll confirm the OE reference for your body shop.',
            },
            {
                'q': 'Are mounting clips included?',
                'a': 'Most kits include the needed clips or seals; if not, we list the compatible hardware in the quote.',
            },
            {
                'q': 'How do you pack large exterior pieces?',
                'a': 'Each part gets foam edging, corner protectors, and double-wall cartons so it arrives dent-free.',
            },
            {
                'q': 'Can you send fitment photos?',
                'a': 'Yes—ask for mounting diagrams or photos and we’ll include them in the dispatch email.',
            },
        ],
        'structured_category': 'Body & Exterior',
    },
    'hardware': {
        'dir': 'scania/hardware',
        'category_label': 'Hardware & Fasteners',
        'category_url': '/pages/categories/scania-hardware-and-fasteners.html',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) keeps chassis assemblies locked down on {application}. "
            "Thread geometry, coatings, and proof-load testing match the OEM spec so torque readings stay accurate even after field service."
        ),
        'features': [
            'Grade-marked steel with OEM coatings resists corrosion and galling.',
            'Threads roll-formed for higher fatigue strength versus cut threads.',
            'Each lot torque-tested and batch-coded for traceability.',
            'Ships with protective caps or VCI sleeves so threads stay clean.',
        ],
        'faqs': [
            {
                'q': 'Which torque spec should I follow?',
                'a': 'Use the torque chart from the Scania workshop manual for your VIN. We can share the spec sheet when you request a quote.',
            },
            {
                'q': 'Are washers or nuts included?',
                'a': 'Most kits include mating hardware. If not, we list compatible part numbers and can pack them together.',
            },
            {
                'q': 'Do you stock stainless or zinc-nickel variants?',
                'a': 'Yes, select SKUs come in alternate finishes. Share the environment details and we will match the right coating.',
            },
            {
                'q': 'Can you ship consolidated hardware kits?',
                'a': 'We regularly palletize mixed fastener kits for fleet overhauls with labeled bags and packing lists.',
            },
        ],
        'structured_category': 'Hardware & Fasteners',
    },
    'misc': {
        'dir': 'scania/misc',
        'category_label': 'Electrical & Cabin Essentials',
        'category_url': '/pages/categories/scania-electrical-and-cabin.html',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) keeps auxiliary systems running on {application}. "
            "Switchgear, sensors, and cabin hardware ship pre-tested so your technicians plug them in without rewiring surprises."
        ),
        'features': [
            'Bench-tested for continuity, signal accuracy, or mechanical travel before packing.',
            'Harness connectors retain OEM keying so they plug into factory looms instantly.',
            'Compact packaging with foam cells protects delicate plastics and PCB traces.',
            'Every box includes QR codes linking to install notes or wiring diagrams.',
        ],
        'faqs': [
            {
                'q': 'Will this part trigger fault codes?',
                'a': 'Components mirror OEM resistance/voltage curves so ECUs read them correctly. Send fault logs and we will double-check before shipping.',
            },
            {
                'q': 'Do you provide wiring assistance?',
                'a': 'Yes, our desk shares pinouts, wiring diagrams, or voice support if your technician needs guidance during install.',
            },
            {
                'q': 'How do you package fragile cabin parts?',
                'a': 'We use foam cradles and anti-static bags so switchgear and displays reach your shop intact.',
            },
            {
                'q': 'Can I club multiple cabin trims in one order?',
                'a': 'Absolutely—we bundle mixed SKUs with labeled cartons so installers can stage parts per cab.',
            },
        ],
        'structured_category': 'Electrical & Cabin Essentials',
    },
    'filtration': {
        'dir': 'scania/filtration',
        'category_label': 'Filters & Filtration',
        'category_url': '/pages/categories/scania-filters-and-filtration.html',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) keeps oil, fuel, or air circuits clean on {application}. "
            "Media density matches OEM microns, and every element is vacuum-bagged so it drops straight into housings without contamination."
        ),
        'features': [
            'Multi-layer media catches fine particulates while maintaining flow.',
            'Seals and end caps moulded to OEM dimensions for leak-free installs.',
            'Each batch pressure-tested for collapse and bypass performance.',
            'Ships vacuum-sealed with desiccant so media stays dust-free.',
        ],
        'faqs': [
            {
                'q': 'What service interval should I follow?',
                'a': 'Use the Scania service schedule for your duty cycle. We can provide interval tables for on-road vs. mining use.',
            },
            {
                'q': 'Is this compatible with biofuel or synthetic oils?',
                'a': 'Yes—media is rated for modern fluids. Share your lubricant if you have special additive packages.',
            },
            {
                'q': 'Do filters ship with O-rings?',
                'a': 'Critical filters include fresh seals. If a kit needs extra gaskets we add them to the pack list.',
            },
            {
                'q': 'Can you supply MSDS or lab reports?',
                'a': 'Sure, we maintain filtration certificates and can email them with your invoice.',
            },
        ],
        'structured_category': 'Filters & Filtration',
    },
    'fuel': {
        'dir': 'scania/fuel',
        'category_label': 'Fuel System Components',
        'category_url': '/pages/categories/scania-fuel-system.html',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) keeps injection and supply circuits primed on {application}. "
            "We test every unit for pressure integrity and clean-room pack it so installers don’t fight debris in rail lines."
        ),
        'features': [
            'Bench-tested for correct opening pressure or flow before dispatch.',
            'Critical sealing surfaces capped to prevent nicks during shipping.',
            'Supplied with torque specs or shim data where applicable.',
            'Each lot bagged in ISO-clean pouches to keep fuel circuits spotless.',
        ],
        'faqs': [
            {
                'q': 'Is coding required after injector/valve replacement?',
                'a': 'If EMS coding is required we’ll send the trim file or reference so your dealer software can upload it.',
            },
            {
                'q': 'Do you flush components before shipping?',
                'a': 'Yes, fuel hardware is cleaned with filtered fluid and nitrogen-dried before sealing.',
            },
            {
                'q': 'Can you match older pump revisions?',
                'a': 'We keep legacy part numbers mapped. Share your engine serial and we’ll confirm compatibility.',
            },
            {
                'q': 'How fast can you dispatch fuel parts?',
                'a': 'Most SKUs leave the same day with shock-proof packaging and insurance for high-value components.',
            },
        ],
        'structured_category': 'Fuel System Components',
    },
    'braking': {
        'dir': 'scania/braking',
        'category_label': 'Brake & Air Systems',
        'category_url': '/pages/categories/scania-brake-and-air.html',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) maintains braking pressure and modulation on {application}. "
            "Seals, seats, and diaphragms follow factory tolerances so stopping distances stay consistent after service."
        ),
        'features': [
            'Valve bodies and chambers leak-tested at operating pressure.',
            'Elastomers sourced to OEM Shore hardness for long diaphragm life.',
            'Port threads protected with caps plus corrosion inhibitor.',
            'Each unit serialized so you can trace QC data post-install.',
        ],
        'faqs': [
            {
                'q': 'Does this part require calibration?',
                'a': 'Most brake hardware is plug-and-play. If stroke or bias needs setting we send the adjustment guide with your invoice.',
            },
            {
                'q': 'Is it compatible with ABS/EBS systems?',
                'a': 'Yes—components follow OEM specs so sensors and ECU logic read the correct pressures.',
            },
            {
                'q': 'How do you package air-system parts?',
                'a': 'We block ports, add desiccant, and strap assemblies inside double-wall cartons to avoid impact damage.',
            },
            {
                'q': 'Can you support fleet brake rebuilds?',
                'a': 'We can palletize multi-axle kits with labelled cartons so workshops can service several trucks in parallel.',
            },
        ],
        'structured_category': 'Brake & Air Systems',
    },
}

GENERIC_COPY = {
    'engine': {
        'features': [
            'Machined to Scania OEM tolerances so housings and covers bolt up without shims.',
            'Heat-treated alloys handle repeated hot/cold cycles on long-haul and mining duty.',
            'Oil and coolant passages are leak-checked before every batch leaves our bench.',
            'Each lot is laser batch-coded so you can pull QC data whenever you need it.',
        ],
        'faqs': [
            {
                'q': 'Where is this Scania engine part used?',
                'a': "It fits Scania P/G/R/S-series engine assemblies. Share your VIN or PES number and we'll confirm the EPC match before dispatch.",
            },
            {
                'q': 'Do I need ECU programming after installing?',
                'a': 'Most mechanical swaps drop in. If a sensor or actuator needs calibration we include torque values and adaptation steps in the quote reply.',
            },
            {
                'q': 'What testing is performed before shipping?',
                'a': 'Every lot is CMM-measured, leak-tested, and backed by a QC sheet we can share with your workshop.',
            },
            {
                'q': 'Can you ship engine components internationally?',
                'a': 'Yes—daily India dispatch plus weekly export lots with HS codes, fumigation certificates, and pre-dispatch photos.',
            },
        ],
    },
    'transmission': {
        'features': [
            'Ground spline and gear profiles keep backlash within Scania spec.',
            'Hardened bearing surfaces shrug off torsional spikes from loaded drivetrains.',
            'Assemblies are spun for runout and leak-checked before we pack them.',
            'Splines and ports ship capped with VCI wrap so installs stay clean and quick.',
        ],
        'faqs': [
            {
                'q': 'Which Scania gearboxes use this part?',
                'a': "It covers GRS/GRSO/I-Shift families. Send your VIN or gearbox code so we can confirm the EPC match before dispatch.",
            },
            {
                'q': 'Is calibration needed after replacement?',
                'a': 'Most mechanical drops do not. If clutch packs or actuators need shimming we include shim data and torque notes.',
            },
            {
                'q': 'How do you pack driveline parts?',
                'a': 'Components are dipped in anti-corrosion oil, capped, and cushioned so sealing faces arrive blemish-free.',
            },
            {
                'q': 'Do you supply export paperwork?',
                'a': 'Yes—HS codes, certificates of origin, and pre-dispatch photos are available for every shipment.',
            },
        ],
    },
    'suspension': {
        'features': [
            'OEM-grade rubber and metal pairs keep ride height and damping consistent.',
            'Shot-peened, stress-relieved inserts resist cracking on rough haul roads.',
            'Press-fit bores are honed for quiet alignment and longer bushing life.',
            'Parts ship with torque markings plus VCI wrap so they drop in without extra prep.',
        ],
        'faqs': [
            {
                'q': 'Which chassis does this suspension component fit?',
                'a': "It suits Scania chassis codes once we verify your VIN or axle code against the EPC.",
            },
            {
                'q': 'Do I need special tools to install it?',
                'a': 'Standard hydraulic presses and torque tools work. We can share orientation diagrams and torque charts on request.',
            },
            {
                'q': 'How is the part protected during shipping?',
                'a': "Bushings are capped and foam-braced so the rubber doesn't flatten or pick up shop debris in transit.",
            },
            {
                'q': 'Do you support export orders?',
                'a': 'Yes—daily domestic dispatch plus consolidated export shipments with HS codes and inspection notes.',
            },
        ],
    },
    'exterior': {
        'features': [
            'Injection-moulded or pressed to OEM dimensions so gaps and shut lines stay true.',
            'Neutral primer finish saves prep time—scuff, paint, and install.',
            'Reinforced mounting bosses handle cab flex and repeated service.',
            'Panels ship with peel film, corner protectors, and foam cradles to prevent transit scuffs.',
        ],
        'faqs': [
            {
                'q': 'Does this panel match factory paint?',
                'a': 'Panels arrive in primer. Share your paint code and we will confirm the OE reference for your body shop.',
            },
            {
                'q': 'Are mounting clips included?',
                'a': 'Most kits include the needed clips or seals; if not, we list the compatible hardware in the quote.',
            },
            {
                'q': 'How do you pack large exterior pieces?',
                'a': 'Each part gets foam edging, corner protectors, and double-wall cartons so it arrives dent-free.',
            },
            {
                'q': 'Can you send fitment photos?',
                'a': 'Yes—ask for mounting diagrams or photos and we will include them in the dispatch email.',
            },
        ],
    },
}

for category_key, copy in GENERIC_COPY.items():
    CATEGORY_CONFIGS[category_key]['features'] = copy['features']
    CATEGORY_CONFIGS[category_key]['faqs'] = copy['faqs']

DEFAULT_PROCESS_ORDER: List[str] = list(CATEGORY_CONFIGS.keys())


def read_template() -> str:
    if not BASE_TEMPLATE_PATH.exists():
        raise FileNotFoundError(f"Template not found: {BASE_TEMPLATE_PATH}")
    return BASE_TEMPLATE_PATH.read_text(encoding='utf-8')


def slug_part_label(raw_title: str, part_number: str) -> str:
    label = raw_title.replace(part_number, '').strip()
    if label.lower().startswith('scania'):
        label = label[6:].strip()
    return label or 'Component'


def extract_metadata(html_text: str, part_number: str) -> dict:
    soup = BeautifulSoup(html_text, 'html.parser')
    h1 = soup.find('h1')
    raw_title = h1.get_text(strip=True) if h1 else f'Scania Part {part_number}'
    part_label = slug_part_label(raw_title, part_number)

    ptc_number = None
    ptc_match = re.search(r'PTC\s+Number[: ]+([A-Za-z0-9-]+)', soup.get_text(" "))
    if ptc_match:
        ptc_number = ptc_match.group(1).strip()
    if not ptc_number:
        ptc_number = f'PTC{part_number}'

    table_data = {}
    table = soup.find('table')
    if table:
        cells = [c.get_text(strip=True) for c in table.find_all('td')]
        for i in range(0, len(cells) - 1, 2):
            key = cells[i]
            value = cells[i + 1]
            table_data[key] = value

    application = table_data.get('Application') or 'Scania heavy vehicles (confirm with VIN)'
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
    meta_description = f"Order Scania {part_label_lower} {part_number} for {cfg['category_label'].lower()}. Ready stock in Mumbai with pan-India dispatch and WhatsApp quotes."
    keywords = f"Scania {part_number}, {part_label_lower} {part_number}, {cfg['category_label'].lower()}, {part_number} India, scania parts Mumbai"
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
    base_url = f"https://partstrading.com/scania/{context['category_key']}/{part_number}"

    canonical_link = soup.find('link', {'rel': 'canonical'})
    if canonical_link:
        canonical_link['href'] = base_url + '.html'
    for link in soup.find_all('link', rel='alternate'):
        href = link.get('href', '')
        if '/scania/' in href and href.endswith('.html'):
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
        data['name'] = f"Scania {context['part_label']}"
        data['mpn'] = part_number
        data['sku'] = part_number
        data['description'] = context['structured_description']
        data['url'] = base_url
        data['brand']['name'] = 'Scania'
        data['brand']['url'] = base_url
        data['category'] = context['structured_category']
        data['additionalProperty'][1]['value'] = context['ptc_number']
        if 'breadcrumb' in data:
            items = data['breadcrumb'].get('itemListElement', [])
            if len(items) >= 4:
                items[3]['name'] = f"Scania {context['part_label']} {part_number}"
                items[3]['item'] = base_url
        if 'mainEntity' in data:
            data['mainEntity']['name'] = f"Scania {context['part_label']} {part_number} Product Page"
            data['mainEntity']['description'] = context['structured_description']
        ld_script.string = json.dumps(data, indent=4)

    sku_breadcrumb = soup.find('li', {'class': 'text-yellow-600 font-semibold'})
    if sku_breadcrumb:
        sku_breadcrumb.string = part_number
    h1 = soup.find('h1')
    if h1:
        h1.string = f"Scania {context['part_label']} {part_number}"

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
        quote_btn['onclick'] = f"submitQuote('{part_number}', 'Scania {context['part_label']} {part_number}', 'Scania', '{context['category_label']}')"
    whatsapp_float = soup.find('a', {'class': 'whatsapp-float'})
    if whatsapp_float:
        whatsapp_float['onclick'] = f"requestQuoteOnWhatsApp('{part_number}', 'Scania {context['part_label']} {part_number}', 'Scania', '{context['category_label']}', '{context['application']}')"

    faq_section = soup.find('div', class_='mt-12 bg-white rounded-xl shadow-lg p-8')
    if faq_section:
        content_wrapper = faq_section.find('div', {'class': 'space-y-4'})
        if content_wrapper:
            content_wrapper.clear()
            for qa in context['faqs']:
                qa_html = BeautifulSoup(f'''<div class="border-b border-gray-200 pb-4" x-data="{{open: false}}">
<button @click="open = !open" class="w-full text-left flex justify-between items center py-2 hover:text-yellow-600 transition-colors">
  <h3 class="font-semibold text-gray-900">{qa['q']}</h3>
  <svg class="w-5 h-5 transform transition-transform" :class="{{'rotate-180': open}}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
  </svg>
</button>
<div x-show="open" x-transition class="mt-2 text-gray-700">{qa['a']}</div>
</div>''', 'html.parser')
                content_wrapper.append(qa_html)

    html_output = str(soup)
    html_output = html_output.replace('Hydraulic Systems & Connectors', context['category_label'])
    html_output = html_output.replace('/pages/categories/scania-hydraulic-systems-and-connectors.html', context['category_url'])
    html_output = html_output.replace('https://partstrading.com/scania/hydraulics/302624', base_url)
    html_output = html_output.replace('/scania/hydraulics/302624.html', f"/scania/{context['category_key']}/{part_number}.html")
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
            'page_title': f"Scania {metadata['part_label']} {part_number} | {cfg['category_label']} | PTC",
            'og_title': f"Scania {metadata['part_label']} {part_number}",
        }
        html_output = render_html(context)
        html_path.write_text(html_output, encoding='utf-8')
        processed += 1
    print(f"Converted {processed} Scania {category_key} pages.")
    return processed


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Convert Scania product pages to the modern template.')
    parser.add_argument(
        '--categories',
        nargs='+',
        choices=sorted(CATEGORY_CONFIGS.keys()),
        help='Specific categories to process (default: all configured categories).',
    )
    return parser.parse_args()


def main() -> None:
    if not BASE_TEMPLATE_PATH.exists():
        raise SystemExit('Base template missing; create templates/scania-hydraulics-base.html first.')

    args = parse_args()
    categories = args.categories or DEFAULT_PROCESS_ORDER

    total = 0
    for category_key in categories:
        total += process_category(category_key)
    print(f"Total pages converted: {total}")


if __name__ == '__main__':
    main()
