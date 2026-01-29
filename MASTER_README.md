# The Infinite SEO Engine ("God Mode") - Master Documentation

**Version:** 1.2 (Cleaned)
**Date:** January 28, 2026
**Repository:** https://github.com/aayu203-blip/nexgen (Deployed to Vercel)

## 1. Project Mission
To create the "Wikipedia of Heavy Machinery Parts" — a programmatic SEO engine that dominates search results for Volvo, Scania, CAT, and Komatsu parts. We have pivoted from a **Static Site Generation** model (Python -> HTML) to a **Dynamic Next.js Engine** (Live Data -> React) to handle 25,000+ pages efficiently.

## 2. Core Architecture

### 2.1 The "Next-Engine" (Frontend)
Located in `/next-engine`.
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Shadcn/UI (Industrial/Brutalist Aesthetic)
- **Search:** Fuse.js (Client-side fuzzy search, weighted for Part Numbers)
- **Data Layer:** `lib/data-loader.ts` (Hybrid loader: Static JSON + Live JSONL)

### 2.2 The "Intelligence Layer" (Backend Pipeline)
Located in `/next-engine/scripts`.
1.  **Harvester (`mass_harvest_sparepower.py`)**:
    -   **Source:** SparePower.co.za
    -   **Method:** Multi-threaded async crawling.
    -   **Output:** `full_dataset.jsonl` (Append-only log).
    -   **Status:** Active (26,000+ parts harvested).
2.  **Enricher (`enrich_db.py`)**:
    -   **Source:** Watches `full_dataset.jsonl` for new lines.
    -   **AI Engine:** Google Gemini 2.0 Flash.
    -   **Function:** Generates "Marketing Description", "Technical Specs", and "Application".
    -   **Output:** `data/enriched_specs.json`.
    -   **Config:** Turbo Mode (120 RPM, No Daily Limit).
3.  **Injector (`lib/data-loader.ts`)**:
    -   Merges Raw Data + AI Specs on the fly.
    -   **Naming Convention:** `[Part Number] [Brand] [Enriched Name]`

## 3. Data Schema (The "Part" Model)

Every product in our system conforms to this TypeScript definition (`lib/data-loader.ts`):

```typescript
type Part = {
    id: string;             // Generated ID (e.g., "harvest-1042")
    partNumber: string;     // CLEAN part number (e.g., "1521725")
    brand: string;          // Normalized: "Volvo", "Scania", "CAT", "Komatsu"
    name: string;           // Raw or Enriched Name
    description: string;    // Marketing copy (SEO rich)
    category: string;       // E.g., "Engine Parts", "Hydraulics"
    compatibility: string[];// List of supported machine models
    technical_specs?: {     // AI-Generated Attributes
        "Weight"?: string;
        "Material"?: string;
        "Thread Size"?: string;
    };
    application?: string;   // Clean Display Name (e.g., "Rock Drill Buffer Ring")
}
```

## 4. Script Bot Army (The "Workers")

We have a suite of Python automations in `next-engine/scripts/`.

### Core Pipeline
-   `mass_harvest_sparepower.py`: The Main Crawler. Runs 24/7.
-   `enrich_db.py`: The AI Brain. Enriches data in real-time.

### Utilities & Pilots
-   `mine_srp_pilot.py`: Experimental scraper for SRP.com.tr (Competitor analysis).
-   `clean_caterpillar_data.py`: Specialized script to fix formatting issues in CAT parts.
-   `check_homepage.py`: Health check for the landing page.
-   `download_sitemaps.py`: SEO utility to fetch competitor sitemaps for discovery.
-   `verify_miner.py`: QA tool to audit harvested data quality.

## 5. Legacy Context (The "Pivot")

You may see a huge number of HTML files or Python generation scripts in the root directory (outside `next-engine`).
-   **Old Strategy:** Generating 25,000 static `.html` files using Python templates.
-   **Why We Stopped:** Build times were too slow, and managing updates was impossible.
-   **Current Status:** These files are **deprecated** and excluded from Git (`.gitignore`). Do not use them. Focus entirely on `next-engine`.

## 6. Operational Status (as of Jan 28)

| Component | Status | Metrics |
| :--- | :--- | :--- |
| **Harvest** | 🟢 Active | 26,931 Parts (95% Volvo, 5% Others) |
| **Enrichment** | 🟢 Turbo | ~200 items/batch (Processing live) |
| **Frontend** | 🟢 Deployed | 500k+ potential programmatic pages |
| **Deployment** | 🟢 Live | GitHub (nexgen) -> Vercel |

## 7. Strategic Roadmap (For Deep Research)

### 7.1 Immediate Strategies
-   **Category Clustering:** Currently, parts are "flat". We need AI to cluster them into specific trees (e.g., `Engine` -> `Fuel Injection` -> `Injectors`).
-   **Internal Linking:** Programmatically link related parts (e.g., "Piston" page should link to "Piston Rings").

### 7.2 Content Engine
-   **Knowledge Hub:** Generate "How-To" guides that reference specific Part Numbers.
-   **Internationalization:** Activate `/es` (Spanish) and `/ar` (Arabic) subdirectories using `next-intl`.

---
**Note for Gemini Deep Research:**
This document is the **Single Source of Truth**. Ignore any logic found in the root directory's legacy Python scripts. The future is `next-engine`.
