import re

file_path = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete/scripts/live_header.html"
with open(file_path, 'r') as f:
    content = f.read()

# Fix assets paths
content = content.replace('href="assets/', 'href="/assets/')

# Fix hash links
content = content.replace('href="#', 'href="/#')

# Fix blog link
content = content.replace('href="blog/index.html"', 'href="/blog/index.html"')

with open(file_path, 'w') as f:
    f.write(content)

print("live_header.html fixed!")
