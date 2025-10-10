#!/usr/bin/env python3
"""
Complete fix for all international product pages - proper HTML structure, translations, and WhatsApp messages.
"""

import os
import glob
import re

# Complete translation mappings for all languages
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
        'whatsapp_message': 'Привет! Я заинтересован в запасных частях. Пожалуйста, предоставьте цену и наличие.',
        'description': 'Купить кольцо зацепления (Номер детали: 1521878) для компонентов двигателя. Совместимо с моделями Volvo. В наличии - Быстрая доставка по всей Индии - WhatsApp: +91-98210-37990',
        'keywords': 'Volvo Резиновая пружина, 1521878, детали подвески рулевого управления Volvo, запасные части Volvo Индия, детали тяжелого оборудования, детали грузовиков, запасные части Volvo, запасные части Scania, запасные части Komatsu, запасные части CAT, запасные части Hitachi, запасные части Kobelco, послепродажные части Volvo, послепродажные части Scania, послепродажные части Komatsu, послепродажные части CAT, послепродажные части Hitachi, послепродажные части Kobelco'
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
        'whatsapp_message': 'Bonjour! Je suis intéressé par des pièces de rechange. Veuillez fournir un devis et la disponibilité.',
        'description': 'Acheter bague d\'engagement (Numéro de pièce: 1521878) pour composants du moteur. Compatible avec les modèles Volvo. En stock - Livraison rapide dans toute l\'Inde - WhatsApp: +91-98210-37990',
        'keywords': 'Ressort en caoutchouc Volvo, 1521878, pièces de suspension de direction Volvo, pièces de rechange Volvo Inde, pièces d\'équipement lourd, pièces de camion, pièces de rechange Volvo, pièces de rechange Scania, pièces de rechange Komatsu, pièces de rechange CAT, pièces de rechange Hitachi, pièces de rechange Kobelco, pièces après-vente Volvo, pièces après-vente Scania, pièces après-vente Komatsu, pièces après-vente CAT, pièces après-vente Hitachi, pièces après-vente Kobelco'
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
        'whatsapp_message': '您好！我对备件感兴趣。请提供报价和库存情况。',
        'description': '购买接合环（零件号：1521878）用于发动机组件。与沃尔沃型号兼容。有库存 - 印度全境快速配送 - WhatsApp: +91-98210-37990',
        'keywords': '沃尔沃橡胶弹簧, 1521878, 沃尔沃转向悬架零件, 沃尔沃备件印度, 重型设备零件, 卡车零件, 沃尔沃替换零件, 斯堪尼亚替换零件, 小松替换零件, CAT替换零件, 日立替换零件, 神钢替换零件, 沃尔沃售后零件, 斯堪尼亚售后零件, 小松售后零件, CAT售后零件, 日立售后零件, 神钢售后零件'
    },
    'ar': {
        'company_name': 'شركة تداول قطع الغيار',
        'engine_components': 'مكونات المحرك',
        'home': 'الرئيسية',
        'brands': 'العلامات التجارية',
        'products': 'المنتجات',
        'faq': 'الأسئلة الشائعة',
        'contact': 'اتصل بنا',
        'part_number': 'رقم القطعة',
        'product_details': 'تفاصيل المنتج',
        'breadcrumb_home': 'الرئيسية',
        'breadcrumb_volvo': 'فولفو',
        'breadcrumb_engine': 'مكونات المحرك',
        'breadcrumb_engine_short': 'المحرك',
        'whatsapp_message': 'مرحباً! أنا مهتم بقطع الغيار. يرجى تقديم عرض سعر والتوفر.',
        'description': 'شراء حلقة الاشتباك (رقم القطعة: 1521878) لمكونات المحرك. متوافق مع موديلات فولفو. متوفر - توصيل سريع في جميع أنحاء الهند - واتساب: +91-98210-37990',
        'keywords': 'فولفو نابض مطاطي, 1521878, قطع تعليق التوجيه فولفو, قطع غيار فولفو الهند, قطع المعدات الثقيلة, قطع الشاحنات, قطع غيار فولفو, قطع غيار سكانيا, قطع غيار كوماتسو, قطع غيار كات, قطع غيار هيتاشي, قطع غيار كوبلكو, قطع ما بعد البيع فولفو, قطع ما بعد البيع سكانيا, قطع ما بعد البيع كوماتسو, قطع ما بعد البيع كات, قطع ما بعد البيع هيتاشي, قطع ما بعد البيع كوبلكو'
    },
    'es': {
        'company_name': 'Compañía Parts Trading',
        'engine_components': 'Componentes del motor',
        'home': 'Inicio',
        'brands': 'Marcas',
        'products': 'Productos',
        'faq': 'Preguntas frecuentes',
        'contact': 'Contacto',
        'part_number': 'Número de pieza',
        'product_details': 'Detalles del producto',
        'breadcrumb_home': 'Inicio',
        'breadcrumb_volvo': 'Volvo',
        'breadcrumb_engine': 'Componentes del motor',
        'breadcrumb_engine_short': 'Motor',
        'whatsapp_message': '¡Hola! Estoy interesado en repuestos. Por favor proporcione un presupuesto y disponibilidad.',
        'description': 'Comprar anillo de acoplamiento (Número de pieza: 1521878) para componentes del motor. Compatible con modelos Volvo. En stock - Entrega rápida en toda la India - WhatsApp: +91-98210-37990',
        'keywords': 'Resorte de goma Volvo, 1521878, piezas de suspensión de dirección Volvo, repuestos Volvo India, piezas de equipos pesados, piezas de camiones, repuestos Volvo, repuestos Scania, repuestos Komatsu, repuestos CAT, repuestos Hitachi, repuestos Kobelco, piezas postventa Volvo, piezas postventa Scania, piezas postventa Komatsu, piezas postventa CAT, piezas postventa Hitachi, piezas postventa Kobelco'
    },
    'kn': {
        'company_name': 'Parts Trading ಕಂಪನಿ',
        'engine_components': 'ಎಂಜಿನ್ ಘಟಕಗಳು',
        'home': 'ಮುಖಪುಟ',
        'brands': 'ಬ್ರಾಂಡ್‌ಗಳು',
        'products': 'ಉತ್ಪನ್ನಗಳು',
        'faq': 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು',
        'contact': 'ಸಂಪರ್ಕಿಸಿ',
        'part_number': 'ಭಾಗ ಸಂಖ್ಯೆ',
        'product_details': 'ಉತ್ಪನ್ನ ವಿವರಗಳು',
        'breadcrumb_home': 'ಮುಖಪುಟ',
        'breadcrumb_volvo': 'ವೋಲ್ವೋ',
        'breadcrumb_engine': 'ಎಂಜಿನ್ ಘಟಕಗಳು',
        'breadcrumb_engine_short': 'ಎಂಜಿನ್',
        'whatsapp_message': 'ನಮಸ್ಕಾರ! ನಾನು ಸ್ಪೇರ್ ಪಾರ್ಟ್‌ಗಳಲ್ಲಿ ಆಸಕ್ತಿ ಹೊಂದಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಉಲ್ಲೇಖ ಮತ್ತು ಲಭ್ಯತೆಯನ್ನು ಒದಗಿಸಿ.',
        'description': 'ಎಂಜಿನ್ ಘಟಕಗಳಿಗಾಗಿ ಎಂಗೇಜಿಂಗ್ ರಿಂಗ್ ಖರೀದಿಸಿ (ಭಾಗ ಸಂಖ್ಯೆ: 1521878). ವೋಲ್ವೋ ಮಾದರಿಗಳೊಂದಿಗೆ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತದೆ. ಸ್ಟಾಕ್‌ನಲ್ಲಿ - ಭಾರತದಾದ್ಯಂತ ವೇಗದ ವಿತರಣೆ - WhatsApp: +91-98210-37990',
        'keywords': 'ವೋಲ್ವೋ ರಬ್ಬರ್ ಸ್ಪ್ರಿಂಗ್, 1521878, ವೋಲ್ವೋ ಸ್ಟೀರಿಂಗ್ ಸಸ್ಪೆನ್ಷನ್ ಭಾಗಗಳು, ವೋಲ್ವೋ ಸ್ಪೇರ್ ಪಾರ್ಟ್‌ಗಳು ಭಾರತ, ಭಾರೀ ಉಪಕರಣಗಳ ಭಾಗಗಳು, ಟ್ರಕ್ ಭಾಗಗಳು, ವೋಲ್ವೋ ರಿಪ್ಲೇಸ್‌ಮೆಂಟ್ ಭಾಗಗಳು, ಸ್ಕಾನಿಯಾ ರಿಪ್ಲೇಸ್‌ಮೆಂಟ್ ಭಾಗಗಳು, ಕೊಮಾಟ್ಸು ರಿಪ್ಲೇಸ್‌ಮೆಂಟ್ ಭಾಗಗಳು, CAT ರಿಪ್ಲೇಸ್‌ಮೆಂಟ್ ಭಾಗಗಳು, ಹಿಟಾಚಿ ರಿಪ್ಲೇಸ್‌ಮೆಂಟ್ ಭಾಗಗಳು, ಕೊಬೆಲ್ಕೋ ರಿಪ್ಲೇಸ್‌ಮೆಂಟ್ ಭಾಗಗಳು, ವೋಲ್ವೋ ಆಫ್ಟರ್‌ಮಾರ್ಕೆಟ್ ಭಾಗಗಳು, ಸ್ಕಾನಿಯಾ ಆಫ್ಟರ್‌ಮಾರ್ಕೆಟ್ ಭಾಗಗಳು, ಕೊಮಾಟ್ಸು ಆಫ್ಟರ್‌ಮಾರ್ಕೆಟ್ ಭಾಗಗಳು, CAT ಆಫ್ಟರ್‌ಮಾರ್ಕೆಟ್ ಭಾಗಗಳು, ಹಿಟಾಚಿ ಆಫ್ಟರ್‌ಮಾರ್ಕೆಟ್ ಭಾಗಗಳು, ಕೊಬೆಲ್ಕೋ ಆಫ್ಟರ್‌ಮಾರ್ಕೆಟ್ ಭಾಗಗಳು'
    },
    'ta': {
        'company_name': 'Parts Trading நிறுவனம்',
        'engine_components': 'இயந்திர கூறுகள்',
        'home': 'முகப்பு',
        'brands': 'பிராண்டுகள்',
        'products': 'தயாரிப்புகள்',
        'faq': 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
        'contact': 'எங்களை தொடர்பு கொள்ள',
        'part_number': 'பகுதி எண்',
        'product_details': 'தயாரிப்பு விவரங்கள்',
        'breadcrumb_home': 'முகப்பு',
        'breadcrumb_volvo': 'வோல்வோ',
        'breadcrumb_engine': 'இயந்திர கூறுகள்',
        'breadcrumb_engine_short': 'இயந்திரம்',
        'whatsapp_message': 'வணக்கம்! நான் உதிரி பாகங்களில் ஆர்வமாக உள்ளேன். தயவுசெய்து மதிப்பீடு மற்றும் கிடைக்கும் தன்மையை வழங்கவும்.',
        'description': 'இயந்திர கூறுகளுக்கான ஈடுபாட்டு வளையத்தை வாங்கவும் (பகுதி எண்: 1521878). வோல்வோ மாடல்களுடன் பொருந்தக்கூடியது. பங்கு உள்ளது - இந்தியா முழுவதும் வேகமான விநியோகம் - WhatsApp: +91-98210-37990',
        'keywords': 'வோல்வோ ரப்பர் வில், 1521878, வோல்வோ ஸ்டீரிங் இடைநிறுத்த பாகங்கள், வோல்வோ உதிரி பாகங்கள் இந்தியா, கனரக உபகரணங்கள் பாகங்கள், டிரக் பாகங்கள், வோல்வோ மாற்று பாகங்கள், ஸ்கானியா மாற்று பாகங்கள், கோமட்சு மாற்று பாகங்கள், CAT மாற்று பாகங்கள், ஹிடாச்சி மாற்று பாகங்கள், கோபெல்கோ மாற்று பாகங்கள், வோல்வோ பிந்தைய சந்தை பாகங்கள், ஸ்கானியா பிந்தைய சந்தை பாகங்கள், கோமட்சு பிந்தைய சந்தை பாகங்கள், CAT பிந்தைய சந்தை பாகங்கள், ஹிடாச்சி பிந்தைய சந்தை பாகங்கள், கோபெல்கோ பிந்தைய சந்தை பாகங்கள்'
    },
    'ml': {
        'company_name': 'Parts Trading കമ്പനി',
        'engine_components': 'എഞ്ചിൻ ഘടകങ്ങൾ',
        'home': 'ഹോം',
        'brands': 'ബ്രാൻഡുകൾ',
        'products': 'ഉത്പന്നങ്ങൾ',
        'faq': 'പതിവ് ചോദ്യങ്ങൾ',
        'contact': 'ബന്ധപ്പെടുക',
        'part_number': 'ഭാഗ നമ്പർ',
        'product_details': 'ഉത്പന്ന വിശദാംശങ്ങൾ',
        'breadcrumb_home': 'ഹോം',
        'breadcrumb_volvo': 'വോൾവോ',
        'breadcrumb_engine': 'എഞ്ചിൻ ഘടകങ്ങൾ',
        'breadcrumb_engine_short': 'എഞ്ചിൻ',
        'whatsapp_message': 'നമസ്കാരം! ഞാൻ സ്പെയർ പാർട്ടുകളിൽ താല്പര്യമുണ്ട്. ദയവായി ഒരു ക്വോട്ടും ലഭ്യതയും നൽകുക.',
        'description': 'എഞ്ചിൻ ഘടകങ്ങൾക്കുള്ള എൻഗേജിംഗ് റിംഗ് വാങ്ങുക (ഭാഗ നമ്പർ: 1521878). വോൾവോ മോഡലുകളുമായി പൊരുത്തപ്പെടുന്നു. സ്റ്റോക്കിലുണ്ട് - ഇന്ത്യയിലുടനീളം വേഗ ഡെലിവറി - WhatsApp: +91-98210-37990',
        'keywords': 'വോൾവോ റബ്ബർ സ്പ്രിംഗ്, 1521878, വോൾവോ സ്റ്റിയറിംഗ് സസ്പെൻഷൻ ഭാഗങ്ങൾ, വോൾവോ സ്പെയർ പാർട്ടുകൾ ഇന്ത്യ, ഭാരമേറിയ ഉപകരണങ്ങളുടെ ഭാഗങ്ങൾ, ട്രക്ക് ഭാഗങ്ങൾ, വോൾവോ റിപ്ലേസ്മെന്റ് ഭാഗങ്ങൾ, സ്കാനിയ റിപ്ലേസ്മെന്റ് ഭാഗങ്ങൾ, കൊമാറ്റ്സു റിപ്ലേസ്മെന്റ് ഭാഗങ്ങൾ, CAT റിപ്ലേസ്മെന്റ് ഭാഗങ്ങൾ, ഹിറ്റാച്ചി റിപ്ലേസ്മെന്റ് ഭാഗങ്ങൾ, കൊബെൽക്കോ റിപ്ലേസ്മെന്റ് ഭാഗങ്ങൾ, വോൾവോ ആഫ്റ്റർമാർക്കറ്റ് ഭാഗങ്ങൾ, സ്കാനിയ ആഫ്റ്റർമാർക്കറ്റ് ഭാഗങ്ങൾ, കൊമാറ്റ്സു ആഫ്റ്റർമാർക്കറ്റ് ഭാഗങ്ങൾ, CAT ആഫ്റ്റർമാർക്കറ്റ് ഭാഗങ്ങൾ, ഹിറ്റാച്ചി ആഫ്റ്റർമാർക്കറ്റ് ഭാഗങ്ങൾ, കൊബെൽക്കോ ആഫ്റ്റർമാർക്കറ്റ് ഭാഗങ്ങൾ'
    },
    'te': {
        'company_name': 'Parts Trading కంపెనీ',
        'engine_components': 'ఇంజిన్ భాగాలు',
        'home': 'హోమ్',
        'brands': 'బ్రాండ్లు',
        'products': 'ఉత్పత్తులు',
        'faq': 'తరచుగా అడిగే ప్రశ్నలు',
        'contact': 'మమ్మల్ని సంప్రదించండి',
        'part_number': 'భాగ సంఖ్య',
        'product_details': 'ఉత్పత్తి వివరాలు',
        'breadcrumb_home': 'హోమ్',
        'breadcrumb_volvo': 'వోల్వో',
        'breadcrumb_engine': 'ఇంజిన్ భాగాలు',
        'breadcrumb_engine_short': 'ఇంజిన్',
        'whatsapp_message': 'నమస్కారం! నేను స్పేర్ పార్ట్స్‌లో ఆసక్తి కలిగి ఉన్నాను. దయచేసి ఒక కోట్ మరియు లభ్యతను అందించండి.',
        'description': 'ఇంజిన్ భాగాల కోసం ఎంగేజింగ్ రింగ్ కൊనండి (భాగ సంఖ్య: 1521878). వోల్వో మోడల్స్‌తో అనుకూలంగా ఉంటుంది. స్టాక్‌లో ఉంది - భారతదేశం అంతటా వేగవంతమైన డെలివరీ - WhatsApp: +91-98210-37990',
        'keywords': 'వోల్వో రబ్బర్ స్ప్రింగ్, 1521878, వోల్వో స్టీరింగ్ సస్పెన్షన్ భాగాలు, వోల్వో స్పేర్ పార్ట్స్ ఇండియా, హెవీ ఎక్విప్మెంట్ భాగాలు, ట్రక్ భాగాలు, వోల్వో రిప్లేస్మెంట్ భాగాలు, స్కానియా రిప్లేస్మెంట్ భాగాలు, కొమాట్సు రిప్లేస్మెంట్ భాగాలు, CAT రిప్లేస్మెంట్ భాగాలు, హిటాచి రిప్లేస్మెంట్ భాగాలు, కొబెల్కో రిప్లేస్మెంట్ భాగాలు, వోల్వో ఆఫ్టర్‌మార్కెట్ భాగాలు, స్కానియా ఆఫ్టర్‌మార్కెట్ భాగాలు, కొమాట్సు ఆఫ్టర్‌మార్కెట్ భాగాలు, CAT ఆఫ్టర్‌మార్కెట్ భాగాలు, హిటాచి ఆఫ్టర్‌మార్కెట్ భాగాలు, కొబెల్కో ఆఫ్టర్‌మార్కెట్ భాగాలు'
    },
    'hi': {
        'company_name': 'Parts Trading कंपनी',
        'engine_components': 'इंजन घटक',
        'home': 'होम',
        'brands': 'ब्रांड्स',
        'products': 'उत्पाद',
        'faq': 'सामान्य प्रश्न',
        'contact': 'संपर्क करें',
        'part_number': 'पार्ट नंबर',
        'product_details': 'उत्पाद विवरण',
        'breadcrumb_home': 'होम',
        'breadcrumb_volvo': 'वोल्वो',
        'breadcrumb_engine': 'इंजन घटक',
        'breadcrumb_engine_short': 'इंजन',
        'whatsapp_message': 'नमस्ते! मुझे स्पेयर पार्ट्स में रुचि है। कृपया एक कोट और उपलब्धता प्रदान करें।',
        'description': 'इंजन घटकों के लिए एंगेजिंग रिंग खरीदें (पार्ट नंबर: 1521878)। वोल्वो मॉडल्स के साथ संगत। स्टॉक में - पूरे भारत में तेज डिलीवरी - WhatsApp: +91-98210-37990',
        'keywords': 'वोल्वो रबर स्प्रिंग, 1521878, वोल्वो स्टीयरिंग सस्पेंशन पार्ट्स, वोल्वो स्पेयर पार्ट्स इंडिया, भारी उपकरण पार्ट्स, ट्रक पार्ट्स, वोल्वो रिप्लेसमेंट पार्ट्स, स्कैनिया रिप्लेसमेंट पार्ट्स, कोमात्सु रिप्लेसमेंट पार्ट्स, CAT रिप्लेसमेंट पार्ट्स, हिटाची रिप्लेसमेंट पार्ट्स, कोबेल्को रिप्लेसमेंट पार्ट्स, वोल्वो आफ्टरमार्केट पार्ट्स, स्कैनिया आफ्टरमार्केट पार्ट्स, कोमात्सु आफ्टरमार्केट पार्ट्स, CAT आफ्टरमार्केट पार्ट्स, हिटाची आफ्टरमार्केट पार्ट्स, कोबेल्को आफ्टरमार्केट पार्ट्स'
    },
    'id': {
        'company_name': 'Perusahaan Parts Trading',
        'engine_components': 'Komponen Mesin',
        'home': 'Beranda',
        'brands': 'Merek',
        'products': 'Produk',
        'faq': 'Pertanyaan Umum',
        'contact': 'Kontak',
        'part_number': 'Nomor Bagian',
        'product_details': 'Detail Produk',
        'breadcrumb_home': 'Beranda',
        'breadcrumb_volvo': 'Volvo',
        'breadcrumb_engine': 'Komponen Mesin',
        'breadcrumb_engine_short': 'Mesin',
        'whatsapp_message': 'Halo! Saya tertarik dengan suku cadang. Silakan berikan penawaran dan ketersediaan.',
        'description': 'Beli cincin pengait (Nomor Bagian: 1521878) untuk komponen mesin. Kompatibel dengan model Volvo. Tersedia - Pengiriman cepat di seluruh India - WhatsApp: +91-98210-37990',
        'keywords': 'Pegas karet Volvo, 1521878, bagian suspensi kemudi Volvo, suku cadang Volvo India, bagian peralatan berat, bagian truk, suku cadang Volvo, suku cadang Scania, suku cadang Komatsu, suku cadang CAT, suku cadang Hitachi, suku cadang Kobelco, bagian aftermarket Volvo, bagian aftermarket Scania, bagian aftermarket Komatsu, bagian aftermarket CAT, bagian aftermarket Hitachi, bagian aftermarket Kobelco'
    }
}

def get_language_from_path(file_path):
    """Extract language from file path."""
    parts = file_path.split('/')
    for part in parts:
        if part in translations:
            return part
    return 'en'

def encode_whatsapp_message(message):
    """Encode WhatsApp message for URL."""
    return message.replace(' ', '%20').replace('!', '%21').replace(',', '%2C').replace('.', '%2E').replace('؟', '%3F').replace('。', '%2E').replace('¡', '%21').replace('¿', '%3F').replace('ñ', '%C3%B1').replace('á', '%C3%A1').replace('é', '%C3%A9').replace('í', '%C3%AD').replace('ó', '%C3%B3').replace('ú', '%C3%BA').replace('ü', '%C3%BC').replace('ç', '%C3%A7').replace('ã', '%C3%A3').replace('õ', '%C3%B5').replace('à', '%C3%A0').replace('è', '%C3%A8').replace('ì', '%C3%AC').replace('ò', '%C3%B2').replace('ù', '%C3%B9')

def translate_content(content, lang):
    """Translate content based on language."""
    if lang not in translations:
        return content
    
    trans = translations[lang]
    
    # Replace company name
    content = re.sub(r'Parts Trading Company', trans['company_name'], content)
    content = re.sub(r'Parts Trading 公司', trans['company_name'], content)
    content = re.sub(r'Компания Parts Trading', trans['company_name'], content)
    content = re.sub(r'شركة تداول قطع الغيار', trans['company_name'], content)
    
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
    
    # Replace meta descriptions and keywords
    content = re.sub(r'content="Buy engaging ring \(Part No: 1521878\) for engine components\. Compatible with Volvo models\. In Stock - Fast Delivery Across India - WhatsApp: \+91-98210-37990', 
                    f'content="{trans["description"]}"', content)
    
    content = re.sub(r'content="Volvo Rubber Spring, 1521878, Volvo steering suspension parts parts, Volvo spare parts India, heavy equipment parts, truck parts, Volvo replacement parts, Scania replacement parts, Komatsu replacement parts, CAT replacement parts, Hitachi replacement parts, Kobelco replacement parts, Volvo aftermarket parts, Scania aftermarket parts, Komatsu aftermarket parts, CAT aftermarket parts, Hitachi aftermarket parts, Kobelco aftermarket parts"',
                    f'content="{trans["keywords"]}"', content)
    
    # Replace WhatsApp message - fix the entire message
    whatsapp_url_pattern = r'(https://wa\.me/919821037990\?text=)[^"]*'
    encoded_message = encode_whatsapp_message(trans['whatsapp_message'])
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
        print(f"  File already has proper structure, updating translations...")
    else:
        print(f"  Adding proper HTML structure...")
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
    languages = ['ru', 'fr', 'cn', 'ar', 'es', 'kn', 'ta', 'ml', 'te', 'hi', 'id']
    
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
    print("All international product pages have been updated with proper HTML structure and complete translations!")

if __name__ == "__main__":
    main()






