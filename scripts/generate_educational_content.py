import os
import json

ROOT_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete/pages/diagnostic"

TEMPLATE = """<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Parts Trading Company</title>
    <meta name="description" content="{description}">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {{
            theme: {{
                extend: {{
                    fontFamily: {{
                        sans: ['Inter', 'sans-serif'],
                        heading: ['Outfit', 'sans-serif'],
                    }},
                    colors: {{
                        'ptc-yellow': '#FFB81C',
                        'whatsapp-green': '#25D366',
                    }}
                }}
            }}
        }}
    </script>
</head>
<body class="bg-gray-50 text-gray-900 font-sans antialiased">
    <!-- Navbar Minimal -->
    <nav class="w-full bg-white shadow-sm border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2">
                <div class="bg-ptc-yellow text-black font-heading font-black text-2xl px-2 py-1 rounded tracking-tighter transform -skew-x-12">PTC</div>
                <div class="hidden sm:block font-heading font-bold text-xl tracking-tight text-gray-900">PARTS TRADING<span class="text-ptc-yellow">.</span></div>
            </a>
            <a href="https://wa.me/919821037990" class="bg-ptc-yellow hover:bg-yellow-400 text-black font-bold py-2.5 px-6 rounded-full transition-all text-sm">GET EXPERT HELP</a>
        </div>
    </nav>

    <!-- Hero -->
    <section class="bg-gray-900 text-white py-20 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div class="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <div class="inline-flex items-center gap-2 bg-ptc-yellow/20 border border-ptc-yellow/30 text-ptc-yellow font-bold px-4 py-1.5 rounded-full mb-6 text-xs uppercase tracking-wider">
                <i class="fas fa-book-open"></i> Technical Guide 2026
            </div>
            <h1 class="font-heading text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">{hero_title}</h1>
            <p class="text-xl text-gray-300 font-light max-w-2xl mx-auto">{hero_subtitle}</p>
        </div>
    </section>

    <!-- Content -->
    <section class="py-16 bg-white">
        <div class="max-w-4xl mx-auto px-4 prose prose-lg prose-yellow">
            {content}
        </div>
    </section>

    <!-- CTA -->
    <section class="bg-gray-50 py-16 border-t border-gray-100">
        <div class="max-w-3xl mx-auto text-center px-4">
            <h2 class="text-3xl font-heading font-bold mb-6">Need Help Finding The Right {brand} Part?</h2>
            <p class="text-gray-600 mb-8">Our engineers have 70 years of experience decoding part numbers and ensuring perfect fitment. Send us a picture of your nameplate or part number.</p>
            <a href="https://wa.me/919821037990?text=I%20need%20help%20identifying%20a%20{brand}%20part." class="inline-flex items-center justify-center gap-3 bg-whatsapp-green hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all text-lg w-full sm:w-auto">
                <i class="fab fa-whatsapp text-2xl"></i> WhatsApp An Expert Now
            </a>
        </div>
    </section>

    <!-- Desktop Floating WhatsApp CTA -->
    <div class="hidden md:flex fixed bottom-8 right-8 z-[100] group flex-col items-end" style="position: fixed; bottom: 2rem; right: 2rem; z-index: 100;">
        <div class="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
            <div class="bg-white text-gray-900 text-sm font-bold px-4 py-3 rounded-2xl shadow-xl border-2 border-green-500/20 whitespace-nowrap flex items-center gap-3">
                <span class="flex h-2.5 w-2.5">
                    <span class="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                Chat with Parts Expert
            </div>
            <div class="w-4 h-4 bg-white border-r-2 border-b-2 border-green-500/20 transform rotate-45 absolute -bottom-2 right-6"></div>
        </div>
        <a href="https://wa.me/919821037990?text=Hi%21%20I%20was%20reading%20the%20{brand}%20guide%20and%20need%20help." target="_blank" 
           class="bg-gradient-to-tr from-green-500 to-emerald-400 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(34,197,94,0.3)] hover:shadow-[0_8px_30px_rgb(34,197,94,0.5)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center relative overflow-hidden group/btn">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
            </svg>
        </a>
    </div>

</body>
</html>
"""

ARTICLES = [
    {
        "filename": "how-to-identify-scania-part-numbers.html",
        "title": "How to Identify Scania Part Numbers",
        "brand": "Scania",
        "description": "Master the Scania part numbering system. Learn how to decode Scania 7-digit and 8-digit part numbers for trucks and marine engines.",
        "hero_title": "How to Identify Scania Part Numbers (Complete 2026 Guide)",
        "hero_subtitle": "Stop guessing. Learn the exact logic behind Scania's 7-digit OEM part numbering system to order the right replacement parts every time.",
        "content": """
        <h2 class="text-2xl font-bold mb-4">Understanding the Scania Logic</h2>
        <p class="mb-4">Scania's part numbering system is one of the most straightforward in the heavy equipment industry, but it still requires a basic understanding to avoid costly mistakes. Unlike CAT or Volvo, Scania predominantly uses a standard <strong>7-digit numerical format</strong>.</p>
        
        <h3 class="text-xl font-bold mt-8 mb-4">The Standard 7-Digit Format</h3>
        <p class="mb-4">A typical Scania part number looks like this: <strong>1 234 567</strong> or <strong>1234567</strong>.</p>
        <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>No letters:</strong> Authentic Scania OEM parts do not contain letters in their standard numbering sequence.</li>
            <li><strong>Chassis Specific:</strong> Scania's modular build system means parts are heavily tied to the specific chassis series (3-Series, 4-Series, PRT-Series).</li>
        </ul>

        <h3 class="text-xl font-bold mt-8 mb-4">Finding the Nameplate</h3>
        <p class="mb-4">The easiest way to identify the exact parts your Scania truck or marine engine needs is not by guessing, but by locating the chassis or engine nameplate. This nameplate contains the VIN (Vehicle Identification Number), which unlocks the precise Bill of Materials (BOM) used to build your specific unit at the factory.</p>
        
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r-lg">
            <p class="text-blue-800 m-0"><strong>Pro Tip:</strong> Upgrades happen during the production year. Two Scania R450s built in the same year might use different EGR valves. The <strong>Chassis Number</strong> is the only source of absolute truth.</p>
        </div>

        <h3 class="text-xl font-bold mt-8 mb-4">Common Component Groups</h3>
        <p class="mb-4">Though Scania doesn't publicly publish a strict prefix-based category decoder like some manufacturers, parts within specific systems often fall into recognizable numeric ranges within their internal software (MULTI).</p>
        <p class="mb-4">When ordering, always provide your supplier with:</p>
        <ol class="list-decimal pl-6 mb-6 space-y-2">
            <li>The 7-Digit Part Number</li>
            <li>The Engine Type (e.g., DC13)</li>
            <li>The Last 7 Digits of the Chassis Number</li>
        </ol>
        """
    },
    {
        "filename": "caterpillar-heavy-equipment-troubleshooting-guide.html",
        "title": "Caterpillar Heavy Equipment Troubleshooting Guide",
        "brand": "Caterpillar",
        "description": "Essential troubleshooting guide for Caterpillar excavators, dozers, and generators. Learn how to diagnose common CAT error codes and hydraulic failures.",
        "hero_title": "Caterpillar Equipment Troubleshooting Guide",
        "hero_subtitle": "Diagnose the most common CAT engine, hydraulic, and electrical failures before they result in catastrophic downtime.",
        "content": """
        <h2 class="text-2xl font-bold mb-4">Zero Downtime: The Diagnostic Approach</h2>
        <p class="mb-4">Caterpillar (CAT) machinery is built for extreme durability, but sophisticated hydraulics and electronics require a systematic approach to troubleshooting. When a 320D Excavator or D8 Dozer goes down, every hour costs money.</p>
        
        <h3 class="text-xl font-bold mt-8 mb-4">1. The CAT Error Code System</h3>
        <p class="mb-4">Modern CAT equipment uses Electronic Control Modules (ECMs) that generate Diagnostic Trouble Codes (DTCs) across the CAN Data Link. A standard CAT code consists of:</p>
        <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>MID (Module Identifier):</strong> Which computer is reporting the issue (e.g., MID 036 is the Engine ECM).</li>
            <li><strong>CID (Component Identifier):</strong> Which specific sensor or valve is failing.</li>
            <li><strong>FMI (Failure Mode Identifier):</strong> What exactly went wrong (e.g., FMI 03 means "Voltage Above Normal").</li>
        </ul>

        <h3 class="text-xl font-bold mt-8 mb-4">2. Top 3 Hydraulic Warning Signs</h3>
        <div class="space-y-4 mb-6">
            <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="font-bold text-lg">Sluggish Implement Response</h4>
                <p class="text-gray-600">Usually points to pilot pump pressure drops, main relief valve failure, or severe internal leakage in the control valve.</p>
            </div>
            <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="font-bold text-lg">Hydraulic Oil Overheating</h4>
                <p class="text-gray-600">Often caused by a blocked hydraulic oil cooler, stuck relief valves, or using the incorrect viscosity of hydraulic fluid.</p>
            </div>
            <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="font-bold text-lg">Aeration (Foamy Oil)</h4>
                <p class="text-gray-600">A clear indicator that air is entering the suction side of the pump. Check suction lines and the pump shaft seal immediately to prevent cavitation.</p>
            </div>
        </div>

        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6 rounded-r-lg">
            <p class="text-yellow-800 m-0"><strong>Critical Warning:</strong> Never use bare hands to check for hydraulic leaks. High-pressure hydraulic fluid can penetrate the skin and cause severe toxic injury.</p>
        </div>
        """
    },
    {
        "filename": "komatsu-undercarriage-maintenance-guide.html",
        "title": "Komatsu Undercarriage Maintenance Guide",
        "brand": "Komatsu",
        "description": "Maximize the lifespan of your Komatsu excavator and dozer undercarriage. Learn measurement techniques, tension adjustments, and wear signs.",
        "hero_title": "Komatsu Undercarriage Maintenance Manual",
        "hero_subtitle": "The undercarriage accounts for 50% of your track-type machine's maintenance costs. Learn how to measure wear, adjust tension, and prevent premature failure.",
        "content": """
        <h2 class="text-2xl font-bold mb-4">The 50% Rule</h2>
        <p class="mb-4">On Komatsu excavators (like the PC200/PC300) and dozers (like the D155A), undercarriage maintenance represents roughly half of all maintenance costs over the life of the machine. Proactive measurement and tensioning can extend OEM link lifespan by thousands of hours.</p>
        
        <h3 class="text-xl font-bold mt-8 mb-4">1. Daily Visual Inspections</h3>
        <p class="mb-4">Before starting the day's shift, operators should perform a 360-degree walkaround looking for:</p>
        <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Missing Hardware:</strong> Check for sheared track shoe bolts. A loose shoe will quickly wallow out the bolt holes in the track link.</li>
            <li><strong>Leaking Rollers:</strong> Look for fresh oil stains on the lower rollers or front idler. A dry roller will seize and flat-spot rapidly.</li>
            <li><strong>Rock Guards:</strong> Ensure rock guards (if equipped) are intact. Bent guards can act as a shear against the bottom rollers.</li>
        </ul>

        <h3 class="text-xl font-bold mt-8 mb-4">2. Track Tension (Sag) Adjustment</h3>
        <p class="mb-4">Incorrect track tension is the #1 killer of undercarriage components.</p>
        <p class="mb-4"><strong>Too Tight:</strong> Forces extreme load on the idler bearings, final drive bearings, and accelerates bushing wear. It acts like a brake, burning extra fuel.</p>
        <p class="mb-4"><strong>Too Loose:</strong> Causes the track chain to snake side-to-side, violently grinding against inner roller flanges and the rock guards. It can also lead to de-tracking on side-slopes.</p>
        
        <div class="bg-gray-100 p-4 rounded-lg my-6">
            <h4 class="font-bold text-gray-900 mb-2">How to Pack Material Correctly</h4>
            <p class="text-gray-700">When setting tension (sag), always factor in the working environment. If working in mud or clay, the material will pack into the sprocket teeth, artificially tightening the track. In packing conditions, track tension must be set looser than when working on clean rock or sand.</p>
        </div>
        """
    }
]

if not os.path.exists(ROOT_DIR):
    os.makedirs(ROOT_DIR, exist_ok=True)

for article in ARTICLES:
    html = TEMPLATE.format(**article)
    file_path = os.path.join(ROOT_DIR, article['filename'])
    with open(file_path, "w", encoding='utf-8') as f:
        f.write(html)
    print(f"Generated: {file_path}")
