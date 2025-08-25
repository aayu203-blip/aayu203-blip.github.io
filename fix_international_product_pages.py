#!/usr/bin/env python3
"""
Fix all international product pages by adding proper HTML structure and translating content.
"""

import os
import glob
import re

# Translation mappings for different languages
translations = {
    'ru': {
        'company_name': 'Компания Parts Trading',
        'engine_components': 'Компоненты двигателя',
        'home': 'Главная',
        'brands': 'Бренды',
        'products': 'Продукты',
        'faq': 'FAQ',
        'contact': 'Контакты',
        'part_number': 'Номер детали',
        'product_details': 'Детали продукта',
        'breadcrumb_home': 'Главная',
        'breadcrumb_volvo': 'Volvo',
        'breadcrumb_engine': 'Компоненты двигателя',
        'breadcrumb_engine_short': 'Двигатель',
        'whatsapp_message': 'Привет! Я заинтересован в запасных частях. Пожалуйста, предоставьте цену и наличие.'
    },
    'fr': {
        'company_name': 'Société Parts Trading',
        'engine_components': 'Composants du moteur',
        'home': 'Accueil',
        'brands': 'Marques',
        'products': 'Produits',
        'faq': 'FAQ',
        'contact': 'Contact',
        'part_number': 'Numéro de pièce',
        'product_details': 'Détails du produit',
        'breadcrumb_home': 'Accueil',
        'breadcrumb_volvo': 'Volvo',
        'breadcrumb_engine': 'Composants du moteur',
        'breadcrumb_engine_short': 'Moteur',
        'whatsapp_message': 'Bonjour! Je suis intéressé par des pièces de rechange. Veuillez fournir un devis et la disponibilité.'
    },
    'cn': {
        'company_name': 'Parts Trading 公司',
        'engine_components': '发动机组件',
        'home': '首页',
        'brands': '品牌',
        'products': '产品',
        'faq': '常见问题',
        'contact': '联系我们',
        'part_number': '零件号',
        'product_details': '产品详情',
        'breadcrumb_home': '首页',
        'breadcrumb_volvo': 'Volvo',
        'breadcrumb_engine': '发动机组件',
        'breadcrumb_engine_short': '发动机',
        'whatsapp_message': '您好！我对备件感兴趣。请提供报价和库存情况。'
    }
}

def get_language_from_path(file_path):
    """Extract language from file path."""
    parts = file_path.split('/')
    for part in parts:
        if part in translations:
            return part
    return 'en'

def translate_content(content, lang):
    """Translate content based on language."""
    if lang not in translations:
        return content
    
    trans = translations[lang]
    
    # Replace company name
    content = re.sub(r'Parts Trading Company', trans['company_name'], content)
    content = re.sub(r'Parts Trading 公司', trans['company_name'], content)
    
    # Replace navigation items
    content = re.sub(r'>HOME<', f'>{trans["home"]}<', content)
    content = re.sub(r'>BRANDS<', f'>{trans["brands"]}<', content)
    content = re.sub(r'>PRODUCTS<', f'>{trans["products"]}<', content)
    content = re.sub(r'>FAQ<', f'>{trans["faq"]}<', content)
    content = re.sub(r'>CONTACT<', f'>{trans["contact"]}<', content)
    
    # Replace breadcrumb items
    content = re.sub(r'>Home<', f'>{trans["breadcrumb_home"]}<', content)
    content = re.sub(r'>Volvo<', f'>{trans["breadcrumb_volvo"]}<', content)
    content = re.sub(r'>Engine Components<', f'>{trans["breadcrumb_engine"]}<', content)
    content = re.sub(r'>Engine<', f'>{trans["breadcrumb_engine_short"]}<', content)
    
    # Replace WhatsApp message - fix the entire message
    whatsapp_url_pattern = r'(https://wa\.me/919821037990\?text=)[^"]*'
    encoded_message = trans['whatsapp_message'].replace(' ', '%20').replace('!', '%21').replace(',', '%2C').replace('.', '%2E').replace('？', '%3F').replace('。', '%2E')
    content = re.sub(whatsapp_url_pattern, r'\1' + encoded_message, content)
    
    return content

def fix_product_page(file_path):
    """Fix a single product page by adding proper HTML structure and translating content."""
    
    print(f"Fixing: {file_path}")
    
    # Get language from file path
    lang = get_language_from_path(file_path)
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file already has proper structure
    if '<!DOCTYPE html>' in content:
        print(f"  File already has proper structure, skipping...")
        return False
    
    # Add proper HTML structure
    content = f'''<!DOCTYPE html>
<html lang="{lang}">
{content}'''
    
    # Translate content
    content = translate_content(content, lang)
    
    # Write the fixed content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  Fixed successfully!")
    return True

def main():
    """Main function to fix all international product pages."""
    
    # Get the base directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Language directories
    languages = ['ru', 'fr', 'cn']
    
    total_fixed = 0
    
    for lang in languages:
        lang_dir = os.path.join(base_dir, lang, 'pages', 'products')
        
        if not os.path.exists(lang_dir):
            print(f"Language directory not found: {lang_dir}")
            continue
        
        print(f"\nProcessing {lang.upper()} product pages...")
        
        # Get all HTML files in the language's product directory
        html_files = glob.glob(os.path.join(lang_dir, '*.html'))
        
        if not html_files:
            print(f"  No HTML files found in {lang_dir}")
            continue
        
        lang_fixed = 0
        for html_file in html_files:
            if fix_product_page(html_file):
                lang_fixed += 1
        
        print(f"  Fixed {lang_fixed} out of {len(html_files)} files for {lang.upper()}")
        total_fixed += lang_fixed
    
    print(f"\nTotal files fixed: {total_fixed}")
    print("All international product pages have been updated with proper HTML structure and translations!")

if __name__ == "__main__":
    main()
