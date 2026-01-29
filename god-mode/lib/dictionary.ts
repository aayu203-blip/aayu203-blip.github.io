export type Term = {
    en: string;
    es: string;
    zh: string;
    hi: string;
    ar: string;
    id: string;
    fr: string;
    pt: string;
    ru: string;
    ja: string;
};

export const CORE_DICTIONARY: Record<string, Term> = {
    // Categories
    "Hydraulic": {
        en: "Hydraulic", es: "Hidráulico", zh: "液压", hi: "हाइड्रोलिक", ar: "هيدروليكي",
        id: "Hidrolik", fr: "Hydraulique", pt: "Hidráulico", ru: "Гидравлический", ja: "油圧"
    },
    "Engine": {
        en: "Engine", es: "Motor", zh: "发动机", hi: "इंजन", ar: "محرك",
        id: "Mesin", fr: "Moteur", pt: "Motor", ru: "Двигатель", ja: "エンジン"
    },
    "Transmission": {
        en: "Transmission", es: "Transmisión", zh: "变速箱", hi: "ट्रांसमिशन", ar: "ناقل الحركة",
        id: "Transmisi", fr: "Transmission", pt: "Transmissão", ru: "Трансмиссия", ja: "トランスミッション"
    },
    "Undercarriage": {
        en: "Undercarriage", es: "Tren de rodaje", zh: "底盘", hi: "अंडरकरेज", ar: "الهيكل السفلي",
        id: "Undercarriage", fr: "Train de roulement", pt: "Material Rodante", ru: "Ходовая часть", ja: "足回り"
    },
    "Cooling": {
        en: "Cooling", es: "Refrigeración", zh: "冷却", hi: "कूलिंग", ar: "تبريد",
        id: "Pendingin", fr: "Refroidissement", pt: "Arrefecimento", ru: "Охлаждение", ja: "冷却"
    },
    "Electrical": {
        en: "Electrical", es: "Eléctrico", zh: "电气", hi: "इलेक्ट्रिकल", ar: "كهربائي",
        id: "Kelistrikan", fr: "Électrique", pt: "Elétrico", ru: "Электрика", ja: "電気"
    },

    // Common Parts
    "Pump": {
        en: "Pump", es: "Bomba", zh: "泵", hi: "पंप", ar: "مضخة",
        id: "Pompa", fr: "Pompe", pt: "Bomba", ru: "Насос", ja: "ポンプ"
    },
    "Filter": {
        en: "Filter", es: "Filtro", zh: "滤清器", hi: "फ़िल्टर", ar: "فلتر",
        id: "Filter", fr: "Filtre", pt: "Filtro", ru: "Фильтр", ja: "フィルター"
    },
    "Valve": {
        en: "Valve", es: "Válvula", zh: "阀门", hi: "वॉल्व", ar: "صمام",
        id: "Katup", fr: "Valve", pt: "Válvula", ru: "Клапан", ja: "バルブ"
    },
    "Cylinder": {
        en: "Cylinder", es: "Cilindro", zh: "油缸", hi: "सिलेंडर", ar: "أسطوانة",
        id: "Silinder", fr: "Cylindre", pt: "Cilindro", ru: "Цилиндр", ja: "シリンダー"
    },
    "Seal Kit": {
        en: "Seal Kit", es: "Kit de Sellos", zh: "密封套件", hi: "सील किट", ar: "طقم مانع تسرب",
        id: "Kit Segel", fr: "Kit de Joints", pt: "Kit de Vedação", ru: "Ремкомплект", ja: "シールキット"
    },
    "Bearing": {
        en: "Bearing", es: "Rodamiento", zh: "轴承", hi: "बेयरिंग", ar: "محمل",
        id: "Bearing", fr: "Roulement", pt: "Rolamento", ru: "Подшипник", ja: "ベアリング"
    },
    "Gasket": {
        en: "Gasket", es: "Junta", zh: "垫片", hi: "ගاسकेट", ar: "حشية",
        id: "Gasket", fr: "Joint", pt: "Junta", ru: "Прокладка", ja: "ガスケット"
    },
    "Injector": {
        en: "Injector", es: "Inyector", zh: "喷油器", hi: "इंजेक्टर", ar: "حاقن",
        id: "Injektor", fr: "Injecteur", pt: "Injetor", ru: "Форсунка", ja: "インジェクター"
    },
    "Turbocharger": {
        en: "Turbocharger", es: "Turbocompresor", zh: "涡轮增压器", hi: "टर्बोचार्जर", ar: "شاحن توربيني",
        id: "Turbocharger", fr: "Turbocompresseur", pt: "Turbocompressor", ru: "Турбокомпрессор", ja: "ターボチャージャー"
    },
    "Alternator": {
        en: "Alternator", es: "Alternador", zh: "交流发电机", hi: "الٹرनेटर", ar: "مولد التيار البديل",
        id: "Alternator", fr: "Alternateur", pt: "Alternador", ru: "Генератор", ja: "オルタネーター"
    },
    "Starter": {
        en: "Starter", es: "Motor de Arranque", zh: "起动机", hi: "स्टार्टर", ar: "بادئ الحركة",
        id: "Starter", fr: "Démarreur", pt: "Motor de Partida", ru: "Стартер", ja: "スターター"
    },
    "Sensor": {
        en: "Sensor", es: "Sensor", zh: "传感器", hi: "सेंसर", ar: "مستشعر",
        id: "Sensor", fr: "Capteur", pt: "Sensor", ru: "Датчик", ja: "センサー"
    }
};

export function translateTerm(term: string, locale: string): string {
    // 1. Direct Match
    if (CORE_DICTIONARY[term] && (CORE_DICTIONARY[term] as any)[locale]) {
        return (CORE_DICTIONARY[term] as any)[locale];
    }

    // 2. Case Insensitive Match
    const key = Object.keys(CORE_DICTIONARY).find(k => k.toLowerCase() === term.toLowerCase());
    if (key && (CORE_DICTIONARY[key] as any)[locale]) {
        return (CORE_DICTIONARY[key] as any)[locale];
    }

    // 3. Fallback to English
    return term;
}

export function translateTitle(title: string, locale: string): string {
    if (locale === 'en') return title;

    let translatedTitle = title;

    // Replace known terms
    Object.keys(CORE_DICTIONARY).forEach(term => {
        const translation = (CORE_DICTIONARY[term] as any)[locale];
        if (translation) {
            // Regex to replace whole words, case insensitive
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            translatedTitle = translatedTitle.replace(regex, translation);
        }
    });

    return translatedTitle;
}
