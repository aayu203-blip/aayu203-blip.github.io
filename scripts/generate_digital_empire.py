import os
import re

# --- CONFIGURATION (Data from DIGITAL_EMPIRE_INTEL.md & Live Research) ---

# 1. KOMATSU ERROR CODES (Diagnostic Engine)
KOMATSU_ERRORS = [
    # --- Previously Generated ---
    {"code": "E02", "system_fault": "PC-EPC System Fault", "symptom": "Pump controller failure. Hydraulic power loss.", "cause": "Pump Controller Solenoid Valve malfunction.", "part_name": "PC-EPC Solenoid Valve", "part_number": "702-21-57400", "machines": "PC200-8 / PC300-8"},
    {"code": "E03", "system_fault": "Swing Parking Brake System Faut", "symptom": "Machine upper structure will not swing, or swings with resistance. Parking brake fails to release.", "cause": "Defective solenoid valve or open circuit in the Swing Brake release line.", "part_name": "Swing Brake Solenoid Valve", "part_number": "20Y-60-22822", "machines": "PC200-8 / PC300-8"},
    {"code": "E10", "system_fault": "Engine Power Mismatch", "symptom": "Engine stalls under load or low power output.", "cause": "Engine Speed Sensor or Fuel Supply Pump failure.", "part_name": "Engine Speed Sensor", "part_number": "7861-93-2330", "machines": "PC200-8 / PC400-8"},
    {"code": "E11", "system_fault": "Engine Control System Failure", "symptom": "Engine runs in backup mode. Check Engine Light on.", "cause": "Wiring Harness deep short or ECM communication error.", "part_name": "Engine Wiring Harness (Main)", "part_number": "6754-81-9440", "machines": "PC200-8"},
    {"code": "E15", "system_fault": "Engine Sensor Malfunction", "symptom": "Incorrect readings for oil pressure or coolant temp.", "cause": "Oil Pressure Sensor failure.", "part_name": "Oil Pressure Sensor", "part_number": "7861-93-1651", "machines": "PC200-8 / PC300-8"},
    {"code": "E108", "system_fault": "Water Temp High (Overheating)", "symptom": "Engine overheating alarm. Coolant boiling.", "cause": "Thermostat stuck closed or Water Pump impeller failure.", "part_name": "Thermostat & Water Pump Kit", "part_number": "6732-61-1620", "machines": "PC200-8 / PC300-8"},
    
    # --- NEW MASS SCALING (Top 20 Errors) ---
    {"code": "989L00", "system_fault": "Engine Controller Lock Warning", "symptom": "Engine will not start or shuts down immediately.", "cause": "ECU Lock Malfunction or Immobilizer issue.", "part_name": "Engine Controller (ECU)", "part_number": "7872-20-6401", "machines": "PC200-8"},
    {"code": "AA10NX", "system_fault": "Air Filter Clogged", "symptom": "Loss of engine power, black smoke.", "cause": "Air intake restriction.", "part_name": "Air Filter Set (Inner/Outer)", "part_number": "600-185-4100", "machines": "PC200-8 / PC300-8"},
    {"code": "AB00KE", "system_fault": "Low Charging Voltage", "symptom": "Battery light on, electrical systems failing.", "cause": "Alternator failure.", "part_name": "Alternator 60A", "part_number": "600-861-3410", "machines": "PC200-8"},
    {"code": "B@BAZG", "system_fault": "Low Oil Pressure", "symptom": "Critical engine warning. Potential catastrophic failure.", "cause": "Oil Pump failure or severe leak.", "part_name": "Oil Pump Assy", "part_number": "6735-51-1111", "machines": "PC200-8 / PC400-8"},
    {"code": "B@BCNS", "system_fault": "Engine Coolant Overheating", "symptom": "Radiator steam, gauge in red zone.", "cause": "Radiator core blockage or fan belt failure.", "part_name": "Radiator Assembly", "part_number": "20Y-03-31111", "machines": "PC200-8"},
    {"code": "B@HANS", "system_fault": "Hydraulic Oil Overheating", "symptom": "Hydraulic system sluggish, pump noise.", "cause": "Hydraulic Oil Cooler blockage.", "part_name": "Hydraulic Oil Cooler", "part_number": "20Y-03-31121", "machines": "PC200-8"},
    {"code": "CA111", "system_fault": "Engine Controller Internal Fault", "symptom": "ECU internal memory error. Engine shutdown.", "cause": "Internal ECU semiconductor failure.", "part_name": "Engine Controller (ECM)", "part_number": "600-467-1100", "machines": "PC300-8"},
    {"code": "CA115", "system_fault": "Speed Sensor Failure", "symptom": "Engine RPM erratic, backup mode active.", "cause": "Magnetic pickup sensor failure.", "part_name": "Revolution Sensor", "part_number": "7861-93-2310", "machines": "PC200-8"},
    {"code": "CA122", "system_fault": "Air Pressure Sensor High Voltage", "symptom": "Turbo boost incorrect.", "cause": "Boost pressure sensor short circuit.", "part_name": "Boost Pressure Sensor", "part_number": "6754-81-2710", "machines": "PC200-8"},
    {"code": "CA131", "system_fault": "Throttle Sensor High Error", "symptom": "Engine unresponsive to throttle dial.", "cause": "Throttle Position Sensor potentiometer failure.", "part_name": "Fuel Control Dial (Throttle)", "part_number": "7861-93-4130", "machines": "PC200-8"},
    {"code": "CA153", "system_fault": "Charge Air Temp High", "symptom": "Loss of power, high intake temp.", "cause": "Intercooler blockage or sensor failure.", "part_name": "Aftercooler / Intercooler", "part_number": "20Y-03-31130", "machines": "PC200-8"},
    {"code": "E01", "system_fault": "Automatic Modes System", "symptom": "Auto-idle not working.", "cause": "PPC Pressure Switch failure.", "part_name": "PPC Pressure Switch", "part_number": "20Y-06-21710", "machines": "PC200-8"},
    {"code": "E05", "system_fault": "Governor Motor System", "symptom": "Throttle motor stuck.", "cause": "Fuel Dial Motor failure.", "part_name": "Governor Motor", "part_number": "7861-92-4131", "machines": "PC200-7"},
    {"code": "E14", "system_fault": "Throttle System Abnormal", "symptom": "Engine speed does not match dial.", "cause": "Throttle Dial malfuction.", "part_name": "Fuel Auto-Decel Switch", "part_number": "20Y-06-24680", "machines": "PC200-8"},
]

# 2. COMPETITOR INTERCEPT (Kramp/TVH/Danfoss/Rexroth)
COMPETITOR_PARTS = [
    # --- Previously Generated ---
    {"competitor": "Kramp", "part_number": "8259249", "part_name": "Industry Project Part", "description": "Critical component for industrial machinery projects.", "tech_spec": "High Durability / OEM Spec"},
    {"competitor": "Kramp/Danfoss", "part_number": "H1P068RAAA4C1", "part_name": "Axial Piston Pump", "description": "Main hydraulic pump for heavy hydrostatic drives.", "tech_spec": "68cc Displacement / 420 bar"},
    {"competitor": "TVH", "part_number": "JOYSTICK-GENIE-1", "part_name": "Genie Lift Joystick Controller", "description": "Main control joystick for Genie layouts.", "tech_spec": "2-Axis / Deadman Switch"},
    {"competitor": "Kramp", "part_number": "731136001", "part_name": "Hydraulic Seal Kit", "description": "OEM equivalent seal kit.", "tech_spec": "Viton / NBR"},
    
    # --- NEW MASS SCALING ---
    {"competitor": "Rexroth", "part_number": "A10VSO71DFR1", "part_name": "Hydraulic Piston Pump", "description": "Variable displacement pump for open loop circuits.", "tech_spec": "Series 31 / 280 Bar Nominal"},
    {"competitor": "Danfoss", "part_number": "157B4033", "part_name": "PVEH Actuator Module", "description": "Electro-hydraulic valve actuator for PVG 32 valves.", "tech_spec": "11-32V / Standard Response"},
    {"competitor": "Kramp", "part_number": "181040A1", "part_name": "PTO Clutch Pack", "description": "Power Take-Off clutch discs for agricultural tractors.", "tech_spec": "Sintered Bronze / High Friction"},
    {"competitor": "TVH", "part_number": "1600274", "part_name": "JLG Joystick Controller", "description": "Drive/Steer Controller for JLG Scissor Lifts.", "tech_spec": "Hall Effect Sensor / IP67"},
    {"competitor": "Carraro", "part_number": "137686", "part_name": "Transmission Gear Set", "description": "Bevel gear set for TLB axles.", "tech_spec": "Case Hardened Steel"},
    {"competitor": "Parker", "part_number": "3781205", "part_name": "Hydraulic Filter Element", "description": "High efficiency glass fiber element.", "tech_spec": "10 Micron Absolute / Beta>200"},
]

# 3. HYPER-LOCAL FRONTS
GEO_TARGETS = [
    # --- Previously Generated ---
    {
        "country": "UAE",
        "flag_code": "ae",
        "title_suffix": "UAE / GCC Export",
        "meta_desc": "Heavy Parts for UAE Construction. Heat-resistant radiators and filters in Jebel Ali stock.",
        "headline": "Spare Parts for <br><span class='text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-black'>Desert Conditions</span>",
        "subheadline": "Stock in Jebel Ali Free Zone. Tropicalized Radiators & Filters for CAT/Komatsu.",
        "trust_1": "Jebel Ali Free Zone Pickup",
        "trust_2": "Tropicalized Specs (50°C+)",
        "whatsapp_text": "Need parts in UAE/Dubai",
        "filename": "heavy-parts-uae.html"
    },
    {
        "country": "Indonesia",
        "flag_code": "id",
        "title_suffix": "Indonesia / Kalimantan Mining",
        "meta_desc": "Sparepart Alat Berat Komatsu/Caterpillar di Indonesia. Pengiriman cepat ke Kalimantan.",
        "headline": "Sparepart <br><span class='text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-white'>Alat Berat</span> Indonesia",
        "subheadline": "Supplier Langsung untuk Tambang Kalimantan & Sumatera. Undercarriage & Komponen Engine.",
        "trust_1": "Pengiriman ke Kalimantan",
        "trust_2": "Harga Rupiah / USD",
        "whatsapp_text": "Halo, butuh sparepart alat berat di Indonesia",
        "filename": "alat-berat-indonesia.html"
    },
     {
        "country": "Chile",
        "flag_code": "cl",
        "title_suffix": "Chile / Mineria",
        "meta_desc": "Repuestos Komatsu para Mineria Chile. Envios a Antofagasta.",
        "headline": "Repuestos para <br><span class='text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600'>Camiones Mineros</span>",
        "subheadline": "Abastecimiento Critico para Faena.",
        "trust_1": "Envios a Antofagasta",
        "trust_2": "Cobertura Calama",
        "whatsapp_text": "Hola, busco repuestos en Chile",
        "filename": "repuestos-komatsu-chile.html"
    },
    
    # --- NEW MASS SCALING ---
    {
        "country": "Peru",
        "flag_code": "pe",
        "title_suffix": "Peru / Minería",
        "meta_desc": "Repuestos Maquinaria Pesada Peru. Atención a minas en Arequipa y Cajamarca.",
        "headline": "Repuestos <br><span class='text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400'>Maquinaria Minera</span> Perú",
        "subheadline": "Soluciones logísticas para Yanacocha, Antamina y Las Bambas.",
        "trust_1": "Envíos a Lima/Arequipa",
        "trust_2": "Facturación Local",
        "whatsapp_text": "Hola, busco repuestos para mina en Peru",
        "filename": "repuestos-maquinaria-peru.html"
    },
    {
        "country": "Australia",
        "flag_code": "au",
        "title_suffix": "Australia / Mining",
        "meta_desc": "Komatsu & CAT Parts Australia. Fast shipping to Pilbara and Queensland mines.",
        "headline": "Heavy Parts for <br><span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-red-600'>Aussie Mines</span>",
        "subheadline": "Direct supply to Pilbara, Perth, and Queensland. OEM quality, better price.",
        "trust_1": "Air Freight to Perth (3 Days)",
        "trust_2": "GST Invoice Available",
        "whatsapp_text": "G'day, need parts for Australia",
        "filename": "heavy-parts-australia.html"
    },
    {
        "country": "Russia",
        "flag_code": "ru",
        "title_suffix": "Russia / CIS",
        "meta_desc": "Запчасти Komatsu/CAT с доставкой в Россию. В обход санкций (Parallel Import).",
        "headline": "Запчасти <br><span class='text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-600 to-red-600'>Спецтехники</span> РФ",
        "subheadline": "Прямые поставки запчастей для горной техники. Логистика через третьи страны.",
        "trust_1": "Доставка в Москву/СПб",
        "trust_2": "Оплата в Рублях/USDT",
        "whatsapp_text": "Здравствуйте, нужны запчасти в РФ",
        "filename": "zapchasti-russia.html"
    },
    {
        "country": "South Africa",
        "flag_code": "za",
        "title_suffix": "South Africa / SADC",
        "meta_desc": "Earthmoving parts South Africa. Supply to Johannesburg, Durban and mines.",
        "headline": "Plant Hire & <br><span class='text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-600 to-red-600'>Mining Parts</span> SA",
        "subheadline": "Reliable spares for Volvo ADTs and Bell Trucks. Durban port pickup available.",
        "trust_1": "JHB / Durban Delivery",
        "trust_2": "SADC Export Documents",
        "whatsapp_text": "Hello, need parts in South Africa",
        "filename": "mining-parts-south-africa.html"
    }
]

# --- TEMPLATE LOADING ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES_DIR = os.path.join(BASE_DIR, "pages")

def load_template(filename):
    with open(filename, 'r') as f:
        return f.read()

# --- GENERATION LOGIC ---

def generate_diagnostic_pages():
    print("--- Generating Diagnostic Engine Pages ---")
    template_path = os.path.join(PAGES_DIR, "diagnostic", "komatsu-error-e03.html")
    # Use existing file if template not separate, E03 is our "template"
    if not os.path.exists(template_path):
         # Fallback if I deleted it? Unlikely.
         pass
         
    template = load_template(template_path)

    for error in KOMATSU_ERRORS:
        filename = f"komatsu-error-{error['code'].lower()}.html"
        output_path = os.path.join(PAGES_DIR, "diagnostic", filename)
        
        content = template
        # Basic Replace
        content = content.replace("E03", error['code'])
        content = content.replace("Swing Parking Brake System Faut", error['system_fault']) 
        content = content.replace("Machine upper structure will not swing, or swings with resistance. Parking brake fails to release.", error['symptom'])
        content = content.replace("Defective solenoid valve or open circuit in the Swing Brake release line.", error['cause'])
        content = content.replace("Swing Brake Solenoid Valve", error['part_name']) 
        content = content.replace("Solenoid Valve", error['part_name']) 
        
        # Table System Hack (Replace "Swing Brake" with generic system from fault name)
        # In template: <td class="py-3 font-bold text-gray-900 text-right">Swing Brake</td>
        # We replace "Swing Brake" with first 2 words of system_fault
        sys_name = " ".join(error['system_fault'].split()[:2])
        content = content.replace("Swing Brake", sys_name)
        
        content = content.replace("20Y-60-22822", error['part_number'])
        content = content.replace("Komatsu Swing Solenoid", error['part_name'])
        content = content.replace("This is the direct replacement valve for the swing brake release circuit.", f"Direct replacement {error['part_name']} to fix {error['code']} faults.")
        
        with open(output_path, 'w') as f:
            f.write(content)
        print(f"Generated: {filename}")

def generate_competitor_pages():
    print("\n--- Generating Competitor Intercept Pages ---")
    template_path = os.path.join(PAGES_DIR, "intercept", "replacement-for-kramp-731136001.html")
    template = load_template(template_path)

    for part in COMPETITOR_PARTS:
        # Sanitize filename
        safe_part_num = re.sub(r'[^a-zA-Z0-9]', '', part['part_number']).lower()
        filename = f"replacement-for-{part['competitor'].lower().split('/')[0].strip()}-{safe_part_num}.html"
        output_path = os.path.join(PAGES_DIR, "intercept", filename)
        
        content = template
        content = content.replace("731136001", part['part_number'])
        content = content.replace("Kramp", part['competitor'])
        content = content.replace("Hydraulic Kit", part['part_name'])
        content = content.replace("Hydraulic Seal Kit", part['part_name']) 
        content = content.replace("Viton / NBR (High Temp)", part['tech_spec'])
        content = content.replace("Only 3 Units of Kramp 731136001 Equivalent Left", f"Limited Stock: {part['part_name']} Replacement")
        content = content.replace("Looking for Kramp 731136001 Hydraulic Kit?", f"Looking for {part['competitor']} {part['part_number']} {part['part_name']}?")
        
        with open(output_path, 'w') as f:
            f.write(content)
        print(f"Generated: {filename}")

def generate_local_pages():
    print("\n--- Generating Hyper-Local Fronts ---")
    template_path = os.path.join(PAGES_DIR, "local", "repuestos-komatsu-chile.html")
    template = load_template(template_path)

    for geo in GEO_TARGETS:
        output_path = os.path.join(PAGES_DIR, "local", geo['filename'])
        
        content = template
        # Meta
        content = content.replace("Repuestos Komatsu para Minería Chile | Envíos a Antofagasta y Calama", f"Komatsu/CAT Parts {geo['title_suffix']}")
        content = content.replace("¿Busca repuestos para Camiones Mineros y Excavadoras Komatsu en Chile? Stock crítico de solenoides E03 y kits hidráulicos. Envíos express a Antofagasta, Calama y Copiapó.", geo['meta_desc'])
        
        # Flag & Headers
        content = content.replace("https://flagcdn.com/w20/cl.png", f"https://flagcdn.com/w20/{geo['flag_code']}.png")
        content = content.replace("CHILE / MINERÍA", geo['title_suffix'].upper())
        content = content.replace("Atención Especializada: Minería Chile", f"Specialized Attention: {geo['title_suffix']}")
        
        # H1 & Sub
        # Brute force replace key phrases from template
        content = content.replace("Repuestos para <br>\n                <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-chile-red via-white to-chile-blue\">Camiones Mineros</span>", geo['headline'])
        content = content.replace("Abastecimiento directo de componentes críticos para flotas <strong>Komatsu & Caterpillar</strong>. Soluciones para \"Chiguas\" y Maquinaria Pesada sin intermediarios.", geo['subheadline'])
        
        # Trust Signals
        content = content.replace("Envíos a Antofagasta", geo['trust_1'])
        content = content.replace("Cobertura en Calama", geo['trust_2'])
        content = content.replace("Hola, busco repuestos para mineria en Chile. (Komatsu/CAT)", geo['whatsapp_text'])
        
        # Localization (Lang)
        if geo['country'] not in ["Chile", "Peru"]:
            # English/Russian Switch
            content = content.replace("COTIZAR AHORA", "GET QUOTE")
            content = content.replace("Consultar Stock", "Check Stock")
            content = content.replace("WhatsApp Directo", "Direct WhatsApp")
            content = content.replace("Stock Crítico para Faena", "Critical Stock for Sites")
            content = content.replace("Cotizar Ahora", "Get Quote")
            content = content.replace("Solenoides E03/E10", "E03/E10 Solenoids")
            content = content.replace("Kits de Rodado", "Undercarriage Kits")
            content = content.replace("Sellos Hidráulicos", "Hydraulic Seals")
            content = content.replace("Envíos en 48h", "Express Shipping")
            content = content.replace("Sin Garantía de Fábrica (Verified Quality)", "Verified Quality (No Warranty)")
            
            # Russian specific? (Minimal support via this script, ideally needs separate template or full dict, but this works for prototype scaling)
            if geo['country'] == "Russia":
                 content = content.replace("GET QUOTE", "ЗАПРОС ЦЕНЫ") # Basic Cyrillic

        with open(output_path, 'w') as f:
            f.write(content)
        print(f"Generated: {geo['filename']}")

if __name__ == "__main__":
    generate_diagnostic_pages()
    generate_competitor_pages()
    generate_local_pages()
