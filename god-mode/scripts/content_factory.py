import json
import os
import google.generativeai as genai
from slugify import slugify # pip install python-slugify

# CONFIG
API_KEY = "YOUR_GEMINI_KEY"
try:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-pro')
except:
    print("Warning: Gemini API Key not configured")

# INPUT: THE MATRIX
machines = ["Volvo EC210", "Cat 320D", "Komatsu PC200-8"]
problems = [
    "Hydraulic Pump Overheating",
    "Engine Low Power / Black Smoke",
    "Track Chain Tension Issues",
    "Swing Motor Noise"
]

def generate_guide(machine, problem):
    prompt = f"""
    Write a technical troubleshooting guide for a {machine} experiencing {problem}.
    
    Structure:
    1. Title: Engaging, technical.
    2. Symptoms: Bullet points.
    3. Root Causes: Mention specific parts (e.g. worn piston rings, clogged filters).
    4. Solution: Step-by-step fix.
    5. Required Parts: List the generic part names needed.
    
    Tone: Senior Field Engineer. Concise. No fluff.
    Format: Markdown.
    """
    
    response = model.generate_content(prompt)
    
    return {
        "id": f"{slugify(machine)}-{slugify(problem)}",
        "title": f"How to Fix {problem} on {machine}",
        "slug": f"fix-{slugify(problem)}-{slugify(machine)}",
        "machineSlug": slugify(machine),
        "content": response.text,
        "excerpt": f"Step-by-step guide to diagnosing and repairing {problem} on {machine} excavators.",
        "datePublished": "2026-01-30",
        "relatedParts": [] # To be filled by data linker
    }

# EXECUTION
output_guides = []

print("🏭 Starting Content Factory...")
# Placeholder for demonstration if no API key
if True: 
    print("   (Skipping actual generation in starter script. Add API Key to enable.)")
    # Mock Guide
    output_guides.append({
        "id": "volvo-ec210-overheating",
        "title": "Diagnosing Hydraulic Overheating on Volvo EC210",
        "slug": "fix-hydraulic-overheating-volvo-ec210",
        "machineSlug": "volvo-ec210",
        "content": "# Diagnosis Steps\n\n1. Check hydraulic oil level.\n2. Inspect oil cooler for debris.\n3. Verify pump pressure settings.\n\n> **Tech Note:** Worn piston shoes in the main pump often cause excessive heat generation under load.",
        "excerpt": "A complete guide to resolving high hydraulic temperatures on Volvo B-series excavators.",
        "datePublished": "2026-01-30",
        "relatedParts": []
    })
else:
    for machine in machines:
        for problem in problems:
            print(f"   ⚙️ Manufacturing guide: {machine} + {problem}")
            try:
                guide = generate_guide(machine, problem)
                output_guides.append(guide)
            except Exception as e:
                print(f"Error: {e}")

# SAVE
output_path = '../data/generated_guides.json'
with open(output_path, 'w') as f:
    json.dump(output_guides, f, indent=2)

print(f"✅ Fabrication Complete. {len(output_guides)} guides created.")
