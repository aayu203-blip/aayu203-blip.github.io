
import os

LIVE_REPO = "/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io"
INDEX_PATH = os.path.join(LIVE_REPO, "index.html")
SCRIPTS_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete/scripts"

def extract_templates():
    with open(INDEX_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # EXTRACT HEADER
    # We want everything from <!DOCTYPE html> down to the end of the <nav> or hero section.
    # Looking at the file, the main content starts roughly after the nav.
    # However, since these are "inner" pages, we might want a simplified header or the full one.
    # Let's grab everything up to the opening <body> and the <nav>.
    
    # Strategy: 
    # Header = From start to </div> closing the nav (line ~880 in previous view, check actual file)
    # Footer = From <footer... to </html>
    
    # Finding split points
    nav_end_marker = '</nav>'
    footer_start_marker = '<footer'
    
    if nav_end_marker not in content:
        print("CRITICAL: Nav end marker not found.")
        return
        
    header_end_index = content.find(nav_end_marker) + len(nav_end_marker)
    header_html = content[:header_end_index]
    
    if footer_start_marker not in content:
        print("CRITICAL: Footer start marker not found.")
        return
        
    footer_start_index = content.find(footer_start_marker)
    footer_html = content[footer_start_index:]
    
    # Save to scripts dir
    with open(os.path.join(SCRIPTS_DIR, "live_header.html"), "w") as f:
        f.write(header_html)
        
    with open(os.path.join(SCRIPTS_DIR, "live_footer.html"), "w") as f:
        f.write(footer_html)
        
    print(f"Success! Extracted header ({len(header_html)} chars) and footer ({len(footer_html)} chars).")

if __name__ == "__main__":
    extract_templates()
