# Security Baseline Report — partstrading.com
_Skill: rampstack/security-baseline | Date: 2026-05-04_

---

## Summary

| Category | Status |
|----------|--------|
| HTTPS/TLS | ✅ Pass |
| HTTP→HTTPS redirect | ✅ Pass |
| HSTS | ✅ Pass |
| Security headers (CSP, XFO, XCTO, RP, PP) | ❌ All missing |
| Sensitive file exposure | ⚠️ .htaccess readable |
| Secrets in source | ✅ Pass |
| Third-party script integrity | ✅ Fixed (SRI added) |
| Form security | ✅ Pass (no server-side form) |

---

## Findings

### ✅ HTTPS & TLS
- HTTP→HTTPS: 301 redirect working
- HSTS: `strict-transport-security: max-age=31556952` (1 year) — **good**
- Served via GitHub Pages + Fastly CDN — TLS 1.3 handled by infrastructure

### ✅ No Sensitive File Exposure
- `.env` → 404 ✅
- `.git/config` → 404 ✅
- `wp-admin/` → 404 ✅
- `admin/` → 404 ✅

### ⚠️ .htaccess Readable
- `/.htaccess` → **200** (returns full file content)
- Exposes server config (GZIP, mod_deflate directives)
- GitHub Pages ignores `.htaccess` but serves it as a static file
- Low risk, but best removed from public web root

**Fix**: Delete `.htaccess` from the repo (GitHub Pages doesn't use it) or add to robots.txt:
```
Disallow: /.htaccess
```

### ❌ Missing Security Headers
GitHub Pages doesn't allow custom response headers. All 5 standard security headers are absent.

**Fix**: Move DNS to Cloudflare (free) and add headers via Transform Rules:

| Header | Recommended Value |
|--------|-------------------|
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | See below |

**CSP for this stack** (starts permissive, tighten over time):
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://unpkg.com https://www.googletagmanager.com https://www.google-analytics.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://ipapi.co https://www.google-analytics.com https://analytics.google.com;
frame-src 'none';
```

Note: `unsafe-inline` is required while Babel compiles JSX in-browser. Eliminating Babel (see PERFORMANCE-REPORT.md) would allow removing `unsafe-inline`.

### ✅ No Secrets in Source
- GA4 Measurement ID (`G-9S54H015YY`) is public by design — not a secret
- No API keys, tokens, or credentials found in `index.html`
- ipapi.co call uses free tier (no key) ✅

### ✅ SRI Hashes Added (this session)
React, ReactDOM, and Babel CDN scripts now have `integrity=` hashes on the homepage.
Product pages had SRI added in a previous batch run.

### ✅ Third-party Script Inventory
| Script | Domain | Purpose | SRI |
|--------|--------|---------|-----|
| gtag.js | googletagmanager.com | GA4 analytics | ❌ (Google rotates, SRI not applicable) |
| react.production.min.js | unpkg.com | React runtime | ✅ |
| react-dom.production.min.js | unpkg.com | React DOM | ✅ |
| babel.min.js | unpkg.com | JSX transpiler | ✅ |
| search-db.js | self | Search index | — |
| ipapi.co/json | ipapi.co | Geolocation | N/A (fetch, not script) |

### ✅ No Server-side Forms
All form submissions open `mailto:` or `https://wa.me/` links — no server processing, no CSRF exposure.

---

## Priority Actions

| # | Action | Effort | Priority |
|---|--------|--------|----------|
| 1 | Add security headers via Cloudflare Transform Rules | 30 min | High |
| 2 | Remove `.htaccess` from repo (unused on GH Pages) | 2 min | Low |
| 3 | Move DNS to Cloudflare for header control | 15 min | Medium |
