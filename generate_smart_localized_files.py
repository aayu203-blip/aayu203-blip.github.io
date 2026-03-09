import os
import glob
import re
import codecs
import concurrent.futures

# The 11 target languages
LANGUAGES = ['cn', 'te', 'ru', 'ml', 'kn', 'ar', 'hi', 'id', 'fr', 'es', 'ta']

# Basic SEO translations for the <title> and <meta name="description">
SEO_TRANSLATIONS = {
    'es': {"Aftermarket": "Repuestos", "Request Quote for": "Solicitar Cotización para", "Compatible with": "Compatible con", "Verified fitment for": "Ajuste verificado para", "Heavy Machinery": "Maquinaria Pesada"},
    'fr': {"Aftermarket": "Pièces de Rechange", "Request Quote for": "Demander un devis pour", "Compatible with": "Compatible avec", "Verified fitment for": "Compatibilité vérifiée pour", "Heavy Machinery": "Machines Lourdes"},
    'ru': {"Aftermarket": "Аналоги", "Request Quote for": "Запросить цену на", "Compatible with": "Совместимо с", "Verified fitment for": "Проверенная совместимость для", "Heavy Machinery": "Тяжелая Техника"},
    'ar': {"Aftermarket": "قطع غيار ما بعد البيع", "Request Quote for": "طلب عرض سعر لـ", "Compatible with": "متوافق مع", "Verified fitment for": "توافق تم التحقق منه لـ", "Heavy Machinery": "المعدات الثقيلة"},
    'hi': {"Aftermarket": "आफ्टरमार्केट", "Request Quote for": "कोटेशन का अनुरोध करें", "Compatible with": "के साथ संगत", "Verified fitment for": "सत्यापित फिटमेंट", "Heavy Machinery": "भारी मशीनरी"},
    'te': {"Aftermarket": "ఆఫ్టర్మార్కెట్", "Request Quote for": "కోట్ కోసం అభ్యర్థించండి", "Compatible with": "అనుకూలమైనది", "Verified fitment for": "ధృవీకరించబడిన అమరిక", "Heavy Machinery": "భారీ యంత్రాలు"},
    'ml': {"Aftermarket": "ആഫ്റ്റർമാർക്കറ്റ്", "Request Quote for": "ക്വോട്ടേഷൻ അഭ്യർത്ഥിക്കുക", "Compatible with": "അനുയോജ്യമായത്", "Verified fitment for": "പരിശോധിച്ച ഫിറ്റ്‌മെൻ്റ്", "Heavy Machinery": "ഹെവി മെഷിനറി"},
    'ta': {"Aftermarket": "ஆஃப்டர்மார்க்கெட்", "Request Quote for": "விலைப்புள்ளியைக் கோருங்கள்", "Compatible with": "பொருந்தக்கூடியது", "Verified fitment for": "சரிபார்க்கப்பட்ட பொருத்தம்", "Heavy Machinery": "கனரக இயந்திரங்கள்"},
    'kn': {"Aftermarket": "ಆಫ್ಟರ್‌ಮಾರ್ಕೆಟ್", "Request Quote for": "ಉಲ್ಲೇಖಕ್ಕಾಗಿ ವಿನಂತಿಸಿ", "Compatible with": "ಹೊಂದಿಕೊಳ್ಳುವ", "Verified fitment for": "ಪರಿಶೀಲಿಸಿದ ಫಿಟ್‌ಮೆಂಟ್", "Heavy Machinery": "ಭಾರಿ ಯಂತ್ರೋಪಕರಣಗಳು"},
    'id': {"Aftermarket": "Suku Cadang", "Request Quote for": "Minta Penawaran untuk", "Compatible with": "Kompatibel dengan", "Verified fitment for": "Kecocokan terverifikasi untuk", "Heavy Machinery": "Alat Berat"},
    'cn': {"Aftermarket": "售后件", "Request Quote for": "请求报价", "Compatible with": "兼容", "Verified fitment for": "经验证适用于", "Heavy Machinery": "重型机械"}
}

def translate_seo_text(text, lang):
    if lang not in SEO_TRANSLATIONS: return text
    for eng, trans in SEO_TRANSLATIONS[lang].items():
        text = text.replace(eng, trans)
    return text

def process_file(filepath):
    try:
        with codecs.open(filepath, 'r', 'utf-8') as f:
            content = f.read()

        # Extract everything from doctype to </head>
        head_match = re.search(r'(<!DOCTYPE html>.*?<head>.*?</head>)', content, re.IGNORECASE | re.DOTALL)
        if not head_match:
            print(f"Skipping {filepath} - Could not find <head>")
            return 0
        
        base_head = head_match.group(1)
        filename = os.path.basename(filepath)
        count = 0

        for lang in LANGUAGES:
            lang_dir = os.path.join(lang, 'pages', 'products')
            os.makedirs(lang_dir, exist_ok=True)
            target_path = os.path.join(lang_dir, filename)

            # Modify the head block for the specific language
            # 1. Update html lang
            head_lang = re.sub(r'<html lang="en"', f'<html lang="{lang}"', base_head, count=1, flags=re.IGNORECASE)
            
            # 2. Update canonical URL
            # From: https://partstrading.com/pages/products/...
            # To:   https://partstrading.com/{lang}/pages/products/...
            head_lang = re.sub(
                r'(<link.*?rel="canonical".*?href="https://partstrading\.com)(/pages/products/.*?".*?>)', 
                rf'\1/{lang}\2', 
                head_lang, 
                flags=re.IGNORECASE
            )

            # 3. Update og:url
            head_lang = re.sub(
                r'(<meta property="og:url" content="https://partstrading\.com)(/pages/products/.*?".*?>)', 
                rf'\1/{lang}\2', 
                head_lang, 
                flags=re.IGNORECASE
            )

            # 4. Translate SEO tags
            title_match = re.search(r'<title>(.*?)</title>', head_lang, re.IGNORECASE | re.DOTALL)
            if title_match:
                orig_title = title_match.group(1)
                new_title = translate_seo_text(orig_title, lang)
                head_lang = head_lang.replace(f"<title>{orig_title}</title>", f"<title>{new_title}</title>")

            desc_match = re.search(r'<meta name="description" content="(.*?)">', head_lang, re.IGNORECASE | re.DOTALL)
            if desc_match:
                orig_desc = desc_match.group(1)
                new_desc = translate_seo_text(orig_desc, lang)
                head_lang = head_lang.replace(f'content="{orig_desc}"', f'content="{new_desc}"')

            # Assemble the final lightweight stub
            stub_html = f"""{head_lang}
<body class="bg-gray-50 flex flex-col items-center justify-center min-h-screen font-sans">
    <div class="animate-pulse flex flex-col items-center mt-20 p-8 text-center">
        <!-- Loader -->
        <div class="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Loading Product Details</h2>
        <p class="text-gray-500 font-mono text-sm max-w-md">Initializing global translation framework and retrieving live marketplace data for part <b>{filename.replace('.html', '')}</b>...</p>
    </div>
    
    <!-- Translation Engine Router -->
    <script>
        // Set language token
        sessionStorage.setItem('ptc_lang', '{lang}');
    </script>
    <script src="/assets/js/translator.js"></script>
</body>
</html>"""
            
            with codecs.open(target_path, 'w', 'utf-8') as out_f:
                out_f.write(stub_html)
            
            count += 1
            
        return count
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return 0

def main():
    product_files = glob.glob("pages/products/*.html")
    print(f"Found {len(product_files)} product files. Starting intelligent stub generation...")

    total_created = 0
    futures = []
    
    # Process 50 files concurrently to speed up generation
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        for filepath in product_files:
            futures.append(executor.submit(process_file, filepath))
            
        for i, future in enumerate(concurrent.futures.as_completed(futures)):
            total_created += future.result()
            if (i+1) % 1000 == 0:
                print(f"Processed {i+1}/{len(product_files)} source files. Generated {total_created} stubs...")
                
    print(f"==========================================")
    print(f"✅ SUCCESS: Generated {total_created} lightweight SEO stubs!")
    print(f"Repository size is now protected.")

if __name__ == "__main__":
    main()
