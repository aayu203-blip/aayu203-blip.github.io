/**
 * PTC Shared Components — injected into all pages
 * Handles: Nav, Footer, WhatsApp Floater, Geo-IP Delivery Banner, Search Link Logic
 * Version: 1.4
 */

// Centralized link generation logic for search results
window.getProductPageLink = function (result) {
  const brandRaw = (result.Brand || '').toString().trim();
  const partNoRaw = (result["Part No"] || '').toString().trim();
  if (!partNoRaw) return '#';

  const brand = brandRaw.toLowerCase();
  const partNo = partNoRaw.toUpperCase();

  if (typeof window.productPathIndex === 'object' && window.productPathIndex !== null) {
    const brandKey = `${brand}|${partNo}`;
    const directPath = window.productPathIndex[brandKey] || window.productPathIndex[partNo];
    if (directPath) return directPath;
  }

  const brandSlug = brand.includes('caterpillar') ? 'cat' : brand.split(' ')[0];
  return `/pages/products/aftermarket-${brandSlug}-${partNo.toLowerCase()}.html`;
};

(function () {
  'use strict';

  var PAGE_MESSAGES = {
    'jcb-spare-parts': 'Hi! I need JCB spare parts.',
    'doosan-spare-parts': 'Hi! I need Doosan excavator spare parts.',
    'liebherr-spare-parts': 'Hi! I need Liebherr mining equipment parts.',
    'atlas-copco-spare-parts': 'Hi! I need Atlas Copco drill/compressor parts.',
    'wirtgen-spare-parts': 'Hi! I need Wirtgen / Vögele / Hamm road equipment parts.',
    'terex-grove-crane-parts': 'Hi! I need Terex or Grove crane spare parts.',
    'normet-spare-parts': 'Hi! I need Normet underground equipment parts.',
    'volvo-ce-articulated-parts': 'Hi! I need Volvo CE articulated hauler (A-series) parts.',
    'bell-equipment-parts': 'Hi! I need Bell Equipment ADT (B25/B30) spare parts.',
    'russia-heavy-equipment': 'Hi! I need heavy equipment parts for export to Russia.',
    'indonesia-heavy-equipment': 'Hi! I need heavy equipment parts for export to Indonesia.',
    'uae-heavy-equipment': 'Hi! I need heavy equipment parts for UAE.',
    'south-africa-heavy-equipment': 'Hi! I need heavy equipment parts for South Africa.',
    'underground-mining-parts': 'Hi! I need underground mining equipment parts (Epiroc/Sandvik/Normet).',
    'blog': 'Hi! I read your blog post and have a question about spare parts.',
    'equipment-models': 'Hi! I need spare parts for my equipment.',
  };

  function getWAMessage() {
    var path = window.location.pathname;
    for (var key in PAGE_MESSAGES) {
      if (path.indexOf(key) >= 0) return encodeURIComponent(PAGE_MESSAGES[key]);
    }
    return encodeURIComponent('Hi! I need heavy equipment spare parts. Can you help?');
  }

  var WA_NUM = '919821037990';

  // ── NAV HTML (Black Text Enforced) ──────────────────────────────────────────
  var NAV_HTML = '<nav aria-label="Main Navigation" class="sticky top-0 w-full z-50 bg-white shadow-lg border-b border-gray-200">'
    + '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">'
    + '<div class="flex justify-between items-center h-28">'
    + '<div class="flex items-center">'
    + '<a href="https://partstrading.com/" class="flex-shrink-0 flex items-center space-x-4 hover:scale-105 transition-transform duration-300">'
    + '<img src="/assets/images/ptc-logo.png?v=1" alt="PTC Parts Trading Company" class="h-32 w-auto">'
    + '</a>'
    + '</div>'
    + '<div class="hidden md:flex items-center space-x-2">'
    + '<a class="nav-link px-4 py-2 font-bold !text-black hover:text-yellow-600 transition-colors" style="color: black !important;" href="https://partstrading.com/#home">HOME</a>'
    + '<a class="nav-link px-4 py-2 font-bold !text-black hover:text-yellow-600 transition-colors" style="color: black !important;" href="https://partstrading.com/#brands">BRANDS</a>'
    + '<a class="nav-link px-4 py-2 font-bold !text-black hover:text-yellow-600 transition-colors" style="color: black !important;" href="https://partstrading.com/#equipment-models">MODELS</a>'
    + '<a class="nav-link px-4 py-2 font-bold !text-black hover:text-yellow-600 transition-colors" style="color: black !important;" href="https://partstrading.com/#product-categories">PRODUCTS</a>'
    + '<a class="nav-link px-4 py-2 font-bold !text-black hover:text-yellow-600 transition-colors" style="color: black !important;" href="https://partstrading.com/blog/">BLOG</a>'
    + '<a class="ml-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all shadow-md" href="https://partstrading.com/#contact">CONTACT</a>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</nav>';

  var WA_FLOATER_HTML = '<a id="ptc-wa-float" href="#" target="_blank" rel="noopener" '
    + 'style="position:fixed;bottom:2rem;right:2.5rem;z-index:9999999 !important;'
    + 'background:#25d366 !important;color:#fff !important;border-radius:50%;width:70px;height:70px;'
    + 'display:flex;align-items:center;justify-content:center;'
    + 'box-shadow:0 8px 32px rgba(37,211,102,0.4);border:2px solid rgba(255,255,255,0.2);'
    + 'cursor:pointer;text-decoration:none;transition:all 0.4s; visibility: visible !important; opacity: 1 !important;">'
    + '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="white">'
    + '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>'
    + '</svg>'
    + '</a>'
    + '<div id="ptc-wa-pulse" style="position:fixed;bottom:2rem;right:2.5rem;z-index:9999998;width:70px;height:70px;border-radius:50%;background:rgba(37,211,102,0.3);animation:ptcPulse 2s infinite;pointer-events:none;"></div>';

  var COUNTRY_MESSAGES = {
    'RU': '🇷🇺 Delivering to Russia', 'UA': '🇺🇦 Delivering to Ukraine',
    'AE': '🇦🇪 Delivering to UAE', 'SA': '🇸🇦 Delivering to Saudi Arabia',
    'IN': '🚀 Same-Day Dispatch from Mumbai',
    'DEFAULT': '🌏 Shipping Worldwide — 30+ Countries'
  };

  var GEO_BANNER_HTML = '<div id="ptc-geo-banner" style="display:block;position:fixed;bottom:0;left:0;width:100%;z-index:9999998;'
    + 'background:rgba(17,24,39,0.98);backdrop-filter:blur(8px);color:#fff;padding:0.75rem 1rem;text-align:center;'
    + 'font-size:0.875rem;font-weight:600;box-shadow:0 -4px 20px rgba(0,0,0,0.4); border-top:2px solid #facc15;">'
    + '<span id="ptc-geo-text">🌏 Shipping Worldwide — 30+ Countries</span>'
    + '</div>';

  var STYLE_HTML = '<style>html{scroll-padding-top:120px!important;}'
    + '@keyframes ptcPulse{0%{transform:scale(1);opacity:0.8;}70%{transform:scale(1.6);opacity:0;}100%{transform:scale(1.6);opacity:0;}}'
    + '.nav-link:hover{color:#d97706!important;}'
    + '</style>';

  var FOOTER_HTML = '<div id="ptc-footer-container" style="clear:both; width: 100%;">'
    + '<footer id="ptc-footer" style="background:#111827;color:#9ca3af;padding:4rem 1.5rem 2rem;margin-top:4rem;clear:both;">'
    + '<div style="max-width:1280px;margin:0 auto;">'
    + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:3rem;margin-bottom:3rem;">'
    + '<div>'
    + '<img src="/assets/images/ptc-logo.png?v=1" alt="Parts Trading Company" style="height:60px;margin-bottom:1.5rem;">'
    + '<p style="color:#d1d5db;font-size:0.9rem;line-height:1.6;">India\'s trusted supplier of OEM &amp; aftermarket spare parts for heavy machinery globally.</p>'
    + '</div>'
    + '<div>'
    + '<h4 style="color:#facc15;font-weight:700;margin-bottom:1.25rem;font-size:0.9rem;text-transform:uppercase;">Quick Links</h4>'
    + '<ul style="list-style:none;padding:0;margin:0;line-height:2.2;">'
    + '<li><a href="https://partstrading.com/#brands" style="color:#9ca3af;text-decoration:none;font-size:0.9rem;">Brands</a></li>'
    + '<li><a href="https://partstrading.com/#equipment-models" style="color:#9ca3af;text-decoration:none;font-size:0.9rem;">Equipment Models</a></li>'
    + '<li><a href="https://partstrading.com/#product-categories" style="color:#9ca3af;text-decoration:none;font-size:0.9rem;">Products</a></li>'
    + '<li><a href="https://partstrading.com/blog/" style="color:#9ca3af;text-decoration:none;font-size:0.9rem;">Technical Blog</a></li>'
    + '</ul>'
    + '</div>'
    + '<div>'
    + '<h4 style="color:#facc15;font-weight:700;margin-bottom:1.25rem;font-size:0.9rem;text-transform:uppercase;">Contact Us</h4>'
    + '<p style="color:#d1d5db;font-size:0.9rem;line-height:1.8;">Grant Road, Mumbai 400 007<br>'
    + '<a href="tel:+919821037990" style="color:#facc15;text-decoration:none;font-weight:bold;">+91 98210 37990</a><br>'
    + '<a href="mailto:parts@partstrading.com" style="color:#facc15;text-decoration:none;">parts@partstrading.com</a></p>'
    + '</div>'
    + '</div>'
    + '<div style="border-top:1px solid #374151;padding-top:2rem;display:flex;justify-content:space-between;align-items:center;">'
    + '<p style="font-size:0.8rem;color:#6b7280;">&copy; 2025 Parts Trading Company. All rights reserved.</p>'
    + '</div>'
    + '</div>'
    + '</footer>'
    + '</div>';

  function inject() {
    var isHomepage = (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname.length < 2);

    document.head.insertAdjacentHTML('beforeend', STYLE_HTML);
    if (!document.getElementById('ptc-wa-float')) document.body.insertAdjacentHTML('beforeend', WA_FLOATER_HTML);
    if (!document.getElementById('ptc-geo-banner')) document.body.insertAdjacentHTML('beforeend', GEO_BANNER_HTML);

    var waMsg = getWAMessage();
    var waUrl = 'https://wa.me/' + WA_NUM + '?text=' + waMsg;
    var floatEl = document.getElementById('ptc-wa-float');
    if (floatEl) floatEl.href = waUrl;

    if (!isHomepage) {
      // Avoid duplicate navs
      if (!document.querySelector('nav[aria-label="Main Navigation"]')) {
        var existingNavs = document.querySelectorAll('nav');
        existingNavs.forEach(function (n) {
           if (!n.classList.contains('mb-8') && !n.innerText.includes('/')) n.remove();
        });
        var topBar = document.querySelector('div.bg-gray-900.text-white.py-3');
        if (topBar) topBar.remove();
        document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
      }

      // Avoid duplicate footers
      if (!document.getElementById('ptc-footer')) {
        var eFoot = document.querySelector('footer');
        if (eFoot) {
          var current = eFoot;
          while (current) {
            var next = current.nextElementSibling;
            if (current.tagName !== 'SCRIPT') current.remove();
            current = next;
          }
        }
        document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
      }
    }

    // Geo IP Update
    setTimeout(function () {
      if (!document.getElementById('ptc-geo-text')) return;
      fetch('https://ipapi.co/json/')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var cc = (data && data.country_code) ? data.country_code : 'DEFAULT';
          var msg = COUNTRY_MESSAGES[cc] || COUNTRY_MESSAGES['DEFAULT'];
          var el = document.getElementById('ptc-geo-text');
          if (el) el.textContent = msg;
        }).catch(function(){});
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
