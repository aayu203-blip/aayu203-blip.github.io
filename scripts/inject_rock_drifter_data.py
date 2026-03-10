import csv
import json
import os

# Paths
CSV_PATH = "tools/intelligence_engine/master_autonomous_export.csv"
JS_PATH = "new_partDatabase.js"

def inject_data():
    if not os.path.exists(CSV_PATH):
        print(f"Error: {CSV_PATH} not found.")
        return
    
    # Read new parts from CSV
    new_entries = []
    with open(CSV_PATH, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            part_num = row.get("oem_reference_number") or row.get("Part Number", "Unknown")
            description = row.get("name") or row.get("Part Name", "Underground Rock Drifter Part")
            source = row.get("source_manual") or row.get("Source", "OEM Manual")
            brand = "Epiroc" if "epiroc" in source.lower() else "Sandvik" if "sandvik" in source.lower() else "Premium OEM"
            
            entry = {
                "Part No": part_num,
                "Cleaned Description": description,
                "Application": "Underground Mining / Tunneling",
                "Alt Part No 1": "",
                "Alt Part No 2": "",
                "Alt Part No 3": "",
                "Alt Part No 4": "",
                "Alt Part No 5": "",
                "Alt Part No 6": "",
                "Alt Part No 7": "",
                "Brand": brand,
                "Measurement (MXX)": "",
                "Category": "Underground Rock Drifter",
                "OEM Part Nos": part_num
            }
            new_entries.append(entry)

    if not new_entries:
        print("No new entries to inject.")
        return

    # Read the JS file
    with open(JS_PATH, "r") as f:
        content = f.read()

    # Find the end of the array
    # Looking for the last closing bracket before any potential trailing script tags or characters
    last_bracket_index = content.rfind("];")
    if last_bracket_index == -1:
        # Try finding just ]
        last_bracket_index = content.rfind("]")
    
    if last_bracket_index == -1:
        print("Error: Could not find the end of the partDatabase array.")
        return

    # Prepare the string to inject
    # Each entry as a formatted JSON object string
    injection_parts = []
    for entry in new_entries:
        injection_parts.append(",\n  " + json.dumps(entry, indent=2).replace("\n", "\n  "))

    injection_string = "".join(injection_parts)

    # Reconstruct the file
    new_content = content[:last_bracket_index] + injection_string + "\n" + content[last_bracket_index:]

    with open(JS_PATH, "w") as f:
        f.write(new_content)
    
    print(f"Successfully injected {len(new_entries)} parts into {JS_PATH}.")

if __name__ == "__main__":
    inject_data()
