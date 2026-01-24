import os
import google.generativeai as genai
import time
import random

# Configure Gemini
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
else:
    model = None
    print("WARNING: GEMINI_API_KEY not found. Using static content only.")

BLOG_DIR = "blog"

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-9S54H015YY"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){{dataLayer.push(arguments);}}
      gtag('js', new Date());
      gtag('config', 'G-9S54H015YY');
    </script>
    
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>{title} | PTC Knowledge Hub</title>
    <meta content="{description}" name="description"/>
    <link href="../../assets/images/favicon.png?v=2" rel="icon" type="image/png"/>
    <link href="../../assets/css/main.css" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
</head>
<body class="bg-gray-50 font-sans text-gray-900">

    <!-- Nav -->
    <nav class="fixed w-full z-50 bg-white/98 backdrop-blur-xl border-b-2 border-yellow-300/60 shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <a href="/" class="flex items-center space-x-3">
                    <img src="/assets/images/ptc-logo.png?v=1" alt="PTC" class="h-12 w-auto">
                </a>
                <div class="hidden md:flex space-x-8">
                    <a href="/" class="font-bold hover:text-yellow-600 transition">HOME</a>
                    <a href="/blog/index.html" class="font-bold text-yellow-600">KNOWLEDGE HUB</a>
                    <a href="/#contact" class="px-5 py-2 bg-yellow-400 rounded-lg font-bold hover:bg-yellow-500 transition shadow-sm">CONTACT</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Header -->
    <header class="pt-32 pb-16 bg-gradient-to-br from-yellow-50 via-white to-gray-100">
        <div class="max-w-4xl mx-auto px-4 text-center">
            <span class="inline-block py-1 px-3 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold tracking-wide uppercase mb-4">{category}</span>
            <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">{title}</h1>
            <p class="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">{description}</p>
        </div>
    </header>

    <!-- Content -->
    <article class="max-w-3xl mx-auto px-4 pb-20">
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg prose-yellow max-w-none">
            {content_html}
        </div>
        
        <!-- CTA -->
        <div class="mt-12 bg-gray-900 rounded-2xl p-8 text-center text-white shadow-2xl relative overflow-hidden">
            <div class="absolute inset-0 bg-yellow-500/10 pattern-grid-lg opacity-20"></div>
            <h3 class="text-2xl font-bold mb-4 relative z-10">Need genuine parts for your fleet?</h3>
            <p class="text-gray-300 mb-8 relative z-10">We stock OEM and high-quality aftermarket parts for Volvo, Scania, and Komatsu.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <a href="https://wa.me/919821037990" class="inline-flex items-center justify-center px-8 py-3 bg-green-600 font-bold rounded-xl hover:bg-green-500 transition">
                    WhatsApp Us
                </a>
                <a href="/#contact" class="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition">
                    Get a Quote
                </a>
            </div>
        </div>
    </article>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-12 text-center border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4">
            <p>&copy; 2025 Parts Trading Company. All rights reserved.</p>
        </div>
    </footer>

</body>
</html>
"""

TOPICS = [
    # Volvo
    "Identifying Volvo Construction Equipment Serial Numbers",
    "Volvo D13 Engine Common Problems and Fixes",
    "Volvo Penta Marine Engine Maintenance Schedule",
    "Difference Between Volvo VCE and Volvo Penta Parts",
    "Troubleshooting Volvo Excavator Error Codes",
    "Volvo Wheel Loader Hydraulic System Maintenance",
    "Guide to Volvo Truck Injector Replacement",
    "Volvo Articulated Hauler Suspension Repairs",
    "Volvo EC210 Excavator Track Tensioning Guide",
    "Understanding Volvo I-Shift Transmission Faults",
    
    # Scania
    "Scania R-Series Truck Maintenance Checklist",
    "Scania PDE vs HPI Injectors Explained",
    "Scania Retarder Common Failures and Solutions",
    "How to Bleed Scania Fuel System",
    "Scania V8 Engine Oil Consumption Issues (Fixed)",
    "Scania Bus Air Suspension Troubleshooting",
    "Scania Truck AdBlue System Faults",
    "Replacing Scania Brake Pads and Discs",
    "Scania Gearbox Planet Gear Wear Signs",
    "Scania 500kva Generator Maintenance Guide",

    # Komatsu
    "Komatsu PC200 vs PC210: Which Excavator is Right?",
    "Komatsu Hydraulic Pump Failure Symptoms",
    "Komatsu Undercarriage Wear Measurement Guide",
    "Komatsu Bulldozer Final Drive Oil Change",
    "Troubleshooting Komatsu Monitor Panel Errors",
    "Komatsu Engine Overheating Causes",
    "Komatsu Forklift Hydraulic Cylinder Repair",
    "Komatsu Wheel Loader Bucket Teeth Types",
    "Komatsu Motor Grader Blade Adjustment Tips",
    "Komatsu Genuine Oil vs Aftermarket Oil",

    # CAT / General
    "Caterpillar C15 Engine Rebuild Tips",
    "CAT Excavator Hydraulic Fluid Contamination Signs",
    "Heavy Equipment Battery Maintenance in Winter",
    "How to Choose the Right Grease for Excavator Pins",
    "Turbocharger Failure Signs in Diesel Engines",
    "Diesel Particulate Filter (DPF) Cleaning Guide",
    "Heavy Duty Radiator Flush Procedure",
    "Preventing Cavitation in Cylinder Liners",
    "Heavy Equipment Air Filter Cleaning Myths",
    "Hydraulic Hose Safety Inspections",
    
    # Parts Specific
    "OEM vs Aftermarket vs Remanufactured Parts",
    "How to Identify Counterfeit Spare Parts",
    "Understanding Bearing Clearance C3 vs Standard",
    "Diesel Fuel Injector Testing Methods",
    "Heavy Duty Alternator Wiring Diagrams",
    "Excavator Swing Motor Troubleshooting",
    "Dump Truck Hydraulic Cylinder Leaks",
    "Crane Wire Rope Inspection Criteria",
    "Concrete Pump Wear Plate Replacement",
    "Rock Breaker Chisel Maintenance"
]

def generate_ai_content(topic):
    if not model:
        return None

    print(f"🤖 Generating AI content for: {topic}")
    try:
        prompt = f"""
        Write a comprehensive, SEO-optimized blog post about "{topic}" for a heavy equipment parts website.
        
        Output Format: JSON string with keys: 'title', 'description', 'category', 'content_html'.
        
        Constraints:
        - 'title': Catchy and SEO friendly.
        - 'description': Meta description under 160 chars.
        - 'category': A short category name (e.g., "Volvo Tips").
        - 'content_html': The body content in semantic HTML (h2, h3, p, ul, li). Do NOT include <html>, <head>, or <body> tags. 
          - Use <h2> for main sections.
          - Use <h3> for subsections.
          - Use <ul class="list-disc pl-6 space-y-2 mb-6"> for lists.
          - Make it authoritative, technical, and useful for mechanics/owners.
          - Mention "PTC" or "Parts Trading Company" as a trusted source naturally once.
        """
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean up JSON markdown block if present
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        import json
        data = json.loads(text)
        return data
        
    except Exception as e:
        print(f"❌ Error generating {topic}: {e}")
        return None

def generate_blog():
    if not os.path.exists(BLOG_DIR):
        os.makedirs(BLOG_DIR)
        print(f"Created directory: {BLOG_DIR}")

    # Generate Index (Simple list for now, ideally we'd make a nice index.html)
    index_links = []

    for i, topic in enumerate(TOPICS):
        filename = topic.lower().replace(" ", "-").replace("&", "and").replace(":", "").replace("?", "").replace("(", "").replace(")", "").replace("/", "-") + ".html"
        file_path = os.path.join(BLOG_DIR, filename)
        
        # Skip if exists to save tokens/time (unless force overwrite needed)
        # For this demo, we skip if exists
        if os.path.exists(file_path):
            print(f"⚠️ Skipping existing: {filename}")
            # Add to index assuming it's good
            link = f'<li><a href="{filename}" class="text-blue-600 hover:underline">{topic}</a></li>'
            index_links.append(link)
            continue

        data = generate_ai_content(topic)
        
        if not data:
            # Fallback to a placeholder if AI fails
            data = {
                "title": topic,
                "description": f"Detailed guide about {topic}.",
                "category": "General",
                "content_html": f"<p>Content for {topic} is currently being updated. Check back soon!</p>"
            }
        
        full_html = HTML_TEMPLATE.format(
            title=data['title'],
            description=data['description'],
            category=data['category'],
            content_html=data['content_html']
        )
        
        with open(file_path, 'w') as f:
            f.write(full_html)
        print(f"✅ Generated: {filename}")
        
        link = f'<li><a href="{filename}" class="text-blue-600 hover:underline">{data["title"]}</a></li>'
        index_links.append(link)
        
        # Rate limit
        time.sleep(1.0)
        
    # Generate a simple index page
    index_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Knowledge Hub | PTC</title>
        <link href="../assets/css/main.css" rel="stylesheet"/>
    </head>
    <body class="bg-gray-50 p-8">
        <div class="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 class="text-3xl font-bold mb-6">Knowledge Hub</h1>
            <ul class="space-y-3">
                {''.join(index_links)}
            </ul>
        </div>
    </body>
    </html>
    """
    with open(os.path.join(BLOG_DIR, "index.html"), "w") as f:
        f.write(index_html)

if __name__ == "__main__":
    generate_blog()
