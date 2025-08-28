#!/usr/bin/env python3
import re

def translate_russian_homepage():
    # Read the English homepage
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update HTML lang and dir attributes
    content = content.replace('lang="en"', 'lang="ru"')
    content = content.replace('dir="ltr"', 'dir="ltr"')  # Keep LTR for Russian
    
    # Comprehensive Russian translations
    translations = {
        # Meta tags
        'Parts Trading Company | Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco Spare Parts Supplier India': 'Компания Parts Trading | Поставщик запчастей Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco в Индии',
        'Global supplier of Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco spare parts. 5,000+ high quality replacement parts in stock. Fast shipping worldwide. WhatsApp: +91-98210-37990. Serving Russia, Africa, Indonesia, India': 'Глобальный поставщик запчастей Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco. Более 5000 качественных запасных частей на складе. Быстрая доставка по всему миру. WhatsApp: +91-98210-37990. Обслуживаем Россию, Африку, Индонезию, Индию',
        'Parts Trading Company': 'Компания Parts Trading',
        
        # Navigation
        'PARTS TRADING': 'PARTS TRADING',
        'COMPANY': 'КОМПАНИЯ',
        'HOME': 'ГЛАВНАЯ',
        'BRANDS': 'БРЕНДЫ',
        'PRODUCTS': 'ПРОДУКТЫ',
        'FAQ': 'ЧАВО',
        'CONTACT': 'КОНТАКТЫ',
        
        # Hero Section
        'Trusted Since 1956': 'Доверяют с 1956 года',
        'If you have': 'Если у вас есть',
        'Earthmovers,': 'землеройная техника,',
        'We have the Parts.': 'у нас есть запчасти.',
        'Backed by 70 years of excellence': 'Поддерживаемые 70-летним опытом',
        ' in spare parts for Volvo, Scania, Komatsu, Caterpillar,': ' в запчастях для Volvo, Scania, Komatsu, Caterpillar,',
        ' and other major heavy equipment brands': ' и других ведущих брендов тяжелой техники',
        ' — powering infrastructure, mining, and logistics': ' — обеспечивая инфраструктуру, горнодобывающую промышленность и логистику',
        ' across India and beyond.': ' по всей Индии и за ее пределами.',
        'WhatsApp Us': 'Напишите нам в WhatsApp',
        'Get Your Quote': 'Получить предложение',
        'Explore Brands': 'Изучить бренды',
        'Parts in Inventory': 'Запчастей на складе',
        'Years Experience': 'Лет опыта',
        'Support Available': 'Поддержка доступна',
        'Quality Assured': 'Качество гарантировано',
        
        # Search Section
        'Quick Part Search': 'Быстрый поиск запчастей',
        'Search Parts Instantly': 'Найти запчасти мгновенно',
        'We help you quickly find the right spare parts from our catalog of': 'Мы помогаем быстро найти нужные запчасти из нашего каталога',
        '5,000+ stocked items': 'более 5000 товаров на складе',
        'Enter Part Number or Description': 'Введите номер детали или описание',
        'Search Parts': 'Найти запчасти',
        'Popular searches (5,000+ parts available):': 'Популярные поиски (доступно более 5000 запчастей):',
        
        # Brands Section
        'Brands We Support': 'Бренды, которые мы поддерживаем',
        'We supply spare parts compatible with all': 'Мы поставляем запчасти, совместимые со всеми',
        'major equipment brands': 'основными брендами оборудования',
        ' used worldwide.': ' используемыми во всем мире.',
        'Trucks & Excavators': 'Грузовики и экскаваторы',
        'Heavy Trucks': 'Тяжелые грузовики',
        'Excavators & Dozers': 'Экскаваторы и бульдозеры',
        'Construction Equipment': 'Строительное оборудование',
        'Excavators': 'Экскаваторы',
        
        # Component Brands
        'Brands We Stock': 'Бренды, которые мы храним',
        "We offer genuine and replacement parts from the world's": 'Мы предлагаем оригинальные и запасные части от ведущих',
        'top component manufacturers': 'производителей компонентов мира',
        'Needle Bearings': 'Игольчатые подшипники',
        'Clutches, Steering Pumps': 'Сцепления, насосы рулевого управления',
        'Shock Absorbers': 'Амортизаторы',
        'AC Compressors': 'Компрессоры кондиционеров',
        'Universal Joints & Crosses': 'Карданные шарниры и крестовины',
        'Water Pumps, Valves': 'Водяные насосы, клапаны',
        'Clutches, Pressure Plates, ECAs, Compressors': 'Сцепления, нажимные диски, ECA, компрессоры',
        'Undercarriage Parts': 'Части ходовой части',
        'Air Brake Components': 'Компоненты пневматических тормозов',
        
        # Industries Section
        'Industries We Serve': 'Отрасли, которые мы обслуживаем',
        'We support key sectors with reliable spare parts and': 'Мы поддерживаем ключевые секторы надежными запчастями и',
        'expert technical assistance': 'экспертной технической поддержкой',
        'Mining': 'Горнодобывающая промышленность',
        'Heavy Equipment & Machinery Parts': 'Запчасти для тяжелого оборудования и машин',
        'Infrastructure': 'Инфраструктура',
        'Roads, Bridges & Development': 'Дороги, мосты и развитие',
        'Construction': 'Строительство',
        'Building & Development Projects': 'Строительные и развивающие проекты',
        'Transport': 'Транспорт',
        'Logistics & Fleet Management': 'Логистика и управление парком',
        'Genset': 'Дизель-генераторы',
        'Power Generation Equipment': 'Оборудование для выработки электроэнергии',
        
        # Product Categories
        'Product Categories We Stock': 'Категории продуктов, которые мы храним',
        'We offer a full range of spare parts for': 'Мы предлагаем полный ассортимент запчастей для',
        'heavy equipment': 'тяжелого оборудования',
        ', ready for dispatch or special order.': ', готовых к отправке или специальному заказу.',
        'Engine Components': 'Компоненты двигателя',
        'Engine components, powertrain internals, cooling & lubrication': 'Компоненты двигателя, внутренние части силовой передачи, охлаждение и смазка',
        'Fuel System Components': 'Компоненты топливной системы',
        'Injectors, pumps, rails, lines and fuel delivery parts': 'Инжекторы, насосы, рейки, трубопроводы и детали подачи топлива',
        'Transmission & Differential Components': 'Компоненты трансмиссии и дифференциала',
        'Transmission systems, differential components, gear assemblies': 'Системы трансмиссии, компоненты дифференциала, зубчатые сборки',
        'Braking System Components': 'Компоненты тормозной системы',
        'Calipers, pads, discs, drums, chambers and brake hardware': 'Суппорты, колодки, диски, барабаны, камеры и тормозное оборудование',
        'Steering & Suspension Parts': 'Детали рулевого управления и подвески',
        'Steering linkages, suspension arms, bushings, shocks': 'Рулевые тяги, рычаги подвески, втулки, амортизаторы',
        'Hydraulic Systems & Connectors': 'Гидравлические системы и соединители',
        'Hydraulic components, hoses, fittings and connectors': 'Гидравлические компоненты, шланги, фитинги и соединители',
        'Air & Fluid Filtration Systems': 'Системы фильтрации воздуха и жидкости',
        'Air filters, fluid filters, filtration systems': 'Воздушные фильтры, фильтры жидкости, системы фильтрации',
        'Lighting & Exterior Body Components': 'Осветительные и внешние кузовные компоненты',
        'Lighting systems, exterior body parts, visual components': 'Осветительные системы, внешние кузовные части, визуальные компоненты',
        'Fasteners, Hardware & Accessories': 'Крепежные элементы, оборудование и аксессуары',
        'Fasteners, hardware components and accessories': 'Крепежные элементы, компоненты оборудования и аксессуары',
        'View Products →': 'Посмотреть продукты →',
        'Select Brand': 'Выбрать бренд',
        '← Back to category': '← Назад к категории',
        
        # Why Choose Us Section
        'Why Customers Choose Us': 'Почему клиенты выбирают нас',
        "We're trusted for our speed, stock availability, and commitment to quality since 1956.": 'Нам доверяют за скорость, наличие на складе и приверженность качеству с 1956 года.',
        'Quick Quotes': 'Быстрые предложения',
        'Get a personalized quote within 24 hours. Fast, no-hassle response from our expert team.': 'Получите персональное предложение в течение 24 часов. Быстрый, беззаботный ответ от нашей экспертной команды.',
        'Quick Deliveries': 'Быстрые поставки',
        'Pan-India shipping with rapid dispatch. Get your parts when you need them, wherever you are.': 'Доставка по всей Индии с быстрой отправкой. Получите свои запчасти, когда они вам нужны, где бы вы ни находились.',
        'High Quality Parts': 'Высококачественные запчасти',
        'OEM and premium replacement parts for all major brands. Quality you can trust, every time.': 'OEM и премиальные запасные части для всех основных брендов. Качество, которому можно доверять каждый раз.',
        
        # Our Journey Section
        'Our Journey Since 1956': 'Наш путь с 1956 года',
        "We've earned over 70 years of trust by supporting India's growth through quality parts.": 'Мы заслужили более 70 лет доверия, поддерживая рост Индии качественными запчастями.',
        'Founded in Mumbai': 'Основана в Мумбаи',
        "Serving the first generation of India's heavy equipment industry.": 'Обслуживание первого поколения тяжелой промышленности Индии.',
        'Expansion Nationwide': 'Расширение по всей стране',
        'Supplying parts to major mining and construction projects across India.': 'Поставка запчастей для крупных горнодобывающих и строительных проектов по всей Индии.',
        'Global Partnerships': 'Глобальные партнерства',
        'Partnering with world-class brands and expanding our inventory to over 5,000 SKUs.': 'Партнерство с мировыми брендами и расширение нашего ассортимента до более чем 5000 SKU.',
        'Trusted Industry Leader': 'Доверенный лидер отрасли',
        'Serving 1000+ clients with rapid response, technical expertise, and a legacy of trust.': 'Обслуживание более 1000 клиентов с быстрым реагированием, технической экспертизой и наследием доверия.',
        
        # FAQ Section
        'Frequently Asked Questions': 'Часто задаваемые вопросы',
        'We answer common queries about our': 'Мы отвечаем на общие вопросы о наших',
        'products, delivery': 'продуктах, доставке',
        'and sourcing capabilities': 'и возможностях закупок',
        'What does Parts Trading Company do?': 'Что делает компания Parts Trading?',
        'Where are you located?': 'Где вы находитесь?',
        'How long have you been in business?': 'Как давно вы в бизнесе?',
        'Do you supply spare parts for all major truck and equipment brands?': 'Поставляете ли вы запчасти для всех основных брендов грузовиков и оборудования?',
        'Do you offer both OEM and aftermarket parts?': 'Предлагаете ли вы как OEM, так и запасные части?',
        'Are the parts available in ready stock?': 'Доступны ли запчасти на складе?',
        'Can you help source rare or discontinued parts?': 'Можете ли вы помочь найти редкие или снятые с производства запчасти?',
        'How can I request a quote?': 'Как я могу запросить предложение?',
        'Do you offer delivery across India?': 'Предлагаете ли вы доставку по всей Индии?',
        'What premium component brands do you supply?': 'Какие премиальные бренды компонентов вы поставляете?',
        'What types of heavy equipment and machinery do you supply parts for?': 'Для каких типов тяжелого оборудования и машин вы поставляете запчасти?',
        
        # FAQ Answers
        'Parts Trading Company is India': 'Компания Parts Trading является',
        "'s leading importer and distributor of OEM and high-quality aftermarket spare parts for heavy-duty trucks, construction equipment, and mining machinery. We've been serving the industry since 1956.": 'ведущим импортером и дистрибьютором OEM и высококачественных запасных частей для тяжелых грузовиков, строительного оборудования и горнодобывающей техники в Индии. Мы обслуживаем отрасль с 1956 года.',
        'Our head office is located at': 'Наш главный офис находится по адресу',
        '. We supply parts across India and also support export requirements upon request.': '. Мы поставляем запчасти по всей Индии и также поддерживаем экспортные требования по запросу.',
        "We've been operational since 1956 with over 70 years of expertise in heavy equipment and commercial vehicle spares.": 'Мы работаем с 1956 года с более чем 70-летним опытом в запчастях для тяжелого оборудования и коммерческих транспортных средств.',
        
        # Contact Section
        'Contact Information': 'Контактная информация',
        'Landline': 'Стационарный телефон',
        'Mobile': 'Мобильный телефон',
        'Email': 'Электронная почта',
        'Address': 'Адрес',
        'Save Contact': 'Сохранить контакт',
        'Find Us on Google Maps': 'Найдите нас на Google Maps',
        'Click to open in Google Maps': 'Нажмите, чтобы открыть в Google Maps',
        'Open in Google Maps': 'Открыть в Google Maps',
        
        # Exit Modal
        'Before You Leave': 'Прежде чем уйти',
        'Exclusive 2% Discount': 'Эксклюзивная скидка 2%',
        "As a valued visitor, you're eligible for an exclusive 2% discount on your first quote.": 'Как ценный посетитель, вы имеете право на эксклюзивную скидку 2% на ваше первое предложение.',
        'Parts Trading Company is a trusted supplier of OEM and high-quality replacement parts for Volvo, Scania, Komatsu, Caterpillar, and other major brands - with 95% of parts available in ready stock for immediate dispatch across India.': 'Компания Parts Trading является надежным поставщиком OEM и высококачественных запасных частей для Volvo, Scania, Komatsu, Caterpillar и других основных брендов - с 95% запчастей, доступных на складе для немедленной отправки по всей Индии.',
        'Contact Us': 'Связаться с нами',
        
        # Footer
        '© Parts Trading Company. All rights reserved.': '© Компания Parts Trading. Все права защищены.',
        'Disclaimer: All brand names, logos, images, and part numbers used on this website are for identification and reference purposes only. Parts Trading Company is not affiliated with any original equipment manufacturers (OEMs) unless specifically stated. We offer a range of products that may include genuine OEM parts or compatible high-quality aftermarket alternatives, based on availability and customer requirements.': 'Отказ от ответственности: Все названия брендов, логотипы, изображения и номера деталей, используемые на этом веб-сайте, предназначены только для целей идентификации и справки. Компания Parts Trading не связана с какими-либо производителями оригинального оборудования (OEM), если это не указано специально. Мы предлагаем ряд продуктов, которые могут включать подлинные OEM-детали или совместимые высококачественные альтернативы послепродажного обслуживания, в зависимости от наличия и требований клиентов.'
    }
    
    # Apply translations
    for english, russian in translations.items():
        content = content.replace(english, russian)
    
    # Write to Russian homepage
    with open('ru/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Comprehensive Russian translation completed!")

if __name__ == "__main__":
    translate_russian_homepage()
