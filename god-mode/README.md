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
