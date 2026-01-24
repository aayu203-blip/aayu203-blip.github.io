#!/usr/bin/env python3
"""Batch-convert Scania product pages to the modern template for multiple categories."""

import argparse
import json
import re
from pathlib import Path
from typing import Dict, List, Optional

from bs4 import BeautifulSoup  # type: ignore

BASE_TEMPLATE_PATH = Path('templates/scania-hydraulics-base.html')
PLACEHOLDER_VALUES = {'-', '—', 'n/a', 'na', 'n.a.', 'na.', 'nil', 'none', 'scania chassis (share vin for confirmation)'}
CATEGORY_CONFIGS: Dict[str, Dict[str, object]] = {
    'engine': {
        'dir': 'scania/engine',
        'category_label': 'Engine Components',
        'category_url': '/pages/categories/scania-engine-components.html',
        'icon': '/assets/icons/icon-engine.svg',
        'category_blurb': 'Precision pistons, liners, and valvetrain hardware for full engine refreshes.',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) keeps engine assemblies aligned on highway and off-road duty. "
            "Surfaces follow OEM drawings so the part bolts in without extra machining and technicians can follow the workshop manual torque steps without surprises."
        ),
        'features': [
            'OEM bolt patterns and dowel seats stay true so housings align without shim stacks.',
            'Heat-treated alloys handle long-haul thermal swings and stop-start duty.',
            'Oil, coolant, and breather ports retain factory diameters for painless plumbing.',
            'Surface finishes arrive gasket-ready to keep assembly time predictable.',
        ],
        'faqs': [
            {
                'q': 'Which Scania models use this engine component?',
                'a': 'Matches the OEM part number across P/G/R/S-series engines; compare with the reference already in your Scania EPC before ordering.',
            },
            {
                'q': 'Do I need special tools during install?',
                'a': 'Use the fixtures and torque charts from your Scania workshop manual—the footprint mirrors the OE part so standard tools are enough.',
            },
            {
                'q': 'Can I bundle multiple engine parts in one shipment?',
                'a': 'Yes, we consolidate cylinder, head, and accessory parts so fleets receive complete kits in a single dispatch.',
            },
            {
                'q': 'Do you support export or remote deliveries?',
                'a': 'Engine components ship nationwide daily and depart in weekly export lots with HS codes, invoices, and packing photos for customs.',
            },
        ],
        'structured_category': 'Engine Components',
    },
    'transmission': {
        'dir': 'scania/transmission',
        'category_label': 'Transmission & Differential Components',
        'category_url': '/pages/categories/scania-transmission-and-differential-components.html',
        'icon': '/assets/icons/icon-gear.svg',
        'category_blurb': 'Synchronizers, gears, and clutch packs that keep drivetrains shifting clean.',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) keeps transmissions and differentials shifting clean on mixed duty cycles. "
            "Gear profiles and splines mirror OEM backlash windows so the driveline returns to work without chatter."
        ),
        'features': [
            'Spline geometry and gear flanks hold backlash within Scania specs.',
            'Hardened bearing seats absorb torsional shock from hill starts and heavy loads.',
            'Seal lands and clutch faces mirror factory finishes for quick assembly.',
            'Locator flats and timing marks match Scania drawings so forks and hubs align quickly.',
        ],
        'faqs': [
            {
                'q': 'Which gearboxes is this part compatible with?',
                'a': 'Follows the listed Scania part number across GRS/GRSO, Opticruise, and related families—use the same number your EPC displays.',
            },
            {
                'q': 'Does installation require ECU calibration?',
                'a': 'Mechanical swaps reuse the existing ECU settings; if your service manual calls for an adaptation, follow those steps once the part is in.',
            },
            {
                'q': 'Can you ship driveline kits together?',
                'a': 'Yes, clutch packs, seals, and gears can be palletized together with one tracking number.',
            },
            {
                'q': 'How fast can you dispatch transmission parts?',
                'a': 'In-stock driveline components are staged for same-day dispatch with tracking shared over email and WhatsApp.',
            },
        ],
        'structured_category': 'Transmission & Differential Components',
    },
    'suspension': {
        'dir': 'scania/suspension',
        'category_label': 'Steering & Suspension Parts',
        'category_url': '/pages/categories/scania-steering-and-suspension-parts.html',
        'icon': '/assets/icons/icon-suspension.svg',
        'category_blurb': 'Springs, bushings, and dampers that hold ride height on punishing duty cycles.',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) keeps ride height steady on quarry, port, and highway duty. "
            "Bushings and housings follow OEM durometer and geometry so they press into hangers smoothly and hold alignment under load."
        ),
        'features': [
            'OEM durometer rubber bonded to forged housings keeps ride height consistent.',
            'Chamfered sleeves guide the part into hangers without tearing bush eyes.',
            'Locator flats and keyways mirror Scania brackets so alignment plates line up quickly.',
            'Quote references highlight companion hardware so axle jobs can be staged in one go.',
        ],
        'faqs': [
            {
                'q': 'Which chassis does this suspension part fit?',
                'a': 'Matches the Scania part number used on steering and drive axles; confirm against your EPC listing before installation.',
            },
            {
                'q': 'What tools are required for install?',
                'a': 'Standard presses, torque wrenches, and hanger fixtures from the Scania workshop manual cover the job.',
            },
            {
                'q': 'Can I order left/right or front/rear pairs together?',
                'a': 'Yes, mirrored parts can be cartoned together so your bay services both sides during the same downtime window.',
            },
            {
                'q': 'Do you support export shipments for suspension parts?',
                'a': 'Steering and suspension SKUs ship across India daily and internationally with HS codes each week.',
            },
        ],
        'structured_category': 'Steering & Suspension Parts',
    },
    'exterior': {
        'dir': 'scania/exterior',
        'category_label': 'Lighting & Exterior Body Components',
        'category_url': '/pages/categories/scania-lighting-and-exterior-body-components.html',
        'icon': '/assets/icons/icon-light.svg',
        'category_blurb': 'Headlamps, fascia, and trim pieces that keep cabs looking fleet-ready.',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) refreshes cab appearance and lighting while keeping airflow on spec. "
            "Panels follow factory hole patterns so they align with OE brackets and trim clips."
        ),
        'features': [
            'Injection-moulded or pressed to OEM contours so gaps and shut lines stay tight.',
            'Primer-ready or UV-stable finishes help paint and vinyl steps move faster.',
            'Reinforced mounting bosses handle cab flex and repeated service.',
            'Clip, seal, and lamp references mirror the Scania parts book for faster staging.',
        ],
        'faqs': [
            {
                'q': 'Does this match factory paint?',
                'a': 'Panels arrive in primer or neutral finishes so your body shop can color-match using Scania paint codes.',
            },
            {
                'q': 'Are clips or seals included?',
                'a': 'If the OEM assembly lists clips or seals we can add them to the quote so everything arrives together.',
            },
            {
                'q': 'How are large panels shipped?',
                'a': 'Large exterior pieces are scheduled on dedicated carriers with tracking so workshops can plan prep and paint time.',
            },
            {
                'q': 'Can you send installation references?',
                'a': "Request the relevant Scania diagram in your quote and we'll include the PDF link.",
            },
        ],
        'structured_category': 'Lighting & Exterior Body Components',
    },
    'hardware': {
        'dir': 'scania/hardware',
        'category_label': 'Fasteners, Hardware & Accessories',
        'category_url': '/pages/categories/scania-fasteners-hardware-accessories.html',
        'icon': '/assets/icons/icon-hardware.svg',
        'category_blurb': 'OE-grade bolts, brackets, and accessories for chassis and cab repairs.',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) keeps chassis assemblies locked down across harsh duty cycles. "
            "Thread geometry and coatings mirror OEM specs so torque readings stay consistent after service."
        ),
        'features': [
            'Grade-marked steel and OEM coatings resist corrosion and galling.',
            'Roll-formed threads deliver higher fatigue strength and repeatable torque.',
            'Head markings follow Scania specifications so crews can audit fasteners quickly.',
            'Supplied in clearly labelled sets so bays can stage bolts, nuts, and spacers per axle or assembly.',
        ],
        'faqs': [
            {
                'q': 'Which torque spec should I follow?',
                'a': 'Use the torque chart from your Scania repair manual; the hardware matches the OEM grade printed on the head.',
            },
            {
                'q': 'Are washers or nuts included?',
                'a': 'Assemblies can be quoted with the washer or nut combinations shown in the parts book so everything arrives together.',
            },
            {
                'q': 'Can I order bulk fastener kits?',
                'a': 'Yes, we kit frame, suspension, or cab fasteners in labelled bags so fleets can service multiple trucks.',
            },
            {
                'q': 'Do you offer corrosion-resistant finishes?',
                'a': 'Zinc-nickel, Dacromet, or stainless variants are available on select SKUs—mention your environment when requesting a quote.',
            },
        ],
        'structured_category': 'Fasteners, Hardware & Accessories',
    },
    'misc': {
        'dir': 'scania/misc',
        'category_label': 'Miscellaneous Parts',
        'category_url': '/pages/categories/scania-miscellaneous-parts.html',
        'icon': '/assets/icons/icon-misc.svg',
        'category_blurb': 'Sensors, harnesses, and cabin essentials that keep diagnostics clean.',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) covers electrical and cabin essentials that keep dashboards, harnesses, and sensors operating. "
            "Connectors follow OEM keying so they plug straight into factory looms."
        ),
        'features': [
            'Connector keys and pin-outs mirror the OEM harness so it plugs in without rewiring.',
            'Housings are moulded in flame-resistant polymers suited for cab interiors.',
            'Switch detents and tactile feedback match the OE feel drivers expect.',
            'Part numbers are printed directly on housings so techs can stage harnesses quickly.',
        ],
        'faqs': [
            {
                'q': 'Does this component require coding after install?',
                'a': 'Most electrical spares reuse existing ECU settings; refer to your diagnostic tool if the Scania manual mentions calibration.',
            },
            {
                'q': 'Can I combine multiple cabin parts in one order?',
                'a': 'Yes, harnesses, switches, and trims can be boxed together so the interior job finishes in one visit.',
            },
            {
                'q': 'Can you share wiring references?',
                'a': 'Quote replies can include the relevant wiring or connector references when you request them.',
            },
            {
                'q': 'Do you ship internationally?',
                'a': 'Electrical SKUs ship nationwide daily and internationally with the same paperwork as mechanical parts.',
            },
        ],
        'structured_category': 'Miscellaneous Parts',
    },
    'filtration': {
        'dir': 'scania/filtration',
        'category_label': 'Air & Fluid Filtration Systems',
        'category_url': '/pages/categories/scania-air-and-fluid-filtration-systems.html',
        'icon': '/assets/icons/icon-filter.svg',
        'category_blurb': 'OEM-spec media elements that protect air, oil, and fuel circuits.',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) keeps air and fluid circuits clean with OEM-spec media. "
            "The cartridge drops straight into the housing so preventative maintenance stays quick."
        ),
        'features': [
            'Multi-layer media captures debris while maintaining OEM flow rates.',
            'End caps and seals moulded to factory tolerances for leak-free seating.',
            'Center tubes resist collapse during cold starts or pressure spikes.',
            'Each element is clearly labelled with part number and flow direction for quick bay identification.',
        ],
        'faqs': [
            {
                'q': 'What service interval should I follow?',
                'a': 'Stick to the interval listed in your Scania maintenance schedule and adjust for dusty or severe duty as required.',
            },
            {
                'q': 'Is it compatible with modern fuels or oils?',
                'a': 'Media is specified for current diesel, bio blends, and synthetic lubes listed in Scania documentation.',
            },
            {
                'q': 'Do filters include O-rings or gaskets?',
                'a': 'Critical seals can be bundled into the same shipment on request so technicians have everything in one tray.',
            },
            {
                'q': 'Can I order bulk filter packs?',
                'a': 'Yes, we palletize filter kits for fleets so PM services can be staged per truck or engine family.',
            },
        ],
        'structured_category': 'Air & Fluid Filtration Systems',
    },
    'fuel': {
        'dir': 'scania/fuel',
        'category_label': 'Fuel System Components',
        'category_url': '/pages/categories/scania-fuel-system-components.html',
        'icon': '/assets/icons/icon-fuel.svg',
        'category_blurb': 'Injectors, rails, and pumps that keep injection pressure on target.',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) keeps injection and supply circuits primed across harsh duty cycles. "
            "Sealing faces and threads mirror OEM specs so plumbing reconnects without drama."
        ),
        'features': [
            'Metering components hold OEM pressures so injection timing stays stable.',
            'Precision-ground sealing faces keep rail pressure where it belongs.',
            'Ports and threads mirror factory sizes for plug-and-play plumbing.',
            'Supplied with part-number tags so build benches can stage banked assemblies quickly.',
        ],
        'faqs': [
            {
                'q': 'Do I need ECU coding after replacement?',
                'a': 'If your Scania manual mentions trim coding, use your diagnostic tool to upload those values after install.',
            },
            {
                'q': 'Can you match older revisions?',
                'a': "Provide the part number currently on your engine plate and we'll supply the same revision or a backwards-compatible supersession.",
            },
            {
                'q': 'Can you bundle seals or fittings?',
                'a': 'Yes, crush washers, seals, or fittings listed alongside the main component can ship in the same box.',
            },
            {
                'q': 'How fast are fuel components dispatched?',
                'a': 'Fuel-system SKUs ship daily with tracked courier options and WhatsApp notifications.',
            },
        ],
        'structured_category': 'Fuel System Components',
    },
    'braking': {
        'dir': 'scania/braking',
        'category_label': 'Braking System Components',
        'category_url': '/pages/categories/scania-braking-system-components.html',
        'icon': '/assets/icons/icon-brake.svg',
        'category_blurb': 'Chambers, rotors, and valves for confident, repeatable stops.',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) maintains brake balance on tractor-trailers and rigid trucks. "
            "Port layouts and mounting faces align with Scania brake hardware so lines reconnect easily."
        ),
        'features': [
            'Port locations and mounting faces match Scania layouts for easy plumbing.',
            'Diaphragm and seal materials handle repeated heat cycles without fade.',
            'Linkage arms include the same splines and keyways as the OE unit.',
            'Reference marks show adjuster positions so setup is repeatable.',
        ],
        'faqs': [
            {
                'q': 'Which series is this brake part for?',
                'a': 'Matches the Scania part number stamped on your existing valve or chamber—check that stamp before ordering.',
            },
            {
                'q': 'Do I need special bleeding procedures?',
                'a': 'Follow the Scania brake manual for bleeding and adjustment; the hardware installs like the OE part.',
            },
            {
                'q': 'Can you bundle brake hardware?',
                'a': 'Yes, chambers, valves, and fittings can be shipped together for axle overhauls.',
            },
            {
                'q': 'Do you offer urgent dispatch?',
                'a': 'Brake parts are prioritized for same-day dispatch with courier tracking and WhatsApp status updates.',
            },
        ],
        'structured_category': 'Braking System Components',
    },
    'hydraulics': {
        'dir': 'scania/hydraulics',
        'category_label': 'Hydraulic Systems & Connectors',
        'category_url': '/pages/categories/scania-hydraulic-systems-and-connectors.html',
        'icon': '/assets/icons/icon-hydraulic.svg',
        'category_blurb': 'Cylinders, hoses, and unions for tipping gears, cranes, and steering.',
        'description_template': (
            "Scania {part_label_lower} (Part {part_number}) keeps hydraulic circuits sealed across tippers, cranes, and steering systems. "
            "Thread forms and flare angles follow Scania specs for leak-free sealing."
        ),
        'features': [
            'Thread forms and flare angles match Scania specs for leak-free sealing.',
            'Corrosion-resistant alloys handle harsh on-site environments.',
            'Port orientation mirrors OEM layouts so hoses run clean routes.',
            'Part numbers are etched or tagged so maintenance teams grab the right fitting quickly.',
        ],
        'faqs': [
            {
                'q': 'Which systems does this hydraulic part suit?',
                'a': 'Matches the OEM part number across tipper, crane, steering, and auxiliary hydraulic circuits—confirm with your existing parts list.',
            },
            {
                'q': 'Can I get hoses and fittings together?',
                'a': 'Yes, hoses, unions, and valves can be quoted as a complete kit per vehicle.',
            },
            {
                'q': 'Do you support export shipments?',
                'a': 'Hydraulic SKUs are stocked for nationwide and export dispatch with HS codes ready.',
            },
            {
                'q': 'How do I verify size before ordering?',
                'a': 'Measure the thread or refer to your Scania hydraulic diagram; the part matches the OEM specification listed there.',
            },
        ],
        'structured_category': 'Hydraulic Systems & Connectors',
    },
}

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


def normalize_field(value: Optional[str], fallback: str) -> str:
    if value is None:
        return fallback
    cleaned = value.strip()
    if not cleaned:
        return fallback
    if cleaned.lower() in PLACEHOLDER_VALUES:
        return fallback
    return cleaned


def extract_metadata(html_text: str, part_number: str) -> dict:
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

    application = normalize_field(table_data.get('Application'), 'Scania trucks (reference OEM part list)')
    alternate = normalize_field(table_data.get('Alternate Part Numbers'), '—')
    measurements = normalize_field(table_data.get('Measurements'), '—')

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
    application_clean = normalize_field(application, 'Scania trucks (reference OEM part list)')
    description = cfg['description_template'].format(part_label_lower=part_label_lower, part_number=part_number, application=application_clean)
    meta_description = f"Order Scania {part_label_lower} {part_number} for {cfg['category_label'].lower()}. Ready stock for nationwide dispatch with WhatsApp quotes and export support."
    keywords = f"Scania {part_number}, {part_label_lower} {part_number}, {cfg['category_label'].lower()}, {part_number} india, scania parts supplier"
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
    breadcrumb_data = None
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
        additional_props = data.get('additionalProperty', [])
        for prop in additional_props:
            name = (prop.get('name') or '').strip().lower()
            if name == 'part number':
                prop['value'] = part_number
            elif name == 'ptc number':
                prop['value'] = context['ptc_number']
            elif name == 'application':
                prop['value'] = context['application']
            elif name == 'alternate part numbers':
                prop['value'] = context['alternate']
            elif name == 'measurements':
                prop['value'] = context['measurements']
        if 'breadcrumb' in data:
            items = data['breadcrumb'].get('itemListElement', [])
            if len(items) >= 4:
                items[3]['name'] = f"Scania {context['part_label']} {part_number}"
                items[3]['item'] = base_url + '.html'
            # Extract breadcrumb data for standalone schema
            breadcrumb_data = data['breadcrumb'].copy()
            breadcrumb_data['@context'] = 'https://schema.org'
        if 'mainEntity' in data:
            data['mainEntity']['name'] = f"Scania {context['part_label']} {part_number} Product Page"
            data['mainEntity']['description'] = context['structured_description']
        ld_script.string = json.dumps(data, indent=4)
    
    # Add standalone BreadcrumbList schema for validators
    if breadcrumb_data and ld_script:
        breadcrumb_script = soup.new_tag('script', type='application/ld+json')
        breadcrumb_script.string = json.dumps(breadcrumb_data, indent=4)
        # Insert after the Product schema script
        ld_script.insert_after(breadcrumb_script)

    sku_breadcrumb = soup.find('li', {'class': 'text-yellow-600 font-semibold'})
    if sku_breadcrumb:
        sku_breadcrumb.string = part_number
    h1 = soup.find('h1')
    if h1:
        h1.string = f"Scania {context['part_label']} {part_number}"

    breadcrumb_nav = soup.find('nav', {'aria-label': 'Breadcrumb'})
    if breadcrumb_nav:
        category_anchor = breadcrumb_nav.find('a', href=re.compile(r'/pages/categories/'))
        if category_anchor:
            category_anchor['href'] = context['category_url']
            category_anchor.string = context['category_label']

    hero_icon = soup.find(attrs={'data-category-icon': True})
    if hero_icon:
        icon_src = context.get('category_icon')
        if icon_src:
            hero_icon['src'] = icon_src
        hero_icon['alt'] = f"{context['category_label']} icon"

    for label_el in soup.select('[data-category-label]'):
        label_el.string = context['category_label']

    blurb_el = soup.find(attrs={'data-category-blurb': True})
    if blurb_el:
        blurb_el.string = context.get('category_blurb') or context['structured_category']

    hero_app = soup.find(attrs={'data-category-application': True})
    if hero_app:
        hero_app.string = context['application']

    hero_ptc = soup.find(attrs={'data-category-ptc': True})
    if hero_ptc:
        hero_ptc.string = context['ptc_number']

    part_p = soup.find('p', string=re.compile(r'Part Number', re.IGNORECASE))
    if part_p:
        part_p.string = f"Part Number: {part_number}"
    ptc_p = soup.find('p', string=re.compile(r'PTC Number', re.IGNORECASE))
    if ptc_p:
        ptc_p.string = f"PTC Number: {context['ptc_number']}"

    desc_p = soup.find('p', {'class': 'text-gray-700 leading-relaxed'})
    if desc_p:
        desc_p.string = context['description']

    features_heading = soup.find('h2', string=re.compile('Technical Features'))
    if features_heading:
        features_heading.string = f"Scania {context['part_label']} {part_number} Technical Features"

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
        quote_panel = quote_btn.find_parent('div', class_='premium-quote-panel')
        if quote_panel:
            cta_title = quote_panel.find('h3')
            if cta_title:
                cta_title.string = f"Scania {context['part_label']} {part_number}"
            cta_part = quote_panel.find('p', string=re.compile(r'Part #', re.IGNORECASE))
            if cta_part:
                cta_part.string = f"Part #{part_number}"
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

    # Load enriched data if available
    enriched_data = {}
    try:
        with open('enriched_product_data.json', 'r') as f:
            enriched_data = json.load(f)
            print("Loaded enriched data.")
    except Exception as e:
        print(f"No enriched data found or error loading: {e}")

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
            'category_icon': cfg.get('icon', ''),
            'category_blurb': cfg.get('category_blurb', ''),
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
