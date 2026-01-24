#!/usr/bin/env python3
"""
Script to fix mobile breadcrumbs and add WhatsApp buttons to all product pages
"""

import os
import re
import glob

def fix_breadcrumbs(html_content):
    """Fix mobile breadcrumb navigation"""
    # Pattern to match the old breadcrumb structure
    old_breadcrumb_pattern = r'<!-- Breadcrumb -->\s*<nav class="mb-8">\s*<ol class="flex items-center space-x-2 text-sm text-gray-500">\s*<li><a href="../../index\.html" class="hover:text-yellow-600">Home</a></li>\s*<li><span class="mx-2">/</span></li>\s*<li><a href="\.\./volvo-categories\.html" class="hover:text-yellow-600">Volvo</a></li>\s*<li><span class="mx-2">/</span></li>\s*<li><a href="\.\./categories/volvo-([^"]+)\.html" class="hover:text-yellow-600">([^<]+)</a></li>\s*<li><span class="mx-2">/</span></li>\s*<li class="text-gray-900">([^<]+)</li>\s*</ol>\s*</nav>'
    
    # New responsive breadcrumb structure
    new_breadcrumb_template = '''        <!-- Breadcrumb -->
        <nav class="mb-8">
            <ol class="flex flex-wrap items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-500">
                <li><a href="../../index.html" class="hover:text-yellow-600 transition-colors">Home</a></li>
                <li><span class="mx-1 md:mx-2">/</span></li>
                <li><a href="../volvo-categories.html" class="hover:text-yellow-600 transition-colors">Volvo</a></li>
                <li><span class="mx-1 md:mx-2">/</span></li>
                <li class="hidden sm:inline"><a href="../categories/volvo-{category}.html" class="hover:text-yellow-600 transition-colors">{full_category}</a></li>
                <li class="sm:hidden"><a href="../categories/volvo-{category}.html" class="hover:text-yellow-600 transition-colors">{short_category}</a></li>
                <li><span class="mx-1 md:mx-2">/</span></li>
                <li class="text-gray-900 font-medium">{part_number}</li>
            </ol>
        </nav>'''
    
    def replace_breadcrumb(match):
        category = match.group(1)
        full_category = match.group(2)
        part_number = match.group(3)
        
        # Create short category name for mobile
        short_category = full_category.split()[0] if full_category else "Category"
        
        return new_breadcrumb_template.format(
            category=category,
            full_category=full_category,
            short_category=short_category,
            part_number=part_number
        )
    
    return re.sub(old_breadcrumb_pattern, replace_breadcrumb, html_content, flags=re.DOTALL)

def add_whatsapp_button(html_content, part_number, part_name):
    """Add WhatsApp floating button to product page"""
    whatsapp_button = f'''    <!-- WhatsApp Floating Button -->
    <a aria-label="Contact us on WhatsApp" class="whatsapp-float bg-gradient-to-r from-green-500/80 to-green-600/80 backdrop-blur-xl border border-green-300/50 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:from-green-600/90 hover:to-green-700/90 transform hover:scale-110 z-50 fixed bottom-6 right-6 w-16 h-16 flex items-center justify-center group" href="https://wa.me/919821037990?text=Hi! I'm interested in {part_name} (Part No: {part_number}). Can you provide more details and pricing?" target="_blank" rel="noopener noreferrer">
        <div class="absolute inset-0 bg-green-400/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <svg class="relative w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 11.7c0 6.45-5.27 11.68-11.78 11.68-2.07 0-4-.53-5.7-1.45L0 24l2.13-6.27a11.57 11.57 0 0 1-1.7-6.04C.44 5.23 5.72 0 12.23 0 18.72 0 24 5.23 24 11.7M12.22 1.85c-5.46 0-9.9 4.41-9.9 9.83 0 2.15.7 4.14 1.88 5.76L2.96 21.1l3.8-1.2a9.9 9.9 0 0 0 5.46 1.62c5.46 0 9.9-4.4 9.9-9.83a9.88 9.88 0 0 0-9.9-9.83m5.95 12.52c-.08-.12-.27-.19-.56-.33-.28-.14-1.7-.84-1.97-.93-.26-.1-.46-.15-.65.14-.2.29-.75.93-.91 1.12-.17.2-.34.22-.63.08-.29-.15-1.22-.45-2.32-1.43a8.64 8.64 0 0 1-1.6-1.98c-.18-.29-.03-.44.12-.58.13-.13.29-.34.43-.5.15-.17.2-.3.29-.48.1-.2.05-.36-.02-.5-.08-.15-.65-1.56-.9-2.13-.24-.58-.48-.48-.65-.48-.17 0-.37-.03-.56-.03-.2 0-.5.08-.77.36-.26.29-1 .98-1 2.4 0 1.4 1.03 2.76 1.17 2.96.14.19 2 3.17 4.93 4.32 2.94 1.15 2.94.77 3.47.72.53-.05 1.7-.7 1.95-1.36.24-.67.24-1.25.17-1.37"></path>
        </svg>
    </a>'''
    
    # Check if WhatsApp button already exists
    if 'whatsapp-float' in html_content:
        return html_content
    
    # Add WhatsApp button before closing body tag
    return html_content.replace('</body>', f'{whatsapp_button}\n</body>')

def extract_part_info(html_content):
    """Extract part number and name from HTML content"""
    # Extract part number from title or content
    part_number_match = re.search(r'Part Number:\s*(\w+)', html_content)
    part_number = part_number_match.group(1) if part_number_match else "Unknown"
    
    # Extract part name from title
    title_match = re.search(r'<title>([^<]+)</title>', html_content)
    if title_match:
        title = title_match.group(1)
        # Extract part name from title (usually the first part before the part number)
        part_name = title.split(' - ')[0] if ' - ' in title else title.split(' ')[0]
    else:
        part_name = "Part"
    
    return part_number, part_name

def process_product_file(file_path):
    """Process a single product file"""
    print(f"Processing: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract part information
        part_number, part_name = extract_part_info(content)
        
        # Fix breadcrumbs
        content = fix_breadcrumbs(content)
        
        # Add WhatsApp button
        content = add_whatsapp_button(content, part_number, part_name)
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Fixed: {file_path}")
        
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")

def main():
    """Main function to process all product files"""
    # Find all product HTML files
    product_files = glob.glob('pages/products/*.html')
    
    print(f"Found {len(product_files)} product files to process")
    print("=" * 50)
    
    for file_path in product_files:
        process_product_file(file_path)
    
    print("=" * 50)
    print("Processing complete!")

if __name__ == "__main__":
    main()
