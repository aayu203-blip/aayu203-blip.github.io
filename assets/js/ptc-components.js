/**
 * PTC Shared Components — injected into all pages
 * Handles: Nav, Footer, WhatsApp Floater, Geo-IP Delivery Banner
 */
(function () {
  'use strict';

  // ── Page context for pre-filled WhatsApp messages ──────────────────────────
  var PAGE_MESSAGES = {
    'jcb-spare-parts':          'Hi! I need JCB spare parts.',
    'doosan-spare-parts':       'Hi! I need Doosan excavator spare parts.',
    'liebherr-spare-parts':     'Hi! I need Liebherr mining equipment parts.',
    'atlas-copco-spare-parts':  'Hi! I need Atlas Copco drill/compressor parts.',
    'wirtgen-spare-parts':      'Hi! I need Wirtgen / Vögele / Hamm road equipment parts.',
    'terex-grove-crane-parts':  'Hi! I need Terex or Grove crane spare parts.',
    'normet-spare-parts':       'Hi! I need Normet underground equipment parts.',
    'volvo-ce-articulated-parts':'Hi! I need Volvo CE articulated hauler (A-series) parts.',
    'bell-equipment-parts':     'Hi! I need Bell Equipment ADT (B25/B30) spare parts.',
    'russia-heavy-equipment':   'Hi! I need heavy equipment parts for export to Russia.',
    'indonesia-heavy-equipment':'Hi! I need heavy equipment parts for export to Indonesia.',
    'uae-heavy-equipment':      'Hi! I need heavy equipment parts for UAE.',
    'south-africa-heavy-equipment':'Hi! I need heavy equipment parts for South Africa.',
    'jharkhand-heavy-equipment':'Hi! I need heavy equipment parts for a mine in Jharkhand.',
    'odisha-heavy-equipment':   'Hi! I need heavy equipment parts for a mine in Odisha.',
    'karnataka-heavy-equipment':'Hi! I need heavy equipment parts for a mine in Karnataka.',
    'rajasthan-heavy-equipment':'Hi! I need heavy equipment parts for Rajasthan.',
    'underground-mining-parts': 'Hi! I need underground mining equipment parts (Epiroc/Sandvik/Normet).',
    'blog':                     'Hi! I read your blog post and have a question about spare parts.',
    'equipment-models':         'Hi! I need spare parts for my equipment. Can you help?',
    'categories':               'Hi! I need spare parts from a specific category.',
  };

  function getWAMessage() {
    var path = window.location.pathname;
    for (var key in PAGE_MESSAGES) {
      if (path.indexOf(key) >= 0) return encodeURIComponent(PAGE_MESSAGES[key]);
    }
    return encodeURIComponent('Hi! I need heavy equipment spare parts. Can you help?');
  }

  var WA_NUM = '919821037990';

  // ── NAV HTML ───────────────────────────────────────────────────────────────
  var NAV_HTML = '<nav id="ptc-nav" style="background:#fff;border-bottom:2px solid #fde047;box-shadow:0 2px 12px rgba(0,0,0,0.07);padding:0 1.5rem;display:flex;align-items:center;justify-content:space-between;height:72px;position:sticky;top:0;z-index:100;">'
    + '<a href="/" style="display:flex;align-items:center;text-decoration:none;">'
    + '<img src="/assets/images/ptc-logo.png" alt="Parts Trading Company" style="height:52px;width:auto;" onerror="this.style.display=\'none\'">'
    + '</a>'
    + '<div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">'
    + '<a href="/" style="color:#374151;font-weight:600;font-size:0.875rem;text-decoration:none;">Home</a>'
    + '<a href="/#brands" style="color:#374151;font-weight:600;font-size:0.875rem;text-decoration:none;">Brands</a>'
    + '<a href="/#equipment-models" style="color:#374151;font-weight:600;font-size:0.875rem;text-decoration:none;">Equipment</a>'
    + '<a href="/blog/" style="color:#374151;font-weight:600;font-size:0.875rem;text-decoration:none;">Blog</a>'
    + '<a href="/#contact" style="color:#374151;font-weight:600;font-size:0.875rem;text-decoration:none;">Contact</a>'
    + '<a id="ptc-nav-wa" href="#" target="_blank" style="background:#22c55e;color:#fff;font-weight:700;font-size:0.875rem;padding:0.5rem 1.1rem;border-radius:0.75rem;text-decoration:none;">WhatsApp</a>'
    + '</div>'
    + '</nav>';

  // ── FOOTER HTML ────────────────────────────────────────────────────────────
  var FOOTER_HTML = '<footer id="ptc-footer" style="background:#111827;color:#9ca3af;padding:3rem 1.5rem 2rem;">'
    + '<div style="max-width:1200px;margin:0 auto;">'
    + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2rem;margin-bottom:2rem;">'
    // Col 1
    + '<div>'
    + '<img src="/assets/images/ptc-logo.png" alt="Parts Trading Company" style="height:48px;margin-bottom:1rem;filter:brightness(0) invert(1);" onerror="this.style.display=\'none\'">'
    + '<p style="font-size:0.875rem;line-height:1.6;">India\'s specialist heavy equipment parts supplier since 1956. 70+ years. 20,000+ parts in stock.</p>'
    + '<p style="margin-top:0.75rem;font-size:0.8rem;">📍 Grant Road, Mumbai 400 007, India</p>'
    + '</div>'
    // Col 2
    + '<div>'
    + '<h3 style="color:#facc15;font-weight:700;font-size:0.9rem;margin-bottom:1rem;letter-spacing:0.05em;">QUICK LINKS</h3>'
    + '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;font-size:0.85rem;">'
    + '<li><a href="/" style="color:#9ca3af;text-decoration:none;hover:color:#facc15;">Home</a></li>'
    + '<li><a href="/#brands" style="color:#9ca3af;text-decoration:none;">Brands We Support</a></li>'
    + '<li><a href="/blog/" style="color:#9ca3af;text-decoration:none;">Blog & Guides</a></li>'
    + '<li><a href="/underground-mining-parts-india.html" style="color:#9ca3af;text-decoration:none;">Underground Mining</a></li>'
    + '<li><a href="/#contact" style="color:#9ca3af;text-decoration:none;">Contact Us</a></li>'
    + '</ul>'
    + '</div>'
    // Col 3
    + '<div>'
    + '<h3 style="color:#facc15;font-weight:700;font-size:0.9rem;margin-bottom:1rem;letter-spacing:0.05em;">EXPORT MARKETS</h3>'
    + '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;font-size:0.85rem;">'
    + '<li><a href="/russia-heavy-equipment-parts.html" style="color:#9ca3af;text-decoration:none;">🇷🇺 Russia</a></li>'
    + '<li><a href="/uae-heavy-equipment-parts.html" style="color:#9ca3af;text-decoration:none;">🇦🇪 UAE</a></li>'
    + '<li><a href="/indonesia-heavy-equipment-parts.html" style="color:#9ca3af;text-decoration:none;">🇮🇩 Indonesia</a></li>'
    + '<li><a href="/south-africa-heavy-equipment-parts.html" style="color:#9ca3af;text-decoration:none;">🇿🇦 South Africa</a></li>'
    + '</ul>'
    + '</div>'
    // Col 4
    + '<div>'
    + '<h3 style="color:#facc15;font-weight:700;font-size:0.9rem;margin-bottom:1rem;letter-spacing:0.05em;">CONTACT</h3>'
    + '<p style="font-size:0.85rem;margin-bottom:0.5rem;">📞 <a id="ptc-footer-tel" href="tel:+919821037990" style="color:#facc15;text-decoration:none;">+91 98210 37990</a></p>'
    + '<p style="font-size:0.85rem;margin-bottom:0.5rem;">📧 <a href="mailto:sales@partstrading.com" style="color:#facc15;text-decoration:none;">sales@partstrading.com</a></p>'
    + '<p style="font-size:0.85rem;margin-top:1rem;color:#6b7280;">Mon – Sat: 9 AM – 6 PM IST</p>'
    + '</div>'
    + '</div>'
    + '<div style="border-top:1px solid #374151;padding-top:1.5rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;font-size:0.8rem;">'
    + '<p>© 2026 Parts Trading Company (Mumbai) Pvt. Ltd. All rights reserved.</p>'
    + '<div style="display:flex;gap:1rem;">'
    + '<span>OEM &amp; Aftermarket Parts</span>'
    + '<span>•</span>'
    + '<span>Global Shipping</span>'
    + '<span>•</span>'
    + '<span>70+ Years</span>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</footer>';

  // ── WHATSAPP FLOATER ───────────────────────────────────────────────────────
  var WA_FLOATER_HTML = '<a id="ptc-wa-float" href="#" target="_blank" rel="noopener" '
    + 'title="WhatsApp Parts Trading Company" '
    + 'style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;'
    + 'background:#25d366;color:#fff;border-radius:50%;width:60px;height:60px;'
    + 'display:flex;align-items:center;justify-content:center;'
    + 'box-shadow:0 4px 20px rgba(37,211,102,0.5);'
    + 'cursor:pointer;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;"'
    + 'onmouseover="this.style.transform=\'scale(1.12)\';this.style.boxShadow=\'0 6px 28px rgba(37,211,102,0.7)\'"'
    + 'onmouseout="this.style.transform=\'scale(1)\';this.style.boxShadow=\'0 4px 20px rgba(37,211,102,0.5)\'">'
    + '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">'
    + '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>'
    + '</svg>'
    + '</a>'
    + '<div id="ptc-wa-pulse" style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9998;'
    + 'width:60px;height:60px;border-radius:50%;background:rgba(37,211,102,0.3);'
    + 'animation:ptcPulse 2s infinite;pointer-events:none;"></div>';

  // ── GEO-IP DELIVERY BANNER ─────────────────────────────────────────────────
  var COUNTRY_MESSAGES = {
    'RU': '🇷🇺 Delivering to Russia', 'UA': '🇺🇦 Delivering to Ukraine',
    'AE': '🇦🇪 Delivering to UAE', 'SA': '🇸🇦 Delivering to Saudi Arabia',
    'QA': '🇶🇦 Delivering to Qatar', 'KW': '🇰🇼 Delivering to Kuwait',
    'OM': '🇴🇲 Delivering to Oman', 'BH': '🇧🇭 Delivering to Bahrain',
    'ID': '🇮🇩 Delivering to Indonesia', 'MY': '🇲🇾 Delivering to Malaysia',
    'TH': '🇹🇭 Delivering to Thailand', 'PH': '🇵🇭 Delivering to Philippines',
    'VN': '🇻🇳 Delivering to Vietnam', 'SG': '🇸🇬 Delivering to Singapore',
    'BD': '🇧🇩 Delivering to Bangladesh', 'LK': '🇱🇰 Delivering to Sri Lanka',
    'NP': '🇳🇵 Delivering to Nepal', 'MM': '🇲🇲 Delivering to Myanmar',
    'KH': '🇰🇭 Delivering to Cambodia',
    'ZA': '🇿🇦 Delivering to South Africa', 'NG': '🇳🇬 Delivering to Nigeria',
    'KE': '🇰🇪 Delivering to Kenya', 'GH': '🇬🇭 Delivering to Ghana',
    'TZ': '🇹🇿 Delivering to Tanzania', 'ZM': '🇿🇲 Delivering to Zambia',
    'ZW': '🇿🇼 Delivering to Zimbabwe', 'BW': '🇧🇼 Delivering to Botswana',
    'NA': '🇳🇦 Delivering to Namibia', 'MZ': '🇲🇿 Delivering to Mozambique',
    'AU': '🇦🇺 Delivering to Australia', 'NZ': '🇳🇿 Delivering to New Zealand',
    'GB': '🇬🇧 Delivering to United Kingdom', 'DE': '🇩🇪 Delivering to Germany',
    'FR': '🇫🇷 Delivering to France', 'IT': '🇮🇹 Delivering to Italy',
    'PL': '🇵🇱 Delivering to Poland', 'ES': '🇪🇸 Delivering to Spain',
    'NL': '🇳🇱 Delivering to Netherlands', 'BE': '🇧🇪 Delivering to Belgium',
    'SE': '🇸🇪 Delivering to Sweden', 'NO': '🇳🇴 Delivering to Norway',
    'FI': '🇫🇮 Delivering to Finland', 'CH': '🇨🇭 Delivering to Switzerland',
    'AT': '🇦🇹 Delivering to Austria', 'CZ': '🇨🇿 Delivering to Czech Republic',
    'RO': '🇷🇴 Delivering to Romania', 'TR': '🇹🇷 Delivering to Turkey',
    'KZ': '🇰🇿 Delivering to Kazakhstan', 'MN': '🇲🇳 Delivering to Mongolia',
    'US': '🇺🇸 Delivering to USA', 'CA': '🇨🇦 Delivering to Canada',
    'MX': '🇲🇽 Delivering to Mexico', 'BR': '🇧🇷 Delivering to Brazil',
    'AR': '🇦🇷 Delivering to Argentina', 'CL': '🇨🇱 Delivering to Chile',
    'CO': '🇨🇴 Delivering to Colombia', 'PE': '🇵🇪 Delivering to Peru',
    'CN': '🇨🇳 Delivering to China', 'JP': '🇯🇵 Delivering to Japan',
    'KR': '🇰🇷 Delivering to South Korea', 'IN': '🚀 Same-Day Dispatch from Mumbai',
    'DEFAULT': '🌏 Shipping Worldwide — 30+ Countries'
  };

  var GEO_BANNER_HTML = '<div id="ptc-geo-banner" style="display:none;position:fixed;bottom:6rem;right:1.5rem;z-index:9990;'
    + 'background:rgba(17,24,39,0.95);color:#fff;padding:0.6rem 1rem;border-radius:0.75rem;'
    + 'font-size:0.8rem;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,0.3);'
    + 'border-left:3px solid #facc15;max-width:220px;line-height:1.4;">'
    + '<span id="ptc-geo-text">🌏 Shipping Worldwide</span>'
    + '<button onclick="document.getElementById(\'ptc-geo-banner\').style.display=\'none\'" '
    + 'style="background:none;border:none;color:#9ca3af;cursor:pointer;float:right;margin-left:0.5rem;font-size:1rem;line-height:1;">×</button>'
    + '</div>';

  // ── CSS KEYFRAMES ──────────────────────────────────────────────────────────
  var STYLE_HTML = '<style>html{scroll-padding-top:120px!important;}'
    + '@keyframes ptcPulse{0%{transform:scale(1);opacity:0.8;}70%{transform:scale(1.6);opacity:0;}100%{transform:scale(1.6);opacity:0;}}'
    + '#ptc-nav a:hover{color:#d97706!important;}'
    + '#ptc-footer a:hover{color:#facc15!important;}'
    + '@media(max-width:640px){#ptc-nav div{gap:0.5rem;}#ptc-nav a{font-size:0.75rem;}}'
    + '</style>';

  // ── INJECTION LOGIC ────────────────────────────────────────────────────────
  function inject() {
    // Only inject if there is NO existing ptc-nav (homepage handles its own)
    var isHomepage = (window.location.pathname === '/' || window.location.pathname === '/index.html');

    // Always inject floater, geo banner, styles
    document.head.insertAdjacentHTML('beforeend', STYLE_HTML);
    document.body.insertAdjacentHTML('beforeend', WA_FLOATER_HTML);
    document.body.insertAdjacentHTML('beforeend', GEO_BANNER_HTML);

    // Set WhatsApp links
    var waMsg = getWAMessage();
    var waUrl = 'https://wa.me/' + WA_NUM + '?text=' + waMsg;
    var floatEl = document.getElementById('ptc-wa-float');
    if (floatEl) floatEl.href = waUrl;

    // Inject nav + footer only on non-homepage pages that don't have their own
    if (!isHomepage && !document.getElementById('ptc-nav')) {
      // Check if page has no real nav
      var existingNavs = document.querySelectorAll('nav');
      if (existingNavs.length === 0) {
        if (!document.querySelector('nav')) { document.body.insertAdjacentHTML('afterbegin', NAV_HTML); }
        var navWa = document.getElementById('ptc-nav-wa');
        if (navWa) navWa.href = waUrl;
      }
    } else if (!isHomepage) {
      // Page has nav — just update the WA link in nav if present
      var navWaEl = document.getElementById('ptc-nav-wa');
      if (navWaEl) navWaEl.href = waUrl;
    }

    // Inject footer on non-homepage pages that don't have their own
    if (!isHomepage && !document.querySelector('footer')) {
      if (!document.querySelector('footer')) { document.body.insertAdjacentHTML('beforeend', FOOTER_HTML); }
    }

    // Geo IP detection
    setTimeout(function() {
      fetch('https://ipapi.co/json/', {signal: AbortSignal.timeout(5000)})
        .then(function(r) { return r.json(); })
        .then(function(data) {
          var cc = (data && data.country_code) ? data.country_code : 'DEFAULT';
          var msg = COUNTRY_MESSAGES[cc] || COUNTRY_MESSAGES['DEFAULT'];
          var el = document.getElementById('ptc-geo-text');
          if (el) el.textContent = msg;
          var banner = document.getElementById('ptc-geo-banner');
          if (banner) {
            banner.style.display = 'block';
            // Auto-hide after 6 seconds
            setTimeout(function() {
              if (banner) banner.style.opacity = '0';
              banner.style.transition = 'opacity 1s';
              setTimeout(function() { banner.style.display = 'none'; }, 1000);
            }, 7000);
          }
        })
        .catch(function() {
          // Silently fail — geo banner just won't show
        });
    }, 1500);
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
