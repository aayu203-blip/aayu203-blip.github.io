#!/usr/bin/env python3
"""
Script to fix remaining WhatsApp icon and brand field issues
"""

import os
import re
import glob

def fix_whatsapp_icon(html_content):
    """Fix WhatsApp icon to show proper logo instead of green circle"""
    # The current SVG path is still the old one, replace it with the correct WhatsApp icon
    old_whatsapp_svg = r'<path d="M17\.472 14\.382c-\.297-\.149-1\.758-\.867-2\.03-\.967-\.273-\.099-\.471-\.148-\.67\.15-\.197\.297-\.767\.966-\.94 1\.164-\.173\.199-\.347\.223-\.644\.075-\.297-\.15-1\.255-\.463-2\.39-1\.475-\.883-\.788-1\.48-1\.761-1\.653-2\.059-\.173-\.297-\.018-\.458\.13-\.606\.134-\.133\.298-\.347\.446-\.52\.149-\.174\.198-\.298\.298-\.497\.099-\.198\.05-\.371-\.025-\.52-\.075-\.149-\.669-1\.612-\.916-2\.207-\.242-\.579-\.487-\.5-\.669-\.51-\.173-\.008-\.371-\.01-\.57-\.01-\.198 0-\.52\.074-\.792\.372-\.272\.297-1\.04 1\.016-1\.04 2\.479 0 1\.462 1\.065 2\.875 1\.213 3\.074\.149\.198 2\.096 3\.2 5\.077 4\.487\.709\.306 1\.262\.489 1\.694\.625\.712\.227 1\.36\.195 1\.871\.118\.571-\.085 1\.758-\.719 2\.006-1\.413\.248-\.694\.248-1\.289\.173-1\.413-\.074-\.124-\.272-\.198-\.57-\.347m-5\.421 7\.403h-\.004a9\.87 9\.87 0 01-5\.031-1\.378l-\.361-\.214-3\.741\.982\.998-3\.648-\.235-\.374a9\.86 9\.86 0 01-1\.51-5\.26c\.001-5\.45 4\.436-9\.884 9\.888-9\.884 2\.64 0 5\.122 1\.03 6\.988 2\.898a9\.825 9\.825 0 012\.893 6\.994c-\.003 5\.45-4\.437 9\.884-9\.885 9\.884m8\.413-18\.297A11\.815 11\.815 0 0012\.05 0C5\.495 0 \.16 5\.335\.157 11\.892c0 2\.096\.547 4\.142 1\.588 5\.945L\.057 24l6\.305-1\.654a11\.882 11\.882 0 005\.683 1\.448h\.005c6\.554 0 11\.89-5\.335 11\.893-11\.893A11\.821 11\.821 0 0020\.885 3\.488"/>'
    
    new_whatsapp_svg = '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>'
    
    # Replace the old SVG path with the new one
    html_content = re.sub(old_whatsapp_svg, new_whatsapp_svg, html_content)
    
    return html_content

def add_brand_field(html_content):
    """Add brand field to additional information section"""
    # Look for the additional information section and add brand field
    # First, let's find where we can add the brand information
    # Look for a table or section where we can add brand info
    
    # Try to find existing additional information section
    if 'Additional Information' in html_content:
        # If there's already an additional information section, add brand to it
        brand_row = '''
                    <tr>
                        <td class="px-4 py-2 border-b border-gray-700">Brand</td>
                        <td class="px-4 py-2 border-b border-gray-700">Volvo</td>
                    </tr>'''
        
        # Insert brand row after the first table row
        html_content = re.sub(
            r'(<tr>\s*<td[^>]*>Part Number</td>\s*<td[^>]*>[^<]*</td>\s*</tr>)',
            r'\1' + brand_row,
            html_content,
            flags=re.DOTALL
        )
    else:
        # If no additional information section exists, we need to create one
        # Look for a good place to insert it (usually after product details)
        additional_info_section = '''
        <!-- Additional Information -->
        <div class="bg-gray-800 rounded-lg p-6 mb-8" data-aos="fade-up">
            <h3 class="text-xl font-bold text-white mb-4">Additional Information</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <tbody>
                        <tr>
                            <td class="px-4 py-2 border-b border-gray-700">Part Number</td>
                            <td class="px-4 py-2 border-b border-gray-700">21489991</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 border-b border-gray-700">Brand</td>
                            <td class="px-4 py-2 border-b border-gray-700">Volvo</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 border-b border-gray-700">Category</td>
                            <td class="px-4 py-2 border-b border-gray-700">Hydraulic Systems & Connectors</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>'''
        
        # Insert after the product details section
        html_content = re.sub(
            r'(<!-- Product Details -->.*?</div>\s*</div>)',
            r'\1' + additional_info_section,
            html_content,
            flags=re.DOTALL
        )
    
    return html_content

def process_product_file(file_path):
    """Process a single product file"""
    print(f"Processing: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix WhatsApp icon
        content = fix_whatsapp_icon(content)
        
        # Add brand field
        content = add_brand_field(content)
        
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
