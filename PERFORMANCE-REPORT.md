# Performance Optimization Report — partstrading.com
_Skill: rampstack/performance-optimization | Date: 2026-05-04_

> **Note**: PageSpeed Insights API quota exhausted during audit. Analysis based on direct HTML inspection, asset inventory, and known performance patterns for the stack.

---

## Stack Profile

| Property | Value |
|----------|-------|
| Hosting | GitHub Pages (Fastly CDN) |
| Framework | React 18 + Babel Standalone (in-browser transpilation) |
| Total HTML size | ~153 KB (homepage), ~91 KB (product pages) |
| Critical JS (CDN) | React 43 KB + ReactDOM 130 KB + Babel 1,630 KB = **~1.8 MB** |
| Fonts | Google Fonts (Inter + Barlow Condensed) |
| Static-first SSR | Yes (injected into `<div id="root">` — recently added) |

---

## Critical Issues

### ❌ P1 — Babel Standalone in Production (1.63 MB, render-blocking)
**Impact**: Babel standalone is a development-time transpiler. In production it compiles JSX in the browser on every page load — adding ~1.6 MB of JS that blocks rendering.

**Evidence**: `<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js">` in every page `<head>`. Babel parses and compiles the entire JSX `<script type="text/babel">` block (100–160 KB of source) at runtime.

**Estimated CWV impact**: TBT likely >600ms, LCP likely >4s on mobile 4G.

**Fix**: Pre-compile JSX to vanilla JS using a build step:
```bash
# Option A: esbuild (fastest, zero config)
npx esbuild index.html --bundle --outfile=dist/index.html

# Option B: Vite (full dev experience)
npx create-vite ptc-build --template react
# Move JSX into proper components, run: npm run build
```
This eliminates Babel entirely and reduces JS to ~140 KB (React + app code).

---

### ❌ P2 — No Preload for Largest Contentful Paint Image
**Impact**: The hero background image (`team-warehouse.jpg`) is referenced only in inline CSS (`backgroundImage: url(...)`), so the browser can't discover it until JS renders. LCP is delayed until after React paints.

**Fix**: Add a preload hint for the hero image in `<head>`:
```html
<link rel="preload" as="image" href="assets/images/team-warehouse.jpg" fetchpriority="high">
```

---

### ⚠️ P3 — Three Render-Blocking CDN Scripts
**Impact**: React, ReactDOM, and Babel all load synchronously from unpkg. Even with SRI hashes (now added), unpkg has variable latency from India.

**Fix (short-term)**: Add `defer` is not possible for React/Babel (Babel must execute before the JSX script). Best short-term option: self-host the files in `/assets/js/`:
```html
<script src="/assets/js/react.production.min.js" crossorigin="anonymous"></script>
<script src="/assets/js/react-dom.production.min.js" crossorigin="anonymous"></script>
<script src="/assets/js/babel.min.js" crossorigin="anonymous"></script>
```
GitHub Pages CDN will serve these with better cache-control and local latency from Mumbai visitors.

---

### ⚠️ P4 — Google Fonts Blocking Render
**Impact**: Two font families (Inter + Barlow Condensed) load from fonts.googleapis.com. Even with `preconnect`, the stylesheet fetch blocks rendering.

**Fix**: Add `font-display: swap` (already present via `display=swap` in URL ✅). Additionally, subset to only the weights used:
```html
<!-- Current (all weights) -->
family=Inter:wght@400;500;600;700

<!-- Optimized (drop 500 if not used) -->
family=Inter:wght@400;600;700&family=Barlow+Condensed:wght@700;800;900
```

---

### ⚠️ P5 — No Resource Hints for ipapi.co
**Impact**: Geolocation fetch at `https://ipapi.co/json/` happens after React renders. No DNS preconnect causes extra latency for the first call.

**Fix**:
```html
<link rel="preconnect" href="https://ipapi.co">
<link rel="dns-prefetch" href="https://ipapi.co">
```

---

## Passing / Low Impact

| Check | Status |
|-------|--------|
| HTTPS / HTTP→HTTPS redirect | ✅ 301 redirect working |
| Fastly CDN delivery | ✅ GitHub Pages via Fastly |
| HSTS header | ✅ max-age=31556952 |
| Font display=swap | ✅ in Google Fonts URL |
| Static-first HTML (SSR fallback) | ✅ recently added |
| Image dimensions in og:meta | ✅ recently fixed to 800×600 |
| GZip via .htaccess | ✅ configured (note: GitHub Pages ignores .htaccess) |

---

## Priority Action Plan

| # | Fix | Effort | CWV Impact |
|---|-----|--------|-----------|
| 1 | Pre-compile JSX (eliminate Babel) | High — requires build pipeline | ★★★★★ |
| 2 | Preload hero image | 1 line | ★★★★ |
| 3 | Self-host React/ReactDOM/Babel | 30 min | ★★★ |
| 4 | Reduce Google Fonts weights | 5 min | ★★ |
| 5 | Add dns-prefetch for ipapi.co | 1 line | ★ |

**Biggest single win**: Eliminating Babel standalone would likely improve mobile LCP by 2–3 seconds and TBT by >500ms. This requires converting the site to a proper build pipeline (Vite is the recommended path given the React stack).
