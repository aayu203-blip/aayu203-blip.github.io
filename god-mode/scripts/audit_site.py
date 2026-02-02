
import os
import json
import re

PROJECT_ROOT = os.getcwd()

def find_files(directory, extensions):
    matches = []
    for root, dirs, files in os.walk(directory):
        if "node_modules" in root or ".git" in root or ".next" in root:
            continue
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                matches.append(os.path.join(root, file))
    return matches

def audit_compliance():
    print("\n--- ⚖️ COMPLIANCE AUDIT ---")
    risky_terms = ["genuine", "original equipment", "oem part", "authentic"]
    files = find_files(".", [".tsx", ".ts", ".js", ".jsx"])
    
    issues = []
    for fpath in files:
        if "scripts/" in fpath: continue # Skip scripts
        with open(fpath, "r", errors='ignore') as f:
            content = f.read().lower()
            for term in risky_terms:
                if term in content:
                    # Ignore comment lines if possible (simple check)
                    lines = content.split('\n')
                    for i, line in enumerate(lines):
                        if term in line and "//" not in line and "import" not in line:
                            issues.append(f"{term} found in {fpath}:{i+1}")
    
    if issues:
        print(f"⚠️  Found {len(issues)} potential compliance risks:")
        for i in issues[:10]: print(f"  - {i}")
        if len(issues) > 10: print(f"  ...and {len(issues)-10} more.")
    else:
        print("✅ No high-risk compliance terms found.")

def audit_dev_artifacts():
    print("\n--- 🛠️ DEV ARTIFACTS AUDIT ---")
    files = find_files(".", [".tsx", ".ts"])
    
    artifacts = {
        "console.log": [],
        "TODO": [],
        "FIXME": [],
        "localhost": []
    }
    
    for fpath in files:
        if "scripts/" in fpath: continue
        with open(fpath, "r", errors='ignore') as f:
            lines = f.readlines()
            for i, line in enumerate(lines):
                for key in artifacts:
                    if key in line:
                        artifacts[key].append(f"{fpath}:{i+1}")
    
    for key, items in artifacts.items():
        if items:
            print(f"⚠️  Found {len(items)} instances of '{key}':")
            for item in items[:3]: print(f"  - {item}")
        else:
            print(f"✅ No '{key}' found.")

def audit_seo_structure():
    print("\n--- 🔍 SEO & STRUCTURE AUDIT ---")
    pages = find_files("app", ["page.tsx"])
    
    missing_meta = []
    
    for p in pages:
        with open(p, "r", errors='ignore') as f:
            content = f.read()
            if "generateMetadata" not in content and "export const metadata" not in content:
                missing_meta.append(p)
                
    if missing_meta:
        print(f"❌ {len(missing_meta)} Pages missing Metadata:")
        for p in missing_meta: print(f"  - {p}")
    else:
        print("✅ All pages have Metadata exports.")

def audit_ux_links():
    print("\n--- 🔗 UX & LINKS AUDIT ---")
    files = find_files("app", [".tsx"])
    
    broken_links = []
    empty_links = []
    
    for fpath in files:
        with open(fpath, "r", errors='ignore') as f:
            lines = f.readlines()
            for i, line in enumerate(lines):
                if 'href="#"' in line:
                    broken_links.append(f"{fpath}:{i+1}")
                if 'href=""' in line:
                    empty_links.append(f"{fpath}:{i+1}")
                    
    if broken_links:
        print(f"⚠️  Found {len(broken_links)} placeholder links (href='#'):")
        for l in broken_links[:5]: print(f"  - {l}")
    else:
        print("✅ No placeholder links found.")

if __name__ == "__main__":
    audit_compliance()
    audit_dev_artifacts()
    audit_seo_structure()
    audit_ux_links()
