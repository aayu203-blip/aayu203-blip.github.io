#!/usr/bin/env python3
"""
Programmatic Landing Page Generator for partstrading.com
Generates ~15,000+ targeted landing pages across all dimensions.

URL outputs:
  /suppliers/{brand}-parts-{location}/          Brand × Market (countries + cities + Indian states)
  /{brand}/{category}/{location}/               Brand × Category × Market
  /{brand}/models/{model-slug}/                 Brand × Model
  /{brand}/models/{model-slug}/{category}/      Brand × Model × Category
  /industries/{industry}/{brand}/               Industry × Brand
  /industries/{industry}/{brand}/{category}/    Industry × Brand × Category
  /india/{state-slug}/{brand}-parts/            Indian State × Brand (detailed)
  /india/{state-slug}/{brand}/{category}/       Indian State × Brand × Category
"""

import os, json, re, random, html
from pathlib import Path

ROOT = Path(__file__).parent

# ─────────────────────────────────────────────
# DATA DEFINITIONS
# ─────────────────────────────────────────────

BRANDS = {
    "volvo":   {"label":"Volvo",   "full":"Volvo Trucks & Construction",  "color":"#003DA5", "models":["FH12","FH16","FM12","FM9","B10","B12","A25","A30","A35","EC210","EC290","EC360","L90","L120","L150"]},
    "cat":     {"label":"CAT",     "full":"Caterpillar",                   "color":"#FFCD11", "tc":"#000", "models":["320D","330D","336D","390F","D6T","D8T","D9T","D10T","769C","777F","994K","966H","972H","980H","745C"]},
    "hitachi": {"label":"Hitachi", "full":"Hitachi Construction Machinery","color":"#E60012", "models":["ZX200","ZX240","ZX300","ZX360","ZX450","ZX500","ZX650","EX300","EX400","UH083","UH143","EX1200","ZX870","ZX1000","ZX130"]},
    "komatsu": {"label":"Komatsu", "full":"Komatsu",                       "color":"#FFCC00", "tc":"#000", "models":["PC200","PC300","PC400","PC650","D65","D85","D155","HM400","HD785","WA380","WA470","WA600","GD825","PC1250","PC2000"]},
    "scania":  {"label":"Scania",  "full":"Scania AB",                     "color":"#0E1E5B", "models":["R380","R440","R500","R560","P380","P440","G440","S500","S730","K380","K440","F500","L320","G360","R730"]},
    "john-deere": {"label":"John Deere","full":"John Deere",              "color":"#367C2B", "models":["310L","410L","444K","544K","624K","644K","850K","870G","872G","310SK","410K","710L","544L","624L","9RX"]},
}

CATEGORIES = {
    "engine-parts":          {"label":"Engine Parts",           "short":"engine",       "desc":"pistons, liners, gaskets, crankshafts, camshafts, bearings, cylinder heads"},
    "hydraulic-parts":       {"label":"Hydraulic Parts",        "short":"hydraulics",   "desc":"hydraulic pumps, motors, cylinders, valves, seals, hoses, fittings"},
    "brake-parts":           {"label":"Brake Parts",            "short":"brakes",       "desc":"brake discs, pads, calipers, master cylinders, wheel cylinders, brake drums"},
    "transmission-parts":    {"label":"Transmission Parts",     "short":"transmission", "desc":"gearbox components, clutch plates, torque converters, shift forks, synchronizers"},
    "electrical-parts":      {"label":"Electrical Parts",       "short":"electrical",   "desc":"alternators, starters, sensors, relays, switches, wiring harnesses, ECUs"},
    "filters":               {"label":"Filters",                "short":"filters",      "desc":"oil filters, fuel filters, air filters, hydraulic filters, cabin air filters"},
    "cooling-system":        {"label":"Cooling System",         "short":"cooling",      "desc":"radiators, water pumps, thermostats, coolant hoses, fan assemblies, intercoolers"},
    "fuel-system":           {"label":"Fuel System",            "short":"fuel",         "desc":"fuel injectors, injection pumps, fuel rails, pressure regulators, fuel tanks"},
    "suspension-chassis":    {"label":"Suspension & Chassis",   "short":"suspension",   "desc":"springs, shock absorbers, control arms, bushings, ball joints, tie rods"},
    "steering-parts":        {"label":"Steering Parts",         "short":"steering",     "desc":"steering pumps, steering cylinders, rack & pinion, tie rod ends, steering columns"},
    "cab-body-parts":        {"label":"Cab & Body Parts",       "short":"cab",          "desc":"cab doors, mirrors, glass, seats, panels, lights, wiper systems"},
    "exhaust-turbo":         {"label":"Exhaust & Turbo",        "short":"exhaust",      "desc":"turbochargers, exhaust manifolds, DPF filters, EGR valves, mufflers, catalysts"},
    "seals-orings":          {"label":"Seals & O-Rings",        "short":"seals",        "desc":"hydraulic seals, O-rings, gasket sets, oil seals, dust seals, lip seals"},
    "bearing-bushing":       {"label":"Bearings & Bushings",    "short":"bearings",     "desc":"roller bearings, thrust bearings, bronze bushings, needle bearings, hub bearings"},
    "spare-parts":           {"label":"Spare Parts",            "short":"spares",       "desc":"general spare parts, wear components, service kits, overhaul sets"},
}

# International markets: countries
COUNTRIES = [
    {"name":"United Arab Emirates","slug":"uae","city":"Dubai","currency":"AED","lead":"2-5 days","region":"Middle East"},
    {"name":"Saudi Arabia",        "slug":"saudi-arabia","city":"Riyadh","currency":"SAR","lead":"3-6 days","region":"Middle East"},
    {"name":"Qatar",               "slug":"qatar","city":"Doha","currency":"QAR","lead":"3-5 days","region":"Middle East"},
    {"name":"Kuwait",              "slug":"kuwait","city":"Kuwait City","currency":"KWD","lead":"3-5 days","region":"Middle East"},
    {"name":"Bahrain",             "slug":"bahrain","city":"Manama","currency":"BHD","lead":"3-5 days","region":"Middle East"},
    {"name":"Oman",                "slug":"oman","city":"Muscat","currency":"OMR","lead":"3-6 days","region":"Middle East"},
    {"name":"Iraq",                "slug":"iraq","city":"Baghdad","currency":"IQD","lead":"5-8 days","region":"Middle East"},
    {"name":"Jordan",              "slug":"jordan","city":"Amman","currency":"JOD","lead":"4-7 days","region":"Middle East"},
    {"name":"Nigeria",             "slug":"nigeria","city":"Lagos","currency":"NGN","lead":"5-8 days","region":"West Africa"},
    {"name":"Ghana",               "slug":"ghana","city":"Accra","currency":"GHS","lead":"5-8 days","region":"West Africa"},
    {"name":"Senegal",             "slug":"senegal","city":"Dakar","currency":"XOF","lead":"7-10 days","region":"West Africa"},
    {"name":"Ivory Coast",         "slug":"ivory-coast","city":"Abidjan","currency":"XOF","lead":"7-10 days","region":"West Africa"},
    {"name":"Cameroon",            "slug":"cameroon","city":"Douala","currency":"XAF","lead":"7-10 days","region":"Central Africa"},
    {"name":"Angola",              "slug":"angola","city":"Luanda","currency":"AOA","lead":"7-12 days","region":"Central Africa"},
    {"name":"DR Congo",            "slug":"dr-congo","city":"Kinshasa","currency":"CDF","lead":"8-12 days","region":"Central Africa"},
    {"name":"Kenya",               "slug":"kenya","city":"Nairobi","currency":"KES","lead":"5-8 days","region":"East Africa"},
    {"name":"Tanzania",            "slug":"tanzania","city":"Dar es Salaam","currency":"TZS","lead":"5-8 days","region":"East Africa"},
    {"name":"Uganda",              "slug":"uganda","city":"Kampala","currency":"UGX","lead":"6-9 days","region":"East Africa"},
    {"name":"Ethiopia",            "slug":"ethiopia","city":"Addis Ababa","currency":"ETB","lead":"6-9 days","region":"East Africa"},
    {"name":"Rwanda",              "slug":"rwanda","city":"Kigali","currency":"RWF","lead":"6-9 days","region":"East Africa"},
    {"name":"South Africa",        "slug":"south-africa","city":"Johannesburg","currency":"ZAR","lead":"5-8 days","region":"Southern Africa"},
    {"name":"Zambia",              "slug":"zambia","city":"Lusaka","currency":"ZMW","lead":"6-9 days","region":"Southern Africa"},
    {"name":"Zimbabwe",            "slug":"zimbabwe","city":"Harare","currency":"ZWL","lead":"6-9 days","region":"Southern Africa"},
    {"name":"Mozambique",          "slug":"mozambique","city":"Maputo","currency":"MZN","lead":"7-10 days","region":"Southern Africa"},
    {"name":"Botswana",            "slug":"botswana","city":"Gaborone","currency":"BWP","lead":"6-9 days","region":"Southern Africa"},
    {"name":"Namibia",             "slug":"namibia","city":"Windhoek","currency":"NAD","lead":"7-10 days","region":"Southern Africa"},
    {"name":"Egypt",               "slug":"egypt","city":"Cairo","currency":"EGP","lead":"4-7 days","region":"North Africa"},
    {"name":"Morocco",             "slug":"morocco","city":"Casablanca","currency":"MAD","lead":"5-8 days","region":"North Africa"},
    {"name":"Algeria",             "slug":"algeria","city":"Algiers","currency":"DZD","lead":"5-8 days","region":"North Africa"},
    {"name":"Tunisia",             "slug":"tunisia","city":"Tunis","currency":"TND","lead":"5-8 days","region":"North Africa"},
    {"name":"Sudan",               "slug":"sudan","city":"Khartoum","currency":"SDG","lead":"6-9 days","region":"North Africa"},
    {"name":"Bangladesh",          "slug":"bangladesh","city":"Dhaka","currency":"BDT","lead":"3-5 days","region":"South Asia"},
    {"name":"Sri Lanka",           "slug":"sri-lanka","city":"Colombo","currency":"LKR","lead":"2-4 days","region":"South Asia"},
    {"name":"Nepal",               "slug":"nepal","city":"Kathmandu","currency":"NPR","lead":"2-4 days","region":"South Asia"},
    {"name":"Pakistan",            "slug":"pakistan","city":"Karachi","currency":"PKR","lead":"3-5 days","region":"South Asia"},
    {"name":"Myanmar",             "slug":"myanmar","city":"Yangon","currency":"MMK","lead":"4-7 days","region":"Southeast Asia"},
    {"name":"Thailand",            "slug":"thailand","city":"Bangkok","currency":"THB","lead":"3-6 days","region":"Southeast Asia"},
    {"name":"Philippines",         "slug":"philippines","city":"Manila","currency":"PHP","lead":"4-7 days","region":"Southeast Asia"},
    {"name":"Indonesia",           "slug":"indonesia","city":"Jakarta","currency":"IDR","lead":"5-8 days","region":"Southeast Asia"},
    {"name":"Malaysia",            "slug":"malaysia","city":"Kuala Lumpur","currency":"MYR","lead":"4-6 days","region":"Southeast Asia"},
    {"name":"Vietnam",             "slug":"vietnam","city":"Ho Chi Minh City","currency":"VND","lead":"4-7 days","region":"Southeast Asia"},
    {"name":"Cambodia",            "slug":"cambodia","city":"Phnom Penh","currency":"KHR","lead":"5-8 days","region":"Southeast Asia"},
    {"name":"Kazakhstan",          "slug":"kazakhstan","city":"Almaty","currency":"KZT","lead":"5-9 days","region":"Central Asia"},
    {"name":"Uzbekistan",          "slug":"uzbekistan","city":"Tashkent","currency":"UZS","lead":"6-9 days","region":"Central Asia"},
    {"name":"Mongolia",            "slug":"mongolia","city":"Ulaanbaatar","currency":"MNT","lead":"7-10 days","region":"Central Asia"},
]

# International cities
CITIES = [
    # Middle East
    {"name":"Dubai",        "slug":"dubai",         "country":"United Arab Emirates","region":"Middle East","lead":"2-4 days"},
    {"name":"Abu Dhabi",    "slug":"abu-dhabi",      "country":"United Arab Emirates","region":"Middle East","lead":"2-4 days"},
    {"name":"Sharjah",      "slug":"sharjah",        "country":"United Arab Emirates","region":"Middle East","lead":"2-4 days"},
    {"name":"Riyadh",       "slug":"riyadh",         "country":"Saudi Arabia","region":"Middle East","lead":"3-5 days"},
    {"name":"Jeddah",       "slug":"jeddah",         "country":"Saudi Arabia","region":"Middle East","lead":"3-5 days"},
    {"name":"Dammam",       "slug":"dammam",         "country":"Saudi Arabia","region":"Middle East","lead":"3-5 days"},
    {"name":"Doha",         "slug":"doha",           "country":"Qatar","region":"Middle East","lead":"3-5 days"},
    {"name":"Kuwait City",  "slug":"kuwait-city",    "country":"Kuwait","region":"Middle East","lead":"3-5 days"},
    {"name":"Muscat",       "slug":"muscat",         "country":"Oman","region":"Middle East","lead":"3-5 days"},
    {"name":"Manama",       "slug":"manama",         "country":"Bahrain","region":"Middle East","lead":"3-5 days"},
    {"name":"Amman",        "slug":"amman",          "country":"Jordan","region":"Middle East","lead":"4-6 days"},
    # Africa
    {"name":"Lagos",        "slug":"lagos",          "country":"Nigeria","region":"West Africa","lead":"5-7 days"},
    {"name":"Abuja",        "slug":"abuja",          "country":"Nigeria","region":"West Africa","lead":"5-7 days"},
    {"name":"Port Harcourt","slug":"port-harcourt",  "country":"Nigeria","region":"West Africa","lead":"5-7 days"},
    {"name":"Kano",         "slug":"kano",           "country":"Nigeria","region":"West Africa","lead":"6-8 days"},
    {"name":"Accra",        "slug":"accra",          "country":"Ghana","region":"West Africa","lead":"5-7 days"},
    {"name":"Kumasi",       "slug":"kumasi",         "country":"Ghana","region":"West Africa","lead":"6-8 days"},
    {"name":"Dakar",        "slug":"dakar",          "country":"Senegal","region":"West Africa","lead":"7-9 days"},
    {"name":"Abidjan",      "slug":"abidjan",        "country":"Ivory Coast","region":"West Africa","lead":"7-9 days"},
    {"name":"Douala",       "slug":"douala",         "country":"Cameroon","region":"Central Africa","lead":"7-9 days"},
    {"name":"Luanda",       "slug":"luanda",         "country":"Angola","region":"Central Africa","lead":"7-10 days"},
    {"name":"Kinshasa",     "slug":"kinshasa",       "country":"DR Congo","region":"Central Africa","lead":"8-11 days"},
    {"name":"Nairobi",      "slug":"nairobi",        "country":"Kenya","region":"East Africa","lead":"5-7 days"},
    {"name":"Mombasa",      "slug":"mombasa",        "country":"Kenya","region":"East Africa","lead":"5-7 days"},
    {"name":"Dar es Salaam","slug":"dar-es-salaam",  "country":"Tanzania","region":"East Africa","lead":"5-7 days"},
    {"name":"Kampala",      "slug":"kampala",        "country":"Uganda","region":"East Africa","lead":"6-8 days"},
    {"name":"Addis Ababa",  "slug":"addis-ababa",    "country":"Ethiopia","region":"East Africa","lead":"6-8 days"},
    {"name":"Kigali",       "slug":"kigali",         "country":"Rwanda","region":"East Africa","lead":"6-8 days"},
    {"name":"Johannesburg", "slug":"johannesburg",   "country":"South Africa","region":"Southern Africa","lead":"5-7 days"},
    {"name":"Cape Town",    "slug":"cape-town",      "country":"South Africa","region":"Southern Africa","lead":"6-8 days"},
    {"name":"Durban",       "slug":"durban",         "country":"South Africa","region":"Southern Africa","lead":"5-7 days"},
    {"name":"Lusaka",       "slug":"lusaka",         "country":"Zambia","region":"Southern Africa","lead":"6-8 days"},
    {"name":"Harare",       "slug":"harare",         "country":"Zimbabwe","region":"Southern Africa","lead":"6-8 days"},
    {"name":"Cairo",        "slug":"cairo",          "country":"Egypt","region":"North Africa","lead":"4-6 days"},
    {"name":"Alexandria",   "slug":"alexandria",     "country":"Egypt","region":"North Africa","lead":"4-6 days"},
    {"name":"Casablanca",   "slug":"casablanca",     "country":"Morocco","region":"North Africa","lead":"5-7 days"},
    {"name":"Algiers",      "slug":"algiers",        "country":"Algeria","region":"North Africa","lead":"5-7 days"},
    # South Asia
    {"name":"Dhaka",        "slug":"dhaka",          "country":"Bangladesh","region":"South Asia","lead":"3-4 days"},
    {"name":"Chittagong",   "slug":"chittagong",     "country":"Bangladesh","region":"South Asia","lead":"3-4 days"},
    {"name":"Colombo",      "slug":"colombo",        "country":"Sri Lanka","region":"South Asia","lead":"2-3 days"},
    {"name":"Kathmandu",    "slug":"kathmandu",      "country":"Nepal","region":"South Asia","lead":"2-3 days"},
    {"name":"Karachi",      "slug":"karachi",        "country":"Pakistan","region":"South Asia","lead":"3-4 days"},
    {"name":"Lahore",       "slug":"lahore",         "country":"Pakistan","region":"South Asia","lead":"3-4 days"},
    # Southeast Asia
    {"name":"Bangkok",      "slug":"bangkok",        "country":"Thailand","region":"Southeast Asia","lead":"3-5 days"},
    {"name":"Manila",       "slug":"manila",         "country":"Philippines","region":"Southeast Asia","lead":"4-6 days"},
    {"name":"Jakarta",      "slug":"jakarta",        "country":"Indonesia","region":"Southeast Asia","lead":"5-7 days"},
    {"name":"Kuala Lumpur", "slug":"kuala-lumpur",   "country":"Malaysia","region":"Southeast Asia","lead":"3-5 days"},
    {"name":"Ho Chi Minh City","slug":"ho-chi-minh-city","country":"Vietnam","region":"Southeast Asia","lead":"4-6 days"},
    {"name":"Yangon",       "slug":"yangon",         "country":"Myanmar","region":"Southeast Asia","lead":"4-6 days"},
    {"name":"Phnom Penh",   "slug":"phnom-penh",     "country":"Cambodia","region":"Southeast Asia","lead":"5-7 days"},
    # Central Asia
    {"name":"Almaty",       "slug":"almaty",         "country":"Kazakhstan","region":"Central Asia","lead":"5-8 days"},
    {"name":"Tashkent",     "slug":"tashkent",       "country":"Uzbekistan","region":"Central Asia","lead":"6-8 days"},
    {"name":"Ulaanbaatar",  "slug":"ulaanbaatar",    "country":"Mongolia","region":"Central Asia","lead":"7-9 days"},
]

# Indian states
INDIAN_STATES = [
    {"name":"Maharashtra","slug":"maharashtra","capital":"Mumbai","hubs":["Mumbai","Pune","Nagpur","Nashik","Aurangabad"]},
    {"name":"Gujarat","slug":"gujarat","capital":"Ahmedabad","hubs":["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar"]},
    {"name":"Tamil Nadu","slug":"tamil-nadu","capital":"Chennai","hubs":["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem"]},
    {"name":"Rajasthan","slug":"rajasthan","capital":"Jaipur","hubs":["Jaipur","Jodhpur","Udaipur","Kota","Alwar"]},
    {"name":"Telangana","slug":"telangana","capital":"Hyderabad","hubs":["Hyderabad","Warangal","Nizamabad","Karimnagar","Ramagundam"]},
    {"name":"Karnataka","slug":"karnataka","capital":"Bengaluru","hubs":["Bengaluru","Hubballi","Belagavi","Mangaluru","Mysuru"]},
    {"name":"Uttar Pradesh","slug":"uttar-pradesh","capital":"Lucknow","hubs":["Lucknow","Kanpur","Agra","Varanasi","Allahabad"]},
    {"name":"West Bengal","slug":"west-bengal","capital":"Kolkata","hubs":["Kolkata","Howrah","Durgapur","Asansol","Siliguri"]},
    {"name":"Madhya Pradesh","slug":"madhya-pradesh","capital":"Bhopal","hubs":["Bhopal","Indore","Jabalpur","Gwalior","Rewa"]},
    {"name":"Andhra Pradesh","slug":"andhra-pradesh","capital":"Amaravati","hubs":["Visakhapatnam","Vijayawada","Tirupati","Guntur","Kurnool"]},
    {"name":"Odisha","slug":"odisha","capital":"Bhubaneswar","hubs":["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur"]},
    {"name":"Jharkhand","slug":"jharkhand","capital":"Ranchi","hubs":["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar"]},
    {"name":"Chhattisgarh","slug":"chhattisgarh","capital":"Raipur","hubs":["Raipur","Bhilai","Bilaspur","Korba","Durg"]},
    {"name":"Punjab","slug":"punjab","capital":"Chandigarh","hubs":["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda"]},
    {"name":"Haryana","slug":"haryana","capital":"Chandigarh","hubs":["Faridabad","Gurgaon","Panipat","Ambala","Hisar"]},
    {"name":"Bihar","slug":"bihar","capital":"Patna","hubs":["Patna","Gaya","Muzaffarpur","Bhagalpur","Darbhanga"]},
    {"name":"Assam","slug":"assam","capital":"Dispur","hubs":["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon"]},
    {"name":"Delhi","slug":"delhi","capital":"New Delhi","hubs":["New Delhi","Noida","Ghaziabad","Faridabad","Gurugram"]},
    {"name":"Kerala","slug":"kerala","capital":"Thiruvananthapuram","hubs":["Kochi","Thiruvananthapuram","Kozhikode","Thrissur","Malappuram"]},
    {"name":"Uttarakhand","slug":"uttarakhand","capital":"Dehradun","hubs":["Dehradun","Haridwar","Roorkee","Haldwani","Rishikesh"]},
    {"name":"Himachal Pradesh","slug":"himachal-pradesh","capital":"Shimla","hubs":["Shimla","Manali","Dharamsala","Solan","Mandi"]},
    {"name":"Goa","slug":"goa","capital":"Panaji","hubs":["Panaji","Margao","Vasco da Gama","Mapusa","Ponda"]},
    {"name":"Meghalaya","slug":"meghalaya","capital":"Shillong","hubs":["Shillong","Tura","Nongstoin","Jowai","Baghmara"]},
    {"name":"Tripura","slug":"tripura","capital":"Agartala","hubs":["Agartala","Dharmanagar","Udaipur","Kailasahar","Belonia"]},
    {"name":"Manipur","slug":"manipur","capital":"Imphal","hubs":["Imphal","Thoubal","Bishnupur","Churachandpur","Senapati"]},
    {"name":"Nagaland","slug":"nagaland","capital":"Kohima","hubs":["Kohima","Dimapur","Mokokchung","Tuensang","Wokha"]},
    {"name":"Mizoram","slug":"mizoram","capital":"Aizawl","hubs":["Aizawl","Lunglei","Saiha","Champhai","Kolasib"]},
    {"name":"Arunachal Pradesh","slug":"arunachal-pradesh","capital":"Itanagar","hubs":["Itanagar","Naharlagun","Pasighat","Tezpur","Bomdila"]},
]

INDUSTRIES = [
    {"name":"Mining",           "slug":"mining",        "desc":"open-pit mines, underground mining, coal extraction, mineral processing"},
    {"name":"Construction",     "slug":"construction",  "desc":"road building, building construction, bridge work, urban infrastructure"},
    {"name":"Oil & Gas",        "slug":"oil-gas",       "desc":"upstream drilling, pipeline construction, refinery maintenance, offshore platforms"},
    {"name":"Agriculture",      "slug":"agriculture",   "desc":"large-scale farming, land clearing, irrigation, crop harvesting"},
    {"name":"Forestry",         "slug":"forestry",      "desc":"logging, wood processing, plantation management, forest road construction"},
    {"name":"Quarrying",        "slug":"quarrying",     "desc":"stone quarrying, granite extraction, limestone mining, aggregate production"},
    {"name":"Marine & Port",    "slug":"marine-port",   "desc":"port construction, dredging, harbour maintenance, marine engineering"},
    {"name":"Road Building",    "slug":"road-building", "desc":"highway construction, asphalt paving, bridge building, road maintenance"},
]

# Combine all geographic markets
ALL_MARKETS = (
    [{"name":c["name"],"slug":c["slug"],"type":"country","region":c["region"],"lead":c["lead"],"city":c.get("city",c["name"])} for c in COUNTRIES] +
    [{"name":c["name"],"slug":c["slug"],"type":"city",   "region":c["region"],"lead":c["lead"],"city":c["name"],"country":c["country"]} for c in CITIES]
)

# Indian state markets
INDIA_MARKETS = [
    {"name":f"India – {s['name']}","slug":f"india-{s['slug']}","type":"indian-state",
     "region":"India","lead":"1-3 days","city":s["capital"],"state":s["name"],"state_slug":s["slug"],
     "hubs":", ".join(s["hubs"][:3])}
    for s in INDIAN_STATES
]

# ─────────────────────────────────────────────
# PART DATA LOADER
# ─────────────────────────────────────────────

_part_cache = {}

def load_parts(brand_slug, cat_slug, limit=12):
    key = f"{brand_slug}/{cat_slug}"
    if key in _part_cache:
        return _part_cache[key][:limit]
    parts = []
    cat_dir = ROOT / brand_slug / cat_slug
    if not cat_dir.exists():
        # try old slug aliases
        aliases = {"engine-parts":"engine","hydraulic-parts":"hydraulics","brake-parts":"braking",
                   "transmission-parts":"transmission","electrical-parts":"electrical",
                   "cooling-system":"cooling","cab-body-parts":"cabin","suspension-chassis":"suspension",
                   "steering-parts":"steering","filters":"filtration","fuel-system":"fuel","spare-parts":"misc"}
        if cat_slug in aliases:
            cat_dir = ROOT / brand_slug / aliases[cat_slug]
    if not cat_dir.exists():
        _part_cache[key] = []
        return []
    p_re = re.compile(r"const P = \{(.*?)\};", re.DOTALL)
    files = sorted(cat_dir.glob("*.html"))[:60]
    for f in files:
        if f.name == "index.html":
            continue
        try:
            txt = f.read_text(errors="ignore")
            m = p_re.search(txt)
            if not m:
                continue
            block = "{" + m.group(1) + "}"
            pno = re.search(r"partNo:'([^']+)'", block)
            nam = re.search(r"name:'([^']+)'", block)
            if pno and nam:
                parts.append({"partNo": pno.group(1), "name": nam.group(1)[:80], "slug": f.stem})
        except Exception:
            continue
        if len(parts) >= limit:
            break
    _part_cache[key] = parts
    return parts[:limit]

# ─────────────────────────────────────────────
# HTML TEMPLATE
# ─────────────────────────────────────────────

WA_NUMBER = "919821037990"

def wa_link(msg):
    return f"https://wa.me/{WA_NUMBER}?text={html.escape(msg, quote=True).replace(' ', '+')}"

def render_page(title, meta_desc, canonical, h1, intro_html, parts_html, faq_html, breadcrumbs, schema_json):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(meta_desc)}">
<link rel="canonical" href="{html.escape(canonical)}">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(meta_desc)}">
<meta property="og:url" content="{html.escape(canonical)}">
<meta property="og:type" content="website">
<meta property="og:image" content="https://partstrading.com/assets/img/og-default.jpg">
<link rel="icon" href="/favicon.ico">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');</script>
<script type="application/ld+json">{schema_json}</script>
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:#0a0a0a;color:#e8e8e8;font-family:'Inter',system-ui,-apple-system,sans-serif;line-height:1.6}}
a{{color:#F5A623;text-decoration:none}}a:hover{{text-decoration:underline}}
.nav{{background:#111;border-bottom:1px solid #222;padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:60px;position:sticky;top:0;z-index:100}}
.nav-logo{{font-weight:900;font-size:18px;letter-spacing:-.02em;color:#fff}}
.nav-logo span{{color:#F5A623}}
.nav-links{{display:flex;gap:24px;font-size:13px}}
.nav-links a{{color:#aaa}}
.hero{{background:linear-gradient(135deg,#111 0%,#1a1a1a 100%);padding:80px 32px 64px;border-bottom:1px solid #222}}
.hero-inner{{max-width:1100px;margin:0 auto}}
.breadcrumb{{font-size:12px;color:#555;margin-bottom:20px;display:flex;gap:6px;flex-wrap:wrap}}
.breadcrumb a{{color:#666}}
.breadcrumb span{{color:#333}}
h1{{font-size:clamp(32px,5vw,58px);font-weight:900;letter-spacing:-.03em;line-height:.95;margin-bottom:20px;text-transform:uppercase}}
h1 em{{color:#F5A623;font-style:normal}}
.hero-sub{{font-size:16px;color:#999;max-width:620px;line-height:1.7;margin-bottom:32px}}
.cta-row{{display:flex;gap:12px;flex-wrap:wrap}}
.btn-wa{{display:inline-flex;align-items:center;gap:10px;background:#25D366;color:#fff;padding:14px 28px;border-radius:10px;font-weight:800;font-size:15px;letter-spacing:.04em;text-transform:uppercase;transition:all .2s}}
.btn-wa:hover{{background:#128C7E;text-decoration:none;transform:translateY(-1px)}}
.btn-email{{display:inline-flex;align-items:center;gap:8px;border:1px solid #333;color:#ccc;padding:14px 24px;border-radius:10px;font-weight:700;font-size:14px;letter-spacing:.04em;text-transform:uppercase;transition:all .2s}}
.btn-email:hover{{border-color:#555;color:#fff;text-decoration:none}}
.stats-bar{{background:#111;border-top:1px solid #222;border-bottom:1px solid #222;padding:20px 32px}}
.stats-inner{{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:20px;text-align:center}}
.stat-val{{font-size:24px;font-weight:900;color:#F5A623}}
.stat-label{{font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.08em;margin-top:2px}}
.section{{padding:64px 32px}}
.section-inner{{max-width:1100px;margin:0 auto}}
h2{{font-size:clamp(22px,3vw,34px);font-weight:900;letter-spacing:-.02em;text-transform:uppercase;margin-bottom:8px}}
.section-sub{{color:#666;font-size:14px;margin-bottom:36px}}
.parts-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}}
.part-card{{background:#111;border:1px solid #222;border-radius:12px;padding:20px;transition:border-color .2s}}
.part-card:hover{{border-color:#333}}
.part-no{{font-family:monospace;font-size:12px;color:#F5A623;font-weight:700;letter-spacing:.06em;margin-bottom:6px}}
.part-name{{font-size:13px;color:#ccc;line-height:1.4;margin-bottom:12px}}
.part-link{{font-size:12px;color:#F5A623;font-weight:600;letter-spacing:.04em;text-transform:uppercase}}
.trust-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}}
.trust-card{{background:#111;border:1px solid #222;border-radius:12px;padding:24px}}
.trust-icon{{font-size:28px;margin-bottom:12px}}
.trust-title{{font-weight:700;font-size:15px;margin-bottom:6px}}
.trust-text{{font-size:13px;color:#777;line-height:1.5}}
.faq-list{{max-width:720px}}
.faq-item{{border-bottom:1px solid #1e1e1e;padding:20px 0}}
.faq-q{{font-weight:700;font-size:15px;margin-bottom:8px;color:#fff}}
.faq-a{{font-size:14px;color:#888;line-height:1.6}}
.cats-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}}
.cat-link{{display:block;background:#111;border:1px solid #222;border-radius:8px;padding:12px 16px;font-size:13px;color:#ccc;transition:all .2s;font-weight:600}}
.cat-link:hover{{background:#161616;border-color:#333;color:#F5A623;text-decoration:none}}
.brands-row{{display:flex;gap:12px;flex-wrap:wrap}}
.brand-pill{{background:#111;border:1px solid #222;border-radius:6px;padding:8px 16px;font-size:12px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.06em}}
.cta-band{{background:#F5A623;padding:64px 32px;text-align:center}}
.cta-band h2{{color:#000}}
.cta-band p{{color:rgba(0,0,0,.7);margin:12px auto 28px;max-width:560px;font-size:15px}}
.btn-dark{{display:inline-flex;align-items:center;gap:10px;background:#000;color:#fff;padding:16px 32px;border-radius:10px;font-weight:800;font-size:15px;letter-spacing:.04em;text-transform:uppercase}}
.footer{{background:#000;border-top:1px solid #1a1a1a;padding:40px 32px;text-align:center}}
.footer p{{color:#444;font-size:12px;line-height:1.8}}
.footer a{{color:#555}}
@media(max-width:600px){{.nav-links{{display:none}}.hero{{padding:48px 20px 40px}}.section{{padding:40px 20px}}.stats-bar{{padding:20px}}}}
</style>
</head>
<body>
<nav class="nav">
  <a href="/" class="nav-logo">PARTS<span>TRADING</span></a>
  <div class="nav-links">
    <a href="/cat/">CAT</a>
    <a href="/volvo/">Volvo</a>
    <a href="/hitachi/">Hitachi</a>
    <a href="/komatsu/">Komatsu</a>
    <a href="/scania/">Scania</a>
    <a href="/john-deere/">John Deere</a>
  </div>
</nav>

<div class="hero">
  <div class="hero-inner">
    <div class="breadcrumb">{breadcrumbs}</div>
    <h1>{h1}</h1>
    <p class="hero-sub">{intro_html}</p>
    <div class="cta-row">
      <a href="{wa_link('Hi, I need parts. Can you help with pricing and availability?')}" class="btn-wa" target="_blank">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp for Quote
      </a>
      <a href="mailto:parts@partstrading.com" class="btn-email">Email Enquiry</a>
    </div>
  </div>
</div>

<div class="stats-bar">
  <div class="stats-inner">
    <div><div class="stat-val">67,000+</div><div class="stat-label">Parts in Catalog</div></div>
    <div><div class="stat-val">47 min</div><div class="stat-label">Avg Response Time</div></div>
    <div><div class="stat-val">6</div><div class="stat-label">Major Brands</div></div>
    <div><div class="stat-val">45+</div><div class="stat-label">Countries Supplied</div></div>
    <div><div class="stat-val">Mumbai</div><div class="stat-label">Dispatch Hub</div></div>
  </div>
</div>

{parts_html}

<section class="section" style="background:#0d0d0d">
  <div class="section-inner">
    <h2>Why Source Heavy Equipment Parts From India</h2>
    <p class="section-sub">Parts Trading Company ships globally from Mumbai — competitive pricing, fast turnaround</p>
    <div class="trust-grid">
      <div class="trust-card">
        <div class="trust-icon">⚡</div>
        <div class="trust-title">Same-Day Dispatch</div>
        <div class="trust-text">Orders confirmed before 3 PM IST ship the same day from our Mumbai warehouse.</div>
      </div>
      <div class="trust-card">
        <div class="trust-icon">✅</div>
        <div class="trust-title">OEM & Aftermarket</div>
        <div class="trust-text">Both genuine OEM and OEM-specification aftermarket parts — you choose the grade.</div>
      </div>
      <div class="trust-card">
        <div class="trust-icon">📄</div>
        <div class="trust-title">Full Export Docs</div>
        <div class="trust-text">Commercial invoice, packing list, COO, and GST invoice included with every shipment.</div>
      </div>
      <div class="trust-card">
        <div class="trust-icon">🌍</div>
        <div class="trust-title">Global Shipping</div>
        <div class="trust-text">DHL, FedEx, and sea freight to 45+ countries. Air freight for urgent requirements.</div>
      </div>
      <div class="trust-card">
        <div class="trust-icon">💬</div>
        <div class="trust-title">60-Min Confirmation</div>
        <div class="trust-text">Send a part number or description — we confirm stock, pricing, and lead time in under an hour.</div>
      </div>
      <div class="trust-card">
        <div class="trust-icon">🔧</div>
        <div class="trust-title">Hard-to-Find Parts</div>
        <div class="trust-text">Obsolete, discontinued, and low-volume parts sourced from our network of 200+ suppliers.</div>
      </div>
    </div>
  </div>
</section>

{faq_html}

<div class="cta-band">
  <div style="max-width:640px;margin:0 auto">
    <h2>Ready to Order?</h2>
    <p>Send us your part number or equipment model and we'll reply with stock confirmation, pricing, and lead time — usually within 47 minutes.</p>
    <a href="{wa_link('Hi, I need heavy equipment parts. Can you help?')}" class="btn-dark" target="_blank">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      WhatsApp Now
    </a>
  </div>
</div>

<footer class="footer">
  <p>Parts Trading Company · Mumbai, India · +91 98210 37990 · <a href="mailto:parts@partstrading.com">parts@partstrading.com</a></p>
  <p style="margin-top:8px"><a href="/">Home</a> · <a href="/cat/">CAT Parts</a> · <a href="/volvo/">Volvo Parts</a> · <a href="/komatsu/">Komatsu Parts</a> · <a href="/hitachi/">Hitachi Parts</a> · <a href="/scania/">Scania Parts</a></p>
  <p style="margin-top:12px;color:#2a2a2a">© 2025 Parts Trading Company. All rights reserved.</p>
</footer>
</body>
</html>"""

# ─────────────────────────────────────────────
# PAGE TYPE GENERATORS
# ─────────────────────────────────────────────

def make_parts_section(parts, brand_slug, cat_slug, brand_label, cat_label):
    if not parts:
        return ""
    cards = ""
    for p in parts:
        url = f"/{brand_slug}/{cat_slug}/{p['slug']}/"
        cards += f"""<div class="part-card">
  <div class="part-no">{html.escape(p['partNo'])}</div>
  <div class="part-name">{html.escape(p['name'])}</div>
  <a href="{url}" class="part-link">View Part →</a>
</div>"""
    return f"""<section class="section">
  <div class="section-inner">
    <h2>Sample {html.escape(brand_label)} {html.escape(cat_label)}</h2>
    <p class="section-sub">Showing {len(parts)} of hundreds available — <a href="/{brand_slug}/{cat_slug}/">browse full catalog</a></p>
    <div class="parts-grid">{cards}</div>
  </div>
</section>"""

def make_cats_section(brand_slug, brand_label, active_cat=None):
    links = ""
    for slug, info in CATEGORIES.items():
        if slug == active_cat:
            continue
        links += f'<a href="/{brand_slug}/{slug}/" class="cat-link">{html.escape(info["label"])}</a>'
    return f"""<section class="section" style="background:#0d0d0d">
  <div class="section-inner">
    <h2>{html.escape(brand_label)} Parts by Category</h2>
    <p class="section-sub">All categories stocked and shipped globally</p>
    <div class="cats-grid">{links}</div>
  </div>
</section>"""

def make_faq(questions):
    items = ""
    for q, a in questions:
        items += f"""<div class="faq-item">
  <div class="faq-q">{html.escape(q)}</div>
  <div class="faq-a">{html.escape(a)}</div>
</div>"""
    return f"""<section class="section">
  <div class="section-inner">
    <h2>Frequently Asked Questions</h2>
    <p class="section-sub">&nbsp;</p>
    <div class="faq-list">{items}</div>
  </div>
</section>"""

def bc(items):
    """Render breadcrumbs HTML."""
    parts = []
    for i, (label, url) in enumerate(items):
        if i < len(items) - 1:
            parts.append(f'<a href="{url}">{html.escape(label)}</a><span>›</span>')
        else:
            parts.append(f'<span>{html.escape(label)}</span>')
    return " ".join(parts)

# ─────────────────────────────────────────────
# 1. BRAND × MARKET  (/suppliers/{brand}-parts-{market}/)
# ─────────────────────────────────────────────

def gen_brand_market(brand_slug, brand, market):
    bl = brand["label"]
    mn = market["name"]
    lead = market["lead"]
    region = market["region"]
    mtype = market.get("type","country")
    city = market.get("city", mn)
    country = market.get("country", mn) if mtype == "city" else mn

    title = f"{bl} Parts Supplier in {mn} | Parts Trading Company"
    meta  = f"Buy genuine and aftermarket {bl} parts in {mn}. Fast shipping {lead} from Mumbai. {bl} engine, hydraulic, brake & transmission parts. WhatsApp +91-98210-37990."
    canonical = f"https://partstrading.com/suppliers/{brand_slug}-parts-{market['slug']}/"
    h1 = f'<em>{bl} Parts</em><br>Supplier in {mn}'
    intro = f"Parts Trading Company supplies {bl} heavy equipment parts to {mn}. We ship from Mumbai via DHL and FedEx — typical delivery time to {city} is {lead}. OEM and aftermarket grades available with full export documentation."

    cats_html = make_cats_section(brand_slug, bl)

    # FAQ
    faq = make_faq([
        (f"How long does shipping take to {mn}?", f"Typically {lead} via air freight (DHL/FedEx). Sea freight takes 14–28 days but is cheaper for large orders."),
        (f"Do you supply both OEM and aftermarket {bl} parts?", f"Yes — we stock OEM-specification aftermarket {bl} parts and can source genuine OEM parts on request."),
        ("What documentation do you provide for export?", "Every shipment includes a commercial invoice, packing list, certificate of origin, and GST invoice."),
        (f"Can you source {bl} parts not listed on your website?", f"Yes. Send us the part number on WhatsApp and we'll check availability within 60 minutes from our network of 200+ suppliers."),
        ("What payment methods do you accept for international orders?", "Wire transfer (TT), LC (Letter of Credit), and online payment for smaller orders."),
    ])

    schema = json.dumps({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Parts Trading Company",
        "description": f"{bl} parts supplier for {mn}",
        "url": canonical,
        "telephone": "+919821037990",
        "email": "parts@partstrading.com",
        "address": {"@type":"PostalAddress","streetAddress":"Mumbai","addressRegion":"Maharashtra","postalCode":"400001","addressCountry":"IN"},
        "areaServed": [{"@type":"Country","name": country}],
        "sameAs": ["https://partstrading.com"]
    }, indent=None)

    crumbs = bc([("Home","/"),("Suppliers","/suppliers/"),(f"{bl} Parts in {mn}","")])
    body = cats_html + faq

    return render_page(title, meta, canonical, h1, intro, "", body, crumbs, schema)

# ─────────────────────────────────────────────
# 2. BRAND × CATEGORY × MARKET  (/{brand}/{cat}/{market}/)
# ─────────────────────────────────────────────

def gen_brand_cat_market(brand_slug, brand, cat_slug, cat, market):
    bl = brand["label"]
    cl = cat["label"]
    mn = market["name"]
    lead = market["lead"]
    city = market.get("city", mn)
    country = market.get("country", mn) if market.get("type") == "city" else mn

    parts = load_parts(brand_slug, cat_slug, 12)

    title = f"{bl} {cl} in {mn} | Parts Trading Company"
    meta  = f"Buy {bl} {cl.lower()} in {mn} — {cat['desc']}. Fast shipping {lead} from Mumbai. WhatsApp +91-98210-37990."
    canonical = f"https://partstrading.com/{brand_slug}/{cat_slug}/{market['slug']}/"
    h1 = f'<em>{bl} {cl}</em><br>Delivered to {mn}'
    intro = f"Parts Trading Company exports {bl} {cl.lower()} to {mn}. We carry {cat['desc']} — OEM specification and genuine OEM grades. Air freight to {city} typically takes {lead} from our Mumbai dispatch hub."

    parts_html = make_parts_section(parts, brand_slug, cat_slug, bl, cl)
    faq = make_faq([
        (f"Do you ship {bl} {cl.lower()} to {mn}?", f"Yes. We ship to {mn} via DHL/FedEx air freight with typical transit time of {lead} from Mumbai."),
        (f"What {bl} {cl.lower()} do you stock?", f"We carry {cat['desc']}."),
        ("Can you source a specific part number?", "Send the part number on WhatsApp (+91 98210 37990) and we'll confirm stock and pricing within 60 minutes."),
        ("Do you provide warranty on parts?", "All parts carry a 6-month warranty against manufacturing defects. OEM parts come with manufacturer warranty."),
    ])
    crumbs = bc([("Home","/"),(f"{bl}",f"/{brand_slug}/"),(cl,f"/{brand_slug}/{cat_slug}/"),(mn,"")])
    schema = json.dumps({"@context":"https://schema.org","@type":"WebPage","name":title,"url":canonical,"description":meta}, indent=None)

    return render_page(title, meta, canonical, h1, intro, parts_html, faq, crumbs, schema)

# ─────────────────────────────────────────────
# 3. BRAND × MODEL  (/{brand}/models/{model}/)
# ─────────────────────────────────────────────

def gen_brand_model(brand_slug, brand, model):
    bl = brand["label"]
    ms = model.lower().replace(" ","-").replace("/","-")
    parts = load_parts(brand_slug, "spare-parts", 12)

    title = f"{bl} {model} Parts | Parts Trading Company"
    meta  = f"OEM & aftermarket spare parts for {bl} {model}. Engine, hydraulic, brake, transmission and electrical parts. Same-day dispatch from Mumbai. WhatsApp +91-98210-37990."
    canonical = f"https://partstrading.com/{brand_slug}/models/{ms}/"
    h1 = f'<em>{bl} {model}</em><br>Spare Parts'
    intro = f"Complete range of spare parts for the {bl} {model}. We carry engine components, hydraulic parts, brake systems, transmission parts, and electrical components — all OEM-specification. Ships same day from Mumbai."

    parts_html = make_parts_section(parts, brand_slug, "spare-parts", bl, f"{model} Spare Parts")
    cats_html = make_cats_section(brand_slug, bl)

    faq = make_faq([
        (f"Do you stock parts for {bl} {model}?", f"Yes — we carry a wide range of {bl} {model} parts including engine, hydraulic, brake, and electrical components."),
        (f"Can I get OEM parts for {bl} {model}?", f"Yes, both genuine OEM and high-quality OEM-specification aftermarket parts are available."),
        (f"How do I order {bl} {model} parts?", f"WhatsApp us your part number or description at +91 98210 37990 and we'll confirm availability and pricing within 60 minutes."),
        (f"What is the warranty on {bl} {model} parts?", "6 months against manufacturing defects. Genuine OEM parts carry the manufacturer warranty."),
    ])
    crumbs = bc([("Home","/"),(f"{bl}",f"/{brand_slug}/"),("Models",f"/{brand_slug}/models/"),(model,"")])
    schema = json.dumps({"@context":"https://schema.org","@type":"Product","name":f"{bl} {model} Parts","brand":{"@type":"Brand","name":bl},"url":canonical}, indent=None)

    return render_page(title, meta, canonical, h1, intro, parts_html, cats_html + faq, crumbs, schema)

# ─────────────────────────────────────────────
# 4. BRAND × MODEL × CATEGORY  (/{brand}/models/{model}/{cat}/)
# ─────────────────────────────────────────────

def gen_brand_model_cat(brand_slug, brand, model, cat_slug, cat):
    bl = brand["label"]
    cl = cat["label"]
    ms = model.lower().replace(" ","-").replace("/","-")
    parts = load_parts(brand_slug, cat_slug, 12)

    title = f"{bl} {model} {cl} | Parts Trading Company"
    meta  = f"OEM & aftermarket {cl.lower()} for {bl} {model} — {cat['desc']}. Same-day dispatch from Mumbai. WhatsApp +91-98210-37990."
    canonical = f"https://partstrading.com/{brand_slug}/models/{ms}/{cat_slug}/"
    h1 = f'<em>{bl} {model}</em><br>{cl}'
    intro = f"{cl} for the {bl} {model}: {cat['desc']}. OEM and aftermarket grades available. Same-day dispatch from Mumbai for orders placed before 3 PM IST."

    parts_html = make_parts_section(parts, brand_slug, cat_slug, bl, f"{model} {cl}")
    faq = make_faq([
        (f"What {cl.lower()} do you carry for the {bl} {model}?", f"We stock {cat['desc']} for the {bl} {model}."),
        (f"How do I identify the correct {cl.lower()} for my {bl} {model}?", f"Provide the serial number or part number — our team will cross-reference and confirm the correct part."),
        ("How fast can you dispatch?", "Same-day for orders before 3 PM IST. Next-day dispatch otherwise."),
    ])
    crumbs = bc([("Home","/"),(f"{bl}",f"/{brand_slug}/"),("Models",f"/{brand_slug}/models/"),(model,f"/{brand_slug}/models/{ms}/"),(cl,"")])
    schema = json.dumps({"@context":"https://schema.org","@type":"Product","name":f"{bl} {model} {cl}","brand":{"@type":"Brand","name":bl},"url":canonical}, indent=None)

    return render_page(title, meta, canonical, h1, intro, parts_html, faq, crumbs, schema)

# ─────────────────────────────────────────────
# 5. INDUSTRY × BRAND  (/industries/{ind}/{brand}/)
# ─────────────────────────────────────────────

def gen_industry_brand(industry, brand_slug, brand):
    bl = brand["label"]
    il = industry["name"]
    parts = load_parts(brand_slug, "spare-parts", 8)

    title = f"{bl} Parts for {il} | Parts Trading Company"
    meta  = f"Heavy-duty {bl} spare parts for {il} applications — {industry['desc']}. OEM & aftermarket. Ships globally from Mumbai. WhatsApp +91-98210-37990."
    canonical = f"https://partstrading.com/industries/{industry['slug']}/{brand_slug}/"
    h1 = f'<em>{bl} Parts</em><br>for {il}'
    intro = f"{bl} equipment is widely used in {il.lower()} — {industry['desc']}. Parts Trading Company supplies genuine and aftermarket {bl} parts specifically suited for the demanding conditions of {il.lower()} operations."

    parts_html = make_parts_section(parts, brand_slug, "spare-parts", bl, f"{il} Spare Parts")
    cats_html = make_cats_section(brand_slug, bl)
    faq = make_faq([
        (f"Which {bl} models are common in {il.lower()}?", f"Common {bl} models in {il.lower()} include {', '.join(brand['models'][:5])}."),
        (f"Do you stock parts suitable for {il.lower()} conditions?", f"Yes — all our {bl} parts are heavy-duty grade, suitable for the demanding conditions in {il.lower()}."),
        ("What is your minimum order quantity?", "No minimum order. We supply single parts to bulk orders equally."),
    ])
    crumbs = bc([("Home","/"),("Industries","/industries/"),(il,f"/industries/{industry['slug']}/"),(bl,"")])
    schema = json.dumps({"@context":"https://schema.org","@type":"WebPage","name":title,"url":canonical,"description":meta}, indent=None)

    return render_page(title, meta, canonical, h1, intro, parts_html, cats_html + faq, crumbs, schema)

# ─────────────────────────────────────────────
# 6. INDUSTRY × BRAND × CATEGORY  (/industries/{ind}/{brand}/{cat}/)
# ─────────────────────────────────────────────

def gen_industry_brand_cat(industry, brand_slug, brand, cat_slug, cat):
    bl = brand["label"]
    cl = cat["label"]
    il = industry["name"]
    parts = load_parts(brand_slug, cat_slug, 12)

    title = f"{bl} {cl} for {il} | Parts Trading Company"
    meta  = f"{bl} {cl.lower()} for {il.lower()} applications — {cat['desc']}. Ships globally from Mumbai. WhatsApp +91-98210-37990."
    canonical = f"https://partstrading.com/industries/{industry['slug']}/{brand_slug}/{cat_slug}/"
    h1 = f'<em>{bl} {cl}</em><br>for {il}'
    intro = f"{bl} {cl.lower()} for {il.lower()} applications: {cat['desc']}. We supply both OEM and aftermarket grades — all tested to OEM specification and suited for the harsh conditions in {il.lower()}."

    parts_html = make_parts_section(parts, brand_slug, cat_slug, bl, f"{il} {cl}")
    faq = make_faq([
        (f"Why are {bl} {cl.lower()} critical in {il.lower()}?", f"In {il.lower()}, equipment runs under extreme load and duty cycles. Keeping {cl.lower()} in top condition prevents costly downtime."),
        (f"What {bl} {cl.lower()} do you stock for {il.lower()} use?", f"We carry {cat['desc']}, all rated for heavy-duty use."),
        ("How do I get a quote?", "WhatsApp us the part number or description at +91 98210 37990. We reply within 60 minutes."),
    ])
    crumbs = bc([("Home","/"),("Industries","/industries/"),(il,f"/industries/{industry['slug']}/"),(bl,f"/industries/{industry['slug']}/{brand_slug}/"),(cl,"")])
    schema = json.dumps({"@context":"https://schema.org","@type":"WebPage","name":title,"url":canonical,"description":meta}, indent=None)

    return render_page(title, meta, canonical, h1, intro, parts_html, faq, crumbs, schema)

# ─────────────────────────────────────────────
# 7. INDIAN STATE × BRAND  (/india/{state}/{brand}-parts/)
# ─────────────────────────────────────────────

def gen_india_state_brand(state, brand_slug, brand):
    bl = brand["label"]
    sn = state["name"]
    hubs = state["hubs"]
    cap = state["capital"]

    title = f"{bl} Parts in {sn} | Parts Trading Company"
    meta  = f"Buy {bl} spare parts in {sn} — same-day dispatch from Mumbai. OEM & aftermarket. Delivery to {cap} and all major cities. WhatsApp +91-98210-37990."
    canonical = f"https://partstrading.com/india/{state['slug']}/{brand_slug}-parts/"
    h1 = f'<em>{bl} Parts</em><br>in {sn}'
    intro = f"Parts Trading Company supplies {bl} heavy equipment parts across {sn}. We dispatch same-day from Mumbai to {', '.join(hubs[:3])} and all major cities in {sn} — typically 1–3 days transit. OEM and aftermarket grades, GST invoice included."

    cats_html = make_cats_section(brand_slug, bl)
    faq = make_faq([
        (f"How quickly can you deliver {bl} parts to {sn}?", f"Same-day dispatch from Mumbai for orders before 3 PM IST. Delivery to {cap} typically within 1–2 days."),
        (f"Do you have a dealer or distributor in {sn}?", f"We operate centrally from Mumbai and ship directly to customers across {sn} — no middlemen, so better pricing."),
        ("Do you provide GST invoices?", "Yes — GST invoice is included with every order."),
        (f"Can I pick up {bl} parts in {cap}?", f"We currently ship only — fast courier delivery to {cap} in 1–2 business days from Mumbai."),
    ])
    crumbs = bc([("Home","/"),("India","/india/"),(sn,f"/india/{state['slug']}/"),(f"{bl} Parts","")])
    schema = json.dumps({"@context":"https://schema.org","@type":"WebPage","name":title,"url":canonical,"description":meta}, indent=None)

    return render_page(title, meta, canonical, h1, intro, "", cats_html + faq, crumbs, schema)

# ─────────────────────────────────────────────
# 8. INDIAN STATE × BRAND × CATEGORY  (/india/{state}/{brand}/{cat}/)
# ─────────────────────────────────────────────

def gen_india_state_brand_cat(state, brand_slug, brand, cat_slug, cat):
    bl = brand["label"]
    cl = cat["label"]
    sn = state["name"]
    cap = state["capital"]
    parts = load_parts(brand_slug, cat_slug, 12)

    title = f"{bl} {cl} in {sn} | Parts Trading Company"
    meta  = f"Buy {bl} {cl.lower()} in {sn} — {cat['desc']}. Same-day dispatch from Mumbai. GST invoice. WhatsApp +91-98210-37990."
    canonical = f"https://partstrading.com/india/{state['slug']}/{brand_slug}/{cat_slug}/"
    h1 = f'<em>{bl} {cl}</em><br>in {sn}'
    intro = f"{bl} {cl.lower()} delivered anywhere in {sn}: {cat['desc']}. Orders placed before 3 PM IST ship same day from our Mumbai warehouse, reaching {cap} in 1–2 business days. GST invoice included."

    parts_html = make_parts_section(parts, brand_slug, cat_slug, bl, cl)
    faq = make_faq([
        (f"How fast can you deliver {bl} {cl.lower()} to {sn}?", f"Typically 1–2 business days to {cap} and major {sn} cities from our Mumbai dispatch hub."),
        ("Do you offer GST invoices?", "Yes — GST invoice included with every shipment across India."),
        (f"Can you source rare {bl} {cl.lower()}?", f"Yes — send the part number on WhatsApp and we'll check our 200+ supplier network within 60 minutes."),
    ])
    crumbs = bc([("Home","/"),("India","/india/"),(sn,f"/india/{state['slug']}/"),(bl,f"/india/{state['slug']}/{brand_slug}-parts/"),(cl,"")])
    schema = json.dumps({"@context":"https://schema.org","@type":"WebPage","name":title,"url":canonical,"description":meta}, indent=None)

    return render_page(title, meta, canonical, h1, intro, parts_html, faq, crumbs, schema)

# ─────────────────────────────────────────────
# MAIN GENERATION LOOP
# ─────────────────────────────────────────────

CORE_CATEGORIES = [
    "engine-parts","hydraulic-parts","brake-parts","transmission-parts",
    "electrical-parts","filters","cooling-system","fuel-system",
    "suspension-chassis","steering-parts","cab-body-parts","exhaust-turbo",
]

def write(path, content):
    path.mkdir(parents=True, exist_ok=True)
    (path / "index.html").write_text(content, encoding="utf-8")

def main():
    import sys
    dry = "--dry" in sys.argv
    count = 0

    def maybe_write(path, content):
        nonlocal count
        count += 1
        if not dry:
            write(path, content)

    print("=== PTC Programmatic Landing Page Generator ===\n")

    # 1. Brand × Market (all intl countries + cities)
    print("1. Brand × Market (supplier pages)…")
    for bs, br in BRANDS.items():
        for mk in ALL_MARKETS:
            path = ROOT / "suppliers" / f"{bs}-parts-{mk['slug']}"
            maybe_write(path, gen_brand_market(bs, br, mk))
    print(f"   → {len(BRANDS)*len(ALL_MARKETS)} pages")

    # 2. Brand × Category × Market (intl)
    print("2. Brand × Category × Market (intl)…")
    for bs, br in BRANDS.items():
        for cs, cat in CATEGORIES.items():
            if cs not in CORE_CATEGORIES:
                continue
            for mk in ALL_MARKETS:
                path = ROOT / bs / cs / mk['slug']
                maybe_write(path, gen_brand_cat_market(bs, br, cs, cat, mk))
    intl_cat_mkt = len(BRANDS) * len(CORE_CATEGORIES) * len(ALL_MARKETS)
    print(f"   → {intl_cat_mkt} pages")

    # 3. Brand × Model
    print("3. Brand × Model pages…")
    for bs, br in BRANDS.items():
        for model in br["models"]:
            ms = model.lower().replace(" ","-").replace("/","-")
            path = ROOT / bs / "models" / ms
            maybe_write(path, gen_brand_model(bs, br, model))
    bm = sum(len(br["models"]) for br in BRANDS.values())
    print(f"   → {bm} pages")

    # 4. Brand × Model × Category
    print("4. Brand × Model × Category…")
    for bs, br in BRANDS.items():
        for model in br["models"]:
            ms = model.lower().replace(" ","-").replace("/","-")
            for cs, cat in CATEGORIES.items():
                if cs not in CORE_CATEGORIES:
                    continue
                path = ROOT / bs / "models" / ms / cs
                maybe_write(path, gen_brand_model_cat(bs, br, model, cs, cat))
    bmc = sum(len(br["models"]) for br in BRANDS.values()) * len(CORE_CATEGORIES)
    print(f"   → {bmc} pages")

    # 5. Industry × Brand
    print("5. Industry × Brand…")
    for ind in INDUSTRIES:
        for bs, br in BRANDS.items():
            path = ROOT / "industries" / ind["slug"] / bs
            maybe_write(path, gen_industry_brand(ind, bs, br))
    print(f"   → {len(INDUSTRIES)*len(BRANDS)} pages")

    # 6. Industry × Brand × Category
    print("6. Industry × Brand × Category…")
    for ind in INDUSTRIES:
        for bs, br in BRANDS.items():
            for cs, cat in CATEGORIES.items():
                if cs not in CORE_CATEGORIES:
                    continue
                path = ROOT / "industries" / ind["slug"] / bs / cs
                maybe_write(path, gen_industry_brand_cat(ind, bs, br, cs, cat))
    ibc = len(INDUSTRIES) * len(BRANDS) * len(CORE_CATEGORIES)
    print(f"   → {ibc} pages")

    # 7. Indian State × Brand
    print("7. Indian State × Brand…")
    for st in INDIAN_STATES:
        for bs, br in BRANDS.items():
            path = ROOT / "india" / st["slug"] / f"{bs}-parts"
            maybe_write(path, gen_india_state_brand(st, bs, br))
    print(f"   → {len(INDIAN_STATES)*len(BRANDS)} pages")

    # 8. Indian State × Brand × Category
    print("8. Indian State × Brand × Category…")
    for st in INDIAN_STATES:
        for bs, br in BRANDS.items():
            for cs, cat in CATEGORIES.items():
                if cs not in CORE_CATEGORIES:
                    continue
                path = ROOT / "india" / st["slug"] / bs / cs
                maybe_write(path, gen_india_state_brand_cat(st, bs, br, cs, cat))
    isbc = len(INDIAN_STATES) * len(BRANDS) * len(CORE_CATEGORIES)
    print(f"   → {isbc} pages")

    total = (len(BRANDS)*len(ALL_MARKETS) + intl_cat_mkt + bm + bmc +
             len(INDUSTRIES)*len(BRANDS) + ibc + len(INDIAN_STATES)*len(BRANDS) + isbc)
    print(f"\n{'DRY RUN — ' if dry else ''}TOTAL: {total:,} pages generated")
    if dry:
        print("Run without --dry to actually write files.")

if __name__ == "__main__":
    main()
