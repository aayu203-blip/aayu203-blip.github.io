import os
import re

def polish_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove OEM Badge Block
    # Search for the block containing "Powered by Tier-1 OEM Suppliers"
    oem_badge_pattern = re.compile(r'<!-- Brand Trust Transference Badge -->.*?<div class="mb-4 inline-flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg shadow-sm">.*?<\/div>\s*<\/div>', re.DOTALL)
    content = oem_badge_pattern.sub('', content)

    # 2. Remove "Verified match for Part No" line
    verified_match_pattern = re.compile(r'<p class="text-\[13px\] text-gray-500 leading-relaxed">Verified match for Part No: <span class="font-mono text-gray-900 font-bold bg-gray-100 px-1\.5 py-0\.5 rounded ml-1">.*?<\/span><\/p>', re.DOTALL)
    content = verified_match_pattern.sub('', content)

    # 3. Remove chassis note row from the table
    chassis_note_generic = re.compile(r'<tr class="border-b border-gray-100 hover:bg-gray-50\/50 transition-colors">\s*<td class="py-3 px-4 text-sm font-medium text-gray-500 w-\[40%\]">Note<\/td>\s*<td class="py-3 px-4 text-sm font-bold text-gray-900 font-mono">.*?Verification with a chassis number.*?<\/td>\s*<\/tr>', re.DOTALL)
    content = chassis_note_generic.sub('', content)
    
    # 3b. Remove technical fitment note in tabs
    fitment_note_pattern = re.compile(r'<p class="text-xs text-gray-500 mb-4 border-b border-gray-100 pb-4">Always verify fitment with your engine serial number before purchasing\.<\/p>', re.DOTALL)
    content = fitment_note_pattern.sub('', content)

    # 4. Handle Related Parts Section - Move it above the footer
    # Find Related Parts block
    related_parts_pattern = re.compile(r'<!-- Related Parts -->.*?<div class="grid grid-cols-2 md:grid-cols-4 gap-4">.*?<\/div>\s*<\/div>\s*<\/div>', re.DOTALL)
    match = related_parts_pattern.search(content)
    if match:
        related_parts_html = match.group(0)
        # Remove it from its current position
        content = content.replace(related_parts_html, '')
        # Re-insert before </main> or before <footer>
        if '</main>' in content:
            content = content.replace('</main>', f'{related_parts_html}\n    </main>')
        elif '<footer' in content:
            content = content.replace('<footer', f'{related_parts_html}\n    <footer')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    root_dir = '/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io/pages/products'
    files = [f for f in os.listdir(root_dir) if f.endswith('.html')]
    
    print(f"Starting polish of {len(files)} files...")
    
    count = 0
    for filename in files:
        file_path = os.path.join(root_dir, filename)
        try:
            polish_file(file_path)
            count += 1
            if count % 1000 == 0:
                print(f"Processed {count} files...")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    print(f"Finished polishing {count} files.")

if __name__ == "__main__":
    main()
