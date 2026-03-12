import os, re

PROD_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io/pages/products"

def audit():
    if not os.path.exists(PROD_DIR):
        print(f"Error: Directory {PROD_DIR} not found.")
        return

    files = [f for f in os.listdir(PROD_DIR) if f.endswith('.html')]
    empty_h1 = 0
    missing_h1 = 0
    alpine_h1 = 0
    static_h1 = 0
    
    print(f"Auditing {len(files)} files in {PROD_DIR}...")
    
    for f in files:
        fpath = os.path.join(PROD_DIR, f)
        try:
            with open(fpath, 'r', encoding='utf-8') as content:
                text = content.read()
                h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', text, re.DOTALL)
                if not h1_match:
                    missing_h1 += 1
                    continue
                
                inner = h1_match.group(1).strip()
                # Check for empty or just <br/>
                if not inner or re.fullmatch(r'(\s*<br/>\s*)+', inner):
                    empty_h1 += 1
                elif 'x-text' in inner:
                    alpine_h1 += 1
                else:
                    # It's static if it has content and no x-text
                    static_h1 += 1
        except Exception as e:
            print(f"Error reading {f}: {e}")
                
    print(f"\nH1 Audit results for {len(files)} files:")
    print(f"  Missing H1 tag:         {missing_h1}")
    print(f"  Empty/Placeholder H1:  {empty_h1}")
    print(f"  Alpine (Dynamic) H1: {alpine_h1}")
    print(f"  Static (Correct) H1:  {static_h1}")

if __name__ == "__main__":
    audit()
