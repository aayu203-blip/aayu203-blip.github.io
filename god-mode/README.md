# NexGen "God Mode" Engine - Complete Documentation

**Version:** 2.0 (Final Release)
**Date:** January 29, 2026
**Architecture:** Next.js 15 (App Router) + Tailwind + Fuse.js + Gemini AI

---

## 1. Executive Summary
This project ("God Mode") is a high-performance, infinite-scale e-commerce engine for heavy machinery parts. It is designed to act as a **"Digital Cleanroom"**—a hyper-fast, noise-free interface for procurement professionals and engineers.

It features a **Self-Feeding Content Engine** that crawls competitors, enriches product data using AI, and generates technical guides programmatically.

## 2. System Architecture

### 2.1 The Core (Frontend)
Located in `/god-mode`.
-   **Framework:** Next.js 15 (App Router) with `next-intl` for Global Scaling (EN/ES/AR).
-   **Search:** `Fuse.js` (Client-side fuzzy search, <50ms latency for 100k items).
-   **UI/UX:** "Digital Cleanroom" aesthetic (High Contrast, Technical Fonts, Blueprint Blue).
-   **Toggle:** "God Mode" Switch (Toggles between **Procurement** and **Engineering** views).

### 2.2 The Intelligence Layer (Background Scripts)
Located in `/god-mode/scripts/`.

| Script | Function | Metric |
| :--- | :--- | :--- |
| `mass_harvest_sparepower.py` | **Crawler**. Multi-threaded scraping of competitor catalogs. | **29,067** Products Harvested |
| `enrich_all_products.py` | **Enricher**. Uses Gemini API to generate marketing descriptions & specs. | **34,191** Products Enriched |
| `content_factory.py` | **Content Engine**. Generates combinatorial SEO guides (Brand x Machine x Problem). | **262+** Unique Guides |

### 2.3 Data Flow
1.  **Harvest**: Raw data enters `data/full_dataset.jsonl`.
2.  **Enrich**: AI processes raw data -> `data/enriched_product_data.json`.
3.  **Generate**: Content Factory creates `data/generated_guides.json`.
4.  **Load**: `lib/data-loader.ts` merges all 3 sources at build time to create the "Infinite Index".

## 3. Key Features

### 🛒 Commerce & Trust
-   **WhatsApp-First**: No traditional cart. "Add to Cart" generates a pre-filled WhatsApp message for instant B2B quoting.
-   **Bulk BOM Tool**: Paste a text list of part numbers on the homepage -> Get a bulk quote link.
-   **Trust Pages**: `/about` (Brand Authority) and `/contact` (Global Logistics + Maps).

### 🧠 Knowledge Hub (`/guides`)
-   A library of technical maintenance guides.
-   **Smart Linking**: Keywords (e.g., "Volvo") in articles act as portals, auto-linking to the respective Brand/Machine pages.
-   **Structured Data**: Automatic `TechArticle` JSON-LD injection for Google.

### 🌍 Global Scaling
-   **i18n**: Built from the ground up for localization.
-   Structure: `app/[locale]/...` supports `/es` (Spanish), `/fr` (French), etc. just by adding a JSON translation file.

## 4. Operational Metrics (As of Jan 29)
*   **Total Index**: **63,000+** Data Points (Harvested + Enriched).
*   **Search**: Fully Functional (Fuzzy Matching + Weighting).
*   **Content**: 262 Technical Guides.
*   **Performance**: 100/100 Lighthouse on Verified Pages.

## 5. Deployment Guide

### Prerequisites
-   Node.js 18+
-   Python 3.9+ (For background scripts)
-   Gemini API Key (For enrichment/generation)

### Installation
```bash
cd god-mode
npm install
```

### Running the System
**1. Frontend (Dev)**
```bash
npm run dev
```

**2. Background Crawlers (Optional)**
```bash
# To harvest more products
python3 scripts/mass_harvest_sparepower.py

# To generate more guides (Requires API Key)
export GEMINI_API_KEY="your_key"
python3 scripts/content_factory.py
```

**3. Production Build**
```bash
npm run build
npm start
```

---
**Maintained by:** NexGen Engineering Team

---

## 6. Page Index & Live Examples

Here is a complete index of the available page types in the application.

### core
| Page Type | Route Pattern | Description | Data Source | Example URL (Production) |
| :--- | :--- | :--- | :--- | :--- |
| **Homepage** | `/en` | The main landing page. "Digital Cleanroom" design. | Hardcoded (for speed) + `getFeaturedParts` | [nexgenspares.com/en](https://nexgenspares.com/en) |
| **Search Results** | `/en/search?q=...` | Full-text fuzzy search results. | `Fuse.js` Index (Client-side) | [nexgenspares.com/en/search?q=filter](https://nexgenspares.com/en/search?q=filter) |
| **Static Pages** | `/en/about`, `/en/contact` | Trust and logistics information. | Static MDX/TSX | [nexgenspares.com/en/about](https://nexgenspares.com/en/about) |

### Commerce (Catalog)
| Page Type | Route Pattern | Description | Data Source | Example URL (Production) |
| :--- | :--- | :--- | :--- | :--- |
| **Product Detail** | `/en/p/[slug]` | The core PDP. technical specs, cross-refs, and WhatsApp CTA. | `parts-database.json` (Enriched) | [nexgenspares.com/en/p/cat-1r-0716](https://nexgenspares.com/en/p/cat-1r-0716) |
| **Brand Index** | `/en/brands/[brand]` | Filtered list of parts for a specific OEM brand. | Filtered Database | [nexgenspares.com/en/brands/caterpillar](https://nexgenspares.com/en/brands/caterpillar) |
| **Machine Index** | `/en/machines/[machine]` | Parts compatible with a specific machine model. | Filtered Database | [nexgenspares.com/en/machines/cat-320d](https://nexgenspares.com/en/machines/cat-320d) |
| **Category Index** | `/en/category/[cat]` | *[Planned]* Filter by part type (e.g., "Filters"). | *Not yet implemented* | N/A |

### Content (SEO)
| Page Type | Route Pattern | Description | Data Source | Example URL (Production) |
| :--- | :--- | :--- | :--- | :--- |
| **Guides Index** | `/en/guides` | List of all technical maintenance guides. | `generated_guides.json` | [nexgenspares.com/en/guides](https://nexgenspares.com/en/guides) |
| **Guide Detail** | `/en/guides/[slug]` | Specific technical article with auto-linking to products. | `generated_guides.json` | [nexgenspares.com/en/guides/how-to-replace-cat-320d-filter](https://nexgenspares.com/en/guides/how-to-replace-cat-320d-filter) |

### Functional Components
*   **Bulk Paste Tool**: On Homepage. Parses raw text lines -> Generates Bulk WhatsApp Quote.
*   **Hero Search**: Type-ahead search with "God Mode" speed (<50ms).

# Force redeploy - Fri Jan 30 13:47:45 IST 2026
