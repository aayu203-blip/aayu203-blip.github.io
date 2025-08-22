#!/usr/bin/env python3
"""
Script to create all language versions of the website
"""

import os
import re
import shutil
from pathlib import Path

# Translation dictionaries for all languages
TRANSLATIONS = {
    'ar': {
        "Parts Trading Company": "شركة تداول قطع الغيار",
        "HOME": "الرئيسية",
        "BRANDS": "العلامات التجارية",
        "PRODUCTS": "المنتجات",
        "FAQ": "الأسئلة الشائعة",
        "CONTACT": "اتصل بنا",
        "Trusted Since 1956": "موثوق منذ 1956",
        "If you have": "إذا كان لديك",
        "Earthmovers,": "معدات الحفر،",
        "We have the Parts.": "لدينا قطع الغيار.",
        "WhatsApp Us": "تواصل معنا عبر واتساب",
        "Get Your Quote": "احصل على عرض السعر",
        "Explore Brands": "استكشف العلامات التجارية",
        "Parts in Inventory": "قطع الغيار في المخزون",
        "Years Experience": "سنوات الخبرة",
        "Support Available": "الدعم متاح",
        "Quality Assured": "الجودة مضمونة",
        "Quick Part Search": "البحث السريع عن قطع الغيار",
        "Search for parts by part number, brand, or description...": "ابحث عن قطع الغيار برقم القطعة أو العلامة التجارية أو الوصف...",
        "Search Parts": "البحث عن قطع الغيار",
        "Our Trusted Brands": "علاماتنا التجارية الموثوقة",
        "Product Categories": "فئات المنتجات",
        "Engine Components": "مكونات المحرك",
        "Fuel System Components": "مكونات نظام الوقود",
        "Braking System Components": "مكونات نظام الفرامل",
        "Transmission & Differential": "ناقل الحركة والتفاضل",
        "Hydraulic Systems": "الأنظمة الهيدروليكية",
        "Compressed Air Systems": "أنظمة الهواء المضغوط",
        "Air & Fluid Filtration": "ترشيح الهواء والسوائل",
        "Steering & Suspension": "التوجيه والتعليق",
        "Lighting & Exterior": "الإضاءة والخارجية",
        "Fasteners & Hardware": "المثبتات والأجهزة",
        "Frequently Asked Questions": "الأسئلة الشائعة",
        "Contact Information": "معلومات الاتصال",
        "© Parts Trading Company. All rights reserved.": "© شركة تداول قطع الغيار. جميع الحقوق محفوظة.",
        'lang="en"': 'lang="ar"',
        'dir="ltr"': 'dir="rtl"',
        'en_US': 'ar_SA',
        'https://partstrading.com/': 'https://ar.partstrading.com/',
        'https://partstrading.com': 'https://ar.partstrading.com',
        'hreflang="en"': 'hreflang="ar"',
    },
    
    'fr': {
        "Parts Trading Company": "Société de Commerce de Pièces",
        "HOME": "ACCUEIL",
        "BRANDS": "MARQUES",
        "PRODUCTS": "PRODUITS",
        "FAQ": "FAQ",
        "CONTACT": "CONTACT",
        "Trusted Since 1956": "Fait confiance depuis 1956",
        "If you have": "Si vous avez",
        "Earthmovers,": "des engins de terrassement,",
        "We have the Parts.": "Nous avons les pièces.",
        "WhatsApp Us": "WhatsApp Nous",
        "Get Your Quote": "Obtenez votre devis",
        "Explore Brands": "Explorer les marques",
        "Parts in Inventory": "Pièces en inventaire",
        "Years Experience": "Années d'expérience",
        "Support Available": "Support disponible",
        "Quality Assured": "Qualité assurée",
        "Quick Part Search": "Recherche rapide de pièces",
        "Search for parts by part number, brand, or description...": "Recherchez des pièces par numéro de pièce, marque ou description...",
        "Search Parts": "Rechercher des pièces",
        "Our Trusted Brands": "Nos marques de confiance",
        "Product Categories": "Catégories de produits",
        "Engine Components": "Composants du moteur",
        "Fuel System Components": "Composants du système de carburant",
        "Braking System Components": "Composants du système de freinage",
        "Transmission & Differential": "Transmission et différentiel",
        "Hydraulic Systems": "Systèmes hydrauliques",
        "Compressed Air Systems": "Systèmes d'air comprimé",
        "Air & Fluid Filtration": "Filtration d'air et de fluides",
        "Steering & Suspension": "Direction et suspension",
        "Lighting & Exterior": "Éclairage et extérieur",
        "Fasteners & Hardware": "Fixations et quincaillerie",
        "Frequently Asked Questions": "Questions fréquemment posées",
        "Contact Information": "Informations de contact",
        "© Parts Trading Company. All rights reserved.": "© Société de Commerce de Pièces. Tous droits réservés.",
        'lang="en"': 'lang="fr"',
        'dir="ltr"': 'dir="ltr"',
        'en_US': 'fr_FR',
        'https://partstrading.com/': 'https://fr.partstrading.com/',
        'https://partstrading.com': 'https://fr.partstrading.com',
        'hreflang="en"': 'hreflang="fr"',
    },
    
    'hi': {
        "Parts Trading Company": "पार्ट्स ट्रेडिंग कंपनी",
        "HOME": "होम",
        "BRANDS": "ब्रांड्स",
        "PRODUCTS": "उत्पाद",
        "FAQ": "सामान्य प्रश्न",
        "CONTACT": "संपर्क",
        "Trusted Since 1956": "1956 से विश्वसनीय",
        "If you have": "यदि आपके पास है",
        "Earthmovers,": "भूमि खोदने वाली मशीनें,",
        "We have the Parts.": "हमारे पास पार्ट्स हैं।",
        "WhatsApp Us": "हमें WhatsApp करें",
        "Get Your Quote": "अपना कोटेशन प्राप्त करें",
        "Explore Brands": "ब्रांड्स की खोज करें",
        "Parts in Inventory": "इन्वेंटरी में पार्ट्स",
        "Years Experience": "वर्षों का अनुभव",
        "Support Available": "समर्थन उपलब्ध",
        "Quality Assured": "गुणवत्ता की गारंटी",
        "Quick Part Search": "त्वरित पार्ट खोज",
        "Search for parts by part number, brand, or description...": "पार्ट नंबर, ब्रांड या विवरण से पार्ट्स खोजें...",
        "Search Parts": "पार्ट्स खोजें",
        "Our Trusted Brands": "हमारे विश्वसनीय ब्रांड्स",
        "Product Categories": "उत्पाद श्रेणियां",
        "Engine Components": "इंजन कंपोनेंट्स",
        "Fuel System Components": "ईंधन प्रणाली कंपोनेंट्स",
        "Braking System Components": "ब्रेकिंग सिस्टम कंपोनेंट्स",
        "Transmission & Differential": "ट्रांसमिशन और डिफरेंशियल",
        "Hydraulic Systems": "हाइड्रोलिक सिस्टम",
        "Compressed Air Systems": "संपीड़ित वायु प्रणाली",
        "Air & Fluid Filtration": "वायु और तरल फ़िल्टरेशन",
        "Steering & Suspension": "स्टीयरिंग और सस्पेंशन",
        "Lighting & Exterior": "प्रकाश व्यवस्था और बाहरी",
        "Fasteners & Hardware": "फास्टनर्स और हार्डवेयर",
        "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न",
        "Contact Information": "संपर्क जानकारी",
        "© Parts Trading Company. All rights reserved.": "© पार्ट्स ट्रेडिंग कंपनी। सर्वाधिकार सुरक्षित।",
        'lang="en"': 'lang="hi"',
        'dir="ltr"': 'dir="ltr"',
        'en_US': 'hi_IN',
        'https://partstrading.com/': 'https://hi.partstrading.com/',
        'https://partstrading.com': 'https://hi.partstrading.com',
        'hreflang="en"': 'hreflang="hi"',
    },
    
    'te': {
        "Parts Trading Company": "పార్ట్స్ ట్రేడింగ్ కంపెనీ",
        "HOME": "హోమ్",
        "BRANDS": "బ్రాండ్లు",
        "PRODUCTS": "ఉత్పత్తులు",
        "FAQ": "తరచుగా అడిగే ప్రశ్నలు",
        "CONTACT": "సంప్రదించండి",
        "Trusted Since 1956": "1956 నుండి విశ్వసనీయమైనది",
        "If you have": "మీకు ఉంటే",
        "Earthmovers,": "భూమి తవ్వే యంత్రాలు,",
        "We have the Parts.": "మాకు పార్ట్లు ఉన్నాయి.",
        "WhatsApp Us": "మమ్మల్ని WhatsApp చేయండి",
        "Get Your Quote": "మీ కోటేషన్ పొందండి",
        "Explore Brands": "బ్రాండ్లను అన్వేషించండి",
        "Parts in Inventory": "ఇన్వెంటరీలో పార్ట్లు",
        "Years Experience": "సంవత్సరాల అనుభవం",
        "Support Available": "మద్దతు అందుబాటులో",
        "Quality Assured": "నాణ్యత హామీ",
        "Quick Part Search": "వేగవంతమైన పార్ట్ శోధన",
        "Search for parts by part number, brand, or description...": "పార్ట్ నంబర్, బ్రాండ్ లేదా వివరణ ద్వారా పార్ట్లను శోధించండి...",
        "Search Parts": "పార్ట్లను శోధించండి",
        "Our Trusted Brands": "మా విశ్వసనీయ బ్రాండ్లు",
        "Product Categories": "ఉత్పత్తి వర్గాలు",
        "Engine Components": "ఇంజిన్ భాగాలు",
        "Fuel System Components": "ఇంధన వ్యవస్థ భాగాలు",
        "Braking System Components": "బ్రేకింగ్ వ్యవస్థ భాగాలు",
        "Transmission & Differential": "ట్రాన్స్మిషన్ మరియు డిఫరెన్షియల్",
        "Hydraulic Systems": "హైడ్రాలిక్ వ్యవస్థలు",
        "Compressed Air Systems": "కంప్రెస్డ్ ఎయిర్ వ్యవస్థలు",
        "Air & Fluid Filtration": "గాలి మరియు ద్రవ ఫిల్టరేషన్",
        "Steering & Suspension": "స్టీరింగ్ మరియు సస్పెన్షన్",
        "Lighting & Exterior": "లైటింగ్ మరియు బాహ్య",
        "Fasteners & Hardware": "ఫాస్టెనర్లు మరియు హార్డ్వేర్",
        "Frequently Asked Questions": "తరచుగా అడిగే ప్రశ్నలు",
        "Contact Information": "సంప్రదింపు సమాచారం",
        "© Parts Trading Company. All rights reserved.": "© పార్ట్స్ ట్రేడింగ్ కంపెనీ. అన్ని హక్కులు రక్షించబడ్డాయి.",
        'lang="en"': 'lang="te"',
        'dir="ltr"': 'dir="ltr"',
        'en_US': 'te_IN',
        'https://partstrading.com/': 'https://te.partstrading.com/',
        'https://partstrading.com': 'https://te.partstrading.com',
        'hreflang="en"': 'hreflang="te"',
    },
    
    'ml': {
        "Parts Trading Company": "പാർട്സ് ട്രേഡിംഗ് കമ്പനി",
        "HOME": "ഹോം",
        "BRANDS": "ബ്രാൻഡുകൾ",
        "PRODUCTS": "ഉത്പന്നങ്ങൾ",
        "FAQ": "പതിവ് ചോദ്യങ്ങൾ",
        "CONTACT": "ബന്ധപ്പെടുക",
        "Trusted Since 1956": "1956 മുതൽ വിശ്വസനീയമായത്",
        "If you have": "നിങ്ങൾക്ക് ഉണ്ടെങ്കിൽ",
        "Earthmovers,": "ഭൂമി കുഴിക്കുന്ന യന്ത്രങ്ങൾ,",
        "We have the Parts.": "ഞങ്ങൾക്ക് പാർട്സുകൾ ഉണ്ട്.",
        "WhatsApp Us": "ഞങ്ങളെ WhatsApp ചെയ്യുക",
        "Get Your Quote": "നിങ്ങളുടെ ക്വോട്ടേഷൻ നേടുക",
        "Explore Brands": "ബ്രാൻഡുകൾ പര്യവേക്ഷണം ചെയ്യുക",
        "Parts in Inventory": "ഇൻവെന്ററിയിലെ പാർട്സുകൾ",
        "Years Experience": "വർഷങ്ങളുടെ അനുഭവം",
        "Support Available": "പിന്തുണ ലഭ്യമാണ്",
        "Quality Assured": "ഗുണനിലവാരം ഉറപ്പാക്കി",
        "Quick Part Search": "വേഗ പാർട്ട് തിരയൽ",
        "Search for parts by part number, brand, or description...": "പാർട്ട് നമ്പർ, ബ്രാൻഡ് അല്ലെങ്കിൽ വിവരണം ഉപയോഗിച്ച് പാർട്സുകൾ തിരയുക...",
        "Search Parts": "പാർട്സുകൾ തിരയുക",
        "Our Trusted Brands": "ഞങ്ങളുടെ വിശ്വസനീയ ബ്രാൻഡുകൾ",
        "Product Categories": "ഉത്പന്ന വിഭാഗങ്ങൾ",
        "Engine Components": "എഞ്ചിൻ ഘടകങ്ങൾ",
        "Fuel System Components": "ഇന്ധന സിസ്റ്റം ഘടകങ്ങൾ",
        "Braking System Components": "ബ്രേക്കിംഗ് സിസ്റ്റം ഘടകങ്ങൾ",
        "Transmission & Differential": "ട്രാൻസ്മിഷൻ & ഡിഫറൻഷ്യൽ",
        "Hydraulic Systems": "ഹൈഡ്രോളിക് സിസ്റ്റങ്ങൾ",
        "Compressed Air Systems": "കംപ്രസ്ഡ് എയർ സിസ്റ്റങ്ങൾ",
        "Air & Fluid Filtration": "എയർ & ഫ്ലൂയിഡ് ഫിൽട്രേഷൻ",
        "Steering & Suspension": "സ്റ്റിയറിംഗ് & സസ്പെൻഷൻ",
        "Lighting & Exterior": "ലൈറ്റിംഗ് & എക്സ്റ്റീരിയർ",
        "Fasteners & Hardware": "ഫാസ്റ്റനറുകൾ & ഹാർഡ്വെയർ",
        "Frequently Asked Questions": "പതിവ് ചോദ്യങ്ങൾ",
        "Contact Information": "ബന്ധപ്പെടൽ വിവരങ്ങൾ",
        "© Parts Trading Company. All rights reserved.": "© പാർട്സ് ട്രേഡിംഗ് കമ്പനി. എല്ലാ അവകാശങ്ങളും സംരക്ഷിച്ചിരിക്കുന്നു.",
        'lang="en"': 'lang="ml"',
        'dir="ltr"': 'dir="ltr"',
        'en_US': 'ml_IN',
        'https://partstrading.com/': 'https://ml.partstrading.com/',
        'https://partstrading.com': 'https://ml.partstrading.com',
        'hreflang="en"': 'hreflang="ml"',
    },
    
    'ta': {
        "Parts Trading Company": "பார்ட்ஸ் டிரேடிங் நிறுவனம்",
        "HOME": "முகப்பு",
        "BRANDS": "பிராண்டுகள்",
        "PRODUCTS": "தயாரிப்புகள்",
        "FAQ": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
        "CONTACT": "தொடர்பு",
        "Trusted Since 1956": "1956 முதல் நம்பகமானது",
        "If you have": "உங்களிடம் இருந்தால்",
        "Earthmovers,": "பூமி அகழும் இயந்திரங்கள்,",
        "We have the Parts.": "எங்களிடம் பாகங்கள் உள்ளன.",
        "WhatsApp Us": "எங்களை WhatsApp செய்யுங்கள்",
        "Get Your Quote": "உங்கள் விலைப்புள்ளியைப் பெறுங்கள்",
        "Explore Brands": "பிராண்டுகளை ஆராயுங்கள்",
        "Parts in Inventory": "சரக்கில் உள்ள பாகங்கள்",
        "Years Experience": "ஆண்டுகளின் அனுபவம்",
        "Support Available": "ஆதரவு கிடைக்கிறது",
        "Quality Assured": "தரம் உறுதி",
        "Quick Part Search": "விரைவு பாக தேடல்",
        "Search for parts by part number, brand, or description...": "பாக எண், பிராண்டு அல்லது விளக்கத்தால் பாகங்களைத் தேடுங்கள்...",
        "Search Parts": "பாகங்களைத் தேடுங்கள்",
        "Our Trusted Brands": "எங்கள் நம்பகமான பிராண்டுகள்",
        "Product Categories": "தயாரிப்பு வகைகள்",
        "Engine Components": "இயந்திர கூறுகள்",
        "Fuel System Components": "எரிபொருள் அமைப்பு கூறுகள்",
        "Braking System Components": "பிரேக்கிங் அமைப்பு கூறுகள்",
        "Transmission & Differential": "பரிமாற்றம் & வேறுபாடு",
        "Hydraulic Systems": "ஹைட்ராலிக் அமைப்புகள்",
        "Compressed Air Systems": "அமுக்கப்பட்ட காற்று அமைப்புகள்",
        "Air & Fluid Filtration": "காற்று & திரவ வடிப்பு",
        "Steering & Suspension": "திசைமாற்றி & இடைநிறுத்தம்",
        "Lighting & Exterior": "விளக்கு & வெளிப்புறம்",
        "Fasteners & Hardware": "பிடிப்பான்கள் & வன்பொருள்",
        "Frequently Asked Questions": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
        "Contact Information": "தொடர்பு தகவல்",
        "© Parts Trading Company. All rights reserved.": "© பார்ட்ஸ் டிரேடிங் நிறுவனம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டுள்ளன.",
        'lang="en"': 'lang="ta"',
        'dir="ltr"': 'dir="ltr"',
        'en_US': 'ta_IN',
        'https://partstrading.com/': 'https://ta.partstrading.com/',
        'https://partstrading.com': 'https://ta.partstrading.com',
        'hreflang="en"': 'hreflang="ta"',
    },
    
    'kn': {
        "Parts Trading Company": "ಪಾರ್ಟ್ಸ್ ಟ್ರೇಡಿಂಗ್ ಕಂಪನಿ",
        "HOME": "ಮುಖಪುಟ",
        "BRANDS": "ಬ್ರಾಂಡ್‌ಗಳು",
        "PRODUCTS": "ಉತ್ಪನ್ನಗಳು",
        "FAQ": "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
        "CONTACT": "ಸಂಪರ್ಕಿಸಿ",
        "Trusted Since 1956": "1956 ರಿಂದ ವಿಶ್ವಾಸಾರ್ಹ",
        "If you have": "ನಿಮಗೆ ಇದ್ದರೆ",
        "Earthmovers,": "ಭೂಮಿ ತೋಡುವ ಯಂತ್ರಗಳು,",
        "We have the Parts.": "ನಮಗೆ ಪಾರ್ಟ್‌ಗಳು ಇವೆ.",
        "WhatsApp Us": "ನಮ್ಮನ್ನು WhatsApp ಮಾಡಿ",
        "Get Your Quote": "ನಿಮ್ಮ ಉಲ್ಲೇಖ ಪಡೆಯಿರಿ",
        "Explore Brands": "ಬ್ರಾಂಡ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
        "Parts in Inventory": "ಸರಕುಪಟ್ಟಿಯಲ್ಲಿ ಪಾರ್ಟ್‌ಗಳು",
        "Years Experience": "ವರ್ಷಗಳ ಅನುಭವ",
        "Support Available": "ಬೆಂಬಲ ಲಭ್ಯವಿದೆ",
        "Quality Assured": "ಗುಣಮಟ್ಟ ಖಚಿತಪಡಿಸಲಾಗಿದೆ",
        "Quick Part Search": "ತ್ವರಿತ ಪಾರ್ಟ್ ಹುಡುಕಾಟ",
        "Search for parts by part number, brand, or description...": "ಪಾರ್ಟ್ ಸಂಖ್ಯೆ, ಬ್ರಾಂಡ್ ಅಥವಾ ವಿವರಣೆಯಿಂದ ಪಾರ್ಟ್‌ಗಳನ್ನು ಹುಡುಕಿ...",
        "Search Parts": "ಪಾರ್ಟ್‌ಗಳನ್ನು ಹುಡುಕಿ",
        "Our Trusted Brands": "ನಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಬ್ರಾಂಡ್‌ಗಳು",
        "Product Categories": "ಉತ್ಪನ್ನ ವರ್ಗಗಳು",
        "Engine Components": "ಎಂಜಿನ್ ಘಟಕಗಳು",
        "Fuel System Components": "ಇಂಧನ ವ್ಯವಸ್ಥೆ ಘಟಕಗಳು",
        "Braking System Components": "ಬ್ರೇಕಿಂಗ್ ವ್ಯವಸ್ಥೆ ಘಟಕಗಳು",
        "Transmission & Differential": "ಟ್ರಾನ್ಸ್‌ಮಿಷನ್ & ಡಿಫರೆನ್ಷಿಯಲ್",
        "Hydraulic Systems": "ಹೈಡ್ರಾಲಿಕ್ ವ್ಯವಸ್ಥೆಗಳು",
        "Compressed Air Systems": "ಸಂಕುಚಿತ ಗಾಳಿ ವ್ಯವಸ್ಥೆಗಳು",
        "Air & Fluid Filtration": "ಗಾಳಿ & ದ್ರವ ಫಿಲ್ಟರೇಷನ್",
        "Steering & Suspension": "ಸ್ಟೀರಿಂಗ್ & ಸಸ್ಪೆನ್ಷನ್",
        "Lighting & Exterior": "ಬೆಳಗುವಿಕೆ & ಬಾಹ್ಯ",
        "Fasteners & Hardware": "ಫಾಸ್ಟೆನರ್‌ಗಳು & ಹಾರ್ಡ್‌ವೇರ್",
        "Frequently Asked Questions": "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
        "Contact Information": "ಸಂಪರ್ಕ ಮಾಹಿತಿ",
        "© Parts Trading Company. All rights reserved.": "© ಪಾರ್ಟ್ಸ್ ಟ್ರೇಡಿಂಗ್ ಕಂಪನಿ. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಲಾಗಿದೆ.",
        'lang="en"': 'lang="kn"',
        'dir="ltr"': 'dir="ltr"',
        'en_US': 'kn_IN',
        'https://partstrading.com/': 'https://kn.partstrading.com/',
        'https://partstrading.com': 'https://kn.partstrading.com',
        'hreflang="en"': 'hreflang="kn"',
    },
    
    'es': {
        "Parts Trading Company": "Compañía de Comercio de Partes",
        "HOME": "INICIO",
        "BRANDS": "MARCAS",
        "PRODUCTS": "PRODUCTOS",
        "FAQ": "PREGUNTAS FRECUENTES",
        "CONTACT": "CONTACTO",
        "Trusted Since 1956": "Confiado desde 1956",
        "If you have": "Si tienes",
        "Earthmovers,": "maquinaria pesada,",
        "We have the Parts.": "Tenemos las Partes.",
        "WhatsApp Us": "WhatsApp Nosotros",
        "Get Your Quote": "Obtén tu Cotización",
        "Explore Brands": "Explorar Marcas",
        "Parts in Inventory": "Partes en Inventario",
        "Years Experience": "Años de Experiencia",
        "Support Available": "Soporte Disponible",
        "Quality Assured": "Calidad Asegurada",
        "Quick Part Search": "Búsqueda Rápida de Partes",
        "Search for parts by part number, brand, or description...": "Busca partes por número de parte, marca o descripción...",
        "Search Parts": "Buscar Partes",
        "Our Trusted Brands": "Nuestras Marcas de Confianza",
        "Product Categories": "Categorías de Productos",
        "Engine Components": "Componentes del Motor",
        "Fuel System Components": "Componentes del Sistema de Combustible",
        "Braking System Components": "Componentes del Sistema de Frenos",
        "Transmission & Differential": "Transmisión y Diferencial",
        "Hydraulic Systems": "Sistemas Hidráulicos",
        "Compressed Air Systems": "Sistemas de Aire Comprimido",
        "Air & Fluid Filtration": "Filtración de Aire y Fluidos",
        "Steering & Suspension": "Dirección y Suspensión",
        "Lighting & Exterior": "Iluminación y Exterior",
        "Fasteners & Hardware": "Sujetadores y Herramientas",
        "Frequently Asked Questions": "Preguntas Frecuentes",
        "Contact Information": "Información de Contacto",
        "© Parts Trading Company. All rights reserved.": "© Compañía de Comercio de Partes. Todos los derechos reservados.",
        'lang="en"': 'lang="es"',
        'dir="ltr"': 'dir="ltr"',
        'en_US': 'es_ES',
        'https://partstrading.com/': 'https://es.partstrading.com/',
        'https://partstrading.com': 'https://es.partstrading.com',
        'hreflang="en"': 'hreflang="es"',
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
    """Main function to create all language versions"""
    print("Creating all language versions of the website...")
    
    # Get all HTML files
    html_files = get_all_html_files()
    print(f"Found {len(html_files)} HTML files to translate")
    
    # Create translations for each language
    languages = ['ar', 'fr', 'hi', 'te', 'ml', 'ta', 'kn', 'es']
    
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
    
    print("\n=== All language website creation complete! ===")
    print("Files created in the following directories:")
    for lang in languages:
        print(f"- {lang}/ (for {lang}.partstrading.com)")

if __name__ == "__main__":
    main()
