import os
import glob
import re

ROOT_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete"

def optimize_china_pages():
    search_path = os.path.join(ROOT_DIR, 'cn', '**', '*.html')
    files = glob.glob(search_path, recursive=True)
    
    modified_count = 0
    for filepath in files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # 1. Strip Google Fonts
        content = re.sub(r'<link[^>]*href="https://fonts\.googleapis\.com[^>]*>', '', content)
        content = re.sub(r'<link[^>]*href="//fonts\.googleapis\.com[^>]*>', '', content)
        content = re.sub(r'<link[^>]*href="https://fonts\.gstatic\.com[^>]*>', '', content)
        
        # 2. Strip Google Tag Manager
        content = re.sub(r'<script async src="https://www\.googletagmanager\.com/gtag/js\?id=[a-zA-Z0-9_-]+"></script>', '', content)
        
        # 3. Strip gtag execution block
        content = re.sub(r'<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];.*?gtag\(\'config\', \'[a-zA-Z0-9_-]+\'\);\s*</script>', '', content, flags=re.DOTALL)
        
        # 4. Inject Baidu Verification Tag
        if 'baidu-site-verification' not in content:
            content = content.replace('</head>', '    <meta name="baidu-site-verification" content="placeholder_baidu_code" />\n</head>')
            
        # 5. Fix Body font family constraint (Optional but good, replacing Inter with local stack)
        content = content.replace('font-family: "Inter", sans-serif;', 'font-family: -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif;')
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            modified_count += 1
            
    return modified_count

def optimize_russia_pages():
    search_path = os.path.join(ROOT_DIR, 'ru', '**', '*.html')
    files = glob.glob(search_path, recursive=True)
    
    modified_count = 0
    for filepath in files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # 1. Inject Yandex Verification Tag
        if 'yandex-verification' not in content:
            content = content.replace('</head>', '    <meta name="yandex-verification" content="placeholder_yandex_code" />\n</head>')
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            modified_count += 1
            
    return modified_count

def main():
    print("Starting Step 2: Regional Search Engine Tech Optimization")
    
    cn_modified = optimize_china_pages()
    print(f"Optimized {cn_modified} pages for Baidu & Great Firewall (stripped Google dependencies).")
    
    ru_modified = optimize_russia_pages()
    print(f"Optimized {ru_modified} pages for Yandex.")
    
    print("\nRegional technical optimization complete.")

if __name__ == "__main__":
    main()
