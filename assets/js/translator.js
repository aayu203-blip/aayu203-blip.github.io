// translator.js
// Client-side translation engine for Ghost Internationalization (Option 1)

const DICTIONARY = {
    'es': {
        "Parts Trading Company": "Compañía de Comercio de Partes",
        "HOME": "INICIO",
        "BRANDS": "MARCAS",
        "PRODUCTS": "PRODUCTOS",
        "FAQ": "PREGUNTAS FRECUENTES",
        "CONTACT": "CONTACTO",
        "Get Your Quote": "Obtén tu Cotización",
        "Search Parts": "Buscar Partes",
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
        "Request Quote": "Solicitar Cotización",
        "Contact Information": "Información de Contacto",
        "Compatible with": "Compatible con"
    },
    'fr': {
        "Parts Trading Company": "Société de Commerce de Pièces",
        "HOME": "ACCUEIL",
        "BRANDS": "MARQUES",
        "PRODUCTS": "PRODUITS",
        "FAQ": "FAQ",
        "CONTACT": "CONTACT",
        "Get Your Quote": "Obtenez votre devis",
        "Search Parts": "Rechercher des pièces",
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
        "Request Quote": "Demander un devis",
        "Contact Information": "Informations de contact",
        "Compatible with": "Compatible avec"
    },
    'ru': {
        "Parts Trading Company": "Компания Parts Trading",
        "HOME": "ГЛАВНАЯ",
        "BRANDS": "БРЕНДЫ",
        "PRODUCTS": "ПРОДУКТЫ",
        "FAQ": "ЧАВО",
        "CONTACT": "КОНТАКТЫ",
        "Get Your Quote": "Получить предложение",
        "Search Parts": "Найти запчасти",
        "Product Categories": "Категории продуктов",
        "Engine Components": "Компоненты двигателя",
        "Fuel System Components": "Компоненты топливной системы",
        "Braking System Components": "Компоненты тормозной системы",
        "Transmission & Differential": "Трансмиссия и дифференциал",
        "Hydraulic Systems": "Гидравлические системы",
        "Compressed Air Systems": "Системы сжатого воздуха",
        "Air & Fluid Filtration": "Фильтрация воздуха и жидкости",
        "Steering & Suspension": "Рулевое управление и подвеска",
        "Lighting & Exterior": "Освещение и экстерьер",
        "Fasteners & Hardware": "Крепежи и оборудование",
        "Request Quote": "Запросить цену",
        "Contact Information": "Контактная информация",
        "Compatible with": "Совместимо с"
    },
    'ar': {
        "Parts Trading Company": "شركة تداول قطع الغيار",
        "HOME": "الرئيسية",
        "BRANDS": "العلامات التجارية",
        "PRODUCTS": "المنتجات",
        "FAQ": "الأسئلة الشائعة",
        "CONTACT": "اتصل بنا",
        "Get Your Quote": "احصل على عرض السعر",
        "Search Parts": "البحث عن قطع الغيار",
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
        "Request Quote": "طلب تسعيرة",
        "Contact Information": "معلومات الاتصال",
        "Compatible with": "متوافق مع"
    },
    'hi': {
        "Parts Trading Company": "पार्ट्स ट्रेडिंग कंपनी",
        "HOME": "होम",
        "BRANDS": "ब्रांड्स",
        "PRODUCTS": "उत्पाद",
        "FAQ": "सामान्य प्रश्न",
        "CONTACT": "संपर्क",
        "Get Your Quote": "अपना कोटेशन प्राप्त करें",
        "Search Parts": "पार्ट्स खोजें",
        "Product Categories": "उत्पाद श्रेणियां",
        "Engine Components": "इंजन कंपोनेंट्स",
        "Fuel System Components": "ईंधन प्रणाली कंपोनेंट्स",
        "Braking System Components": "ब्रेकिंग सिस्टम कंपोनेंट्स",
        "Transmission & Differential": "ट्रांसमिशन और डिफरेंशियल",
        "Hydraulic Systems": "हाइड्रोलिक सिस्टम",
        "Compressed Air Systems": "संपीड़ित वायु प्रणाली",
        "Air & Fluid Filtration": "वायु और तरल फ़िल्टरेशन",
        "Steering & Suspension": "स्टीयरिंग और सस्पेंशन",
        "Lighting & Exterior": "प्रकाश व बाहरी",
        "Fasteners & Hardware": "फास्टनर्स और हार्डवेयर",
        "Request Quote": "कोटेशन अनुरोध करें",
        "Contact Information": "संपर्क जानकारी",
        "Compatible with": "के साथ संगत"
    },
    'cn': {
        "Parts Trading Company": "零部件贸易公司",
        "HOME": "主页",
        "BRANDS": "品牌",
        "PRODUCTS": "产品",
        "FAQ": "常见问题",
        "CONTACT": "联系我们",
        "Get Your Quote": "获取报价",
        "Search Parts": "搜索零件",
        "Product Categories": "产品类别",
        "Engine Components": "发动机部件",
        "Fuel System Components": "燃油系统部件",
        "Braking System Components": "制动系统部件",
        "Transmission & Differential": "变速器和差速器",
        "Hydraulic Systems": "液压系统",
        "Compressed Air Systems": "压缩空气系统",
        "Air & Fluid Filtration": "空气和流体过滤",
        "Steering & Suspension": "转向和悬挂",
        "Lighting & Exterior": "照明和外部",
        "Fasteners & Hardware": "紧固件和五金",
        "Request Quote": "请求报价",
        "Contact Information": "联系信息",
        "Compatible with": "兼容"
    },
    'id': {
        "Parts Trading Company": "Perusahaan Perdagangan Suku Cadang",
        "HOME": "BERANDA",
        "BRANDS": "MEREK",
        "PRODUCTS": "PRODUK",
        "FAQ": "FAQ",
        "CONTACT": "KONTAK",
        "Get Your Quote": "Dapatkan Penawaran",
        "Search Parts": "Cari Suku Cadang",
        "Product Categories": "Kategori Produk",
        "Request Quote": "Minta Penawaran",
        "Contact Information": "Informasi Kontak",
        "Compatible with": "Kompatibel dengan"
    }
    // Add other languages as needed...
};

// Fallbacks for languages without full dictionaries
['te', 'ml', 'ta', 'kn'].forEach(lang => {
    if(!DICTIONARY[lang]) DICTIONARY[lang] = DICTIONARY['en'] || {};
});

async function bootInternationalization() {
    try {
        // 1. Identify Language and Target Page
        const pathParts = window.location.pathname.split('/').filter(p => p.length > 0);
        
        // Example path: /es/pages/products/aftermarket-cat-123.html
        if (pathParts.length < 3) return; // Not a translatable product page structure
        
        const lang = pathParts[0]; // e.g. "es"
        
        // Restitch the english path (remove the lang prefix)
        // Original: /es/pages/products/abc.html -> /pages/products/abc.html
        const englishPath = '/' + pathParts.slice(1).join('/');
        
        // 2. Fetch English Layout
        const response = await fetch(englishPath);
        if(!response.ok) {
            console.error("Failed to load english template");
            document.body.innerHTML = "<div style='text-align:center; padding:10%; font-family:sans-serif'>Error loading product data.</div>";
            return;
        }
        const html = await response.text();
        
        // 3. Extract the English <body>
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // We preserve our own <head> (SEO tags), but replace the <body>
        document.body.className = doc.body.className;
        document.body.innerHTML = doc.body.innerHTML;
        
        // 4. Translate DOM Text Nodes
        applyTranslations(lang);
        
        // 5. Re-execute Scripts to bind AlpineJS and Modals
        rehydrateScripts();
        
    } catch(err) {
        console.error("Router Error:", err);
    }
}

function applyTranslations(lang) {
    const dict = DICTIONARY[lang];
    if (!dict) return; // No dictionary for this language
    
    // Sort keys by length descending to prevent partial replacements
    const engKeys = Object.keys(dict).sort((a,b) => b.length - a.length);
    if(engKeys.length === 0) return;
    
    // Walk over all text nodes in the body
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while((node = walker.nextNode())) {
        let text = node.nodeValue;
        if(text.trim().length > 0) {
            let modified = false;
            for(let key of engKeys) {
                if(text.includes(key)) {
                    // Quick replace
                    text = text.split(key).join(dict[key]);
                    modified = true;
                }
            }
            if(modified) {
                node.nodeValue = text;
            }
        }
    }
}

function rehydrateScripts() {
    // Because innerHTML does not execute <script> tags, we must re-insert them manually
    const scripts = document.body.querySelectorAll('script');
    scripts.forEach(oldScript => {
        // Don't rehydrate AlpineJS from CDN if already in head, but usually it's in head
        if(oldScript.src && oldScript.src.includes('translator.js')) return;
        
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

// Start engine Let's go!
document.addEventListener('DOMContentLoaded', bootInternationalization);

// ── PTC Shared Components Auto-Loader ────────────────────────────────────────
(function() {
  if (document.getElementById('ptc-components-loaded')) return;
  var s = document.createElement('script');
  s.id = 'ptc-components-loaded';
  s.src = '/assets/js/ptc-components.js';
  s.defer = true;
  (document.head || document.documentElement).appendChild(s);
})();
