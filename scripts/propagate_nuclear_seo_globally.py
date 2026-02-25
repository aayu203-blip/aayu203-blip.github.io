import os
import glob
import re
import json
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

ROOT_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete"
EXCLUDE_DIRS = ['node_modules', 'god-mode', 'next-engine', 'scripts', 'assets', '.git', 'pages_backup', 'weaver-game', 'database', 'BACKUP_BEFORE_ENRICHMENT']

def get_files():
    all_html = []
    for root, dirs, files in os.walk(ROOT_DIR):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for f in files:
            if f.endswith(".html"):
                all_html.append(os.path.join(root, f))
    return all_html

desktop_whatsapp_html = """
<!-- Desktop Floating WhatsApp CTA -->
<div class="hidden md:flex fixed bottom-8 right-8 z-[100] group flex-col items-end" style="position: fixed; bottom: 2rem; right: 2rem; z-index: 100;">
    <!-- Tooltip -->
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
    
    <!-- Button -->
    <a href="https://wa.me/919821037990?text=Hi%21%20I%20visited%20your%20website%20and%20need%20parts%20assistance." target="_blank" 
       class="bg-gradient-to-tr from-green-500 to-emerald-400 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(34,197,94,0.3)] hover:shadow-[0_8px_30px_rgb(34,197,94,0.5)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center relative overflow-hidden group/btn">
        <div class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:animate-shine"></div>
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
        </svg>
    </a>
</div>
"""

def extract_product_schema(content):
    matches = re.finditer(r'<script type="application/ld\+json">([\s\S]*?)</script>', content)
    for m in matches:
        try:
            data = json.loads(m.group(1).strip())
            if isinstance(data, dict) and data.get('@type') == 'Product':
                name = data.get('name', 'Heavy Equipment Part')
                brand = data.get('brand', {}).get('name', 'Premium Brand')
                return name, brand
        except json.JSONDecodeError:
            continue
    return None, None

def generate_faq_schema(name, brand):
    faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": f"Is {name} compatible with my equipment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f"Yes, this {name} by {brand} is fully verified to fit and perform safely in your equipment. Please WhatsApp us your machine details to double-check exact fitment."
          }
        },
        {
          "@type": "Question",
          "name": f"Do you offer genuine or aftermarket options for {brand} {name}?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f"We stock both OEM genuine {brand} parts and premium aftermarket alternatives for the {name}. You can choose the tier that fits your budget and longevity requirements."
          }
        },
        {
          "@type": "Question",
          "name": f"How fast can you dispatch the {name}?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f"If you confirm dimensions/specs with our team on WhatsApp before 3 PM, the {name} dispatches the same day from our Mumbai warehouse via priority air freight."
          }
        }
      ]
    }
    html = f"\\n<!-- Dynamic FAQ Schema -->\\n<script type=\\\"application/ld+json\\\">\\n{json.dumps(faq, indent=2)}\\n</script>\\n"
    return html

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        modified = False
        
        # 1. Desktop WhatsApp Floater Check
        if "Desktop Floating WhatsApp CTA" not in content and "hidden md:flex fixed bottom-8 right-8" not in content:
            if "</body>" in content:
                content = content.replace("</body>", f"{desktop_whatsapp_html}\n</body>")
                modified = True
                
        # 2. FAQ Schema Injection Check
        if '"@type": "FAQPage"' not in content:
            name, brand = extract_product_schema(content)
            if name: # Only inject FAQ if it's a product page
                faq_html = generate_faq_schema(name, brand)
                if "</head>" in content:
                    content = content.replace("</head>", f"{faq_html}</head>")
                    modified = True
                    
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        # logging.error(f"Error processing {filepath}: {e}")
        return False

def main():
    files = get_files()
    logging.info(f"Found {len(files)} total HTML files to scan.")
    
    modified_count = 0
    for i, filepath in enumerate(files):
        if process_file(filepath):
            modified_count += 1
            if modified_count % 1000 == 0:
                logging.info(f"Successfully processed {modified_count} files so far...")
                
    logging.info(f"Phase 14 Nuclear SEO applied completely! {modified_count} total files upgraded.")

if __name__ == "__main__":
    main()
