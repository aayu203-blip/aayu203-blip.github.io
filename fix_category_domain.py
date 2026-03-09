import os
import glob
import re
import codecs

# Configuration
CATEGORY_DIR = "categories"
OLD_DOMAIN = "partstradingcompany.com"
NEW_DOMAIN = "partstrading.com"

def fix_category_seo():
    print(f"Scanning category hubs in '{CATEGORY_DIR}/'...")
    files = glob.glob(f"{CATEGORY_DIR}/*.html")
    
    if not files:
        print("Error: No category files found!")
        return
        
    print(f"Found {len(files)} category hubs.")
    
    updated_files = 0
    for filepath in files:
        try:
            with codecs.open(filepath, 'r', 'utf-8') as f:
                content = f.read()
                
            original_content = content
            
            # Replace old domain with new domain in canonical links
            content = re.sub(
                r'<link rel="canonical" href="https://(?:www\.)?' + OLD_DOMAIN + r'(/.*?)"',
                r'<link rel="canonical" href="https://' + NEW_DOMAIN + r'\1"',
                content,
                flags=re.IGNORECASE
            )
            
            # Replace old domain with new domain in og:url
            content = re.sub(
                r'<meta property="og:url" content="https://(?:www\.)?' + OLD_DOMAIN + r'(/.*?)"',
                r'<meta property="og:url" content="https://' + NEW_DOMAIN + r'\1"',
                content,
                flags=re.IGNORECASE
            )
            
            # Replace old domain with new domain in og:image
            content = re.sub(
                r'<meta property="og:image" content="https://(?:www\.)?' + OLD_DOMAIN + r'(/.*?)"',
                r'<meta property="og:image" content="https://' + NEW_DOMAIN + r'\1"',
                content,
                flags=re.IGNORECASE
            )
            
            # Replace old domain with new domain in Schema JSON-LD url blocks
            content = re.sub(
                r'"url":\s*"https://(?:www\.)?' + OLD_DOMAIN + r'(/.*?)"',
                r'"url": "https://' + NEW_DOMAIN + r'\1"',
                content,
                flags=re.IGNORECASE
            )
            
            # If the content was modified, save it
            if content != original_content:
                with codecs.open(filepath, 'w', 'utf-8') as f:
                    f.write(content)
                updated_files += 1
                
        except Exception as e:
            print(f"Error processing {filepath}: {e}")
            
    print(f"✅ Successfully updated SEO metadata on {updated_files} category hubs.")

if __name__ == "__main__":
    fix_category_seo()
