import json
import random
import re

# Template for "How To Fix" articles
PROBLEM_TEMPLATES = [
    {
        "title": "Top 5 Symptoms of a Failing {brand} {part_name}",
        "slug_suffix": "failing-symptoms",
        "intro": "Is your {brand} machine acting up? If you're suspecting issues with the {part_name}, you're in the right place. Here are the top signs that your {part_name} might be failing.",
        "body": """
        <h3>1. Unusual Noise</h3>
        <p>One of the first signs of a bad {part_name} is strange noises during operation. Only a trained ear can distinguish these, but clanking or grinding is never good.</p>
        
        <h3>2. Reduced Performance</h3>
        <p>If your {brand} equipment feels sluggish, the {part_name} ({part_number}) might be the culprit. Efficiency drops lead to higher fuel consumption.</p>
        
        <h3>3. Leaks or Visual Damage</h3>
        <p>Inspect the {part_name} visually. Any signs of wear, cracks, or leaks mean it's time for a replacement.</p>
        
        <h3>The Fix?</h3>
        <p>Replacing the <strong>{brand} {part_number}</strong> is the recommended solution. Prevent further damage by acting fast.</p>
        """
    },
    {
        "title": "How to Replace {brand} {part_number} {part_name}",
        "slug_suffix": "replacement-guide",
        "intro": "Need to replace the {part_name} on your {brand} equipment? This guide covers the basics of replacing part number {part_number}.",
        "body": """
        <h3>Safety First</h3>
        <p>Always ensure the machine is off and cooled down before attempting any maintenance on the {part_name}.</p>
        
        <h3>Preparation</h3>
        <p>Have your replacement part <strong>{part_number}</strong> ready. Ensure you have the correct tools for {brand} specifications.</p>
        
        <h3>Installation Tip</h3>
        <p>When installing the new {part_name}, ensure all seals and connections are tight. A loose {part_name} can cause vibration damage.</p>
        """
    }
]

def generate_blog_posts():
    input_path = 'data/parts-database.json'
    output_path = 'data/blog-posts.json'
    
    with open(input_path, 'r') as f:
        parts = json.load(f)
        
    posts = []
    
    # Generate posts for High-Value parts (Tier 1)
    # We'll pick random parts to demonstrate scale, or specific categories
    target_parts = [p for p in parts if p.get('brand') in ['Volvo', 'Scania', 'Caterpillar'] and len(p.get('product_name', '')) > 5]
    
    # Generate 50 posts
    selected_parts = random.sample(target_parts, 50)
    
    for i, part in enumerate(selected_parts):
        # Determine "Part Name" (cleaner version)
        part_name = part.get('product_name', 'Component')
        part_name = re.sub(r'VOLVO|SCANIA|CATERPILLAR', '', part_name, flags=re.IGNORECASE).strip()
        part_name = re.sub(r'\d+', '', part_name).strip() # Remove numbers
        if not part_name: part_name = "Part"
        
        part_name = part_name.split(',')[0] # Take first part before comma
        
        template = random.choice(PROBLEM_TEMPLATES)
        
        brand = part['brand']
        pn = part['part_number']
        
        title = template['title'].format(brand=brand, part_name=part_name, part_number=pn)
        intro = template['intro'].format(brand=brand, part_name=part_name, part_number=pn)
        body = template['body'].format(brand=brand, part_name=part_name, part_number=pn)
        
        slug = f"{brand.lower()}-{part_name.lower().replace(' ', '-')}-{template['slug_suffix']}-{pn.lower()}"
        slug = re.sub(r'[^a-z0-9-]', '', slug)
        
        post = {
            "id": i + 1,
            "title": title,
            "slug": slug,
            "excerpt": intro,
            "content": intro + body,
            "date": "2024-05-20",
            "related_part_slug": part['slug'],
            "related_part_name": part['product_name']
        }
        posts.append(post)
        
    print(f"Generated {len(posts)} blog posts.")
    
    with open(output_path, 'w') as f:
        json.dump(posts, f, indent=2)

if __name__ == "__main__":
    generate_blog_posts()
