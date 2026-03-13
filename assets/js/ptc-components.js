/**
 * PTC Shared Components — injected into all pages
 * Handles: Nav, Footer, WhatsApp Floater, Geo-IP Floating Bubble, Breadcrumbs, Search logic
 * Version: 1.9
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

  var WA_NUM = '919821037990';

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

  // ── NAV HTML ──────────────────────────────────────────────────────────────
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
    + 'style="position:fixed;bottom:2.5rem;right:2.5rem;z-index:9999999 !important;'
    + 'background:#25d366 !important;color:#fff !important;border-radius:50%;width:70px;height:70px;'
    + 'display:flex;align-items:center;justify-content:center;'
    + 'box-shadow:0 8px 32px rgba(37,211,102,0.4);border:2px solid rgba(255,255,255,0.2);'
    + 'cursor:pointer;text-decoration:none;transition:all 0.4s; visibility: visible !important; opacity: 1 !important;">'
    + '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="white">'
    + '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>'
    + '</svg>'
    + '</a>'
    + '<div id="ptc-wa-pulse" style="position:fixed;bottom:2.5rem;right:2.5rem;z-index:9999998;width:70px;height:70px;border-radius:50%;background:rgba(37,211,102,0.3);animation:ptcPulse 2s infinite;pointer-events:none;"></div>';

  var GEO_BUBBLE_HTML = '<div id="ptc-geo-bubble" style="position:fixed;bottom:7.5rem;right:2.5rem;z-index:9999998;'
    + 'background:rgba(17,24,39,0.95);backdrop-filter:blur(10px);color:#fff;padding:0.75rem 1rem; border-radius: 12px;'
    + 'font-size:0.75rem;font-weight:700;box-shadow:0 10px 40px rgba(0,0,0,0.3); border:1px solid rgba(250,204,21,0.5);'
    + 'display:none; transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1); opacity: 0; transform: translateY(20px); pointer-events: none;">'
    + '<div style="display:flex; align-items:center; gap:8px;">'
    + '<span id="ptc-geo-text">🌏 Fast Shipping Available</span>'
    + '</div>'
    + '<div style="position:absolute; bottom:-8px; right:25px; width:0; height:0; border-left:8px solid transparent; border-right:8px solid transparent; border-top:8px solid rgba(17,24,39,0.95);"></div>'
    + '</div>';

  var STYLE_HTML = '<style>html{scroll-padding-top:120px!important;}'
    + '@keyframes ptcPulse{0%{transform:scale(1);opacity:0.8;}70%{transform:scale(1.6);opacity:0;}100%{transform:scale(1.6);opacity:0;}}'
    + '@keyframes ptcSlideUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}'
    + '.nav-link:hover{color:#d97706!important;}'
    + '[id^="ptc-wa-"], .ptc-wa-btn { visibility: visible !important; opacity: 1 !important; display: flex !important; }'
    + '#ptc-geo-bubble { display: block !important; }'
    + '.geo-visible { opacity: 1 !important; transform: translateY(0) !important; animation: ptcSlideUp 0.6s backwards; }'
    + '.ptc-breadcrumb { margin: 1.5rem 0; font-size: 0.8rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }'
    + '.ptc-breadcrumb a { color: #d97706; text-decoration: none; transition: color 0.2s; }'
    + '.ptc-breadcrumb a:hover { color: #b45309; }'
    + '.footer-link { transition: all 0.3s; } .footer-link:hover { color: #facc15 !important; transform: translateX(5px); }'
    + '</style>';

  var FOOTER_HTML = '<div id="ptc-footer-container" style="clear:both; width: 100%; border-top: 1px solid rgba(0,0,0,0.05);">'
    + '<footer id="ptc-footer" style="background:#0f172a; color:#cbd5e1; padding:5rem 1.5rem 3rem; margin-top:4rem; clear:both; position:relative; overflow:hidden;">'
    + '<div style="position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg, transparent, rgba(250,204,21,0.3), transparent);"></div>'
    + '<div style="max-width:1280px; margin:0 auto; position:relative; z-index:1;">'
    + '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:4rem; margin-bottom:4rem;">'
    + '<div>'
    + '<img src="/assets/images/ptc-logo.png?v=1" alt="Parts Trading Company" style="height:70px; margin-bottom:2rem; filter: brightness(0) invert(1);">'
    + '<p style="color:#94a3b8; font-size:0.95rem; line-height:1.8; margin-bottom:2rem;">India\'s globally trusted partner for high-precision OEM and aftermarket heavy machinery parts. We serve mining, construction, and power sectors across 40+ countries.</p>'
    + '<div style="display:flex; gap:15px;">'
    + '<span style="background:rgba(250,204,21,0.1); color:#facc15; padding:6px 12px; border-radius:8px; font-size:0.75rem; font-weight:800; border:1px solid rgba(250,204,21,0.2);">ISO CERTIFIED OPS</span>'
    + '<span style="background:rgba(255,255,255,0.05); color:#fff; padding:6px 12px; border-radius:8px; font-size:0.75rem; font-weight:800; border:1px solid rgba(255,255,255,0.1);">20+ YEARS EXP</span>'
    + '</div>'
    + '</div>'
    + '<div>'
    + '<h4 style="color:#fff; font-weight:800; margin-bottom:2rem; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.1em;">Solutions</h4>'
    + '<ul style="list-style:none; padding:0; margin:0; line-height:2.4;">'
    + '<li><a href="https://partstrading.com/#brands" class="footer-link" style="color:#94a3b8; text-decoration:none; font-size:0.9rem; display:block;">Premium Brands</a></li>'
    + '<li><a href="https://partstrading.com/#equipment-models" class="footer-link" style="color:#94a3b8; text-decoration:none; font-size:0.9rem; display:block;">Equipment Series</a></li>'
    + '<li><a href="https://partstrading.com/#product-categories" class="footer-link" style="color:#94a3b8; text-decoration:none; font-size:0.9rem; display:block;">Major Components</a></li>'
    + '<li><a href="https://partstrading.com/blog/" class="footer-link" style="color:#94a3b8; text-decoration:none; font-size:0.9rem; display:block;">Technical Analysis</a></li>'
    + '</ul>'
    + '</div>'
    + '<div>'
    + '<h4 style="color:#fff; font-weight:800; margin-bottom:2rem; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.1em;">Get in Touch</h4>'
    + '<div style="margin-bottom:1.5rem; display:flex; align-items:flex-start; gap:12px;">'
    + '<div style="color:#facc15; margin-top:4px;"><svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg></div>'
    + '<div><p style="color:#fff; font-weight:600; font-size:0.9rem; margin:0;">Headquarters</p><p style="color:#94a3b8; font-size:0.85rem; margin-top:4px;">Grant Road, Mumbai<br>Maharashtra 400 007, India</p></div>'
    + '</div>'
    + '<div style="margin-bottom:1.5rem; display:flex; align-items:center; gap:12px;">'
    + '<div style="color:#facc15;"><svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg></div>'
    + '<div><a href="tel:+919821037990" style="color:#fff; font-weight:700; text-decoration:none; font-size:1rem;">+91 98210 37990</a></div>'
    + '</div>'
    + '<div style="display:flex; align-items:center; gap:12px;">'
    + '<div style="color:#facc15;"><svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg></div>'
    + '<div><a href="mailto:parts@partstrading.com" style="color:#fff; font-weight:600; text-decoration:none; font-size:0.9rem;">parts@partstrading.com</a></div>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '<div style="border-top:1px solid rgba(255,255,255,0.05); padding-top:2.5rem; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1.5rem;">'
    + '<p style="font-size:0.85rem; color:#64748b; font-weight:500;">&copy; 2026 Parts Trading Company. Engineered for Reliability.</p>'
    + '<div style="display:flex; gap:2rem;">'
    + '<a href="https://partstrading.com/#contact" style="color:#64748b; text-decoration:none; font-size:0.8rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Request Quote</a>'
    + '<a href="https://partstrading.com/#brands" style="color:#64748b; text-decoration:none; font-size:0.8rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Bulk Supply</a>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</footer>'
    + '</div>';

  function inject() {
    var path = window.location.pathname;
    var isHomepage = (path === '/' || path === '/index.html' || path.length < 2);

    if (!document.getElementById('ptc-styles')) {
        var s = document.createElement('div');
        s.id = 'ptc-styles';
        s.innerHTML = STYLE_HTML;
        document.head.appendChild(s);
    }

    if (!document.getElementById('ptc-wa-float')) document.body.insertAdjacentHTML('beforeend', WA_FLOATER_HTML);
    if (!document.getElementById('ptc-geo-bubble')) document.body.insertAdjacentHTML('beforeend', GEO_BUBBLE_HTML);

    var waMsg = getWAMessage();
    var waUrl = 'https://wa.me/' + WA_NUM + '?text=' + waMsg;
    var floatEl = document.getElementById('ptc-wa-float');
    if (floatEl) floatEl.href = waUrl;

    if (!isHomepage) {
      // NAV
      if (!document.querySelector('nav[aria-label="Main Navigation"]')) {
        document.querySelectorAll('nav').forEach(function (n) {
           if (!n.classList.contains('mb-8') && !n.innerText.includes('/')) n.remove();
        });
        document.querySelectorAll('div.bg-gray-900.text-white.py-3').forEach(function(d){ d.remove(); });
        document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
      }

      // FOOTER
      if (!document.getElementById('ptc-footer')) {
        document.querySelectorAll('footer').forEach(function(f){
            var cur = f;
            while(cur && cur.tagName !== 'SCRIPT' && !cur.id.includes('ptc-components')) {
                var next = cur.nextElementSibling;
                cur.remove();
                cur = next;
            }
        });
        document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
      }

      // BREADCRUMBS
      if (!document.querySelector('.ptc-breadcrumb')) {
        var main = document.querySelector('main');
        if (main) {
           var h1 = main.querySelector('h1');
           if (h1) {
              var brand = 'Brands';
              var partNo = '';
              var filename = path.split('/').pop();
              if (filename.includes('aftermarket-')) {
                 var parts = filename.replace('.html', '').split('-');
                 if (parts.length >= 3) {
                    brand = parts[1].toUpperCase();
                    partNo = parts.slice(2).join(' ').toUpperCase();
                 }
              }
              var breadcrumbHTML = '<div class="ptc-breadcrumb max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">'
                + '<a href="https://partstrading.com/">Home</a> &nbsp;/&nbsp; '
                + '<a href="https://partstrading.com/#brands">' + brand + '</a>'
                + (partNo ? ' &nbsp;/&nbsp; <span class="text-gray-900 font-bold">' + partNo + '</span>' : '')
                + '</div>';
              h1.insertAdjacentHTML('beforebegin', breadcrumbHTML);
           }
        }
      }
    }

    // IP Bubble Fade In
    setTimeout(function () {
      var bubble = document.getElementById('ptc-geo-bubble');
      var el = document.getElementById('ptc-geo-text');
      if (!bubble || !el) return;
      
      fetch('https://ipapi.co/json/')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.city && data.country_name) {
            el.innerHTML = '📦 Standard Shipping to <span style="color:#facc15;">' + data.city + ', ' + data.country_name + '</span>';
            bubble.classList.add('geo-visible');
          } else { bubble.classList.add('geo-visible'); }
        }).catch(function(){ bubble.classList.add('geo-visible'); });
    }, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
