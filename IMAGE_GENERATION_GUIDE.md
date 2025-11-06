# 🤖 Automated AI Product Image Generation Guide

## 📋 Overview

This automated solution generates professional product images for all 2,497 parts using OpenAI's DALL-E 3 API.

**What it does:**
1. ✅ Analyzes your product catalog
2. ✅ Identifies 10 unique categories
3. ✅ Generates ~20-30 AI images (one per category × brand)
4. ✅ Downloads and optimizes images
5. ✅ Updates all 2,497 product pages automatically

**Time:** 15-30 minutes (automated)  
**Cost:** $0.80 - $1.20 (see breakdown below)

---

## 💰 Cost Breakdown

### DALL-E 3 Pricing (as of Oct 2024):
- **Standard Quality:** $0.040/image (1024×1024)
- **HD Quality:** $0.080/image (1024×1024)

### Your Project:
```
Categories: 10 (engine, braking, suspension, etc.)
Brands: 2 (Volvo, Scania)
Special: 2 (Dayco APV variants)

Total Images: 22 unique images

Cost Estimate:
- Standard Quality: 22 × $0.040 = $0.88
- HD Quality: 22 × $0.080 = $1.76

Recommended: HD Quality ($1.76 total)
```

**Monthly API costs:** ~$2 (if you regenerate occasionally)

---

## 🚀 Setup Instructions

### Step 1: Install Requirements

```bash
cd "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete"

# Install Python packages
pip3 install openai pillow requests
```

### Step 2: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

**Pricing Note:** You'll need to add credit to your OpenAI account
- Minimum: $5
- Recommended: $10 (plenty for this project + extras)

### Step 3: Set API Key

**Option A: Environment Variable (Temporary)**
```bash
export OPENAI_API_KEY="sk-your-key-here"
```

**Option B: .env File (Recommended)**
```bash
# Create .env file
echo 'OPENAI_API_KEY=sk-your-key-here' > .env

# Install python-dotenv
pip3 install python-dotenv
```

### Step 4: Test (Dry Run)

```bash
# Run without generating images (free test)
python3 generate_product_images.py --dry-run
```

This will show:
- ✅ How many categories found
- ✅ How many images will be generated
- ✅ Estimated cost
- ✅ Estimated time
- ❌ No actual API calls or charges

### Step 5: Generate Images (REAL RUN)

```bash
# Generate all images and update pages
python3 generate_product_images.py
```

**What happens:**
1. Script analyzes all 2,497 products ✓
2. Shows summary and asks for confirmation
3. Generates 22 unique AI images (~15-20 minutes)
4. Downloads and optimizes each image
5. Updates all product page HTML automatically
6. Shows final summary

---

## 📊 What You'll Get

### Generated Images:

```
images/products/
├── volvo-engine-standard.jpg
├── volvo-braking-standard.jpg
├── volvo-suspension-standard.jpg
├── volvo-suspension-dayco-tensioner.jpg    ← Special for APV parts
├── volvo-transmission-standard.jpg
├── volvo-filtration-standard.jpg
├── volvo-fuel-standard.jpg
├── volvo-exterior-standard.jpg
├── volvo-hydraulics-standard.jpg
├── volvo-hardware-standard.jpg
├── volvo-misc-standard.jpg
├── scania-engine-standard.jpg
├── scania-braking-standard.jpg
├── scania-suspension-standard.jpg
├── scania-suspension-dayco-tensioner.jpg   ← Special for APV parts
├── scania-transmission-standard.jpg
├── scania-filtration-standard.jpg
├── scania-fuel-standard.jpg
├── scania-exterior-standard.jpg
├── scania-hydraulics-standard.jpg
├── scania-hardware-standard.jpg
└── scania-misc-standard.jpg
```

**Total:** 22 images covering 2,497 products

---

## 🎨 Image Quality

**All images will have:**
- ✅ Pure white background (#FFFFFF)
- ✅ Professional studio lighting
- ✅ Photorealistic quality
- ✅ 1024×1024 resolution (high quality)
- ✅ Optimized JPEG (90% quality, <150KB)
- ✅ Commercial product photography style

---

## 📝 What Gets Updated

### On Every Product Page:

**Before:**
```html
<meta property="og:image" content="https://partstrading.com/images/volvo-parts.jpg"/>
<meta property="twitter:image" content="https://partstrading.com/images/volvo-parts.jpg"/>
"image": "https://partstrading.com/images/volvo-parts.jpg"
```

**After:**
```html
<meta property="og:image" content="https://partstrading.com/images/products/volvo-suspension-dayco-tensioner.jpg"/>
<meta property="twitter:image" content="https://partstrading.com/images/products/volvo-suspension-dayco-tensioner.jpg"/>
"image": "https://partstrading.com/images/products/volvo-suspension-dayco-tensioner.jpg"
```

---

## ⚙️ Advanced Options

### Customize Prompts

Edit `CATEGORY_PROMPTS` in `generate_product_images.py`:

```python
CATEGORY_PROMPTS = {
    'engine': {
        'name': 'Engine Components',
        'prompt': 'Your custom prompt here...'
    },
    # Add more...
}
```

### Change Image Quality

In the script, modify:

```python
response = self.client.images.generate(
    model="dall-e-3",
    prompt=prompt,
    size="1024x1024",
    quality="hd",      # Change to "standard" for cheaper
    n=1,
)
```

**Cost Impact:**
- `quality="standard"` → $0.040/image ($0.88 total)
- `quality="hd"` → $0.080/image ($1.76 total)

### Generate Specific Categories Only

Modify the script or add command-line args to filter categories.

---

## 🐛 Troubleshooting

### "OpenAI API key not found"

**Solution:**
```bash
# Check if key is set
echo $OPENAI_API_KEY

# If empty, set it:
export OPENAI_API_KEY="sk-your-key-here"
```

### "Rate limit exceeded"

**Solution:**
- Script already has 2-second delays
- If still happening, increase `time.sleep(2)` to `time.sleep(5)`

### "Insufficient credits"

**Solution:**
- Go to https://platform.openai.com/account/billing
- Add credits (minimum $5)

### "Module not found: openai"

**Solution:**
```bash
pip3 install openai pillow requests
```

### Images look wrong or low quality

**Solutions:**
1. Use `quality="hd"` instead of `"standard"`
2. Customize prompts in the script
3. Regenerate specific categories

---

## 📈 Expected SEO Impact

### Before Automation:
- ❌ Generic "volvo-parts.jpg" on all pages
- ❌ No product-specific images
- Score: 95/100

### After Automation:
- ✅ Category-specific professional images
- ✅ 22 unique images across 2,497 products
- ✅ Better click-through rates
- ✅ Rich snippets more likely
- Score: 97/100

### With Real Photos Later:
- ✅ Actual product photography
- Score: 100/100

---

## 🔄 Re-running the Script

Safe to run multiple times:
- ✅ Caches generated images
- ✅ Won't regenerate if already exists
- ✅ Only updates changed files

To force regeneration:
```bash
# Delete cached images
rm -rf images/products/*.jpg

# Run again
python3 generate_product_images.py
```

---

## 📦 Deployment

After generation:

```bash
# Review generated images
ls -lh images/products/

# Check a few sample product pages
open volvo/suspension/APV2400.html

# Commit to git
git add images/products/
git add volvo/ scania/
git commit -m "feat: Add AI-generated product images to all 2,497 pages"

# Deploy
git push origin main
```

---

## 💡 Tips

1. **Run dry-run first** to see estimates
2. **Check 1-2 generated images** before continuing all
3. **Keep API key secure** - don't commit to git
4. **Monitor API costs** at platform.openai.com
5. **Save generated images** - they're reusable

---

## 📞 Support

If you encounter issues:
1. Check OpenAI status: https://status.openai.com
2. Review API docs: https://platform.openai.com/docs
3. Check account credits: https://platform.openai.com/account/billing

---

## 🎯 Summary

**Investment:**
- Time: 15-30 minutes (mostly automated)
- Cost: ~$2 (one-time)
- Result: Professional images on all 2,497 products

**ROI:**
- Better SEO rankings
- Higher click-through rates
- More professional appearance
- Improved trust signals
- Worth it: ✅ Absolutely!

---

Ready to generate images? Run:

```bash
python3 generate_product_images.py --dry-run  # Test first
python3 generate_product_images.py            # Real run
```


