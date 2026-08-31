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
  email:     'partstrading@gmail.com',
  phone:     '+91 98210 37990',
  phoneRaw:  '+919821037990',
  address:   'Grant Road, Mumbai<br>Maharashtra 400 007, India',
};

// ── PRODUCT PAGE LINK RESOLVER ───────────────────────────────────────────────
window.getProductPageLink = function (result) {
  const brandRaw = (result.Brand || '').toString().trim();
  const partNoRaw = (result['Part No'] || '').toString().trim();
  if (!partNoRaw) return '#';

  const brand     = brandRaw.toLowerCase();
  const partNo    = partNoRaw.replace(/^-+/, '').toUpperCase(); // display form
  const partNoKey = partNo.toLowerCase();                        // lookup form (index uses lowercase)

  if (typeof window.productPathIndex === 'object' && window.productPathIndex !== null) {
    const directPath = window.productPathIndex[`${brand}|${partNoKey}`]
                    || window.productPathIndex[partNoKey]
                    || window.productPathIndex[`${brand}|${partNo}`]
                    || window.productPathIndex[partNo];
    if (directPath) return directPath;
  }

  // No page exists for this part — open WhatsApp with the part number pre-filled
  const waText = encodeURIComponent(
    `Hi, I need the part ${partNo}${brandRaw ? ' (' + brandRaw + ')' : ''} — do you have it in stock?`
  );
  return `https://wa.me/919821037990?text=${waText}`;
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
    // Product page: extract brand + part number for a specific pre-filled message
    if (path.indexOf('/pages/aftermarket-') >= 0) {
      const m = path.match(/aftermarket-([a-z]+)-(.+?)\.html/i);
      if (m) {
        const brand   = m[1].charAt(0).toUpperCase() + m[1].slice(1);
        const partNum = m[2].toUpperCase();
        return encodeURIComponent('I need a quote for ' + brand + ' ' + partNum + '. Please advise on availability and pricing from Mumbai.');
      }
    }
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
      --ptc-color-accent:          #FFB81C;
      --ptc-color-accent-dim:      rgba(255, 184, 28, 0.3);
      --ptc-color-accent-border:   rgba(255, 184, 28, 0.5);
      --ptc-color-dark-overlay:    rgba(5, 5, 5, 0.97);
      --ptc-color-footer-bg:       #020202;
      --ptc-color-footer-text:     #b8b4ae;
      --ptc-color-footer-muted:    #777;
      --ptc-color-footer-faint:    #555;
      --ptc-color-nav-link:        rgba(255,255,255,0.65);
    }
    html { scroll-padding-top: 80px !important; }
    @keyframes ptcPulse {
      0%   { transform: scale(1);   opacity: 0.8; }
      70%  { transform: scale(1.6); opacity: 0;   }
      100% { transform: scale(1.6); opacity: 0;   }
    }
    @keyframes ptcSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    @keyframes ptcDrawerIn {
      from { transform: translateX(100%); }
      to   { transform: translateX(0); }
    }
    .ptc-nav-link:hover { color: #F0ECE6 !important; }
    [id^="ptc-wa-"], .ptc-wa-btn { visibility: visible !important; opacity: 1 !important; display: flex !important; }
    #ptc-geo-bubble { display: block !important; }
    .geo-visible { opacity: 1 !important; transform: translateY(0) !important; animation: ptcSlideUp 0.6s backwards; }
    .ptc-breadcrumb { margin: 1.5rem 0; font-size: 0.8rem; color: rgba(255,255,255,0.35); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .ptc-breadcrumb a { color: #FFB81C; text-decoration: none; transition: color 0.2s; }
    .ptc-breadcrumb a:hover { color: #F0ECE6; }
    .footer-link { transition: all 0.3s; }
    .footer-link:hover { color: var(--ptc-color-accent) !important; transform: translateX(5px); }
    /* Nav desktop/mobile visibility */
    .ptc-nav-desktop { display: flex !important; }
    .ptc-mob-btn     { display: none !important; }
    @media(max-width:768px) {
      .ptc-nav-desktop { display: none !important; }
      .ptc-mob-btn     { display: flex !important; }
    }
    /* Mobile drawer */
    #ptc-mob-overlay { display:none; position:fixed; inset:0; z-index:1099; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); }
    #ptc-mob-drawer  { display:none; position:fixed; top:0; right:0; bottom:0; width:min(300px,100vw); z-index:1100; background:#080808; border-left:1px solid rgba(255,255,255,0.07); overflow-y:auto; flex-direction:column; box-shadow:-24px 0 80px rgba(0,0,0,0.9); animation:ptcDrawerIn .22s ease; }
    #ptc-mob-overlay.ptc-open, #ptc-mob-drawer.ptc-open { display:flex; }
  </style>`;

  // ── NAV HTML ────────────────────────────────────────────────────────────────
  // • Uses PTC_CONFIG.baseUrl — edit once at the top of this file.
  // • Removed redundant inline color styles; .nav-link CSS rule above handles colour.
  // • onerror hides the logo img gracefully if the asset is missing.
  const WA_SVG_SM = '<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  const MOB_BRANDS = [
    ['Volvo','/volvo/'],['Scania','/scania/'],['Komatsu','/komatsu/'],
    ['CAT','/cat/'],['Hitachi','/hitachi/'],['Sany','/sany/'],['JCB','/jcb/']
  ];

  const NAV_HTML = '<nav id="ptc-nav" aria-label="Main Navigation" style="position:sticky;top:0;z-index:1000;background:rgba(5,5,5,0.97);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.07);">'
    + '<div style="max-width:1360px;margin:0 auto;padding:0 20px;height:64px;display:flex;align-items:center;justify-content:space-between;gap:12px;">'
    // Logo
    + '<a href="' + PTC_CONFIG.baseUrl + '/" style="display:flex;align-items:center;flex-shrink:0;text-decoration:none;">'
    + '<img src="/assets/images/ptc-logo.png" alt="Parts Trading Company" style="height:36px;width:auto;" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\'">'
    + '<span style="display:none;font-family:\'Barlow Condensed\',sans-serif;font-size:18px;font-weight:900;color:#FFB81C;letter-spacing:.04em;">PTC</span>'
    + '</a>'
    // Desktop links
    + '<div class="ptc-nav-desktop" style="align-items:center;gap:2px;">'
    + '<a class="ptc-nav-link" href="' + PTC_CONFIG.baseUrl + '/" style="color:rgba(255,255,255,.65);font-family:\'Barlow\',sans-serif;font-size:13px;font-weight:500;padding:0 13px;height:64px;display:flex;align-items:center;text-decoration:none;transition:color .18s;letter-spacing:.04em;text-transform:uppercase;">Home</a>'
    + '<a class="ptc-nav-link" href="' + PTC_CONFIG.baseUrl + '/volvo/" style="color:rgba(255,255,255,.65);font-family:\'Barlow\',sans-serif;font-size:13px;font-weight:500;padding:0 13px;height:64px;display:flex;align-items:center;text-decoration:none;transition:color .18s;letter-spacing:.04em;text-transform:uppercase;">Volvo</a>'
    + '<a class="ptc-nav-link" href="' + PTC_CONFIG.baseUrl + '/scania/" style="color:rgba(255,255,255,.65);font-family:\'Barlow\',sans-serif;font-size:13px;font-weight:500;padding:0 13px;height:64px;display:flex;align-items:center;text-decoration:none;transition:color .18s;letter-spacing:.04em;text-transform:uppercase;">Scania</a>'
    + '<a class="ptc-nav-link" href="' + PTC_CONFIG.baseUrl + '/blog/" style="color:rgba(255,255,255,.65);font-family:\'Barlow\',sans-serif;font-size:13px;font-weight:500;padding:0 13px;height:64px;display:flex;align-items:center;text-decoration:none;transition:color .18s;letter-spacing:.04em;text-transform:uppercase;">Blog</a>'
    + '<a href="https://wa.me/919821037990?text=Hi%2C%20I%20need%20spare%20parts%20assistance." target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;background:#25D366;color:#fff;font-family:\'Barlow\',sans-serif;font-size:13px;font-weight:700;padding:9px 18px;border-radius:8px;text-decoration:none;margin-left:8px;transition:opacity .18s;" onmouseenter="this.style.opacity=\'.85\'" onmouseleave="this.style.opacity=\'1\'">' + WA_SVG_SM + ' WhatsApp</a>'
    + '</div>'
    // Hamburger button
    + '<button id="ptc-mob-open" class="ptc-mob-btn" aria-label="Open menu" aria-expanded="false" style="align-items:center;justify-content:center;width:38px;height:38px;border-radius:8px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);cursor:pointer;padding:0;flex-shrink:0;">'
    + '<svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="0" y1="1" x2="20" y2="1"/><line x1="0" y1="7" x2="20" y2="7"/><line x1="0" y1="13" x2="20" y2="13"/></svg>'
    + '</button>'
    + '</div>'
    + '</nav>'
    // Overlay backdrop
    + '<div id="ptc-mob-overlay" onclick="window.ptcCloseMenu()"></div>'
    // Slide-out drawer
    + '<div id="ptc-mob-drawer" role="dialog" aria-label="Navigation menu">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.07);flex-shrink:0;">'
    + '<a href="/" style="display:flex;align-items:center;"><img src="/assets/images/ptc-logo.png" alt="PTC" style="height:32px;width:auto;"></a>'
    + '<button id="ptc-mob-close" onclick="window.ptcCloseMenu()" aria-label="Close menu" style="width:34px;height:34px;border-radius:8px;border:1px solid rgba(255,255,255,0.09);background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.7);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>'
    + '</button>'
    + '</div>'
    + '<div style="flex:1;overflow-y:auto;padding-bottom:8px;">'
    + ['Home:/','Blog:/blog/','About:/about.html'].map(function(s){var p=s.split(':');return '<a href="'+p[1]+'" onclick="window.ptcCloseMenu()" style="display:flex;align-items:center;padding:14px 18px;color:rgba(255,255,255,0.82);text-decoration:none;font-family:\'Barlow\',sans-serif;font-size:15px;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.04);">'+p[0]+'</a>';}).join('')
    + '<div style="padding:18px 18px 8px;font-family:\'Barlow Condensed\',sans-serif;font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,0.28);">Shop by Brand</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:0 18px 18px;">'
    + MOB_BRANDS.map(function(b){return '<a href="'+b[1]+'" onclick="window.ptcCloseMenu()" style="display:flex;align-items:center;justify-content:center;padding:11px 6px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.025);text-decoration:none;color:rgba(255,255,255,0.78);font-family:\'Barlow\',sans-serif;font-size:13px;font-weight:600;text-align:center;">'+b[0]+'</a>';}).join('')
    + '</div>'
    + '</div>'
    + '<div style="padding:14px 18px 44px;display:flex;flex-direction:column;gap:10px;border-top:1px solid rgba(255,255,255,0.06);flex-shrink:0;">'
    + '<a href="https://wa.me/919821037990" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#25D366;color:#fff;text-decoration:none;padding:14px;border-radius:12px;font-family:\'Barlow Condensed\',sans-serif;font-weight:800;font-size:16px;letter-spacing:.05em;">' + WA_SVG_SM + ' WhatsApp Us</a>'
    + '<a href="/get-a-quote.html" style="display:flex;align-items:center;justify-content:center;background:#FFB81C;color:#050505;text-decoration:none;padding:14px;border-radius:12px;font-family:\'Barlow Condensed\',sans-serif;font-weight:800;font-size:16px;letter-spacing:.05em;">Get Quote</a>'
    + '</div>'
    + '</div>';

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
  var CY = new Date().getFullYear();
  var WA_ICO = '<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  var FL = 'color:var(--ptc-color-footer-muted);text-decoration:none;font-size:0.875rem;display:block;line-height:2.4;transition:color .15s;';
  var FLH = 'onmouseover="this.style.color=\'#fff\'" onmouseout="this.style.color=\'\'\"';
  function flink(href, label) { return '<li><a href="' + href + '" style="' + FL + '" ' + FLH + '>' + label + '</a></li>'; }

  const FOOTER_HTML = '<footer id="ptc-footer" style="background:var(--ptc-color-footer-bg);color:var(--ptc-color-footer-text);font-family:system-ui,sans-serif;">'
    + '<div style="max-width:1280px;margin:0 auto;padding:48px 24px;">'
    + '<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr;gap:32px;flex-wrap:wrap;">'

    // Col 1: Brand
    + '<div>'
    + '<a href="/"><img src="/assets/images/ptc-logo.png?v=2" alt="Parts Trading Company" style="height:40px;width:auto;filter:brightness(0) invert(1);margin-bottom:12px;" onerror="this.src=\'/assets/images/ptc-logo.webp\'"></a>'
    + '<p style="font-size:13px;color:var(--ptc-color-footer-muted);line-height:1.7;margin:8px 0 16px;">OEM &amp; aftermarket spare parts for heavy equipment &amp; trucks. Est. 1956, Mumbai. Ships to 50+ countries.</p>'
    + '<address style="font-style:normal;font-size:12px;color:var(--ptc-color-footer-faint);line-height:1.8;">1st Floor, Vijay Chambers<br>Grant Road East, Mumbai 400004<br>GST: 27AAAFP1087E1ZG</address>'
    + '</div>'

    // Col 2: Navigate
    + '<div>'
    + '<h4 style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.1em;margin:0 0 8px;">Navigate</h4>'
    + '<ul style="list-style:none;padding:0;margin:0;">'
    + flink('/', 'Home')
    + flink('/#equipment-models', 'Models')
    + flink('/#product-categories', 'Products')
    + flink('/#brands', 'Brands')
    + flink('/blog/', 'Blog')
    + flink('/about.html', 'About')
    + flink('/get-a-quote.html', 'Get a Quote')
    + flink('/privacy-policy.html', 'Privacy Policy')
    + flink('/terms.html', 'Terms of Use')
    + '</ul>'
    + '</div>'

    // Col 3: Brand Parts
    + '<div>'
    + '<h4 style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.1em;margin:0 0 8px;">Brand Parts</h4>'
    + '<ul style="list-style:none;padding:0;margin:0;">'
    + flink('/volvo/', 'Volvo')
    + flink('/komatsu/', 'Komatsu')
    + flink('/cat/', 'CAT')
    + flink('/scania/', 'Scania')
    + flink('/hitachi/', 'Hitachi')
    + flink('/liugong/', 'LiuGong')
    + flink('/sany/', 'Sany')
    + flink('/jcb/', 'JCB')
    + flink('/doosan-spare-parts-india.html', 'Doosan')
    + flink('/liebherr-spare-parts-india.html', 'Liebherr')
    + flink('/atlas-copco-spare-parts-india.html', 'Atlas Copco')
    + '</ul>'
    + '</div>'

    // Col 4: Contact
    + '<div>'
    + '<h4 style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.1em;margin:0 0 8px;">Contact Us</h4>'
    + '<a href="https://wa.me/919821037990?text=Hi!%20I%20need%20help%20with%20a%20spare%20part." target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:#25d366;color:#fff;padding:9px 16px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;margin-bottom:16px;">' + WA_ICO + ' WhatsApp Us</a>'
    + '<ul style="list-style:none;padding:0;margin:0;font-size:13px;color:var(--ptc-color-footer-muted);line-height:2;">'
    + '<li><a href="tel:+919821037990" style="' + FL + '" ' + FLH + '>+91 98210 37990</a></li>'
    + '<li><a href="tel:+912240755999" style="' + FL + '" ' + FLH + '>+91 22 4075 5999</a></li>'
    + '<li><a href="mailto:partstrading@gmail.com" style="' + FL + '" ' + FLH + '>partstrading@gmail.com</a></li>'
    + '<li style="font-size:12px;color:var(--ptc-color-footer-faint);">Mon–Sat 9:00–18:00 IST</li>'
    + '</ul>'
    + '</div>'

    + '</div>'
    + '</div>'

    // Bottom bar
    + '<div style="border-top:1px solid rgba(255,255,255,0.06);">'
    + '<div style="max-width:1280px;margin:0 auto;padding:14px 24px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;font-size:12px;color:var(--ptc-color-footer-faint);">'
    + '<span>&copy; ' + CY + ' Parts Trading Company. All rights reserved.</span>'
    + '</div>'
    + '</div>'

    // Disclaimer
    + '<div style="border-top:1px solid rgba(255,255,255,0.04);">'
    + '<div style="max-width:1280px;margin:0 auto;padding:14px 24px;">'
    + '<p style="font-size:11px;color:var(--ptc-color-footer-faint);line-height:1.7;margin:0;">Disclaimer: All brand names, logos, images, and part numbers are used for identification and reference only. Parts Trading Company is not affiliated with any OEM unless specifically stated. Products may include genuine OEM parts or compatible aftermarket alternatives based on availability and customer requirements.</p>'
    + '</div>'
    + '</div>'
    + '</footer>';

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
    if (floatEl) {
      floatEl.href = waUrl;
      floatEl.addEventListener('click', function () {
        if (typeof gtag === 'function') {
          gtag('event', 'whatsapp_click', { event_category: 'lead', event_label: 'float_button', page_path: path });
        }
      });
    }

    // ── GA4 EVENT DELEGATION ─────────────────────────────────────────────────
    document.addEventListener('click', function (e) {
      if (typeof gtag !== 'function') return;
      var wa  = e.target.closest('a[href*="wa.me"]');
      var tel = e.target.closest('a[href^="tel:"]');
      var ml  = e.target.closest('a[href^="mailto:"]');
      if (wa)  gtag('event', 'whatsapp_click', { event_category: 'lead', event_label: wa.textContent.trim().substring(0, 40) || 'link', page_path: path });
      if (tel) gtag('event', 'phone_click',    { event_category: 'lead', page_path: path });
      if (ml)  gtag('event', 'email_click',    { event_category: 'lead', event_label: ml.href, page_path: path });
    }, true);

    // ── EXIT INTENT ON PRODUCT PAGES ────────────────────────────────────────
    if (path.indexOf('/pages/aftermarket-') >= 0) {
      document.addEventListener('mouseleave', function ptcExitIntent(e) {
        if (e.clientY > 0) return;
        if (sessionStorage.getItem('ptc_exit')) return;
        sessionStorage.setItem('ptc_exit', '1');
        document.removeEventListener('mouseleave', ptcExitIntent);
        var h1       = document.querySelector('h1');
        var partText = h1 ? h1.textContent.trim().substring(0, 80) : 'this part';
        var overlay  = document.createElement('div');
        overlay.id   = 'ptc-exit-modal';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:1rem;';
        overlay.innerHTML =
          '<div style="background:#fff;border-radius:16px;padding:2rem;max-width:460px;width:100%;position:relative;box-shadow:0 24px 60px rgba(0,0,0,0.35);">'
          + '<button id="ptc-exit-close" style="position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.75rem;line-height:1;cursor:pointer;color:#aaa;" aria-label="Close">&times;</button>'
          + '<p style="font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#e8a000;margin:0 0 0.5rem;">Before you leave</p>'
          + '<h3 style="font-size:1.2rem;font-weight:800;margin:0 0 0.5rem;color:#111;">This part is in stock in Mumbai.</h3>'
          + '<p style="color:#666;font-size:0.875rem;margin:0 0 1.5rem;line-height:1.5;">Get a quote for <strong>' + partText + '</strong> within 2 hours. No commitment.</p>'
          + '<a id="ptc-exit-wa" href="' + waUrl + '" target="_blank" style="background:#25D366;color:#fff;font-weight:700;padding:0.875rem 1.5rem;border-radius:10px;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:0.75rem;">'
          + '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
          + 'WhatsApp for Price — Under 2 Hours'
          + '</a>'
          + '<button id="ptc-exit-dismiss" style="width:100%;background:none;border:1px solid #e5e7eb;padding:0.65rem;border-radius:8px;cursor:pointer;color:#9ca3af;font-size:0.8rem;">No thanks, I\'ll browse further</button>'
          + '</div>';
        document.body.appendChild(overlay);
        document.getElementById('ptc-exit-close').onclick   = function () { overlay.remove(); };
        document.getElementById('ptc-exit-dismiss').onclick = function () { overlay.remove(); };
        var waBtn = document.getElementById('ptc-exit-wa');
        if (waBtn) waBtn.addEventListener('click', function () {
          if (typeof gtag === 'function') gtag('event', 'exit_intent_converted', { event_category: 'lead', page_path: path });
        });
        if (typeof gtag === 'function') gtag('event', 'exit_intent_shown', { page_path: path });
      });
    }

    // React pages (brand hubs, product pages, about, etc.) manage their own
    // nav/footer — skip injection there and only provide the utility layer.
    var hasReactRoot = !!document.getElementById('root');

    if (!isHomepage && !hasReactRoot) {
      // NAV — replace any existing nav with the shared component
      if (!document.querySelector('nav[aria-label="Main Navigation"]')) {
        document.querySelectorAll('nav').forEach(function (n) { n.remove(); });
        document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
      }

      // Mobile menu open/close
      window.ptcCloseMenu = function () {
        var ol = document.getElementById('ptc-mob-overlay');
        var dr = document.getElementById('ptc-mob-drawer');
        var bt = document.getElementById('ptc-mob-open');
        if (ol) ol.classList.remove('ptc-open');
        if (dr) dr.classList.remove('ptc-open');
        if (bt) bt.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };
      window.ptcOpenMenu = function () {
        var ol = document.getElementById('ptc-mob-overlay');
        var dr = document.getElementById('ptc-mob-drawer');
        var bt = document.getElementById('ptc-mob-open');
        if (ol) ol.classList.add('ptc-open');
        if (dr) dr.classList.add('ptc-open');
        if (bt) bt.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      };
      var mobOpenBtn = document.getElementById('ptc-mob-open');
      if (mobOpenBtn) mobOpenBtn.addEventListener('click', window.ptcOpenMenu);

      // FOOTER — replace any existing footer with the shared component
      if (!document.getElementById('ptc-footer')) {
        document.querySelectorAll('footer').forEach(function (f) { f.remove(); });
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

    // Some React-root pages (e.g. liugong/) mount an explicit
    // #ptc-footer-root placeholder instead of rendering their own footer —
    // populate it regardless of the hasReactRoot skip above.
    if (hasReactRoot) {
      const footerRoot = document.getElementById('ptc-footer-root');
      if (footerRoot && !document.getElementById('ptc-footer')) {
        footerRoot.insertAdjacentHTML('beforeend', FOOTER_HTML);
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
