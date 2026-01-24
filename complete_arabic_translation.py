#!/usr/bin/env python3
import re

def translate_arabic_homepage():
    # Read the Arabic homepage
    with open('ar/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Comprehensive Arabic translations
    translations = {
        # FAQ Section
        'Frequently Asked Questions': 'الأسئلة الشائعة',
        'We answer common queries about our': 'نرد على الاستفسارات الشائعة حول',
        'products, delivery': 'المنتجات والتوصيل',
        'and sourcing capabilities': 'وقدرات التوريد',
        
        # FAQ Questions
        'What does Parts Trading Company do?': 'ماذا تفعل شركة تداول قطع الغيار؟',
        'Where are you located?': 'أين تقعون؟',
        'How long have you been in business?': 'منذ متى وأنتم في العمل؟',
        'Do you supply spare parts for all major truck and equipment brands?': 'هل توردون قطع غيار لجميع العلامات التجارية الرئيسية للشاحنات والمعدات؟',
        'Do you offer both OEM and aftermarket parts?': 'هل تقدمون قطع OEM وقطع ما بعد البيع؟',
        'Are the parts available in ready stock?': 'هل القطع متوفرة في المخزون الجاهز؟',
        'Can you help source rare or discontinued parts?': 'هل يمكنكم المساعدة في توريد قطع نادرة أو متوقفة؟',
        'How can I request a quote?': 'كيف يمكنني طلب عرض سعر؟',
        'Do you offer delivery across India?': 'هل تقدمون التوصيل عبر الهند؟',
        'What premium component brands do you supply?': 'ما هي العلامات التجارية المتميزة للمكونات التي توردونها؟',
        'What types of heavy equipment and machinery do you supply parts for?': 'ما أنواع المعدات الثقيلة والآلات التي توردون لها قطع غيار؟',
        
        # FAQ Answers
        'Parts Trading Company is India': 'شركة تداول قطع الغيار هي',
        "'s leading importer and distributor of OEM and high-quality aftermarket spare parts for heavy-duty trucks, construction equipment, and mining machinery. We've been serving the industry since 1956.": 'المستورد والموزع الرائد في الهند لقطع OEM وقطع الغيار عالية الجودة لما بعد البيع للشاحنات الثقيلة ومعدات البناء وآلات التعدين. نحن نخدم الصناعة منذ 1956.',
        'Our head office is located at': 'يقع مكتبنا الرئيسي في',
        '. We supply parts across India and also support export requirements upon request.': '. نورد القطع عبر الهند وندعم أيضاً متطلبات التصدير عند الطلب.',
        "We've been operational since 1956 with over 70 years of expertise in heavy equipment and commercial vehicle spares.": 'نعمل منذ 1956 مع أكثر من 70 سنة من الخبرة في قطع المعدات الثقيلة والمركبات التجارية.',
        
        # Product Categories (remaining)
        'Air & Fluid Filtration Systems': 'أنظمة ترشيح الهواء والسوائل',
        'Lighting & Exterior Body Components': 'مكونات الإضاءة والهيكل الخارجي',
        'Fasteners, Hardware & Accessories': 'المثبتات والأجهزة والملحقات',
        
        # Product Category Descriptions
        'Air filters, fluid filters, filtration systems': 'فلاتر الهواء، فلاتر السوائل، أنظمة الترشيح',
        'Lighting systems, exterior body parts, visual components': 'أنظمة الإضاءة، أجزاء الهيكل الخارجي، المكونات البصرية',
        'Fasteners, hardware components and accessories': 'المثبتات، مكونات الأجهزة والملحقات',
        
        # Why Choose Us Section
        'Why Customers Choose Us': 'لماذا يختارنا العملاء',
        "We're trusted for our speed, stock availability, and commitment to quality since 1956.": 'نحن موثوقون لسرعتنا وتوفر المخزون والتزامنا بالجودة منذ 1956.',
        'Quick Quotes': 'عروض أسعار سريعة',
        'Get a personalized quote within 24 hours. Fast, no-hassle response from our expert team.': 'احصل على عرض سعر مخصص خلال 24 ساعة. استجابة سريعة وخالية من المتاعب من فريقنا المتخصص.',
        'Quick Deliveries': 'توصيل سريع',
        'Pan-India shipping with rapid dispatch. Get your parts when you need them, wherever you are.': 'شحن عبر الهند مع إرسال سريع. احصل على قطعك عندما تحتاجها، أينما كنت.',
        'High Quality Parts': 'قطع عالية الجودة',
        'OEM and premium replacement parts for all major brands. Quality you can trust, every time.': 'قطع OEM وبدائل متميزة لجميع العلامات التجارية الرئيسية. جودة يمكنك الوثوق بها، في كل مرة.',
        
        # Our Journey Section
        'Our Journey Since 1956': 'رحلتنا منذ 1956',
        "We've earned over 70 years of trust by supporting India's growth through quality parts.": 'لقد اكتسبنا أكثر من 70 سنة من الثقة من خلال دعم نمو الهند من خلال قطع عالية الجودة.',
        'Founded in Mumbai': 'تأسست في مومباي',
        "Serving the first generation of India's heavy equipment industry.": 'نخدم الجيل الأول من صناعة المعدات الثقيلة في الهند.',
        'Expansion Nationwide': 'التوسع على مستوى البلاد',
        'Supplying parts to major mining and construction projects across India.': 'توريد قطع لمشاريع التعدين والبناء الرئيسية عبر الهند.',
        'Global Partnerships': 'شراكات عالمية',
        'Partnering with world-class brands and expanding our inventory to over 5,000 SKUs.': 'الشراكة مع علامات تجارية عالمية المستوى وتوسيع مخزوننا إلى أكثر من 5000 SKU.',
        'Trusted Industry Leader': 'قائد صناعي موثوق',
        'Serving 1000+ clients with rapid response, technical expertise, and a legacy of trust.': 'نخدم أكثر من 1000 عميل مع استجابة سريعة وخبرة تقنية وإرث من الثقة.',
        
        # Buttons and UI Elements
        'View Products →': 'عرض المنتجات →',
        'Select Brand': 'اختر العلامة التجارية',
        '← Back to category': '← العودة إلى الفئة',
        
        # Contact and other sections
        'Contact Information': 'معلومات الاتصال',
        'Landline': 'الهاتف الثابت',
        'Mobile': 'الجوال',
        'Email': 'البريد الإلكتروني',
        'Address': 'العنوان',
        'Save Contact': 'حفظ جهة الاتصال',
        'Find Us on Google Maps': 'اعثر علينا على خرائط جوجل',
        'Click to open in Google Maps': 'انقر لفتح في خرائط جوجل',
        'Open in Google Maps': 'افتح في خرائط جوجل',
        'Before You Leave': 'قبل أن تغادر',
        'Exclusive 2% Discount': 'خصم حصري 2%',
        "As a valued visitor, you're eligible for an exclusive 2% discount on your first quote.": 'كزائر محترم، أنت مؤهل للحصول على خصم حصري 2% على عرض السعر الأول.',
        'Parts Trading Company is a trusted supplier of OEM and high-quality replacement parts for Volvo, Scania, Komatsu, Caterpillar, and other major brands - with 95% of parts available in ready stock for immediate dispatch across India.': 'شركة تداول قطع الغيار هي مورد موثوق لقطع OEM وقطع الغيار عالية الجودة لـ Volvo و Scania و Komatsu و Caterpillar وغيرها من العلامات التجارية الرئيسية - مع توفر 95% من القطع في المخزون الجاهز للشحن الفوري عبر الهند.',
        'Contact Us': 'اتصل بنا',
        
        # Footer
        '© Parts Trading Company. All rights reserved.': '© شركة تداول قطع الغيار. جميع الحقوق محفوظة.',
        'Disclaimer: All brand names, logos, images, and part numbers used on this website are for identification and reference purposes only. Parts Trading Company is not affiliated with any original equipment manufacturers (OEMs) unless specifically stated. We offer a range of products that may include genuine OEM parts or compatible high-quality aftermarket alternatives, based on availability and customer requirements.': 'إخلاء المسؤولية: جميع أسماء العلامات التجارية والشعارات والصور وأرقام القطع المستخدمة في هذا الموقع هي لأغراض التعريف والمرجعية فقط. شركة تداول قطع الغيار غير مرتبطة بأي مصنعي المعدات الأصلية (OEMs) ما لم يذكر خلاف ذلك. نقدم مجموعة من المنتجات التي قد تشمل قطع OEM أصلية أو بدائل عالية الجودة متوافقة، بناءً على التوفر ومتطلبات العملاء.'
    }
    
    # Apply translations
    for english, arabic in translations.items():
        content = content.replace(english, arabic)
    
    # Write back to file
    with open('ar/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Comprehensive Arabic translation completed!")

if __name__ == "__main__":
    translate_arabic_homepage()
