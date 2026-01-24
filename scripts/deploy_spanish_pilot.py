import os
import google.generativeai as genai
from bs4 import BeautifulSoup
import time

# Configure Gemini
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    # Fallback or strict error
    print("WARNING: GEMINI_API_KEY not found. Using partial translation.")
    
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

def translate_text(text, target_lang="Spanish"):
    if not text or len(text.strip()) < 2:
        return text
    
    # Simple cache to avoid redundant API calls
    # (In a real pro script, we'd use a file cache)
    
    try:
        response = model.generate_content(
            f"Translate the following text to {target_lang}. Return ONLY the translated text, no markdown, no quotes:\n\n{text}"
        )
        time.sleep(1.0) # Rate limit safety
        return response.text.strip()
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def translate_html_file(input_path, output_path):
    print(f"Translating {input_path} -> {output_path}...")
    
    with open(input_path, 'r') as f:
        soup = BeautifulSoup(f, 'html.parser')

    # Set HTML lang to Spanish
    if soup.html:
        soup.html['lang'] = 'es'
    
    # Translate specific elements
    # 1. Title
    if soup.title:
        soup.title.string = translate_text(soup.title.string)
        
    # 2. Description
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    if meta_desc and meta_desc.get('content'):
        meta_desc['content'] = translate_text(meta_desc['content'])
        
    # 3. Nav Links (h1, p, a, button) - Limit to main content to save time
    # This is a heuristic approach
    
    # Translate Navigation
    for nav_link in soup.select('nav a span'):
        nav_link.string = translate_text(nav_link.string)
        
    # Translate Headings
    for tag in soup.find_all(['h1', 'h2', 'h3']):
        if tag.string:
            tag.string = translate_text(tag.string)
            
    # Translate Paragraphs (limit to first 10 to check pilot)
    paragraphs = soup.find_all('p')
    for p in paragraphs[:20]:
        if p.string:
            p.string = translate_text(p.string)
            
    # Fix CSS links (relative path adjustment)
    # If input is root/index.html -> output es/index.html (depth +1)
    # If input is volvo/engine/x -> output es/volvo/engine/x (depth +1)
    
    # Naive adjustment: Prepend ../ to all local assets
    for tag in soup.find_all(['link', 'script', 'img']):
        for attr in ['href', 'src']:
            if tag.get(attr) and not tag[attr].startswith(('http', '//', 'mailto', '#', 'data:')):
                # Detect if it's already relative
                tag[attr] = '../' + tag[attr]

    # Save
    with open(output_path, 'w') as f:
        f.write(str(soup))

if __name__ == "__main__":
    # 1. Translate Homepage
    if os.path.exists("index.html"):
        translate_html_file("index.html", "es/index.html")
    
    # 2. Translate Sample Product
    sample_prod = "volvo/engine/1521725.html"
    if os.path.exists(sample_prod):
         translate_html_file(sample_prod, "es/" + sample_prod)
         
    print("Spanish Pilot Deployed!")
