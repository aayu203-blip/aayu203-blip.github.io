#!/usr/bin/env python3
"""
Fix the live Scania categories page - replace Russian content with English
"""

import re

def fix_scania_page():
    """Replace the Scania categories page with English content"""
    
    # Read the current file
    with open('pages/scania-categories.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace Russian content with English
    replacements = {
        'lang="ar"': 'lang="en"',
        'Категории запчастей Scania | Компания Parts Trading | Ведущий в Индии Scania Parts Supplier': 'Scania Spare Parts Categories - Parts Trading Company | Engine, Brake, Transmission Parts',
        'Просмотр полного Scania каталога запчастей. Детали двигателя, тормоза, трансмиссия, фильтры, гидравлика и многое другое. Более 5000 запчастей на складе. Быстрая доставка по всей Индии. WhatsApp: +91-98210-37990': 'Complete Scania spare parts catalog with 5000+ parts in stock. Engine components, brake systems, transmission parts, filters, hydraulics. Fast shipping worldwide. Expert support. WhatsApp: +91-98210-37990',
        'Компоненты двигателя': 'Engine Components',
        'Компоненты топливной системы': 'Fuel System Components', 
        'Компоненты трансмиссии и дифференциала': 'Transmission & Differential Components',
        'Компоненты тормозной системы': 'Braking System Components',
        'Детали рулевого управления и подвески': 'Steering & Suspension Components',
        'Гидравлические системы и соединители': 'Hydraulic Systems & Connectors',
        'Системы фильтрации воздуха и жидкости': 'Air & Fluid Filtration Systems',
        'Осветительные и внешние кузовные компоненты': 'Lighting & Exterior Body Components',
        'Крепежные элементы, оборудование и аксессуары': 'Fasteners, Hardware & Accessories',
        'Посмотреть продукты →': 'View Products →',
        'Контактная информация': 'Contact Information',
        'Стационарный телефон': 'Landline',
        'Мобильный телефон': 'Mobile',
        'Электронная почта': 'Email',
        'Адрес': 'Address',
        'Сохранить контакт': 'Save Contact',
        'Найдите нас на Google Maps': 'Find Us on Google Maps',
        'Открыть в Google Maps': 'Open in Google Maps',
        'Компания Parts Trading': 'Parts Trading Company'
    }
    
    for russian, english in replacements.items():
        content = content.replace(russian, english)
    
    # Write the fixed content back
    with open('pages/scania-categories.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Scania categories page fixed - converted to English")

if __name__ == "__main__":
    fix_scania_page()





