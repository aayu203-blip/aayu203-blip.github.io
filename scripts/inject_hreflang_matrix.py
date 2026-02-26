import os
import glob
import re

ROOT_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete"
BASE_URL = "https://partstrading.com"

# Standardizing language folders to href_lang codes
LANG_MAP = {
    'es': 'es',
    'ru': 'ru',
    'fr': 'fr',
    'ar': 'ar',
    'cn': 'zh-CN',
    'zh': 'zh',
    'hi': 'hi',
    'id': 'id',
    'kn': 'kn',
    'ml': 'ml',
    'ta': 'ta',
    'te': 'te',
    'pt': 'pt'
}

def build_translation_matrix():
    print("Scanning for translated files...")
    matrix = {} # e.g. "pages/categories/scania.html" -> ["en", "es", "cn"]
    
    # Exclude logic
    EXCLUDE_DIRS = ['.git', 'node_modules', 'scripts', 'god-mode', 'pages_backup', 'BACKUP', 'backup', 'styles', 'assets', 'images']
    
    for root, dirs, files in os.walk(ROOT_DIR):
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in EXCLUDE_DIRS]
        
        for file in files:
            if not file.endswith('.html'):
                continue
                
            filepath = os.path.join(root, file)
            rel_path = os.path.relpath(filepath, ROOT_DIR).replace("\\", "/") # e.g. "es/index.html" or "index.html"
            
            # Determine base path and language
            lang_code = 'en'
            base_rel_path = rel_path
            
            for folder, code in LANG_MAP.items():
                if rel_path == f"{folder}/index.html":
                    lang_code = code
                    base_rel_path = "index.html"
                    break
                elif rel_path.startswith(f"{folder}/pages/"):
                    lang_code = code
                    base_rel_path = rel_path.replace(f"{folder}/", "", 1)
                    break
                elif rel_path.startswith(f"{folder}/"):
                    # Other nested paths under language
                    lang_code = code
                    base_rel_path = rel_path.replace(f"{folder}/", "pages/", 1) # Assumption based on some structures, but let's be safer:
                    base_rel_path = rel_path.replace(f"{folder}/", "", 1)
                    break
                    
            if base_rel_path not in matrix:
                matrix[base_rel_path] = {}
                
            matrix[base_rel_path][lang_code] = rel_path

    return matrix

def inject_matrix(matrix):
    total_injected = 0
    # Pattern to find existing hreflang blocks to remove them cleanly
    existing_block_pattern = re.compile(r'<!-- International SEO - Hreflang Tags -->.*?(?=</head>)', re.DOTALL | re.IGNORECASE)
    
    for base_rel_path, translation_dict in matrix.items():
        # Only inject if there are translations available
        if len(translation_dict) <= 1:
            continue
            
        # Build the exact Hreflang block for this specific page cluster
        hreflang_tags = "\n    <!-- International SEO - Hreflang Tags -->\n"
        
        for lang_code, specific_rel_path in translation_dict.items():
            if specific_rel_path == "index.html":
                page_url = f"{BASE_URL}/"
            else:
                page_url = f"{BASE_URL}/{specific_rel_path}"
                
            hreflang_tags += f'    <link href="{page_url}" hreflang="{lang_code}" rel="alternate" />\n'
            
        # Add x-default pointing to english
        if 'en' in translation_dict:
            en_path = translation_dict['en']
            if en_path == "index.html":
                x_default_url = f"{BASE_URL}/"
            else:
                x_default_url = f"{BASE_URL}/{en_path}"
                
            hreflang_tags += f'    <link href="{x_default_url}" hreflang="x-default" rel="alternate" />\n'
            
        # Now inject this exact block into every file in the cluster
        for lang_code, specific_rel_path in translation_dict.items():
            filepath = os.path.join(ROOT_DIR, specific_rel_path)
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # 1. Clean out the old broken hreflangs if present
                content = existing_block_pattern.sub('', content)
                # 2. Clean out stray individual tags if they were injected loosely
                content = re.sub(r'<link[^>]*hreflang="[^"]*"[^>]*>\s*', '', content)
                
                # 3. Inject new tags right before </head>
                if '</head>' in content:
                    content = content.replace('</head>', f'{hreflang_tags}</head>')
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    total_injected += 1
            except Exception as e:
                print(f"Error processing {filepath}: {e}")
                
    print(f"Flawless Hreflang Matrix injected successfully across {total_injected} localized and base pages.")

def main():
    print("Building Hreflang Translation Matrix...")
    matrix = build_translation_matrix()
    inject_matrix(matrix)
    print("Step 3 Complete: Regional Search Architecture solid.")

if __name__ == "__main__":
    main()
