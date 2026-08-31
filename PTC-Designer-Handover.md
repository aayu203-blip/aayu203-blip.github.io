# PTC Website 2.0 — Designer Handover Brief
**Parts Trading Company · partstrading.com**
*Prepared April 2026 — for designer onboarding*

---

## 1. The Company

**Parts Trading Company (PTC)**
- Heavy equipment spare parts supplier — 70 years in business, Est. 1956
- Physical location: Vijay Chambers, Grant Road East, Mumbai 400004, India
- Phone / WhatsApp: +91 98210 37990
- Email: partstrading@gmail.com
- Website: partstrading.com (GitHub Pages + Vercel)

**What they sell:**
OEM and aftermarket spare parts for heavy construction and mining equipment — excavators, bulldozers, trucks, wheel loaders, dumpers, cranes, motor graders.

**Customers:**
International B2B procurement buyers — equipment operators, fleet managers, mining companies, construction firms. Based across India, Gulf, Africa, Southeast Asia, Russia, Europe, Americas. Primary lead capture is **WhatsApp** (global) and **Email** (US/EU/AU buyers).

**Key business stats (for use in copy and UI):**
- 51,000+ parts catalogued
- 70+ years in business (Est. 1956)
- 50+ countries served
- Same-day dispatch for orders confirmed before 3 PM IST (Mon–Sat)
- Quote turnaround: 60 minutes (Mon–Sat, 9 AM–6 PM IST)
- Payment: SWIFT wire transfer, UPI (India), PayPal/card (select cases)
- Shipping partners: DHL Express, FedEx, specialist freight forwarders

---

## 2. Brand & Design System

### The approved design direction: **Dark Industrial**

This is locked in. The demo homepage (`demo/index.html`) is the reference for everything.

### Colour palette
| Token | Hex | Usage |
|---|---|---|
| `bg` | `#050505` | Page background |
| `bgCard` | `#0D0D0D` | Cards, panels |
| `bgSection` | `#080808` | Section alternates |
| `bgAlt` | `#0B0B0B` | Section alternates |
| `footerBg` | `#020202` | Footer |
| `amber` | `#FFB81C` | Primary accent — CTAs, headings, highlights |
| `amberDim` | `rgba(255,184,28,0.12)` | Amber tints |
| `text` | `#F0ECE6` | Primary text |
| `muted` | `#777` | Secondary text |
| `dim` | `rgba(255,255,255,0.35)` | Tertiary text |
| `border` | `rgba(255,255,255,0.07)` | Card borders |
| `borderAlt` | `rgba(255,255,255,0.04)` | Subtle dividers |
| `green` | `#4ADE80` | In-stock, positive states |
| `greenDim` | `rgba(74,222,128,0.12)` | Green tints |

### Typography
| Role | Font | Weights |
|---|---|---|
| Headlines / display | **Barlow Condensed** | 700, 800, 900 |
| Body / UI | **Barlow** | 400, 500, 600, 700 |
| Part numbers / codes | `monospace` (system) | 700 |

**Font sizes in use:**
- Hero H1: 80–100px condensed, weight 900
- Section H2: 40–56px condensed, weight 800–900
- Sub-H2: 22–38px condensed, weight 800
- Body: 13–16px Barlow, weight 400–500
- Labels / eyebrows: 9–11px Barlow, weight 700, `letter-spacing: 0.13–0.16em`, `text-transform: uppercase`
- Part numbers in UI: monospace, 13–30px depending on context

### Grid & Layout
- Max content width: `1280px`, centered, `padding: 0 28px`
- Standard section padding: `72px 0`
- Card gap: `14–20px`
- Standard border-radius: `12–18px` (cards), `6–10px` (chips/badges), `7–8px` (buttons)

### Signature UI elements
- **Amber scrollbar**: `4–5px`, thumb `#FFB81C`
- **Noise texture overlay**: SVG fractalNoise at 2–3% opacity on dark hero sections
- **Grid lines on hero**: `rgba(255,184,28,0.025)` at `64px` intervals — industrial grid feel
- **Card shine effect**: on hover, a shimmer sweep from left to right in amber
- **Amber top-border on dropdowns**: `2px solid #FFB81C` at top of mega-menu panels
- **Ring pulse animation**: green/amber pulsing dot for "live" indicators (in-stock, counters)
- **Announcement bar**: thin `28px` black bar above nav for offers / shipping notices

### Navigation
- Fixed nav, `60px` height, sits below 28px announcement bar (total top offset: `88px`)
- Logo left, nav links center, CTA button right
- **Mega-menu dropdowns** on hover: "By Brand" (2-col grid) and "By Category" (3-col grid)
- Hover delay (160ms timeout) to prevent accidental close
- Nav becomes more opaque on scroll

### Motion principles
- `fadeUp` on entry: `opacity 0 → 1`, `translateY(28px) → 0`, `0.7–0.8s ease`
- Scroll-reveal: IntersectionObserver triggers staggered `fadeUp` on list items
- Hover transitions: `0.18–0.25s ease` on all interactive elements
- No floating particles, no background animations — clean and purposeful only
- Respects `prefers-reduced-motion`

---

## 3. Site Structure — What Exists Today

### Live URL pattern
All product pages are live at:
`https://partstrading.com/products/{part-number}`
(no `.html` — Vercel `cleanUrls` rewrite)

### Page inventory

| Page type | Count | Status | Design |
|---|---|---|---|
| **Product pages** | ~51,500 | ✅ Live | OLD DESIGN — needs 2.0 |
| **Equipment model pages** | 391 | ✅ Live | OLD DESIGN — needs 2.0 |
| **Homepage** | 1 | ✅ Live (demo done) | Demo is approved direction |
| **Blog posts** | ~65 | ✅ Live | Functional, basic |
| **About page** | 1 | ✅ Live | Basic |
| **Get a Quote page** | 1 | ✅ Live | Basic |
| **404 page** | 1 | ✅ Live | Has nav/footer |
| **Brand hub pages** | 0 | ❌ Not built | Needed |
| **Category hub pages** | 0 | ❌ Not built | Needed |

---

## 4. Product Database

### Brands in catalog
| Brand | Product Pages | Model Pages |
|---|---|---|
| Komatsu | ~25,400 | 58 |
| CAT (Caterpillar) | ~20,700 | 89 |
| Scania | ~1,700 | 55 |
| Hitachi | ~1,965 | 18 |
| Kobelco | ~821 | — |
| Volvo | ~787 | 52 |
| John Deere | ~94 | — |
| Hyundai | — | 20 |
| BEML | — | 42 |
| LiuGong | — | 15 |
| SANY | — | 19 |
| MAIT | — | 12 |
| Soilmec | — | 11 |

**Total: ~51,500 product pages across 7 brands with active parts data**

### Part categories (19 total)
These are the categories used in the live product database. Each has a category image in `assets/images/parts/`:

1. Engine Parts (`engine-parts`)
2. Hydraulic Parts (`hydraulic-parts`)
3. Filters (`filters`)
4. Electrical Parts (`electrical-parts`)
5. Transmission Parts (`transmission-parts`)
6. Undercarriage (`undercarriage`)
7. Brake Parts (`brake-parts`)
8. Cooling System (`cooling-system`)
9. Exhaust & Turbo (`exhaust-turbo`)
10. Seals & O-Rings (`seals-orings`)
11. Cab & Body Parts (`cab-body-parts`)
12. Bearing & Bushing (`bearing-bushing`)
13. Fuel System (`fuel-system`)
14. Drive & Swing Parts (`drive-swing-parts`)
15. Ground Engaging Tools (`ground-engaging-tools`)
16. Hardware & Fasteners (`hardware-fasteners`)
17. Suspension & Chassis (`suspension-chassis`)
18. Gearbox & Differential (`gearbox-differential`)
19. Steering Parts (`steering-parts`)

### Product page data structure
Every product page carries these data fields (relevant for design):

```
partNo        — e.g. "20459253" (primary identifier, monospace display)
name          — e.g. "Hydraulic Pump Assembly"
brand         — e.g. "Volvo"
brandSlug     — e.g. "volvo"
category      — e.g. "Hydraulic Parts"
catSlug       — e.g. "hydraulic-parts"
type          — "OEM" or "Aftermarket"
inStock       — true/false
enquiries     — integer (live-incrementing social proof counter)
fits[]        — array of compatible model names e.g. ["EC210","EC210B","EC240"]
specs[]       — array of {k, v} pairs (specification table rows)
xref[]        — array of cross-reference/alternate part numbers
description[] — array of paragraph strings (3 paragraphs, HTML allowed)
relatedParts[]— array of {partNo, name, cat, catSlug, brand, brandSlug}
faq[]         — array of {q, a} objects (5 questions per page)
```

### Image assets available
**Category images** (in `assets/images/parts/`):
- engine-parts.jpg, hydraulic-parts.jpg, filters.jpg, electrical-parts.jpg
- transmission-parts.jpg, undercarriage.jpg, brake-parts.jpg, cooling-system.jpg
- exhaust-turbo.jpg, seals-orings.jpg, cab-body-parts.jpg, bearing-bushing.jpg
- fuel-system.jpg, drive-swing-parts.jpg, ground-engaging-tools.jpg
- hardware-fasteners.jpg, suspension-chassis.jpg, gearbox-differential.jpg, steering-parts.jpg

**Company photos** (in `assets/images/`):
- `ptc-logo.webp` — primary logo (use on dark backgrounds)
- `ptc-logo.png` — PNG fallback
- `ptc-warehouse.webp` — warehouse interior
- `warehouse-shelves.jpg` — parts shelving
- `team-warehouse.jpg` — team in warehouse
- `ptc-team-exhibition.webp` — exhibition photo
- `packing.jpg`, `dispatch.jpg` — fulfilment process
- `parts-closeup.jpg` — parts macro photo

**Brand logos** referenced in homepage demo — stored in `assets/images/brands/`

---

## 5. Page Templates Needed (2.0 Build List)

### Priority 1 — Product Page (single template, ~51,500 pages)
**URL:** `/products/{part-number}` or `/{brand}/{category}/{part-number}`
**Purpose:** Convert a searcher who found a specific part into a quote request
**Key sections:**
1. Nav (universal)
2. Hero banner — category image + breadcrumb + part type chips
3. Product zone — image with live enquiry counter | H1 + specs + CTAs + dispatch countdown
4. Tabbed content — Specs / Compatibility / Description & Usage / Cross-Reference
5. Related parts grid
6. Stats strip
7. FAQ accordion (SEO — FAQPage schema)
8. WhatsApp/Email CTA section
9. Footer (universal)

**Special behaviours:**
- Geo-aware CTA: WhatsApp primary for most countries, Email primary for US/CA/GB/DE/FR/AU etc.
- Live enquiry counter: starts at seeded value, increments every 18–63 seconds
- Sticky bar: slides in after 480px scroll showing part number + In Stock + quote button
- Countdown timer to 3 PM IST same-day dispatch cutoff
- Shipping estimate shown based on visitor's detected country

### Priority 2 — Equipment Model Hub (391 pages, one template)
**URL:** `/equipment-models/{brand}/{brand}-{model}-parts.html`
**Example:** `/equipment-models/volvo/volvo-ec210-parts.html`
**Purpose:** "All parts for Volvo EC210" — SEO + navigation hub for model-specific buyers
**Key sections:**
1. Nav + Hero with model name as H1
2. Parts by category grid (links to product pages for this model)
3. Machine specs panel
4. Popular parts for this model
5. Cross-compatible models
6. FAQ for this model
7. CTA

### Priority 3 — Brand Hub (8 pages)
**URL:** `/{brand}/` e.g. `/volvo/`, `/komatsu/`
**Purpose:** Brand authority page + category navigation
**Key sections:**
1. Brand hero with logo + model count + part count
2. "Browse by category" grid (19 categories)
3. Popular models strip
4. Featured/popular parts
5. CTA

### Priority 4 — Category Hub (19 pages)
**URL:** `/parts/{category}/` e.g. `/parts/hydraulic-parts/`
**Purpose:** Category authority page for SEO
**Key sections:**
1. Category hero
2. Filter by brand
3. Parts grid
4. Category description (SEO text)
5. CTA

---

## 6. Technical Architecture

### Current tech stack
- **Static HTML** — no server, no CMS
- **React 18 + Babel standalone** — JSX transpiled in-browser (no build step needed)
  - Used only in demo pages; production pages currently use Alpine.js (old design)
- **Deployed:** GitHub Pages → Vercel → partstrading.com
- **Search index:** `assets/js/new_partDatabase.js` — 51,512 entries
- **Path index:** `assets/js/product-paths.js` — 103,020 lookup keys

### The demo homepage (`demo/index.html`)
This is the approved reference design. Self-contained HTML + inline JSX + Babel.
Open at: `file:///Users/aayush/Downloads/PTC%20Website/demo/index.html`

The homepage contains the full design system including:
- Announcement bar
- Mega-menu nav (By Brand + By Category dropdowns)
- Hero with live search (part number, description, brand filter)
- Animated stat counters
- Brand ticker (Volvo, Scania, Komatsu, CAT, Hitachi, Hyundai, BEML, LiuGong)
- Product category grid (19 categories)
- Equipment model browser (tabbed by brand)
- Trust / capability strip
- Live activity feed
- Testimonials
- Blog preview cards
- WhatsApp CTA section
- Contact form → WhatsApp
- Footer

### Theme constants (copy these exactly into all new pages)
```js
const D    = "'Barlow Condensed',sans-serif";  // display font
const B    = "'Barlow',sans-serif";             // body font
const AMBER = '#FFB81C';
const WA   = t => `https://wa.me/919821037990?text=${encodeURIComponent(t)}`;
const EMAIL = 'partstrading@gmail.com';

const T = {
  bg:'#050505', bgCard:'#0D0D0D', bgSection:'#080808', bgAlt:'#0B0B0B',
  text:'#F0ECE6', muted:'#777', dim:'rgba(255,255,255,0.35)',
  border:'rgba(255,255,255,0.07)', borderAlt:'rgba(255,255,255,0.04)',
  navBg:'rgba(5,5,5,0.96)', amber:AMBER, amberDim:'rgba(255,184,28,0.12)',
  green:'#4ADE80', greenDim:'rgba(74,222,128,0.12)',
  footerBg:'#020202',
};
```

### Geo-aware CTA logic
```js
// Countries where Email is shown as primary CTA (WhatsApp as secondary)
const EMAIL_FIRST = new Set([
  'US','CA','GB','DE','FR','JP','KR','IT','ES','NL','SE','NO','DK','FI','CH','AT','BE','NZ','IE','PT','AU'
]);

// Gulf countries (shorter shipping, used for delivery estimate)
const GULF = new Set(['AE','SA','KW','QA','BH','OM','YE','IQ','JO']);

// Geo fetched from: https://ipapi.co/json/?fields=country_code,country_name,timezone,continent_code
// Returns: { country, countryName, timezone, continent }
```

### SEO requirements (non-negotiable)
Every product page must include:
1. `<title>` — starts with part number: `{PN} {Name} | {Model1} {Model2} Parts | PTC India`
2. `<meta name="description">` — includes part number, brand, compatible models, Mumbai, Ships worldwide
3. `<link rel="canonical">` — no `.html` suffix in URL
4. `<h1>` — includes brand name + part number (e.g. "Volvo 20459253")
5. Four JSON-LD schema blocks: **Product**, **BreadcrumbList**, **FAQPage**, **Organization**
6. `itemScope` / `itemProp` microdata on product section
7. Semantic HTML: `<header>`, `<main>`, `<section aria-label>`, `<article>`, `<footer>`
8. `<h2>` for section titles, `<h3>` for FAQ questions
9. Proper OG and Twitter card meta tags
10. `rel="noopener"` on all `target="_blank"` links

---

## 7. Conversion Architecture

**Primary goal: every page ends in a WhatsApp or Email quote request.**

The funnel on each product page:
1. **Sticky bar** — always visible after scroll, always has quote button
2. **Hero CTAs** — primary button (WhatsApp or Email based on geo), secondary (the other one)
3. **Related parts** — each has its own "Get Quote →" button
4. **FAQ section** — ends with "Send a Question →" WhatsApp link
5. **CTA section** — full-width amber block, "Ready to Order?"
6. **Footer** — WhatsApp and Email buttons in footer brand column

**WhatsApp message pre-fill examples:**
```
Nav CTA:       "Hi, I'd like a quote for part {PN} — {Name} ({Brand}). Please confirm availability and shipping cost."
Product zone:  "Hi, I need a quote for {Brand} part {PN} — {Name}. Please confirm availability and shipping to my country."
Related part:  "Hi, I need a quote for {PN} — {Name} ({Brand})."
FAQ:           "Hi, I have a question about part {PN} — {Name} ({Brand})."
Bottom CTA:    "Hi, I need a quote for part {PN} — {Name} ({Brand}). Please confirm availability, pricing, and shipping cost to my country."
```

---

## 8. Copy & Tone Guidelines

**Voice:** Confident, specific, no filler. Think Rolls-Royce technical catalogue — not a marketplace vendor.

**DO use:**
- Specific specs and numbers ("350 bar", "210 L/min", "24.5 kg")
- Operational language ("ordered before 3 PM IST", "dispatched same day")
- Trust through specificity ("70 years", "50+ countries", "Mumbai warehouse")
- Competence signals ("pressure and flow tested before dispatch")
- Geographic reach (name actual countries — Gulf, Africa, Russia, Indonesia, Nigeria, Kenya, Australia)

**DO NOT use:**
- "Genuine", "authentic", "real" — defensive language signals insecurity
- "Guaranteed" or warranty claims
- "Lowest price" or any pricing language
- "We're the best" superlatives without evidence
- Emoji in headlines or CTAs (emojis allowed only in trust mini-cards / decorative UI)

---

## 9. Files & Folder Map

```
/Users/aayush/Downloads/PTC Website/
│
├── demo/
│   └── index.html              ← APPROVED HOMEPAGE DEMO (reference for everything)
│
├── index.html                  ← Live production homepage (older design, being replaced)
├── about.html
├── get-a-quote.html
├── 404.html
│
├── pages/products/             ← ~51,500 product pages (old design)
│   └── {part-number}.html
│
├── equipment-models/           ← 391 model hub pages (old design)
│   ├── volvo/   (52 pages)
│   ├── komatsu/ (58 pages)
│   ├── caterpillar/ (89 pages)
│   ├── hitachi/ (18 pages)
│   ├── hyundai/ (20 pages)
│   ├── scania/  (55 pages)
│   ├── beml/    (42 pages)
│   ├── liugong/ (15 pages)
│   ├── sany/    (19 pages)
│   ├── mait/    (12 pages)
│   └── soilmec/ (11 pages)
│
├── blog/
│   └── ~65 blog posts
│
├── assets/
│   ├── images/
│   │   ├── ptc-logo.webp       ← Primary logo
│   │   ├── ptc-warehouse.webp
│   │   ├── warehouse-shelves.jpg
│   │   ├── team-warehouse.jpg
│   │   ├── packing.jpg
│   │   ├── dispatch.jpg
│   │   └── parts/              ← 19 category images (all as {slug}.jpg)
│   └── js/
│       ├── new_partDatabase.js ← 51,512 part entries (search index)
│       ├── product-paths.js    ← 103,020 URL lookup keys
│       └── ptc-components.js   ← Shared nav/search component
```

---

## 10. What Needs Building (2.0 Scope)

| # | Deliverable | Notes |
|---|---|---|
| 1 | **Product page template** | Single HTML template, universal for all ~51,500 pages. Python build script stamps per-page data. Demo started, needs clean rebuild. |
| 2 | **Equipment model hub template** | One template for 391 pages. Hero + parts by category + machine specs + FAQ. |
| 3 | **Brand hub pages** × 8 | `/volvo/`, `/komatsu/`, `/cat/`, `/scania/`, `/hitachi/`, `/hyundai/`, `/beml/`, `/liugong/` |
| 4 | **Category hub pages** × 19 | `/parts/engine-parts/` etc. |
| 5 | **Contact page** | Full contact form + WhatsApp + map |
| 6 | **Client-side router / page transitions** | App-feel navigation. JS intercepts `<a>` clicks, fetches `<main>`, swaps with fade/slide, updates URL via `history.pushState()` |
| 7 | **Shared CSS + JS shell** | `assets/css/ptc.css` + `assets/js/ptc-shell.js` — nav, footer, router, search modal as shared includes |

---

*For questions, contact Aayush (business owner) directly via WhatsApp: +91 98210 37990*
*Live site: partstrading.com · Demo homepage: demo/index.html*
