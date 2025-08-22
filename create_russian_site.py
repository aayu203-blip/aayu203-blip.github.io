#!/usr/bin/env python3
"""
Script to create Russian version of the website with complete translations
"""

import os
import re
import shutil
from pathlib import Path

# Russian translations
RUSSIAN_TRANSLATIONS = {
    # Meta tags and SEO
    "Parts Trading Company | Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco Spare Parts Supplier India": 
        "Компания Parts Trading | Поставщик запчастей Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco в Индии",
    
    "Global supplier of Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco spare parts. 5,000+ high quality replacement parts in stock. Fast shipping worldwide. WhatsApp: +91-98210-37990. Serving Russia, Africa, Indonesia, India": 
        "Глобальный поставщик запчастей Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco. 5000+ качественных запасных частей на складе. Быстрая доставка по всему миру. WhatsApp: +91-98210-37990. Обслуживаем Россию, Африку, Индонезию, Индию",
    
    "Parts Trading Company": "Компания Parts Trading",
    
    # Navigation
    "HOME": "ГЛАВНАЯ",
    "BRANDS": "БРЕНДЫ",
    "PRODUCTS": "ПРОДУКТЫ",
    "FAQ": "ЧАВО",
    "CONTACT": "КОНТАКТЫ",
    
    # Hero section
    "Trusted Since 1956": "Доверяют с 1956 года",
    "If you have": "Если у вас есть",
    "Earthmovers,": "Землеройная техника,",
    "We have the Parts.": "У нас есть запчасти.",
    "Backed by 70 years of excellence": "Подкреплено 70-летним опытом",
    "in spare parts for Volvo, Scania, Komatsu, Caterpillar,": "в поставках запчастей для Volvo, Scania, Komatsu, Caterpillar,",
    "and other major heavy equipment brands": "и других ведущих брендов тяжелой техники",
    "— powering infrastructure, mining, and logistics": "— обеспечивая инфраструктуру, горнодобывающую промышленность и логистику",
    "across India and beyond.": "по всей Индии и за ее пределами.",
    
    # Buttons
    "WhatsApp Us": "Написать в WhatsApp",
    "Get Your Quote": "Получить предложение",
    "Explore Brands": "Изучить бренды",
    
    # Stats
    "Parts in Inventory": "Запчастей на складе",
    "Years Experience": "Лет опыта",
    "Support Available": "Поддержка доступна",
    "Quality Assured": "Качество гарантировано",
    
    # Search section
    "Quick Part Search": "Быстрый поиск запчастей",
    "Search for parts by part number, brand, or description...": "Поиск запчастей по номеру, бренду или описанию...",
    "Search Parts": "Найти запчасти",
    
    # Brands section
    "Our Trusted Brands": "Наши доверенные бренды",
    "We supply genuine and high-quality aftermarket parts for all major heavy equipment manufacturers": 
        "Мы поставляем оригинальные и качественные запасные части для всех ведущих производителей тяжелой техники",
    
    # Volvo section
    "Volvo": "Volvo",
    "Premium quality Volvo spare parts and components": "Качественные запчасти и компоненты Volvo",
    "View Volvo Parts": "Посмотреть запчасти Volvo",
    
    # Scania section
    "Scania": "Scania",
    "Reliable Scania parts for trucks and heavy vehicles": "Надежные запчасти Scania для грузовиков и тяжелой техники",
    "View Scania Parts": "Посмотреть запчасти Scania",
    
    # Komatsu section
    "Komatsu": "Komatsu",
    "Genuine Komatsu parts for construction and mining equipment": "Оригинальные запчасти Komatsu для строительной и горнодобывающей техники",
    "View Komatsu Parts": "Посмотреть запчасти Komatsu",
    
    # CAT section
    "Caterpillar": "Caterpillar",
    "CAT parts for earthmoving and construction machinery": "Запчасти CAT для землеройной и строительной техники",
    "View CAT Parts": "Посмотреть запчасти CAT",
    
    # Hitachi section
    "Hitachi": "Hitachi",
    "Hitachi spare parts for excavators and heavy machinery": "Запчасти Hitachi для экскаваторов и тяжелой техники",
    "View Hitachi Parts": "Посмотреть запчасти Hitachi",
    
    # Kobelco section
    "Kobelco": "Kobelco",
    "Kobelco parts for construction and industrial equipment": "Запчасти Kobelco для строительной и промышленной техники",
    "View Kobelco Parts": "Посмотреть запчасти Kobelco",
    
    # Product categories
    "Product Categories": "Категории продуктов",
    "Browse our comprehensive range of spare parts by category": "Просмотрите наш полный ассортимент запчастей по категориям",
    
    # Engine components
    "Engine Components": "Компоненты двигателя",
    "Engine parts, filters, and related components": "Запчасти двигателя, фильтры и связанные компоненты",
    
    # Fuel system
    "Fuel System Components": "Компоненты топливной системы",
    "Fuel pumps, injectors, and fuel system parts": "Топливные насосы, форсунки и запчасти топливной системы",
    
    # Braking system
    "Braking System Components": "Компоненты тормозной системы",
    "Brake pads, discs, and braking system parts": "Тормозные колодки, диски и запчасти тормозной системы",
    
    # Transmission
    "Transmission & Differential": "Трансмиссия и дифференциал",
    "Gearboxes, clutches, and transmission components": "Коробки передач, сцепления и компоненты трансмиссии",
    
    # Hydraulic systems
    "Hydraulic Systems": "Гидравлические системы",
    "Hydraulic pumps, valves, and connectors": "Гидравлические насосы, клапаны и соединители",
    
    # Air systems
    "Compressed Air Systems": "Системы сжатого воздуха",
    "Air compressors, dryers, and air system components": "Воздушные компрессоры, осушители и компоненты воздушной системы",
    
    # Filtration
    "Air & Fluid Filtration": "Фильтрация воздуха и жидкостей",
    "Air filters, oil filters, and filtration systems": "Воздушные фильтры, масляные фильтры и системы фильтрации",
    
    # Steering & Suspension
    "Steering & Suspension": "Рулевое управление и подвеска",
    "Steering components, suspension parts, and related systems": "Компоненты рулевого управления, детали подвески и связанные системы",
    
    # Lighting
    "Lighting & Exterior": "Освещение и внешние элементы",
    "Lights, mirrors, and exterior body components": "Фары, зеркала и внешние кузовные компоненты",
    
    # Fasteners
    "Fasteners & Hardware": "Крепежные элементы и фурнитура",
    "Bolts, nuts, washers, and hardware accessories": "Болты, гайки, шайбы и крепежная фурнитура",
    
    # FAQ section
    "Frequently Asked Questions": "Часто задаваемые вопросы",
    "Find answers to common questions about our parts and services": "Найдите ответы на часто задаваемые вопросы о наших запчастях и услугах",
    
    # Contact section
    "Contact Information": "Контактная информация",
    "Get in touch with us for parts inquiries and support": "Свяжитесь с нами для запросов по запчастям и поддержки",
    
    # Footer
    "© Parts Trading Company. All rights reserved.": "© Компания Parts Trading. Все права защищены.",
    "Disclaimer: All brand names, logos, images, and part numbers used on this website are for identification and reference purposes only. Parts Trading Company is not affiliated with any original equipment manufacturers (OEMs) unless specifically stated. We offer a range of products that may include genuine OEM parts or compatible high-quality aftermarket alternatives, based on availability and customer requirements.": 
        "Отказ от ответственности: Все торговые марки, логотипы, изображения и номера деталей, используемые на этом сайте, предназначены только для идентификации и справки. Компания Parts Trading не связана с какими-либо производителями оригинального оборудования (OEM), если это не указано специально. Мы предлагаем ряд продуктов, которые могут включать оригинальные запчасти OEM или совместимые качественные альтернативы, в зависимости от наличия и требований клиентов.",
    
    # Language and locale
    'lang="en"': 'lang="ru"',
    'dir="ltr"': 'dir="ltr"',
    'en_US': 'ru_RU',
    
    # URLs
    'https://partstrading.com/': 'https://ru.partstrading.com/',
    'https://partstrading.com': 'https://ru.partstrading.com',
    
    # Hreflang
    'hreflang="en"': 'hreflang="ru"',
    'hreflang="x-default"': 'hreflang="x-default"',
}

def translate_text(text):
    """Translate text using the translation dictionary"""
    for english, russian in RUSSIAN_TRANSLATIONS.items():
        text = text.replace(english, russian)
    return text

def create_russian_file(source_path, target_path):
    """Create Russian version of a file"""
    print(f"Creating Russian version: {target_path}")
    
    # Ensure target directory exists
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    
    # Read source file
    with open(source_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Translate content
    translated_content = translate_text(content)
    
    # Write translated file
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(translated_content)

def main():
    """Main function to create Russian website"""
    print("Creating Russian version of the website...")
    
    # Create Russian homepage
    create_russian_file('index.html', 'ru/index.html')
    
    # Create Russian product pages (sample)
    product_files = [
        'pages/products/1521879.html',
        'pages/products/1521725.html',
        'pages/products/1521870.html',
        'pages/products/1521878.html',
    ]
    
    for product_file in product_files:
        if os.path.exists(product_file):
            target_file = f"ru/{product_file}"
            create_russian_file(product_file, target_file)
    
    # Create Russian category pages
    category_files = [
        'pages/categories/volvo-fuel-system-components.html',
        'pages/categories/volvo-engine-components.html',
        'pages/categories/volvo-steering-and-suspension-parts.html',
    ]
    
    for category_file in category_files:
        if os.path.exists(category_file):
            target_file = f"ru/{category_file}"
            create_russian_file(category_file, target_file)
    
    print("Russian website creation complete!")
    print("Files created in the 'ru/' directory")

if __name__ == "__main__":
    main()
