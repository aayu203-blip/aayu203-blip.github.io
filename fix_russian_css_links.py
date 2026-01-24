#!/usr/bin/env python3

def fix_russian_css_links():
    # Read the Russian homepage
    with open('ru/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add CSS link after the Tailwind CSS link
    css_link = '<link href="../assets/css/styles.css" rel="stylesheet"/>'
    content = content.replace('<link as="script" href="https://cdn.tailwindcss.com" rel="preload"/>', 
                             '<link as="script" href="https://cdn.tailwindcss.com" rel="preload"/>\n' + css_link)
    
    # Add search database script before closing body tag
    search_script = '<script src="../database/new_partDatabase.js"></script>'
    content = content.replace('</body>', search_script + '\n</body>')
    
    # Fix all internal links to use relative paths
    link_fixes = {
        # Brand category links
        'href="pages/volvo-categories.html"': 'href="../pages/volvo-categories.html"',
        'href="pages/scania-categories.html"': 'href="../pages/scania-categories.html"',
        'href="pages/komatsu-categories.html"': 'href="../pages/komatsu-categories.html"',
        'href="pages/caterpillar-categories.html"': 'href="../pages/caterpillar-categories.html"',
        'href="pages/hitachi-categories.html"': 'href="../pages/hitachi-categories.html"',
        'href="pages/kobelco-categories.html"': 'href="../pages/kobelco-categories.html"',
        
        # Search result links
        'href="pages/products/${result["Part No"]}.html"': 'href="../pages/products/${result["Part No"]}.html"',
        
        # Other page links
        'href="pages/faq.html"': 'href="../pages/faq.html"',
        'href="pages/contact.html"': 'href="../pages/contact.html"',
        'href="pages/about.html"': 'href="../pages/about.html"',
        
        # Asset links
        'href="assets/images/': 'href="../assets/images/',
        'src="assets/images/': 'src="../assets/images/',
        'href="assets/js/': 'href="../assets/js/',
        'src="assets/js/': 'src="../assets/js/',
        
        # Contact file
        'href="parts_trading_company.vcf"': 'href="../parts_trading_company.vcf"'
    }
    
    for old_link, new_link in link_fixes.items():
        content = content.replace(old_link, new_link)
    
    # Write back to file
    with open('ru/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Russian CSS and links fixed!")

if __name__ == "__main__":
    fix_russian_css_links()






