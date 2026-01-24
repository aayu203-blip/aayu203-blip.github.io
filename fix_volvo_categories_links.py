#!/usr/bin/env python3

def fix_volvo_categories_links():
    # Read the volvo-categories.html file
    with open('pages/volvo-categories.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix navigation links - replace July_30_External_CSS.html with proper English homepage
    content = content.replace('href="July_30_External_CSS.html#brands"', 'href="../index.html#brands"')
    content = content.replace('href="July_30_External_CSS.html#product-categories"', 'href="../index.html#product-categories"')
    content = content.replace('href="July_30_External_CSS.html#faq"', 'href="../index.html#faq"')
    content = content.replace('href="July_30_External_CSS.html#contact"', 'href="../index.html#contact"')
    
    # Fix category links - point to English category pages (these should be in English)
    # The category pages were translated but we need them to point to English versions
    # For now, let's point them back to the main homepage sections
    content = content.replace('href="categories/volvo-engine-components.html"', 'href="../index.html#engine-components"')
    content = content.replace('href="categories/volvo-fuel-system-components.html"', 'href="../index.html#fuel-system-components"')
    content = content.replace('href="categories/volvo-transmission-and-differential-components.html"', 'href="../index.html#transmission-components"')
    content = content.replace('href="categories/volvo-braking-system-components.html"', 'href="../index.html#braking-components"')
    content = content.replace('href="categories/volvo-steering-and-suspension-parts.html"', 'href="../index.html#steering-suspension"')
    content = content.replace('href="categories/volvo-hydraulic-systems-and-connectors.html"', 'href="../index.html#hydraulic-systems"')
    content = content.replace('href="categories/volvo-air-and-fluid-filtration-systems.html"', 'href="../index.html#filtration-systems"')
    content = content.replace('href="categories/volvo-lighting-and-exterior-body-components.html"', 'href="../index.html#lighting-components"')
    content = content.replace('href="categories/volvo-fasteners-hardware-accessories.html"', 'href="../index.html#fasteners-hardware"')
    content = content.replace('href="categories/volvo-compressed-air-system-components.html"', 'href="../index.html#compressed-air"')
    content = content.replace('href="categories/volvo-clutch-and-transmission-components.html"', 'href="../index.html#clutch-transmission"')
    content = content.replace('href="categories/volvo-miscellaneous-parts.html"', 'href="../index.html#miscellaneous-parts"')
    
    # Write back to file
    with open('pages/volvo-categories.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Fixed volvo-categories.html navigation and category links!")

if __name__ == "__main__":
    fix_volvo_categories_links()






