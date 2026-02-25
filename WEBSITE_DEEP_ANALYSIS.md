# Deep Analysis: Parts Trading Company (PTC) Website Architecture

**Website:** [partstrading.com](https://partstrading.com)
**Architecture:** Static HTML (5,000+ pages)
**Primary Goal:** SEO dominance for "Heavy Machinery Spare Parts" (Volvo, Scania, CAT, Komatsu).

---

## 1. High-Level Architecture
The website uses a **Directory-Based Static Site** structure. There is no backend database; "content" is hardcoded into individual HTML files generated from Python scripts.

### Directory Structure
```text
/
├── index.html                  # Main Homepage (English)
├── pages/
│   ├── hubs/                   # Brand Hubs (Pillar Content)
│   │   ├── brand-scania.html   # "Scania Spare Parts"
│   │   └── brand-volvo.html    # "Volvo Spare Parts"
│   ├── categories/             # Level 3: Specific Sub-categories
│   │   └── volvo-engine.html
│   └── volvo-categories.html   # Level 2: Brand Category Index
├── products/                   # Level 4: Product Detail Pages (PDPs)
│   ├── 123456.html             # Individual Part Page
│   └── modern-template.html    # The Master Template for PDPs
├── assets/                     # CSS, JS, Images
├── es/                         # Spanish Localization (Mirror of Root)
├── fr/                         # French Localization (Mirror of Root)
└── scripts/                    # Python scripts for generation/maintenance
```

---

## 2. Page Type Analysis

### A. Homepage (`index.html`)
*   **Role:** The "Lobby". Routes users to Brands (Volvo/Scania) or Machine Types.
*   **Key SEO Elements:**
    *   **Keywords:** "Spare Parts India", "OEM", "Aftermarket".
    *   **Schema:** `Organization`, `LocalBusiness`, `WebSite`, `FAQPage`, `Service`, `Store`.
    *   **Strategy:** Targets broad, high-volume keywords.
*   **Current State:** Fully functional, CSS errors fixed. Links to Hubs using exact-match anchor text ("Volvo Spare Parts").

### B. Brand Hub Pages (`pages/hubs/brand-scania.html`)
*   **Role:** "Pillar Pages" for specific brands.
*   **Key SEO Elements:**
    *   **H1:** "Scania Truck Spare Parts" (Optimized).
    *   **Content:** "Maintenance Guide" section added for long-tail queries (e.g., "How to maintain Scania brakes").
    *   **Internal Linking:** Links down to Category Pages and specific high-volume Products.
*   **Optimization Status:** English pages are **Optimized**. Multilingual versions (`/es/pages/hubs/...`) are **Pending Update**.

### C. Category Pages (`pages/volvo-categories.html`)
*   **Role:** Navigational hubs. List sub-systems (Engine, Brakes, Transmission).
*   **Design:** Grid layout with SVG icons.
*   **SEO:** Targets mid-tail keywords like "Volvo Engine Components".
*   **Opportunity:** Content is thin (mostly links). Could benefit from introductory text describing the *types* of engine parts available.

### D. Product Detail Pages (`products/{part_number}.html`)
*   **Template Source:** `products/modern-template.html`.
*   **Role:** The "Conversion" page.
*   **Key Features:**
    *   **Conversion:** "WhatsApp Technician" button (No traditional cart).
    *   **Data:** Part Number, Brand, Category, "Often replaced with" (Cross-selling).
    *   **Schema:** `Product` with `MerchantListings` (Price, Shipping, Returns). *Note: We recently fixed a schema error here.*
*   **Content:** Programmatic descriptions ("{Part Name} is widely used across {Brand}...").
*   **User Action:** Users upload photos of their broken part for identification.

---

## 3. Multilingual Strategy (The "Mirror" Approach)
*   **Setup:** Subdirectories (`/es/`, `/fr/`, `/ar/`) mirror the root structure exactly.
*   **Implementation:** `hreflang` tags connect `partstrading.com` to `partstrading.com/es/`.
*   **Current Issue (Critical for Gemini Research):**
    *   The structure exists, but the **content inside the files** (titles, headers, body text) appears to be **partially un-synced or still in English** in some places.
    *   *Example:* `es/index.html` has English Meta Titles.
    *   **Action Plan:** We are scripting a "Propagation" task to copy SEO wins from English -> All Languages.

---

## 4. Technical SEO & Indexing

### Indexing Status (Google Search Console)
*   **Indexed:** ~8,000 pages.
*   **Not Indexed:** ~32,000 pages.
*   **Analysis:** This ratio is **expected** and **healthy**.
    *   The "Not Indexed" pages are mostly `Alternate with proper canonical tag` (i.e., the `/es/` page points to the `/en/` page as canonical, so Google doesn't index the duplicate content, which is correct behavior until the translations are distinct enough).

### Core Web Vitals
*   **Issue:** Heavy reliance on Tailwind CDN (`<script src="cdn.tailwindcss.com">`).
*   **Fix:** We generated a local `assets/css/tailwind.css` (15KB) to replace the CDN (3MB+ script).
*   **Status:** Applied to English Hubs. Needs propagation to all 5,000+ files.

---

## 5. Improvement Opportunities (For Gemini Deep Research)
If using Gemini for "Deep Research" to find improvements, focus on these prompts:

1.  **"Content Clustering":** *How can we group the 25,000 product pages into logical 'Systems' (e.g., 'Cooling System') better than just broad categories?*
2.  **"Programmatic SEO Content":** *Analyze `pages/hubs/brand-scania.html`. Generate 50 unique "How-To" guide titles that could link to this page to drive informational traffic.*
3.  **"Multilingual SEO":** *Check `es/index.html`. What specific Spanish keywords for 'Truck Spare Parts' are missing from the metadata compared to the English version?*
4.  **"Interlinking Graph":** *Propose a logic for the 'Often replaced with' section on PDPs. Currently, it's random. How can we make it semantic (e.g., if viewing 'Brake Pad', show 'Brake Disc')?*

---
*Report generated by Antigravity Agent on 2026-02-14.*
