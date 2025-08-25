#!/usr/bin/env python3
"""
Fix all product pages for all languages by adding missing WhatsApp floating buttons.
"""

import os
import glob
import re

def fix_product_page(file_path):
    """Fix a single product page by adding WhatsApp button."""
    
    print(f"Fixing: {file_path}")
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if WhatsApp button is already present (more specific check)
    if 'class="whatsapp-float"' in content:
        print(f"  WhatsApp button already present, skipping...")
        return False
    
    # Add WhatsApp floating button and back-to-top button before closing body tag
    whatsapp_button = '''    <!-- WhatsApp Float Button (exactly like homepage) -->
    <a aria-label="Contact us on WhatsApp" class="whatsapp-float bg-gradient-to-r from-green-500/80 to-green-600/80 backdrop-blur-xl border border-green-300/50 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:from-green-600/90 hover:to-green-700/90 z-50" href="https://wa.me/919821037990?text=Hi!%20I%20am%20interested%20in%20spare%20parts.%20Please%20provide%20a%20quote%20and%20availability." rel="noopener noreferrer" target="_blank">
        <svg aria-hidden="true" class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 11.7c0 6.45-5.27 11.68-11.78 11.68-2.07 0-4-.53-5.7-1.45L0 24l2.13-6.27a11.57 11.57 0 0 1-1.7-6.04C.44 5.23 5.72 0 12.23 0 18.72 0 24 5.23 24 11.7M12.22 1.85c-5.46 0-9.9 4.41-9.9 9.83 0 2.15.7 4.14 1.88 5.76L2.96 21.1l3.8-1.2a9.9 9.9 0 0 0 5.46 1.62c5.46 0 9.9-4.4 9.9-9.83a9.88 9.88 0 0 0-9.9-9.83m5.95 12.52c-.08-.12-.27-.19-.56-.33-.28-.14-1.7-.84-1.97-.93-.26-.1-.46-.15-.65.14-.2.29-.75.93-.91 1.12-.17.2-.34.22-.63.08-.29-.15-1.22-.45-2.32-1.43a8.64 8.64 0 0 1-1.6-1.98c-.18-.29-.03-.44.12-.58.13-.13.29-.34.43-.5.15-.17.2-.3.29-.48.1-.2.05-.36-.02-.5-.08-.15-.65-1.56-.9-2.13-.24-.58-.48-.48-.65-.48-.17 0-.37-.03-.56-.03-.2 0-.5.08-.77.36-.26.29-1 .98-1 2.4 0 1.4 1.03 2.76 1.17 2.96.14.19 2 3.17 4.93 4.32 2.94 1.15 2.94.77 3.47.72.53-.05 1.7-.7 1.95-1.36.24-.67.24-1.25.17-1.37"></path>
        </svg>
    </a>

    <!-- Back to Top Button -->
    <button aria-label="Back to top" class="back-to-top bg-gradient-to-r from-yellow-400/80 to-yellow-500/80 backdrop-blur-xl border border-yellow-300/50 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:from-yellow-500/90 hover:to-yellow-600/90 z-50" onclick="scrollToTop()">
        <svg class="h-6 w-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
    </button>

    <style>
        /* Floating buttons styles to match homepage */
        .whatsapp-float {
            position: fixed;
            bottom: 20px;
            right: 70px;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 50;
            transition: all 0.3s ease;
        }
        
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 50;
            transition: all 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .whatsapp-float {
                bottom: 15px;
                right: 70px;
                width: 45px;
                height: 45px;
            }
            
            .back-to-top {
                bottom: 15px;
                right: 15px;
                width: 45px;
                height: 45px;
            }
        }
    </style>

    <script>
        // Back to top functionality
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.style.display = 'flex';
                } else {
                    backToTopBtn.style.display = 'none';
                }
            });
        }

        // Back to top function
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    </script>'''
    
    # Add WhatsApp button before closing body tag
    content = re.sub(r'(</body>\s*</html>)', whatsapp_button + r'\n\1', content)
    
    # Write the fixed content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  Fixed successfully!")
    return True

def main():
    """Main function to fix all product pages."""
    
    # Get the base directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Language directories
    languages = ['ru', 'fr', 'ar', 'es', 'kn', 'ta', 'ml', 'te', 'hi', 'id', 'cn']
    
    total_fixed = 0
    
    for lang in languages:
        lang_dir = os.path.join(base_dir, lang, 'pages', 'products')
        
        if not os.path.exists(lang_dir):
            print(f"Language directory not found: {lang_dir}")
            continue
        
        print(f"\nProcessing {lang.upper()} product pages...")
        
        # Get all HTML files in the language's product directory
        html_files = glob.glob(os.path.join(lang_dir, '*.html'))
        
        if not html_files:
            print(f"  No HTML files found in {lang_dir}")
            continue
        
        lang_fixed = 0
        for html_file in html_files:
            if fix_product_page(html_file):
                lang_fixed += 1
        
        print(f"  Fixed {lang_fixed} out of {len(html_files)} files for {lang.upper()}")
        total_fixed += lang_fixed
    
    print(f"\nTotal files fixed: {total_fixed}")
    print("All product pages have been updated with WhatsApp floating buttons!")

if __name__ == "__main__":
    main()
