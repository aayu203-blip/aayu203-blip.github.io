import csv
import sys
import glob

def print_head(filepath, rows=5):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            # We want to find where the actual data table starts, sometimes GA exports have summary info at top
            lines = f.readlines()
            print(f"--- Analysis for {filepath} ---")
            
            # Print first 10 lines to understand structure
            for i, line in enumerate(lines[:15]):
                print(f"L{i}: {line.strip()}")
            print("\n")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

files = [
    "../Generate_leads_overview.csv",
    "../Reports_snapshot.csv",
    "../Understand_web_and_or_app_traffic_overview.csv"
]

for f in files:
    print_head(f)

