import os
import google.generativeai as genai
from bs4 import BeautifulSoup
import time
import shutil

# Configure Gemini
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    # Use a dummy key for structure generation if strict mode is off, 
    # but practically we need it for translation.
    print("WARNING: GEMINI_API_KEY not found. Translations will be skipped or mocked.")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
except Exception as e:
    print(f"Error configuring Gemini: {e}")
    model = None

LANGUAGES = {
    'fr': 'French',
    'hi': 'Hindi',
    'ar': 'Arabic',
    'ru': 'Russian',
    'zh': 'Simplified Chinese'
}

def translate_text(text, target_lang):
    """Translate text using Gemini."""
    if not text or len(text.strip()) < 2:
        return text
    
    if not model:
        return f"[MOCK {target_lang}] {text}"

    try:
        # Prompt engineering for strict translation
        prompt = f"Translate the following text to {target_lang}. Return ONLY the translated text, no markdown, no quotes, no explanations:\n\n{text}"
        response = model.generate_content(prompt)
        time.sleep(0.5) # Rate limit safety
        return response.text.strip()
    except Exception as e:
        print(f"Translation error ({target_lang}): {e}")
        return text

def process_html_file(input_path, output_path, lang_code, lang_name):
    """Read HTML, translate content, adjust links, and save."""
    print(f"[{lang_code}] Processing {input_path} -> {output_path}...")
    
    with open(input_path, 'r') as f:
        soup = BeautifulSoup(f, 'html.parser')

    # 1. Update HTML Lang Attribute
    if soup.html:
        soup.html['lang'] = lang_code
        if lang_code == 'ar':
            soup.html['dir'] = 'rtl'
        else:
            soup.html['dir'] = 'ltr'

    # 2. Translate Meta Content (Title, Description)
    if soup.title and soup.title.string:
        soup.title.string = translate_text(soup.title.string, lang_name)
    
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    if meta_desc and meta_desc.get('content'):
        meta_desc['content'] = translate_text(meta_desc['content'], lang_name)

    # 3. Adjust Relative Links (CSS, JS, Images, internal links)
    # We are moving from root (depth 0) to /lang/ (depth 1) OR /volvo/ (depth 1) to /lang/volvo/ (depth 2)
    # Actually, we are just adding one level of depth relative to the original location.
    # So if original linked to "assets/css/main.css", new one needs "../assets/css/main.css"
    
    tags_attributes = {
        'link': 'href',
        'script': 'src',
        'img': 'src',
        'a': 'href'
    }

    for tag_name, attr in tags_attributes.items():
        for tag in soup.find_all(tag_name):
            val = tag.get(attr)
            if val and not val.startswith(('http', '//', 'mailto:', '#', 'data:', 'tel:', 'javascript:')):
                # It's a relative link. Prepend '../'
                tag[attr] = '../' + val

    # 4. Translate Visible Text (Heuristic: Headings, Nav, Paragraphs)
    # Limiting to key areas to save tokens/time for the pilot
    
    # Navigation
    for nav_item in soup.select('nav a'):
        if nav_item.string:
            nav_item.string = translate_text(nav_item.string, lang_name)

    # Headings
    for h in soup.find_all(['h1', 'h2', 'h3', 'h4']):
         if h.string:
            h.string = translate_text(h.string, lang_name)

    # Paragraphs (First 5 for speed in this demo)
    for p in soup.find_all('p')[:5]:
        if p.string:
            p.string = translate_text(p.string, lang_name)
            
    # Buttons
    for btn in soup.find_all('button'):
        if btn.string:
            btn.string = translate_text(btn.string, lang_name)
            
    # Ensure Output Directory Exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w') as f:
        f.write(str(soup))

def deploy_language(lang_code, lang_name):
    """Deploy the site structure for a specific language."""
    print(f"\n🚀 Deploying {lang_name} ({lang_code})...")
    
    # 1. Homepage
    if os.path.exists("index.html"):
        process_html_file("index.html", f"{lang_code}/index.html", lang_code, lang_name)
    
    # 2. Pilot Product Pages (Top 5)
    # Volvo
    volvo_src = "volvo/engine"
    if os.path.exists(volvo_src):
        # process first 2 files
        files = [f for f in os.listdir(volvo_src) if f.endswith('.html')][:2]
        for f in files:
            process_html_file(
                os.path.join(volvo_src, f), 
                os.path.join(f"{lang_code}/volvo/engine", f), 
                lang_code, 
                lang_name
            )

    # Scania
    scania_src = "scania/hydraulics" # Assuming this path exists from previous tasks
    if os.path.exists(scania_src):
         files = [f for f in os.listdir(scania_src) if f.endswith('.html')][:2]
         for f in files:
            process_html_file(
                os.path.join(scania_src, f), 
                os.path.join(f"{lang_code}/scania/hydraulics", f), 
                lang_code, 
                lang_name
            )

if __name__ == "__main__":
    for code, name in LANGUAGES.items():
        deploy_language(code, name)
    
    print("\n✅ Global Deployment Complete!")
