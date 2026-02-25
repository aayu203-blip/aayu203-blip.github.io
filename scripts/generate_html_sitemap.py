import os
import re

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES_DIR = os.path.join(BASE_DIR, "pages")
OUTPUT_FILE = os.path.join(PAGES_DIR, "sitemap.html")

# Categories to scan
CATEGORIES = {
    "diagnostic": "Diagnostic Engine (Error Codes)",
    "models": "Model Hubs (Truck Series)",
    "intercept": "Part Cross-Reference (Competitors)",
    "local": "Global Logistics Hubs"
}

def get_page_title(filepath):
    """Extracts the <title> or first <h1> from an HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Try Title Tag
    match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    if match:
        return match.group(1).split('|')[0].strip() # Remove "| Parts Trading Company" suffix
        
    # Try H1
    match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.IGNORECASE | re.DOTALL)
    if match:
        # Remove HTML tags from H1
        clean_h1 = re.sub(r'<[^>]+>', '', match.group(1))
        return clean_h1.strip()
        
    return os.path.basename(filepath)

def generate_sitemap():
    print("--- Generating Global Parts Directory ---")
    
    html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global Parts Directory | Parts Trading Company</title>
    <meta name="description" content="Complete directory of specialized parts, error code diagnostics, and global logistics hubs for Komatsu, CAT, Volvo, Scania parts.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .hover-card:hover { transform: translateY(-2px); }
    </style>
</head>
<body class="bg-gray-50 text-gray-900 font-sans">

    <!-- HEADER (Simplified) -->
    <header class="bg-black text-white py-4 sticky top-0 z-50 shadow-lg border-b border-yellow-500">
        <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <a href="../../index.html" class="flex items-center gap-2 group">
                <i class="fas fa-cube text-yellow-500 text-2xl group-hover:rotate-12 transition-transform"></i>
                <span class="font-bold text-xl tracking-tighter">PARTS<span class="text-yellow-500">TRADING</span>.com</span>
            </a>
            <a href="../../index.html" class="text-sm text-gray-400 hover:text-white transition-colors">
                <i class="fas fa-arrow-left mr-1"></i> Back to Home
            </a>
        </div>
    </header>

    <!-- HERO -->
    <div class="bg-gray-900 text-white py-16 relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div class="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">Global <span class="text-yellow-500">Parts Directory</span></h1>
            <p class="text-xl text-gray-400 max-w-2xl mx-auto">Access our specialized network of diagnostic tools, competitor cross-references, and regional logistics hubs.</p>
        </div>
    </div>

    <!-- DIRECTORY GRID -->
    <div class="max-w-7xl mx-auto px-4 py-16">
"""

    for folder, title in CATEGORIES.items():
        folder_path = os.path.join(PAGES_DIR, folder)
        if not os.path.exists(folder_path):
            continue
            
        # Section Header
        html_content += f"""
        <div class="mb-16">
            <div class="flex items-center gap-4 mb-8 pb-4 border-b border-gray-200">
                <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-black font-bold text-xl shadow-lg">
                    <i class="fas fa-folder py-1"></i>
                </div>
                <div>
                    <h2 class="text-3xl font-bold text-gray-900">{title}</h2>
                    <p class="text-gray-500">Specialized resources and landing pages.</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
"""
        
        # Scan Files
        files = [f for f in os.listdir(folder_path) if f.endswith(".html") and not f.startswith("template")]
        files.sort() # Alphabetical
        
        for file in files:
            filepath = os.path.join(folder_path, file)
            page_title = get_page_title(filepath)
            rel_link = f"{folder}/{file}"
            
            # Simple Card
            html_content += f"""
                <a href="{rel_link}" class="group block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-card transition-all duration-300 hover:shadow-xl hover:border-yellow-400">
                    <div class="flex items-start justify-between mb-4">
                        <div class="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                            <i class="fas fa-link"></i>
                        </div>
                        <span class="text-xs font-mono text-gray-400 group-hover:text-yellow-600">{file}</span>
                    </div>
                    <h3 class="font-bold text-lg text-gray-900 group-hover:text-black mb-2 leading-tight">{page_title}</h3>
                    <div class="text-sm text-yellow-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View Page <i class="fas fa-arrow-right ml-1"></i>
                    </div>
                </a>
"""

        html_content += """
            </div>
        </div>
"""

    # Footer
    html_content += """
    </div>

    <footer class="bg-black text-white py-12 border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <p class="text-gray-500">&copy; 2026 Parts Trading Company. All rights reserved.</p>
        </div>
    </footer>

</body>
</html>
"""

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"Successfully generated: {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_sitemap()
