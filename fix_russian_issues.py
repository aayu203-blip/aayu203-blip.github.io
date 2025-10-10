#!/usr/bin/env python3

def fix_russian_issues():
    # Read the Russian homepage
    with open('ru/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix video path for Russian homepage
    content = content.replace('src="PTC Hero Video.mp4"', 'src="../PTC Hero Video.mp4"')
    
    # Fix remaining English content in Russian homepage
    remaining_translations = {
        # Fix footer address
        '1st Floor, Компания Parts Trading,<br>\n                                    Vijay Chambers, opp. Dreamland Cinema,<br>\n                                    Grant Road, Mumbai, Maharashtra 400004': '1-й этаж, Компания Parts Trading,<br>\n                                    Vijay Chambers, напротив Dreamland Cinema,<br>\n                                    Grant Road, Мумбаи, Махараштра 400004',
        
        # Fix any remaining English titles
        'Find Us on Google Maps': 'Найдите нас на Google Maps',
        'Click to open in Google Maps': 'Нажмите, чтобы открыть в Google Maps',
        'Open in Google Maps': 'Открыть в Google Maps',
        
        # Fix any remaining English in FAQ answers
        'Our head office is located at': 'Наш главный офис находится по адресу',
        '. We supply parts across India and also support export requirements upon request.': '. Мы поставляем запчасти по всей Индии и также поддерживаем экспортные требования по запросу.',
        
        # Fix any remaining English in exit modal
        'Before You Leave': 'Прежде чем уйти',
        'Exclusive 2% Discount': 'Эксклюзивная скидка 2%',
        "As a valued visitor, you're eligible for an exclusive 2% discount on your first quote.": 'Как ценный посетитель, вы имеете право на эксклюзивную скидку 2% на ваше первое предложение.',
        'Contact Us': 'Связаться с нами',
        
        # Fix footer disclaimer
        '© Parts Trading Company. All rights reserved.': '© Компания Parts Trading. Все права защищены.',
        'Disclaimer: All brand names, logos, images, and part numbers used on this website are for identification and reference purposes only. Parts Trading Company is not affiliated with any original equipment manufacturers (OEMs) unless specifically stated. We offer a range of products that may include genuine OEM parts or compatible high-quality aftermarket alternatives, based on availability and customer requirements.': 'Отказ от ответственности: Все названия брендов, логотипы, изображения и номера деталей, используемые на этом веб-сайте, предназначены только для целей идентификации и справки. Компания Parts Trading не связана с какими-либо производителями оригинального оборудования (OEM), если это не указано специально. Мы предлагаем ряд продуктов, которые могут включать подлинные OEM-детали или совместимые высококачественные альтернативы послепродажного обслуживания, в зависимости от наличия и требований клиентов.'
    }
    
    # Apply translations
    for english, russian in remaining_translations.items():
        content = content.replace(english, russian)
    
    # Write back to file
    with open('ru/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Russian issues fixed!")

if __name__ == "__main__":
    fix_russian_issues()






