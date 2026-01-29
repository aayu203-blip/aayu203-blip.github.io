import json
import os
import time
import random
import datetime
import google.generativeai as genai

# CONFIGURATION
OUTPUT_FILE = "../data/generated_guides.json"
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    print("✅ Gemini API Configured.")
else:
    print("❌ GEMINI_API_KEY not found. Please export it.")
    model = None

TOPICS = [
    "Volvo D13 Engine Common Problems and Fixes",
    "Volvo Penta Marine Engine Maintenance Schedule",
    "Difference Between Volvo VCE and Volvo Penta Parts",
    "Troubleshooting Volvo Excavator Error Codes",
    "Volvo Wheel Loader Hydraulic System Maintenance",
    "Guide to Volvo Truck Injector Replacement",
    "Volvo Articulated Hauler Suspension Repairs",
    "Volvo EC210 Excavator Track Tensioning Guide",
    "Understanding Volvo I-Shift Transmission Faults",
    "Scania R-Series Truck Maintenance Checklist",
    "Scania PDE vs HPI Injectors Explained",
    "Scania Retarder Common Failures and Solutions",
    "How to Bleed Scania Fuel System",
    "Scania V8 Engine Oil Consumption Issues (Fixed)",
    "Scania Bus Air Suspension Troubleshooting",
    "Scania Truck AdBlue System Faults",
    "Replacing Scania Brake Pads and Discs",
    "Komatsu PC200 vs PC210: Which Excavator is Right?",
    "Komatsu Hydraulic Pump Failure Symptoms",
    "Komatsu Undercarriage Wear Measurement Guide",
    "Komatsu Bulldozer Final Drive Oil Change",
    "Troubleshooting Komatsu Monitor Panel Errors",
    "Komatsu Engine Overheating Causes",
    "Caterpillar C15 Engine Rebuild Tips",
    "CAT Excavator Hydraulic Fluid Contamination Signs",
    "Heavy Equipment Battery Maintenance in Winter",
    "How to Choose the Right Grease for Excavator Pins",
    "Turbocharger Failure Signs in Diesel Engines",
    "Diesel Particulate Filter (DPF) Cleaning Guide"
]

AUTHORS = ["Chief Engineer S. K. Gupta", "NexGen Quality Lab", "Technical Lead M. Chen", "Site Manager A. Rodriguez"]

def generate_guide_api(index, topic):
    if not model:
        return None

    print(f"🤖 Generating API content for: {topic}")
    
    prompt = f"""
    You are an expert heavy equipment mechanic. Write a JSON object with content for a blog post topic: "{topic}".
    
    Output Format (JSON Only):
    {{
        "title": "SEO Optimized Title",
        "excerpt": "Short summary (under 20 words)",
        "content": "HTML body content (h2, p, ul, li). Do NOT use markdown code blocks. Make it technical and authoritative.",
        "tags": ["Tag1", "Tag2"],
        "category": "Maintenance"
    }}
    
    Constraints:
    - Content length: ~400 words.
    - Mention specific part types (Filters, Injectors) naturally.
    - Use HTML tags directly in the content string.
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean Markdown
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        data = json.loads(text)
        
        # Add metadata
        days_back = random.randint(1, 180)
        date = (datetime.date.today() - datetime.timedelta(days=days_back)).isoformat()
        
        return {
            "id": f"guide-{index}",
            "slug": slugify(data.get("title", topic)),
            "title": data.get("title", topic),
            "excerpt": data.get("excerpt", "Guide."),
            "content": data.get("content", "<p>Content generation error.</p>"),
            "author": random.choice(AUTHORS),
            "date": date,
            "tags": data.get("tags", ["General"]),
            "coverImage": "/images/placeholder-guide.jpg"
        }
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def slugify(text):
    return text.lower().replace(" ", "-").replace(":", "").replace("?", "").replace("/", "-")


# COMBINATORIAL TOPIC GENERATOR
def generate_topics():
    brands = ["Volvo", "Scania", "Komatsu", "Caterpillar", "Hitachi", "JCB"]
    machines = ["Excavator", "Wheel Loader", "Articulated Hauler", "Motor Grader", "Dozer", "Backhoe"]
    systems = ["Hydraulic Pump", "Common Rail Injectors", "Transmission Control Valve", "Undercarriage Track Chain", "Turbocharger", "Final Drive", "Cooling Fan"]
    problems = ["Overheating Diagnosis", "Maintenance Schedule", "Common Failure Modes", "Rebuild vs Replace Guide", "Preventing Catastrophic Failure"]
    
    topics = []
    for brand in brands:
        for machine in machines:
            for system in systems:
                # Select a random problem context for variety
                problem = random.choice(problems)
                topic = f"{brand} {machine} {system}: {problem}"
                topics.append(topic)
    
    # Shuffle to get a good mix if we stop early
    random.shuffle(topics)
    return topics

def main():
    if not model:
        print("Skipping API generation (No Key). Export GEMINI_API_KEY.")
        return

    # Generate massive topic list
    all_topics = generate_topics()
    
    # User requested 1000 guides
    target_count = 1000
    print(f"🚀 Starting Mass Generation: Target {target_count} Guides (Pool: {len(all_topics)})...")
    
    guides = []
    
    # Check for existing
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, 'r') as f:
                guides = json.load(f)
                print(f"Loaded {len(guides)} existing guides.")
        except:
            pass
            
    existing_titles = set(g['title'] for g in guides)
    
    count = 0
    for topic in all_topics:
        if count >= target_count:
            break
            
        # Skip if topic likely covers same ground as existing
        # (Simple check, can be improved)
        if any(topic in t for t in existing_titles):
            continue

        print(f"[{count+1}/{target_count}] Generating: {topic}")
        guide = generate_guide_api(len(guides) + 1, topic)
        if guide:
            guides.append(guide)
            count += 1
            
            # Save incrementally
            if count % 10 == 0:
                with open(OUTPUT_FILE, "w") as f:
                    json.dump(guides, f, indent=2)
                print("  -> Saved batch.")
                
            # Rate limit handling (adaptive)
            time.sleep(1.5) 
            
    # Final Save
    with open(OUTPUT_FILE, "w") as f:
        json.dump(guides, f, indent=2)
        
    print(f"✅ COMPLETE. Total Library Size: {len(guides)} guides -> {OUTPUT_FILE}")

if __name__ == "__main__":
    main()

