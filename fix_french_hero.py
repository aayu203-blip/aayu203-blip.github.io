#!/usr/bin/env python3
import re

def fix_french_hero():
    """Fix the French homepage hero section"""
    
    with open('fr/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix the video path to point to the correct location
    content = re.sub(r'<source src="PTC Hero Video\.mp4"', '<source src="../PTC Hero Video.mp4"', content)
    
    # Also fix any other relative paths that might be broken
    content = re.sub(r'href="assets/', 'href="../assets/', content)
    content = re.sub(r'src="assets/', 'src="../assets/', content)
    
    with open('fr/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ French hero section fixed!")

if __name__ == "__main__":
    fix_french_hero()
