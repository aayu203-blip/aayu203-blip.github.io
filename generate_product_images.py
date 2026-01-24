#!/usr/bin/env python3
"""
Automated AI Product Image Generation using OpenAI DALL-E 3 API

This script:
1. Analyzes all product pages to identify categories
2. Generates unique AI images for each category using DALL-E 3
3. Downloads and optimizes images
4. Updates all product pages with new image URLs

Requirements:
    pip install openai pillow requests

Setup:
    export OPENAI_API_KEY="your-api-key-here"
    or create .env file with OPENAI_API_KEY=your-key
"""

import os
import re
import json
import time
from pathlib import Path
from collections import defaultdict
import requests
from PIL import Image
from io import BytesIO

try:
    from openai import OpenAI
except ImportError:
    print("❌ OpenAI library not installed. Run: pip install openai")
    exit(1)

# Category to image prompt mapping
CATEGORY_PROMPTS = {
    'engine': {
        'name': 'Engine Components',
        'prompt': 'Professional product photography of a heavy-duty truck engine component, metallic silver finish, precision-machined surface, isolated on pure white background (#FFFFFF), studio lighting with soft shadows, commercial automotive part photography, high resolution 8K, photorealistic, sharp focus, clean industrial aesthetic'
    },
    'braking': {
        'name': 'Braking System',
        'prompt': 'Professional product photography of a heavy-duty truck brake drum, cast iron construction, circular with mounting holes, isolated on pure white background (#FFFFFF), dramatic studio lighting showing depth and texture, industrial automotive parts photography, photorealistic, high detail, commercial quality'
    },
    'suspension': {
        'name': 'Steering & Suspension',
        'prompt': 'Professional product photography of a truck suspension component, black metal housing with precision engineering, isolated on pure white background (#FFFFFF), studio lighting with subtle shadows, automotive parts catalog style, photorealistic 8K, sharp focus, commercial quality, professional industrial photography'
    },
    'transmission': {
        'name': 'Transmission & Differential',
        'prompt': 'Professional product photography of a truck transmission gear, metallic steel with precision-cut teeth, helical design, isolated on pure white background (#FFFFFF), dramatic studio lighting showing tooth detail, automotive parts photography, photorealistic, high resolution 8K, commercial quality'
    },
    'filtration': {
        'name': 'Filtration Systems',
        'prompt': 'Professional product photography of a cylindrical truck oil filter, blue and white color scheme, metal canister with threading, isolated on pure white background (#FFFFFF), studio lighting, automotive parts catalog style, photorealistic, sharp focus, commercial product shot'
    },
    'fuel': {
        'name': 'Fuel System',
        'prompt': 'Professional product photography of a truck fuel filter assembly, metal housing with transparent bowl base, isolated on pure white background (#FFFFFF), studio lighting with subtle reflections, commercial automotive photography, photorealistic, 8K resolution'
    },
    'exterior': {
        'name': 'Exterior & Lighting',
        'prompt': 'Professional product photography of a truck headlamp assembly, clear lens with chrome reflector housing, rectangular modern design, isolated on pure white background (#FFFFFF), studio lighting, automotive lighting parts photography, photorealistic, high detail, commercial quality'
    },
    'hydraulics': {
        'name': 'Hydraulic Systems',
        'prompt': 'Professional product photography of a hydraulic cylinder, chrome piston rod with black painted cylinder body, mounting brackets, isolated on pure white background (#FFFFFF), studio lighting, industrial hydraulics photography, photorealistic, commercial quality, high detail'
    },
    'hardware': {
        'name': 'Fasteners & Hardware',
        'prompt': 'Professional product photography of heavy-duty industrial bolts and nuts, metallic steel finish with hex heads, threaded shafts, isolated on pure white background (#FFFFFF), studio lighting with subtle shadows, hardware catalog photography, photorealistic, sharp focus, commercial quality'
    },
    'misc': {
        'name': 'Miscellaneous Parts',
        'prompt': 'Professional product photography of heavy-duty truck spare parts, metallic finish, industrial design, isolated on pure white background (#FFFFFF), studio lighting, commercial automotive parts photography, photorealistic, high resolution, professional composition'
    }
}

# Special prompts for APV (Dayco) parts
DAYCO_PROMPT = 'Professional product photography of a Dayco belt tensioner pulley, black metal housing with silver grooved pulley wheel, isolated on pure white background (#FFFFFF), studio lighting with subtle shadows, automotive parts catalog style, photorealistic 8K, sharp focus, commercial quality, professional industrial photography'


class ProductImageGenerator:
    def __init__(self, api_key=None):
        """Initialize with OpenAI API key"""
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("❌ OpenAI API key not found. Set OPENAI_API_KEY environment variable.")
        
        self.client = OpenAI(api_key=self.api_key)
        self.base_dir = Path(__file__).parent
        self.images_dir = self.base_dir / 'images' / 'products'
        self.images_dir.mkdir(parents=True, exist_ok=True)
        
        # Track generated images
        self.generated_images = {}
        
    def analyze_products(self):
        """Analyze all product pages to determine categories"""
        print("📊 Analyzing product categories...")
        
        category_counts = defaultdict(int)
        category_products = defaultdict(list)
        
        for html_file in list(self.base_dir.glob('volvo/**/*.html')) + \
                          list(self.base_dir.glob('scania/**/*.html')):
            
            category_slug = html_file.parent.name
            part_no = html_file.stem
            brand = 'volvo' if 'volvo' in str(html_file) else 'scania'
            
            category_counts[category_slug] += 1
            category_products[category_slug].append({
                'part_no': part_no,
                'brand': brand,
                'file': html_file
            })
        
        print(f"\n✅ Found {len(category_counts)} categories:")
        for cat, count in sorted(category_counts.items(), key=lambda x: -x[1]):
            print(f"  - {cat}: {count} products")
        
        return category_products
    
    def generate_image(self, category_slug, brand, part_type='standard'):
        """Generate a single AI image using DALL-E 3"""
        
        # Check if already generated
        cache_key = f"{brand}_{category_slug}_{part_type}"
        if cache_key in self.generated_images:
            print(f"  ♻️ Using cached image for {cache_key}")
            return self.generated_images[cache_key]
        
        # Get prompt
        if part_type == 'dayco':
            prompt = DAYCO_PROMPT
            image_name = f"{brand}-suspension-dayco-tensioner.jpg"
        else:
            category_data = CATEGORY_PROMPTS.get(category_slug, CATEGORY_PROMPTS['misc'])
            prompt = category_data['prompt']
            image_name = f"{brand}-{category_slug}-standard.jpg"
        
        print(f"  🎨 Generating: {image_name}")
        print(f"     Prompt: {prompt[:100]}...")
        
        try:
            # Call DALL-E 3 API
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="hd",  # or "standard" for faster/cheaper
                n=1,
            )
            
            image_url = response.data[0].url
            print(f"  ✅ Generated successfully!")
            
            # Download image
            local_path = self.download_image(image_url, image_name)
            
            # Cache result
            self.generated_images[cache_key] = local_path
            
            # Rate limit: DALL-E 3 has limits
            time.sleep(2)
            
            return local_path
            
        except Exception as e:
            print(f"  ❌ Error generating image: {e}")
            return None
    
    def download_image(self, url, filename):
        """Download image from URL and save locally"""
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            # Save original
            img = Image.open(BytesIO(response.content))
            
            # Optimize
            output_path = self.images_dir / filename
            
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Save as JPEG with optimization
            img.save(output_path, 'JPEG', quality=90, optimize=True)
            
            print(f"  💾 Saved: {output_path}")
            
            return f"/images/products/{filename}"
            
        except Exception as e:
            print(f"  ❌ Error downloading image: {e}")
            return None
    
    def update_product_pages(self, category_products):
        """Update all product pages with new image URLs"""
        print("\n📝 Updating product pages with new images...")
        
        updated_count = 0
        
        for category_slug, products in category_products.items():
            print(f"\n  Processing {category_slug} ({len(products)} products)...")
            
            for product in products:
                try:
                    html_file = product['file']
                    part_no = product['part_no']
                    brand = product['brand']
                    
                    # Determine image type
                    if part_no.startswith('APV'):
                        image_path = self.generated_images.get(f"{brand}_{category_slug}_dayco")
                    else:
                        image_path = self.generated_images.get(f"{brand}_{category_slug}_standard")
                    
                    if not image_path:
                        continue
                    
                    # Read file
                    content = html_file.read_text(encoding='utf-8')
                    
                    # Update OG image
                    content = re.sub(
                        r'<meta content="https://partstrading\.com/images/[^"]*" property="og:image"/>',
                        f'<meta content="https://partstrading.com{image_path}" property="og:image"/>',
                        content
                    )
                    
                    # Update Twitter image
                    content = re.sub(
                        r'<meta content="https://partstrading\.com/images/[^"]*" property="twitter:image"/>',
                        f'<meta content="https://partstrading.com{image_path}" property="twitter:image"/>',
                        content
                    )
                    
                    # Update structured data image
                    content = re.sub(
                        r'"image": "https://partstrading\.com/images/[^"]*"',
                        f'"image": "https://partstrading.com{image_path}"',
                        content
                    )
                    
                    # Save
                    html_file.write_text(content, encoding='utf-8')
                    updated_count += 1
                    
                except Exception as e:
                    print(f"    ❌ Error updating {product['part_no']}: {e}")
        
        print(f"\n✅ Updated {updated_count} product pages!")
        return updated_count
    
    def run(self, dry_run=False):
        """Main execution flow"""
        print("🚀 Starting Automated Product Image Generation\n")
        print("=" * 60)
        
        # Step 1: Analyze products
        category_products = self.analyze_products()
        
        # Step 2: Generate unique images for each category
        print("\n" + "=" * 60)
        print("🎨 Generating AI Images with DALL-E 3...\n")
        
        total_to_generate = len(category_products) * 2  # Volvo + Scania for each category
        print(f"Will generate approximately {total_to_generate} unique images")
        print(f"Estimated cost: ${total_to_generate * 0.040:.2f} (DALL-E 3 HD: $0.040/image)")
        print(f"Estimated time: {total_to_generate * 3 / 60:.1f} minutes\n")
        
        if dry_run:
            print("🔍 DRY RUN MODE - No images will be generated")
            return
        
        input("Press Enter to continue or Ctrl+C to cancel... ")
        
        for category_slug in category_products.keys():
            print(f"\n📁 Category: {category_slug}")
            
            # Generate for Volvo
            self.generate_image(category_slug, 'volvo', 'standard')
            
            # Generate Dayco version for suspension (APV parts)
            if category_slug == 'suspension':
                self.generate_image(category_slug, 'volvo', 'dayco')
                self.generate_image(category_slug, 'scania', 'dayco')
            
            # Generate for Scania
            self.generate_image(category_slug, 'scania', 'standard')
        
        # Step 3: Update all product pages
        print("\n" + "=" * 60)
        self.update_product_pages(category_products)
        
        # Summary
        print("\n" + "=" * 60)
        print("✅ IMAGE GENERATION COMPLETE!")
        print("=" * 60)
        print(f"  Generated: {len(self.generated_images)} unique images")
        print(f"  Location: {self.images_dir}")
        print(f"  Updated: All product pages with new image URLs")
        print("\nNext steps:")
        print("  1. Review generated images in images/products/")
        print("  2. Commit changes to git")
        print("  3. Deploy to production")


def main():
    """Main entry point"""
    import sys
    
    # Check for dry run flag
    dry_run = '--dry-run' in sys.argv
    
    try:
        generator = ProductImageGenerator()
        generator.run(dry_run=dry_run)
        
    except KeyboardInterrupt:
        print("\n\n⚠️ Process cancelled by user")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()











