#!/usr/bin/env python3

def fix_arabic_video():
    # Read the Arabic homepage
    with open('ar/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix video path for Arabic homepage
    content = content.replace('src="PTC Hero Video.mp4"', 'src="../PTC Hero Video.mp4"')
    
    # Write back to file
    with open('ar/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Arabic video path fixed!")

if __name__ == "__main__":
    fix_arabic_video()






