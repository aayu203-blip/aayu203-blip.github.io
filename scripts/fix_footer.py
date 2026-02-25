import re

file_path = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete/scripts/live_footer.html"
with open(file_path, 'r') as f:
    content = f.read()

# Fix hash links for navigation and explore brands
content = content.replace('href="#contact"', 'href="/#contact"')
content = content.replace('href="#brands"', 'href="/#brands"')

# The EmailJS and other scripts, check for any assets
content = content.replace('src="assets/', 'src="/assets/')
content = content.replace('href="assets/', 'href="/assets/')

with open(file_path, 'w') as f:
    f.write(content)

print("live_footer.html fixed!")
