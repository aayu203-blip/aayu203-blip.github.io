# 🚀 CLEAN URL IMPLEMENTATION - OPTION B

**Target URL Format:** `/{brand}/{simplified-category}/{part-number}`

**Example:** `/scania/hydraulics/302624`

---

## 📋 CATEGORY MAPPING

| Current Folder Name | Simplified URL Slug |
|---------------------|---------------------|
| `air-&-fluid-filtration-systems` | `filtration` |
| `braking-system-components` | `braking` |
| `braking-system` | `braking` |
| `engine-components` | `engine` |
| `fuel-system-components` | `fuel` |
| `transmission-&-differential-components` | `transmission` |
| `hydraulic-systems-&-connectors` | `hydraulics` |
| `hydraulic-systems-&-connectors-&-connectors` | `hydraulics` |
| `steering-&-suspension-parts` | `suspension` |
| `lighting-&-exterior-body-components` | `exterior` |
| `fasteners,-hardware-&-accessories` | `hardware` |
| `clutch-and-transmission-components` | `clutch` |

---

## 🔧 IMPLEMENTATION STEPS

### Step 1: Test on 5 Files ✅
- Select 5 random product files
- Apply URL transformations
- Show before/after comparison
- Get user approval

### Step 2: Update Vercel Config ✅
- Add rewrite rules for clean URLs
- Support all brand/category combinations

### Step 3: Update All Product Pages (2,497 files)
- Canonical URLs
- Open Graph URLs
- Twitter URLs
- Schema.org URLs
- Breadcrumb URLs

### Step 4: Update Sitemaps
- Change all sitemap URLs to clean format

### Step 5: Deploy & Verify
- Git commit
- Push to production
- Verify on live site

---

## 📝 URL TRANSFORMATION EXAMPLES

### Volvo Engine:
```
BEFORE: /pages/products/volvo/engine-components/21063612.html
AFTER:  /volvo/engine/21063612
```

### Scania Hydraulics:
```
BEFORE: /pages/products/scania/hydraulic-systems-&-connectors/302624.html
AFTER:  /scania/hydraulics/302624
```

### Komatsu Braking:
```
BEFORE: /pages/products/komatsu/braking-system-components/12345.html
AFTER:  /komatsu/braking/12345
```

---

**Status:** Ready to test on 5 files!

