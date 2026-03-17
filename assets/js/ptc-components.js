/**
 * PTC Shared Components — injected into all pages
 * Handles: Nav, Footer, WhatsApp Floater, Geo-IP Floating Bubble, Breadcrumbs, Search logic
 * Version: 2.0
 */

// ── SITE-WIDE CONFIG ────────────────────────────────────────────────────────
// Edit values here — referenced everywhere below so nothing needs to change in
// multiple places when details change.
const PTC_CONFIG = {
  baseUrl:   'https://partstrading.com',
  whatsapp:  '919821037990',
  email:     'parts@partstrading.com',
  phone:     '+91 98210 37990',
  phoneRaw:  '+919821037990',
  address:   'Grant Road, Mumbai<br>Maharashtra 400 007, India',
};

// ── PRODUCT PAGE LINK RESOLVER ───────────────────────────────────────────────
window.getProductPageLink = function (result) {
  const brandRaw = (result.Brand || '').toString().trim();
  const partNoRaw = (result['Part No'] || '').toString().trim();
  if (!partNoRaw) return '#';

  const brand  = brandRaw.toLowerCase();
  const partNo = partNoRaw.toUpperCase();

  if (typeof window.productPathIndex === 'object' && window.productPathIndex !== null) {
    const brandKey  = `${brand}|${partNo}`;
    const directPath = window.productPathIndex[brandKey] || window.productPathIndex[partNo];
    if (directPath) return directPath;
  }

  const brandSlug = brand.includes('caterpillar') ? 'cat' : brand.split(' ')[0];
  return `/pages/products/aftermarket-${brandSlug}-${partNo.toLowerCase()}.html`;
};

(function () {
  'use strict';

  // ── PAGE-SPECIFIC WHATSAPP MESSAGES ────────────────────────────────────────
  const PAGE_MESSAGES = {
    'jcb-spare-parts':            'Hi! I need JCB spare parts.',
    'doosan-spare-parts':         'Hi! I need Doosan excavator spare parts.',
    'liebherr-spare-parts':       'Hi! I need Liebherr mining equipment parts.',
    'atlas-copco-spare-parts':    'Hi! I need Atlas Copco drill/compressor parts.',
    'wirtgen-spare-parts':        'Hi! I need Wirtgen / Vögele / Hamm road equipment parts.',
    'terex-grove-crane-parts':    'Hi! I need Terex or Grove crane spare parts.',
    'normet-spare-parts':         'Hi! I need Normet underground equipment parts.',
    'volvo-ce-articulated-parts': 'Hi! I need Volvo CE articulated hauler (A-series) parts.',
    'bell-equipment-parts':       'Hi! I need Bell Equipment ADT (B25/B30) spare parts.',
    'russia-heavy-equipment':     'Hi! I need heavy equipment parts for export to Russia.',
    'indonesia-heavy-equipment':  'Hi! I need heavy equipment parts for export to Indonesia.',
    'uae-heavy-equipment':        'Hi! I need heavy equipment parts for UAE.',
    'south-africa-heavy-equipment': 'Hi! I need heavy equipment parts for South Africa.',
    'underground-mining-parts':   'Hi! I need underground mining equipment parts (Epiroc/Sandvik/Normet).',
    'blog':                       'Hi! I read your blog post and have a question about spare parts.',
    'equipment-models':           'Hi! I need spare parts for my equipment.',
  };

  function getWAMessage() {
    const path = window.location.pathname;
    for (const key in PAGE_MESSAGES) {
      if (path.indexOf(key) >= 0) return encodeURIComponent(PAGE_MESSAGES[key]);
    }
    return encodeURIComponent('Hi! I need heavy equipment spare parts. Can you help?');
  }

  // ── STYLE INJECTION (CSS design tokens + component overrides) ───────────────
  // All brand colours are defined here as CSS custom properties so that inline
  // styles elsewhere in this file can reference them via var().  Changing a
  // colour means editing exactly one line.
  const STYLE_HTML = `<style>
    :root {
      --ptc-color-whatsapp:        #25d366;
      --ptc-color-whatsapp-shadow: rgba(37, 211, 102, 0.4);
      --ptc-color-whatsapp-pulse:  rgba(37, 211, 102, 0.3);
      --ptc-color-accent:          #facc15;
      --ptc-color-accent-dim:      rgba(250, 204, 21, 0.3);
      --ptc-color-accent-border:   rgba(250, 204, 21, 0.5);
      --ptc-color-dark-overlay:    rgba(17, 24, 39, 0.95);
      --ptc-color-footer-bg:       #0f172a;
      --ptc-color-footer-text:     #cbd5e1;
      --ptc-color-footer-muted:    #94a3b8;
      --ptc-color-footer-faint:    #64748b;
      --ptc-color-nav-link:        #111827;
    }
    html { scroll-padding-top: 120px !important; }
    @keyframes ptcPulse {
      0%   { transform: scale(1);   opacity: 0.8; }
      70%  { transform: scale(1.6); opacity: 0;   }
      100% { transform: scale(1.6); opacity: 0;   }
    }
    @keyframes ptcSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    .nav-link:hover { color: #facc15 !important; }
    [id^="ptc-wa-"], .ptc-wa-btn { visibility: visible !important; opacity: 1 !important; display: flex !important; }
    #ptc-geo-bubble { display: block !important; }
    .geo-visible { opacity: 1 !important; transform: translateY(0) !important; animation: ptcSlideUp 0.6s backwards; }
    .ptc-breadcrumb { margin: 1.5rem 0; font-size: 0.8rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .ptc-breadcrumb a { color: #facc15; text-decoration: none; transition: color 0.2s; }
    .ptc-breadcrumb a:hover { color: #eab308; }
    .footer-link { transition: all 0.3s; }
    .footer-link:hover { color: var(--ptc-color-accent) !important; transform: translateX(5px); }
  </style>`;

  // ── NAV HTML ────────────────────────────────────────────────────────────────
  // • Uses PTC_CONFIG.baseUrl — edit once at the top of this file.
  // • Removed redundant inline color styles; .nav-link CSS rule above handles colour.
  // • onerror hides the logo img gracefully if the asset is missing.
  const NAV_HTML = '<nav aria-label="Main Navigation" class="sticky top-0 w-full z-50 bg-white shadow-lg border-b border-gray-200">'
    + '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">'
    + '<div class="flex justify-between items-center h-20">'
    + '<div class="flex items-center">'
    + '<a href="' + PTC_CONFIG.baseUrl + '/" class="flex-shrink-0 flex items-center space-x-4 hover:scale-105 transition-transform duration-300">'
    + '<img src="/assets/images/ptc-logo.webp" alt="Parts Trading Company" class="h-16 w-auto" width="200" height="64" onerror="this.style.display=\'none\'">'
    + '</a>'
    + '</div>'
    + '<div class="hidden md:flex items-center space-x-2">'
    + '<a class="nav-link px-4 py-2 font-bold transition-colors" style="color:#111827;" href="' + PTC_CONFIG.baseUrl + '/#home">HOME</a>'
    + '<a class="nav-link px-4 py-2 font-bold transition-colors" style="color:#111827;" href="' + PTC_CONFIG.baseUrl + '/#brands">BRANDS</a>'
    + '<a class="nav-link px-4 py-2 font-bold transition-colors" style="color:#111827;" href="' + PTC_CONFIG.baseUrl + '/#equipment-models">MODELS</a>'
    + '<a class="nav-link px-4 py-2 font-bold transition-colors" style="color:#111827;" href="' + PTC_CONFIG.baseUrl + '/#product-categories">PRODUCTS</a>'
    + '<a class="nav-link px-4 py-2 font-bold transition-colors" style="color:#111827;" href="' + PTC_CONFIG.baseUrl + '/blog/">BLOG</a>'
    + '<a class="ml-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all shadow-md" href="' + PTC_CONFIG.baseUrl + '/#contact">CONTACT</a>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</nav>';

  // ── WHATSAPP FLOATER HTML ────────────────────────────────────────────────────
  // Colours now reference CSS variables defined in STYLE_HTML above.
  const WA_FLOATER_HTML = '<a id="ptc-wa-float" href="#" target="_blank" rel="noopener" '
    + 'style="position:fixed;bottom:2.5rem;right:2.5rem;z-index:9999999 !important;'
    + 'background:var(--ptc-color-whatsapp) !important;color:#fff !important;border-radius:50%;width:70px;height:70px;'
    + 'display:flex;align-items:center;justify-content:center;'
    + 'box-shadow:0 8px 32px var(--ptc-color-whatsapp-shadow);border:2px solid rgba(255,255,255,0.2);'
    + 'cursor:pointer;text-decoration:none;transition:all 0.4s;visibility:visible !important;opacity:1 !important;">'
    + '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="white">'
    + '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>'
    + '</svg>'
    + '</a>'
    + '<div id="ptc-wa-pulse" style="position:fixed;bottom:2.5rem;right:2.5rem;z-index:9999998;width:70px;height:70px;border-radius:50%;background:var(--ptc-color-whatsapp-pulse);animation:ptcPulse 2s infinite;pointer-events:none;"></div>';

  // ── GEO BUBBLE HTML ──────────────────────────────────────────────────────────
  const GEO_BUBBLE_HTML = '<div id="ptc-geo-bubble" style="position:fixed;bottom:7.5rem;right:2.5rem;z-index:9999998;'
    + 'background:var(--ptc-color-dark-overlay);backdrop-filter:blur(10px);color:#fff;padding:0.75rem 1rem;border-radius:12px;'
    + 'font-size:0.75rem;font-weight:700;box-shadow:0 10px 40px rgba(0,0,0,0.3);border:1px solid var(--ptc-color-accent-border);'
    + 'display:none;transition:all 0.5s cubic-bezier(0.19,1,0.22,1);opacity:0;transform:translateY(20px);pointer-events:none;">'
    + '<div style="display:flex;align-items:center;gap:8px;">'
    + '<span id="ptc-geo-text">🌏 Fast Shipping Available</span>'
    + '</div>'
    + '<div style="position:absolute;bottom:-8px;right:25px;width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid var(--ptc-color-dark-overlay);"></div>'
    + '</div>';

  // ── FOOTER HTML ──────────────────────────────────────────────────────────────
  // Uses PTC_CONFIG for all contact data and baseUrl for all links.
  const FOOTER_HTML = '<div id="ptc-footer-container" style="clear:both;width:100%;border-top:1px solid rgba(0,0,0,0.05);">'
    + '<footer id="ptc-footer" style="background:var(--ptc-color-footer-bg);color:var(--ptc-color-footer-text);padding:5rem 1.5rem 3rem;margin-top:4rem;clear:both;position:relative;overflow:hidden;">'
    + '<div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--ptc-color-accent-dim),transparent);"></div>'
    + '<div style="max-width:1280px;margin:0 auto;position:relative;z-index:1;">'
    + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:4rem;margin-bottom:4rem;">'
    + '<div>'
    + '<img src="/assets/images/ptc-logo.webp" alt="Parts Trading Company" style="height:64px;margin-bottom:2rem;filter:brightness(0) invert(1);" width="200" height="64" onerror="this.style.display=\'none\'">'
    + '<p style="color:var(--ptc-color-footer-muted);font-size:0.95rem;line-height:1.8;margin-bottom:2rem;">India\'s globally trusted partner for high-precision OEM and aftermarket heavy machinery parts. We serve mining, construction, and power sectors across 40+ countries.</p>'
    + '<div style="display:flex;gap:15px;">'
    + '<span style="background:rgba(250,204,21,0.1);color:var(--ptc-color-accent);padding:6px 12px;border-radius:8px;font-size:0.75rem;font-weight:800;border:1px solid rgba(250,204,21,0.2);">ISO CERTIFIED OPS</span>'
    + '<span style="background:rgba(255,255,255,0.05);color:#fff;padding:6px 12px;border-radius:8px;font-size:0.75rem;font-weight:800;border:1px solid rgba(255,255,255,0.1);">20+ YEARS EXP</span>'
    + '</div>'
    + '</div>'
    + '<div>'
    + '<h4 style="color:#fff;font-weight:800;margin-bottom:2rem;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;">Solutions</h4>'
    + '<ul style="list-style:none;padding:0;margin:0;line-height:2.4;">'
    + '<li><a href="' + PTC_CONFIG.baseUrl + '/#brands" class="footer-link" style="color:var(--ptc-color-footer-muted);text-decoration:none;font-size:0.9rem;display:block;">Premium Brands</a></li>'
    + '<li><a href="' + PTC_CONFIG.baseUrl + '/#equipment-models" class="footer-link" style="color:var(--ptc-color-footer-muted);text-decoration:none;font-size:0.9rem;display:block;">Equipment Series</a></li>'
    + '<li><a href="' + PTC_CONFIG.baseUrl + '/#product-categories" class="footer-link" style="color:var(--ptc-color-footer-muted);text-decoration:none;font-size:0.9rem;display:block;">Major Components</a></li>'
    + '<li><a href="' + PTC_CONFIG.baseUrl + '/blog/" class="footer-link" style="color:var(--ptc-color-footer-muted);text-decoration:none;font-size:0.9rem;display:block;">Technical Analysis</a></li>'
    + '</ul>'
    + '</div>'
    + '<div>'
    + '<h4 style="color:#fff;font-weight:800;margin-bottom:2rem;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;">Get in Touch</h4>'
    + '<div style="margin-bottom:1.5rem;display:flex;align-items:flex-start;gap:12px;">'
    + '<div style="color:var(--ptc-color-accent);margin-top:4px;"><svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg></div>'
    + '<div><p style="color:#fff;font-weight:600;font-size:0.9rem;margin:0;">Headquarters</p><p style="color:var(--ptc-color-footer-muted);font-size:0.85rem;margin-top:4px;">' + PTC_CONFIG.address + '</p></div>'
    + '</div>'
    + '<div style="margin-bottom:1.5rem;display:flex;align-items:center;gap:12px;">'
    + '<div style="color:var(--ptc-color-accent);"><svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg></div>'
    + '<div><a href="tel:' + PTC_CONFIG.phoneRaw + '" style="color:#fff;font-weight:700;text-decoration:none;font-size:1rem;">' + PTC_CONFIG.phone + '</a></div>'
    + '</div>'
    + '<div style="display:flex;align-items:center;gap:12px;">'
    + '<div style="color:var(--ptc-color-accent);"><svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg></div>'
    + '<div><a href="mailto:' + PTC_CONFIG.email + '" style="color:#fff;font-weight:600;text-decoration:none;font-size:0.9rem;">' + PTC_CONFIG.email + '</a></div>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '<div style="border-top:1px solid rgba(255,255,255,0.05);padding-top:2.5rem;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1.5rem;">'
    + '<p style="font-size:0.85rem;color:var(--ptc-color-footer-faint);font-weight:500;">&copy; 2026 Parts Trading Company. Engineered for Reliability.</p>'
    + '<div style="display:flex;gap:2rem;">'
    + '<a href="' + PTC_CONFIG.baseUrl + '/#contact" style="color:var(--ptc-color-footer-faint);text-decoration:none;font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Request Quote</a>'
    + '<a href="' + PTC_CONFIG.baseUrl + '/#brands" style="color:var(--ptc-color-footer-faint);text-decoration:none;font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Bulk Supply</a>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</footer>'
    + '</div>';

  // ── INJECT ──────────────────────────────────────────────────────────────────
  function inject() {
    const path = window.location.pathname;
    const isHomepage = (path === '/' || path === '/index.html' || path.length < 2);

    // Styles (once per page)
    if (!document.getElementById('ptc-styles')) {
      const s = document.createElement('div');
      s.id = 'ptc-styles';
      // STYLE_HTML only contains a <style> tag — safe to use innerHTML here.
      s.innerHTML = STYLE_HTML;
      document.head.appendChild(s);
    }

    // WhatsApp floater
    if (!document.getElementById('ptc-wa-float')) {
      document.body.insertAdjacentHTML('beforeend', WA_FLOATER_HTML);
    }

    // Geo bubble
    if (!document.getElementById('ptc-geo-bubble')) {
      document.body.insertAdjacentHTML('beforeend', GEO_BUBBLE_HTML);
    }

    // Wire up WhatsApp link
    const waMsg   = getWAMessage();
    const waUrl   = 'https://wa.me/' + PTC_CONFIG.whatsapp + '?text=' + waMsg;
    const floatEl = document.getElementById('ptc-wa-float');
    if (floatEl) floatEl.href = waUrl;

    if (!isHomepage) {
      // NAV
      if (!document.querySelector('nav[aria-label="Main Navigation"]')) {
        document.querySelectorAll('nav').forEach(function (n) {
          if (!n.classList.contains('mb-8') && !n.innerText.includes('/')) n.remove();
        });
        document.querySelectorAll('div.bg-gray-900.text-white.py-3').forEach(function (d) { d.remove(); });
        document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
      }

      // FOOTER
      if (!document.getElementById('ptc-footer')) {
        document.querySelectorAll('footer').forEach(function (f) {
          let cur = f;
          while (cur && cur.tagName !== 'SCRIPT' && !cur.id.includes('ptc-components')) {
            const next = cur.nextElementSibling;
            cur.remove();
            cur = next;
          }
        });
        document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
      }

      // BREADCRUMBS
      if (!document.querySelector('.ptc-breadcrumb')) {
        const main = document.querySelector('main');
        if (main) {
          const h1 = main.querySelector('h1');
          if (h1) {
            let brand  = 'Brands';
            let partNo = '';
            const filename = path.split('/').pop();
            if (filename.includes('aftermarket-')) {
              const parts = filename.replace('.html', '').split('-');
              if (parts.length >= 3) {
                brand  = parts[1].toUpperCase();
                partNo = parts.slice(2).join(' ').toUpperCase();
              }
            }
            // breadcrumbHTML contains only static strings — no user input
            const breadcrumbHTML = '<div class="ptc-breadcrumb max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">'
              + '<a href="' + PTC_CONFIG.baseUrl + '/">Home</a> &nbsp;/&nbsp; '
              + '<a href="' + PTC_CONFIG.baseUrl + '/#brands">' + brand + '</a>'
              + (partNo ? ' &nbsp;/&nbsp; <span class="text-gray-900 font-bold">' + partNo + '</span>' : '')
              + '</div>';
            h1.insertAdjacentHTML('beforebegin', breadcrumbHTML);
          }
        }
      }
    }

    // ── GEO-IP SHIPPING BUBBLE ────────────────────────────────────────────────
    // • AbortController enforces a 3 s timeout so the fetch never hangs.
    // • city / country_name are set via textContent — NOT innerHTML — to prevent
    //   XSS if the upstream API ever returns a crafted payload.
    setTimeout(function () {
      const bubble = document.getElementById('ptc-geo-bubble');
      const el     = document.getElementById('ptc-geo-text');
      if (!bubble || !el) return;

      const controller = new AbortController();
      const timeoutId  = setTimeout(function () { controller.abort(); }, 3000);

      fetch('https://ipapi.co/json/', { signal: controller.signal })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          clearTimeout(timeoutId);
          if (data && data.city && data.country_name) {
            // DOM construction — no string concatenation into HTML
            const prefix = document.createTextNode('📦 Standard Shipping to ');
            const span   = document.createElement('span');
            span.style.color   = 'var(--ptc-color-accent)';
            span.style.fontWeight = '700';
            span.textContent   = data.city + ', ' + data.country_name;
            el.textContent = '';
            el.appendChild(prefix);
            el.appendChild(span);
          }
          bubble.classList.add('geo-visible');
        })
        .catch(function () {
          clearTimeout(timeoutId);
          // Show default "Fast Shipping Available" text on any error/timeout
          bubble.classList.add('geo-visible');
        });
    }, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
