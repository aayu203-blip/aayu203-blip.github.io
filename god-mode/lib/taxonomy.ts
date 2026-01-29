
export type ModelCategory = Record<string, string[]>;
export type Catalog = Record<string, ModelCategory>;

export const MACHINE_CATALOG: Catalog = {
    "volvo": {
        "Trucks & Heavy Vehicles": [
            "FH12", "FH13", "FH16", "FH400", "FH440", "FH460", "FH480", "FH500", "FH520", "FH540",
            "FM9", "FM10", "FM12", "FM13", "FM340", "FM370", "FM400", "FM410", "FM440", "FM460", "FM480",
            "FMX330", "FMX370", "FMX410", "FMX440", "FMX460", "FMX480", "FMX500", "FMX540"
        ],
        "Excavators": [
            "EC140", "EC210", "EC240", "EC290", "EC330", "EC360", "EC460", "EC480", "EC700"
        ],
        "Wheel Loaders": [
            "L60", "L90", "L110", "L120", "L150", "L180", "L220", "L350"
        ],
        "Articulated Haulers": [
            "A25", "A30", "A35", "A40", "A45", "A60"
        ]
    },
    "scania": {
        "P-Series (Distribution)": [
            "P230", "P250", "P280", "P310", "P320", "P340", "P360", "P370", "P380", "P400", "P410", "P420", "P440", "P450", "P460", "P480", "P500"
        ],
        "G-Series (Long Haul)": [
            "G340", "G360", "G370", "G380", "G400", "G410", "G420", "G440", "G450", "G460", "G480", "G500"
        ],
        "R-Series (Broad Haul)": [
            "R340", "R360", "R370", "R380", "R400", "R410", "R420", "R440", "R450", "R460", "R480", "R500", "R520", "R540", "R580", "R620", "R650", "R730", "R770"
        ],
        "S-Series & XT": [
            "S500", "S520", "S540", "S580", "S650", "S730", "S770",
            "G410 XT", "G450 XT", "P410 XT", "P440 XT"
        ]
    },
    "komatsu": {
        "Dump Trucks": [
            "HD465-7", "HD465-8", "HD605-7", "HD605-8", "HD785-5", "HD785-7", "HD1500-7", "HD1500-8",
            "HM300-3", "HM400-3", "HM400-5"
        ],
        "Bulldozers": [
            "D37", "D39", "D51", "D61", "D65E-12", "D65EX-15", "D65PX-15", "D85ESS-2", "D85EX-15", "D85PX-15",
            "D155A-6", "D155AX-6", "D275A-5", "D375A-5", "D475A-5"
        ],
        "Motor Graders": [
            "GD555-3", "GD605A-4", "GD655-3", "GD675-3", "GD705A-4", "GD825A-2", "GD785-5"
        ],
        "Excavators": [
            "PC200", "PC210", "PC220", "PC290", "PC350", "PC390", "PC450", "PC490", "PC750", "PC800", "PC850"
        ],
        "Wheel Loaders": [
            "WA320", "WA380", "WA470", "WA500", "WA600", "WA700", "WA900"
        ]
    },
    "caterpillar": {
        "Off-Highway Trucks": [
            "770", "772", "773E", "773F", "775E", "775F", "777C", "777D", "777E", "777F", "777G",
            "785C", "785D", "789C", "789D", "793C", "793D", "793F", "797F",
            "725", "730", "735", "740", "745"
        ],
        "Wheel Dozers & Graders": [
            "814F", "824C", "834G", "844",
            "120H", "120M", "12H", "12M", "140H", "140M", "14H", "14M", "160H", "160M", "16H", "16M", "24H", "24M"
        ],
        "Excavators": [
            "312", "315", "318", "320", "321", "323", "325", "329", "330", "336", "340", "345", "349", "365", "374", "385", "390",
            "6015", "6018", "6020", "6030"
        ],
        "Wheel Loaders": [
            "924", "930", "938", "950", "962", "966", "972", "980", "988", "990", "992", "993", "994"
        ],
        "Compactors": [
            "815F", "816F", "825C", "826C", "1035N", "2021D", "2021E"
        ]
    },
    "beml": {
        "Excavators": [
            "BE100", "BE110", "BE200", "BE220", "BE300", "BE600", "BE650", "BE660", "BE700", "BE750", "BE1000", "BE1400"
        ],
        "Bulldozers": [
            "BD50", "BD50T", "BD80", "BD110", "BD155", "BD260"
        ],
        "Dump Trucks": [
            "BH35", "BH50", "BH60", "BH75", "BH85", "BH120", "BH170"
        ],
        "Wheel Loaders": [
            "Bl520", "BL530", "BL750", "WL30", "WL40", "WL50"
        ],
        "Motor Graders": [
            "BG555", "BG605", "BG685", "BG698", "BG705"
        ]
    },
    "hyundai": {
        "Excavators": [
            "R55", "R80", "R110", "R130", "R150", "R170", "R200", "R220", "R250", "R300", "R350", "R450"
        ],
        "Wheel Loaders": [
            "HL730", "HL740", "HL750", "HL760"
        ],
        "Forklifts": [
            "15BF-7", "20BF-7", "25BF-7", "30BF-7"
        ]
    },
    "sany": {
        "Excavators": [
            "SY55", "SY75", "SY95", "SY135", "SY155", "SY195", "SY235", "SY265", "SY305", "SY365", "SY425", "SY485"
        ],
        "Cranes & Piling": [
            "SCC400", "SCC500", "SCC800", "SCC1000",
            "SR150", "SR200", "SR250"
        ]
    },
    "hitachi": {
        "Excavators": [
            "ZX55", "ZX75", "ZX95", "ZX135", "ZX155", "ZX200", "ZX250", "ZX300", "ZX350", "ZX450", "ZX500"
        ],
        "Mining": [
            "EX1200", "EX1900", "EX2500"
        ],
        "Wheel Loaders": [
            "ZW150", "ZW180", "ZW220", "ZW250"
        ]
    },
    "liugong": {
        "Excavators": [
            "906", "915", "925", "936", "946", "956", "966", "976"
        ],
        "Wheel Loaders": [
            "835", "855", "856", "877"
        ],
        "Bulldozers": [
            "D31", "D41", "D51"
        ]
    },
    "mait": {
        "Excavators": [
            "ME55", "ME75", "ME95", "ME135", "ME155", "ME200", "ME250"
        ],
        "Wheel Loaders": [
            "ML730", "ML740", "ML750"
        ],
        "Compactors": [
            "MC110", "MC130"
        ]
    },
    "soilmec": {
        "Piling Rigs": [
            "SR30", "SR40", "SR50", "SR60", "SR80", "SR100"
        ],
        "Drilling": [
            "R416", "R625", "R825", "CM20", "CM30"
        ]
    }
};
