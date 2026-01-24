#!/usr/bin/env python3
"""
Script to create multilingual versions of the website (Russian, Chinese, Indonesian)
"""

import os
import re
import shutil
from pathlib import Path

# Translation dictionaries for each language
TRANSLATIONS = {
    'ru': {
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
    },
    
    'cn': {
        # Meta tags and SEO
        "Parts Trading Company | Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco Spare Parts Supplier India": 
            "Parts Trading 公司 | 印度 Volvo、Scania、Komatsu、CAT、Hitachi、Kobelco 备件供应商",
        
        "Global supplier of Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco spare parts. 5,000+ high quality replacement parts in stock. Fast shipping worldwide. WhatsApp: +91-98210-37990. Serving Russia, Africa, Indonesia, India": 
            "Volvo、Scania、Komatsu、CAT、Hitachi、Kobelco 备件的全球供应商。库存 5,000+ 高质量替换零件。全球快速发货。WhatsApp：+91-98210-37990。服务俄罗斯、非洲、印度尼西亚、印度",
        
        "Parts Trading Company": "Parts Trading 公司",
        
        # Navigation
        "HOME": "首页",
        "BRANDS": "品牌",
        "PRODUCTS": "产品",
        "FAQ": "常见问题",
        "CONTACT": "联系我们",
        
        # Hero section
        "Trusted Since 1956": "自 1956 年以来值得信赖",
        "If you have": "如果您有",
        "Earthmovers,": "土方机械，",
        "We have the Parts.": "我们有零件。",
        "Backed by 70 years of excellence": "拥有 70 年卓越经验",
        "in spare parts for Volvo, Scania, Komatsu, Caterpillar,": "为 Volvo、Scania、Komatsu、Caterpillar 提供备件，",
        "and other major heavy equipment brands": "以及其他主要重型设备品牌",
        "— powering infrastructure, mining, and logistics": "— 为基础设施、采矿和物流提供动力",
        "across India and beyond.": "遍及印度及更远地区。",
        
        # Buttons
        "WhatsApp Us": "WhatsApp 联系我们",
        "Get Your Quote": "获取报价",
        "Explore Brands": "探索品牌",
        
        # Stats
        "Parts in Inventory": "库存零件",
        "Years Experience": "年经验",
        "Support Available": "可用支持",
        "Quality Assured": "质量保证",
        
        # Search section
        "Quick Part Search": "快速零件搜索",
        "Search for parts by part number, brand, or description...": "按零件号、品牌或描述搜索零件...",
        "Search Parts": "搜索零件",
        
        # Brands section
        "Our Trusted Brands": "我们值得信赖的品牌",
        "We supply genuine and high-quality aftermarket parts for all major heavy equipment manufacturers": 
            "我们为所有主要重型设备制造商提供正品和高质量售后零件",
        
        # Product categories
        "Product Categories": "产品类别",
        "Browse our comprehensive range of spare parts by category": "按类别浏览我们全面的备件系列",
        
        # Engine components
        "Engine Components": "发动机组件",
        "Engine parts, filters, and related components": "发动机零件、过滤器和相关组件",
        
        # Fuel system
        "Fuel System Components": "燃油系统组件",
        "Fuel pumps, injectors, and fuel system parts": "燃油泵、喷油器和燃油系统零件",
        
        # Braking system
        "Braking System Components": "制动系统组件",
        "Brake pads, discs, and braking system parts": "刹车片、刹车盘和制动系统零件",
        
        # Transmission
        "Transmission & Differential": "变速箱和差速器",
        "Gearboxes, clutches, and transmission components": "变速箱、离合器和传动组件",
        
        # Hydraulic systems
        "Hydraulic Systems": "液压系统",
        "Hydraulic pumps, valves, and connectors": "液压泵、阀门和连接器",
        
        # Air systems
        "Compressed Air Systems": "压缩空气系统",
        "Air compressors, dryers, and air system components": "空气压缩机、干燥器和空气系统组件",
        
        # Filtration
        "Air & Fluid Filtration": "空气和流体过滤",
        "Air filters, oil filters, and filtration systems": "空气过滤器、机油过滤器和过滤系统",
        
        # Steering & Suspension
        "Steering & Suspension": "转向和悬挂",
        "Steering components, suspension parts, and related systems": "转向组件、悬挂零件和相关系统",
        
        # Lighting
        "Lighting & Exterior": "照明和外观",
        "Lights, mirrors, and exterior body components": "灯具、镜子和外观车身组件",
        
        # Fasteners
        "Fasteners & Hardware": "紧固件和五金件",
        "Bolts, nuts, washers, and hardware accessories": "螺栓、螺母、垫圈和五金配件",
        
        # FAQ section
        "Frequently Asked Questions": "常见问题",
        "Find answers to common questions about our parts and services": "查找有关我们零件和服务的常见问题答案",
        
        # Contact section
        "Contact Information": "联系信息",
        "Get in touch with us for parts inquiries and support": "联系我们获取零件咨询和支持",
        
        # Footer
        "© Parts Trading Company. All rights reserved.": "© Parts Trading 公司。保留所有权利。",
        "Disclaimer: All brand names, logos, images, and part numbers used on this website are for identification and reference purposes only. Parts Trading Company is not affiliated with any original equipment manufacturers (OEMs) unless specifically stated. We offer a range of products that may include genuine OEM parts or compatible high-quality aftermarket alternatives, based on availability and customer requirements.": 
            "免责声明：本网站上使用的所有品牌名称、徽标、图像和零件号仅用于识别和参考目的。除非特别说明，Parts Trading 公司与任何原始设备制造商 (OEM) 均无关联。我们提供一系列产品，可能包括正品 OEM 零件或兼容的高质量售后替代品，具体取决于可用性和客户要求。",
        
        # Language and locale
        'lang="en"': 'lang="zh-CN"',
        'dir="ltr"': 'dir="ltr"',
        'en_US': 'zh_CN',
        
        # URLs
        'https://partstrading.com/': 'https://cn.partstrading.com/',
        'https://partstrading.com': 'https://cn.partstrading.com',
        
        # Hreflang
        'hreflang="en"': 'hreflang="zh-CN"',
        'hreflang="x-default"': 'hreflang="x-default"',
    },
    
    'id': {
        # Meta tags and SEO
        "Parts Trading Company | Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco Spare Parts Supplier India": 
            "Parts Trading Company | Pemasok Suku Cadang Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco India",
        
        "Global supplier of Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco spare parts. 5,000+ high quality replacement parts in stock. Fast shipping worldwide. WhatsApp: +91-98210-37990. Serving Russia, Africa, Indonesia, India": 
            "Pemasok global suku cadang Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco. 5.000+ suku cadang pengganti berkualitas tinggi tersedia. Pengiriman cepat ke seluruh dunia. WhatsApp: +91-98210-37990. Melayani Rusia, Afrika, Indonesia, India",
        
        "Parts Trading Company": "Parts Trading Company",
        
        # Navigation
        "HOME": "BERANDA",
        "BRANDS": "MEREK",
        "PRODUCTS": "PRODUK",
        "FAQ": "FAQ",
        "CONTACT": "KONTAK",
        
        # Hero section
        "Trusted Since 1956": "Dipercaya Sejak 1956",
        "If you have": "Jika Anda memiliki",
        "Earthmovers,": "Alat berat,",
        "We have the Parts.": "Kami memiliki Suku Cadang.",
        "Backed by 70 years of excellence": "Didukung oleh 70 tahun keunggulan",
        "in spare parts for Volvo, Scania, Komatsu, Caterpillar,": "dalam suku cadang untuk Volvo, Scania, Komatsu, Caterpillar,",
        "and other major heavy equipment brands": "dan merek peralatan berat utama lainnya",
        "— powering infrastructure, mining, and logistics": "— mendukung infrastruktur, pertambangan, dan logistik",
        "across India and beyond.": "di seluruh India dan sekitarnya.",
        
        # Buttons
        "WhatsApp Us": "WhatsApp Kami",
        "Get Your Quote": "Dapatkan Penawaran",
        "Explore Brands": "Jelajahi Merek",
        
        # Stats
        "Parts in Inventory": "Suku Cadang di Inventaris",
        "Years Experience": "Tahun Pengalaman",
        "Support Available": "Dukungan Tersedia",
        "Quality Assured": "Kualitas Terjamin",
        
        # Search section
        "Quick Part Search": "Pencarian Suku Cadang Cepat",
        "Search for parts by part number, brand, or description...": "Cari suku cadang berdasarkan nomor bagian, merek, atau deskripsi...",
        "Search Parts": "Cari Suku Cadang",
        
        # Brands section
        "Our Trusted Brands": "Merek Terpercaya Kami",
        "We supply genuine and high-quality aftermarket parts for all major heavy equipment manufacturers": 
            "Kami memasok suku cadang asli dan berkualitas tinggi untuk semua produsen peralatan berat utama",
        
        # Product categories
        "Product Categories": "Kategori Produk",
        "Browse our comprehensive range of spare parts by category": "Jelajahi rangkaian suku cadang komprehensif kami berdasarkan kategori",
        
        # Engine components
        "Engine Components": "Komponen Mesin",
        "Engine parts, filters, and related components": "Suku cadang mesin, filter, dan komponen terkait",
        
        # Fuel system
        "Fuel System Components": "Komponen Sistem Bahan Bakar",
        "Fuel pumps, injectors, and fuel system parts": "Pompa bahan bakar, injektor, dan suku cadang sistem bahan bakar",
        
        # Braking system
        "Braking System Components": "Komponen Sistem Pengereman",
        "Brake pads, discs, and braking system parts": "Kampas rem, cakram, dan suku cadang sistem pengereman",
        
        # Transmission
        "Transmission & Differential": "Transmisi & Diferensial",
        "Gearboxes, clutches, and transmission components": "Kotak gigi, kopling, dan komponen transmisi",
        
        # Hydraulic systems
        "Hydraulic Systems": "Sistem Hidrolik",
        "Hydraulic pumps, valves, and connectors": "Pompa hidrolik, katup, dan konektor",
        
        # Air systems
        "Compressed Air Systems": "Sistem Udara Bertekanan",
        "Air compressors, dryers, and air system components": "Kompresor udara, pengering, dan komponen sistem udara",
        
        # Filtration
        "Air & Fluid Filtration": "Filtrasi Udara & Cairan",
        "Air filters, oil filters, and filtration systems": "Filter udara, filter oli, dan sistem filtrasi",
        
        # Steering & Suspension
        "Steering & Suspension": "Kemudi & Suspensi",
        "Steering components, suspension parts, and related systems": "Komponen kemudi, suku cadang suspensi, dan sistem terkait",
        
        # Lighting
        "Lighting & Exterior": "Penerangan & Eksterior",
        "Lights, mirrors, and exterior body components": "Lampu, kaca spion, dan komponen eksterior bodi",
        
        # Fasteners
        "Fasteners & Hardware": "Pengencang & Perangkat Keras",
        "Bolts, nuts, washers, and hardware accessories": "Baut, mur, mesin cuci, dan aksesori perangkat keras",
        
        # FAQ section
        "Frequently Asked Questions": "Pertanyaan yang Sering Diajukan",
        "Find answers to common questions about our parts and services": "Temukan jawaban untuk pertanyaan umum tentang suku cadang dan layanan kami",
        
        # Contact section
        "Contact Information": "Informasi Kontak",
        "Get in touch with us for parts inquiries and support": "Hubungi kami untuk pertanyaan suku cadang dan dukungan",
        
        # Footer
        "© Parts Trading Company. All rights reserved.": "© Parts Trading Company. Semua hak dilindungi.",
        "Disclaimer: All brand names, logos, images, and part numbers used on this website are for identification and reference purposes only. Parts Trading Company is not affiliated with any original equipment manufacturers (OEMs) unless specifically stated. We offer a range of products that may include genuine OEM parts or compatible high-quality aftermarket alternatives, based on availability and customer requirements.": 
            "Penafian: Semua nama merek, logo, gambar, dan nomor bagian yang digunakan di situs web ini hanya untuk tujuan identifikasi dan referensi. Parts Trading Company tidak berafiliasi dengan produsen peralatan asli (OEM) mana pun kecuali dinyatakan secara khusus. Kami menawarkan berbagai produk yang mungkin termasuk suku cadang OEM asli atau alternatif aftermarket berkualitas tinggi yang kompatibel, berdasarkan ketersediaan dan persyaratan pelanggan.",
        
        # Language and locale
        'lang="en"': 'lang="id"',
        'dir="ltr"': 'dir="ltr"',
        'en_US': 'id_ID',
        
        # URLs
        'https://partstrading.com/': 'https://id.partstrading.com/',
        'https://partstrading.com': 'https://id.partstrading.com',
        
        # Hreflang
        'hreflang="en"': 'hreflang="id"',
        'hreflang="x-default"': 'hreflang="x-default"',
    }
}

def translate_text(text, language):
    """Translate text using the translation dictionary for the specified language"""
    translations = TRANSLATIONS.get(language, {})
    for english, translated in translations.items():
        text = text.replace(english, translated)
    return text

def create_language_file(source_path, target_path, language):
    """Create translated version of a file"""
    print(f"Creating {language.upper()} version: {target_path}")
    
    # Ensure target directory exists
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    
    # Read source file
    with open(source_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Translate content
    translated_content = translate_text(content, language)
    
    # Write translated file
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(translated_content)

def get_all_html_files():
    """Get all HTML files in the project"""
    html_files = []
    
    # Main pages
    if os.path.exists('index.html'):
        html_files.append('index.html')
    
    # Product pages
    product_dir = 'pages/products'
    if os.path.exists(product_dir):
        for file in os.listdir(product_dir):
            if file.endswith('.html'):
                html_files.append(f'{product_dir}/{file}')
    
    # Category pages
    category_dir = 'pages/categories'
    if os.path.exists(category_dir):
        for file in os.listdir(category_dir):
            if file.endswith('.html'):
                html_files.append(f'{category_dir}/{file}')
    
    return html_files

def main():
    """Main function to create multilingual website"""
    print("Creating multilingual versions of the website...")
    
    # Get all HTML files
    html_files = get_all_html_files()
    print(f"Found {len(html_files)} HTML files to translate")
    
    # Create translations for each language
    languages = ['ru', 'cn', 'id']
    
    for language in languages:
        print(f"\n=== Creating {language.upper()} version ===")
        
        # Create language directory
        lang_dir = language
        os.makedirs(lang_dir, exist_ok=True)
        
        # Translate all HTML files
        for html_file in html_files:
            if os.path.exists(html_file):
                target_file = f"{lang_dir}/{html_file}"
                create_language_file(html_file, target_file, language)
    
    print("\n=== Multilingual website creation complete! ===")
    print("Files created in the following directories:")
    for lang in languages:
        print(f"- {lang}/ (for {lang}.partstrading.com)")

if __name__ == "__main__":
    main()
