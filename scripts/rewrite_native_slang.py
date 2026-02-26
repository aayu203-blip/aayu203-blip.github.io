import os
import glob
import re

ROOT_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete"

# Define the dictionary of literal to slang replacements
# We target <title>, <meta name="description">, and <h1>
SLANG_MAP = {
    'cn': {
        'Spare Parts': '工程机械配件', # Construction Machinery Parts
        '备件': '工程机械配件', # Replace generic translation
        '零件': '配件',
        'Replacement for': '原厂替代件', # OEM equivalent replacement
        '替代': '原厂替代件',
        'Parts Trading 公司': 'Parts Trading (印度直供配件)', # India direct supply parts
        '发动机组件': '发动机核心组件', # Engine Core Components
    },
    'ru': {
        'Spare Parts': 'Запчасти для спецтехники', # Heavy Equipment Parts
        'Запчасти': 'Запчасти для спецтехники',
        'Replacement for': 'Качественный аналог', # Quality analog
        'альтернатива': 'Качественный аналог',
        'Parts Trading Company': 'Parts Trading (Прямые поставки)', # Direct supplies
    },
    'es': {
        'Spare Parts': 'Repuestos para Maquinaria Pesada', # Heavy Machinery Parts
        'Repuestos': 'Repuestos para Maquinaria Pesada',
        'Componentes': 'Componentes Críticos', # Critical Components
        'Replacement for': 'Repuesto Alternativo Exacto para', # Exact alternative replacement
    }
}

def process_file(filepath, slang_dict):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Process replacements carefully
    for old_term, new_term in slang_dict.items():
        # Replace in Title
        content = re.sub(rf'(<title>.*?)({re.escape(old_term)})(.*?</title>)', rf'\1{new_term}\3', content, flags=re.IGNORECASE)
        # Replace in Meta Description
        content = re.sub(rf'(<meta[^>]*name="description"[^>]*content=".*?)({re.escape(old_term)})(.*?")', rf'\1{new_term}\3', content, flags=re.IGNORECASE)
        # Replace in H1
        content = re.sub(rf'(<h1.*?>.*?)({re.escape(old_term)})(.*?</h1>)', rf'\1{new_term}\3', content, flags=re.IGNORECASE)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    print("Starting Step 1: Native Slang Injection")
    total_modified = 0
    
    for lang, slang_dict in SLANG_MAP.items():
        search_path = os.path.join(ROOT_DIR, lang, "**", "*.html")
        files = glob.glob(search_path, recursive=True)
        
        lang_modified = 0
        for file in files:
            if process_file(file, slang_dict):
                lang_modified += 1
                total_modified += 1
                
        print(f"Processed /{lang}/: Updated {lang_modified} files with native slang.")
        
    print(f"Native slang injection complete. Total files upgraded: {total_modified}")

if __name__ == "__main__":
    main()
