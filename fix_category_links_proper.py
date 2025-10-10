#!/usr/bin/env python3

def fix_category_links_proper():
    # Read the volvo-categories.html file
    with open('pages/volvo-categories.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix navigation links - replace July_30_External_CSS.html with proper English homepage
    content = content.replace('href="July_30_External_CSS.html#brands"', 'href="../index.html#brands"')
    content = content.replace('href="July_30_External_CSS.html#product-categories"', 'href="../index.html#product-categories"')
    content = content.replace('href="July_30_External_CSS.html#faq"', 'href="../index.html#faq"')
    content = content.replace('href="July_30_External_CSS.html#contact"', 'href="../index.html#contact"')
    
    # Fix category links - point back to the proper English category pages
    content = content.replace('href="../index.html#engine-components"', 'href="categories/volvo-engine-components.html"')
    content = content.replace('href="../index.html#fuel-system-components"', 'href="categories/volvo-fuel-system-components.html"')
    content = content.replace('href="../index.html#transmission-components"', 'href="categories/volvo-transmission-and-differential-components.html"')
    content = content.replace('href="../index.html#braking-components"', 'href="categories/volvo-braking-system-components.html"')
    content = content.replace('href="../index.html#steering-suspension"', 'href="categories/volvo-steering-and-suspension-parts.html"')
    content = content.replace('href="../index.html#hydraulic-systems"', 'href="categories/volvo-hydraulic-systems-and-connectors.html"')
    content = content.replace('href="../index.html#filtration-systems"', 'href="categories/volvo-air-and-fluid-filtration-systems.html"')
    content = content.replace('href="../index.html#lighting-components"', 'href="categories/volvo-lighting-and-exterior-body-components.html"')
    content = content.replace('href="../index.html#fasteners-hardware"', 'href="categories/volvo-fasteners-hardware-accessories.html"')
    content = content.replace('href="../index.html#compressed-air"', 'href="categories/volvo-compressed-air-system-components.html"')
    content = content.replace('href="../index.html#clutch-transmission"', 'href="categories/volvo-clutch-and-transmission-components.html"')
    content = content.replace('href="../index.html#miscellaneous-parts"', 'href="categories/volvo-miscellaneous-parts.html"')
    
    # Write back to file
    with open('pages/volvo-categories.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Fixed volvo-categories.html to point to proper English category pages!")

if __name__ == "__main__":
    fix_category_links_proper()






