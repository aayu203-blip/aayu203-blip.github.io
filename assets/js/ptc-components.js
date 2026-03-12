/**
 * PTC Shared Components — injected into all pages
 * Handles: Nav, Footer, WhatsApp Floater, Geo-IP Delivery Banner, Search Link Logic
 */

// Centralized link generation logic for search results
window.getProductPageLink = function (result) {
  const brandRaw = (result.Brand || '').toString().trim();
  const partNoRaw = (result["Part No"] || '').toString().trim();
  if (!partNoRaw) return '#';

  const brand = brandRaw.toLowerCase();
  const partNo = partNoRaw.toUpperCase();

  // 1. Try Path Index First (Most Accurate)
  if (typeof window.productPathIndex === 'object' && window.productPathIndex !== null) {
    const brandKey = `${brand}|${partNo}`;
    const directPath = window.productPathIndex[brandKey] || window.productPathIndex[partNo];
    if (directPath) return directPath;
  }

  // 2. Fallback to /pages/products/aftermarket-[brand]-[partNo].html
  const brandSlug = brand.includes('caterpillar') ? 'cat' : brand.split(' ')[0];
  return `/pages/products/aftermarket-${brandSlug}-${partNo.toLowerCase()}.html`;
};

(function () {
  'use strict';

  // ── Page context for pre-filled WhatsApp messages ──────────────────────────
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
    'jharkhand-heavy-equipment': 'Hi! I need heavy equipment parts for a mine in Jharkhand.',
    'odisha-heavy-equipment': 'Hi! I need heavy equipment parts for a mine in Odisha.',
    'karnataka-heavy-equipment': 'Hi! I need heavy equipment parts for a mine in Karnataka.',
    'rajasthan-heavy-equipment': 'Hi! I need heavy equipment parts for Rajasthan.',
    'underground-mining-parts': 'Hi! I need underground mining equipment parts (Epiroc/Sandvik/Normet).',
    'blog': 'Hi! I read your blog post and have a question about spare parts.',
    'equipment-models': 'Hi! I need spare parts for my equipment. Can you help?',
    'categories': 'Hi! I need spare parts from a specific category.',
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
  var NAV_HTML = "<nav aria-label=\"Main Navigation\" class=\"sticky top-0 w-full z-50 bg-white shadow-lg border-b border-gray-200\" x-data=\"{ mobileMenuOpen: false, scrolled: false }\" x-init=\"window.addEventListener('scroll', () => { scrolled = window.scrollY > 50; });\">\n\t<div class=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">\n\t<div class=\"flex justify-between items-center h-28\">\n\t<div class=\"flex items-center\">\n\t<div class=\"flex-shrink-0\">\n\t<a href=\"https://partstrading.com/#home\" class=\"flex items-center space-x-4 hover:scale-105 transition-transform duration-300\">\n\t<img src=\"/assets/images/ptc-logo.png?v=1\" alt=\"PTC Parts Trading Company\" class=\"h-32 w-auto\" id=\"nav-logo\">\n\t</a>\n\t</div>\n\t</div>\n\t<div class=\"hidden md:flex items-center space-x-2\">\n\t<a class=\"nav-link px-4 py-2 font-bold text-gray-900 hover:text-yellow-600 transition-colors\" href=\"https://partstrading.com/#home\">HOME</a>\n\t<a class=\"nav-link px-4 py-2 font-bold text-gray-900 hover:text-yellow-600 transition-colors\" href=\"https://partstrading.com/#brands\">BRANDS</a>\n\t<a class=\"nav-link px-4 py-2 font-bold text-gray-900 hover:text-yellow-600 transition-colors\" href=\"https://partstrading.com/#equipment-models\">MODELS</a>\n\t<a class=\"nav-link px-4 py-2 font-bold text-gray-900 hover:text-yellow-600 transition-colors\" href=\"https://partstrading.com/#product-categories\">PRODUCTS</a>\n\t<a class=\"nav-link px-4 py-2 font-bold text-gray-900 hover:text-yellow-600 transition-colors\" href=\"https://partstrading.com/blog/\">BLOG</a>\n\t<a class=\"nav-link px-4 py-2 font-bold text-gray-900 hover:text-yellow-600 transition-colors\" href=\"https://partstrading.com/#faq\">FAQ</a>\n\t<a class=\"ml-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all shadow-md\" href=\"https://partstrading.com/#contact\">CONTACT</a>\n\t</div>\n\t<div class=\"md:hidden\">\n\t<button @click=\"mobileMenuOpen = !mobileMenuOpen\" class=\"p-2 text-gray-900 focus:outline-none\">\n\t<svg class=\"h-8 w-8\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\" x-show=\"!mobileMenuOpen\"><path d=\"M4 6h16M4 12h16M4 18h16\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path></svg>\n\t<svg class=\"h-8 w-8\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\" x-show=\"mobileMenuOpen\"><path d=\"M6 18L18 6M6 6l12 12\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path></svg>\n\t</button>\n\t</div>\n\t</div>\n\t</div>\n\t<div class=\"md:hidden bg-white border-t border-gray-100\" x-show=\"mobileMenuOpen\" x-transition>\n\t<div class=\"px-4 py-4 space-y-2\">\n\t<a class=\"block px-4 py-3 font-bold text-gray-900 hover:bg-gray-50 rounded-lg\" href=\"https://partstrading.com/#home\">HOME</a>\n\t<a class=\"block px-4 py-3 font-bold text-gray-900 hover:bg-gray-50 rounded-lg\" href=\"https://partstrading.com/#brands\">BRANDS</a>\n\t<a class=\"block px-4 py-3 font-bold text-gray-900 hover:bg-gray-50 rounded-lg\" href=\"https://partstrading.com/#equipment-models\">MODELS</a>\n\t<a class=\"block px-4 py-3 font-bold text-gray-900 hover:bg-gray-50 rounded-lg\" href=\"https://partstrading.com/#product-categories\">PRODUCTS</a>\n\t<a class=\"block px-4 py-3 font-bold text-gray-900 hover:bg-gray-50 rounded-lg\" href=\"https://partstrading.com/blog/\">BLOG</a>\n\t<a class=\"block px-4 py-3 font-bold text-gray-900 hover:bg-gray-50 rounded-lg\" href=\"https://partstrading.com/#contact\">CONTACT</a>\n\t</div>\n\t</div>\n\t</nav>";

  var WA_FLOATER_HTML = '<a id="ptc-wa-float" href="#" target="_blank" rel="noopener" '
    + 'title="WhatsApp Parts Trading Company" '
    + 'style="position:fixed;bottom:2rem;right:2.5rem;z-index:9999999;'
    + 'background:#25d366;color:#fff;border-radius:50%;width:70px;height:70px;'
    + 'display:flex;align-items:center;justify-content:center;'
    + 'box-shadow:0 8px 32px rgba(37,211,102,0.4);border:2px solid rgba(255,255,255,0.2);'
    + 'cursor:pointer;text-decoration:none;transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); visibility: visible !important; opacity: 1 !important;"'
    + 'onmouseover="this.style.transform=\'scale(1.1) translateY(-5px)\';this.style.boxShadow=\'0 12px 40px rgba(37,211,102,0.6)\'"'
    + 'onmouseout="this.style.transform=\'scale(1) translateY(0)\';this.style.boxShadow=\'0 8px 32px rgba(37,211,102,0.4)\'">'
    + '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="white">'
    + '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>'
    + '</svg>'
    + '</a>'
    + '<div id="ptc-wa-pulse" style="position:fixed;bottom:2rem;right:2.5rem;z-index:9999998;'
    + 'width:70px;height:70px;border-radius:50%;background:rgba(37,211,102,0.3);'
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

  var GEO_BANNER_HTML = '<div id="ptc-geo-banner" style="display:none;position:fixed;bottom:0;left:0;width:100%;z-index:9999998;'
    + 'background:rgba(17,24,39,0.98);backdrop-filter:blur(8px);color:#fff;padding:0.75rem 1rem;text-align:center;'
    + 'font-size:0.875rem;font-weight:600;box-shadow:0 -4px 20px rgba(0,0,0,0.4);'
    + 'border-top:2px solid #facc15;transition:transform 0.5s ease-out;">'
    + '<span id="ptc-geo-text">🌏 Shipping Worldwide</span>'
    + '<button onclick="document.getElementById(\'ptc-geo-banner\').style.transform=\'translateY(100%)\'" '
    + 'style="background:none;border:none;color:#9ca3af;cursor:pointer;float:right;margin-left:0.5rem;font-size:1.25rem;line-height:1;">×</button>'
    + '</div>';

  // ── CSS KEYFRAMES ──────────────────────────────────────────────────────────
  var STYLE_HTML = '<style>html{scroll-padding-top:120px!important;}'
    + '@keyframes ptcPulse{0%{transform:scale(1);opacity:0.8;}70%{transform:scale(1.6);opacity:0;}100%{transform:scale(1.6);opacity:0;}}'
    + '#ptc-nav a:hover{color:#d97706!important;}'
    + '#ptc-footer a:hover{color:#facc15!important;}'
    + '@media(max-width:640px){#ptc-nav div{gap:0.5rem;}#ptc-nav a{font-size:0.75rem;}}'
    + '</style>';

  // ── FOOTER HTML ───────────────────────────────────────────────────────────
  var FOOTER_HTML = '<footer id="ptc-footer" style="background:#111827;color:#9ca3af;padding:3rem 1.5rem 2rem;margin-top:2rem;">'
    + '<div style="max-width:1280px;margin:0 auto;">'
    + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem;margin-bottom:2rem;">'
    + '<div>'
    + '<img src="/assets/images/ptc-logo.png?v=1" alt="Parts Trading Company" style="height:60px;margin-bottom:1rem;">'
    + '<p style="color:#d1d5db;font-size:0.9rem;line-height:1.6;">India\'s trusted supplier of OEM &amp; aftermarket spare parts for heavy equipment. 70+ years of experience.</p>'
    + '</div>'
    + '<div>'
    + '<h4 style="color:#facc15;font-weight:700;margin-bottom:1rem;font-size:0.9rem;text-transform:uppercase;letter-spacing:0.05em;">Quick Links</h4>'
    + '<ul style="list-style:none;padding:0;margin:0;space-y:0.5rem;">'
    + '<li><a href="https://partstrading.com/#brands" style="color:#9ca3af;text-decoration:none;font-size:0.875rem;">Brands</a></li>'
    + '<li><a href="https://partstrading.com/#equipment-models" style="color:#9ca3af;text-decoration:none;font-size:0.875rem;">Equipment Models</a></li>'
    + '<li><a href="https://partstrading.com/#product-categories" style="color:#9ca3af;text-decoration:none;font-size:0.875rem;">Products</a></li>'
    + '<li><a href="https://partstrading.com/blog/" style="color:#9ca3af;text-decoration:none;font-size:0.875rem;">Blog</a></li>'
    + '<li><a href="https://partstrading.com/#contact" style="color:#9ca3af;text-decoration:none;font-size:0.875rem;">Contact Us</a></li>'
    + '</ul>'
    + '</div>'
    + '<div>'
    + '<h4 style="color:#facc15;font-weight:700;margin-bottom:1rem;font-size:0.9rem;text-transform:uppercase;letter-spacing:0.05em;">Contact</h4>'
    + '<p style="color:#d1d5db;font-size:0.875rem;line-height:1.8;">Grant Road, Mumbai 400 007<br>'
    + '<a href="tel:+919821037990" style="color:#facc15;">+91 98210 37990</a><br>'
    + '<a href="tel:+912240755999" style="color:#facc15;">+91 22 4075 5999</a><br>'
    + '<a href="mailto:parts@partstrading.com" style="color:#facc15;">parts@partstrading.com</a></p>'
    + '</div>'
    + '<div>'
    + '<h4 style="color:#facc15;font-weight:700;margin-bottom:1rem;font-size:0.9rem;text-transform:uppercase;letter-spacing:0.05em;">Popular Brands</h4>'
    + '<ul style="list-style:none;padding:0;margin:0;">'
    + '<li><a href="https://partstrading.com/pages/hubs/brand-volvo.html" style="color: #6b7280; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color=\'#fbbf24\'" onmouseout="this.style.color=\'#6b7280\'">Volvo Parts</a></li>'
    + '<li><a href="https://partstrading.com/pages/hubs/brand-komatsu.html" style="color: #6b7280; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color=\'#fbbf24\'" onmouseout="this.style.color=\'#6b7280\'">Komatsu Parts</a></li>'
    + '<li><a href="https://partstrading.com/pages/hubs/brand-cat.html" style="color: #6b7280; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color=\'#fbbf24\'" onmouseout="this.style.color=\'#6b7280\'">Caterpillar Parts</a></li>'
    + '<li><a href="https://partstrading.com/pages/hubs/brand-hitachi.html" style="color: #6b7280; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color=\'#fbbf24\'" onmouseout="this.style.color=\'#6b7280\'">Hitachi Parts</a></li>'
    + '<li><a href="https://partstrading.com/pages/hubs/brand-scania.html" style="color: #6b7280; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color=\'#fbbf24\'" onmouseout="this.style.color=\'#6b7280\'">Scania Parts</a></li>'
    + '<li><a href="https://partstrading.com/pages/hubs/brand-jcb.html" style="color: #6b7280; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color=\'#fbbf24\'" onmouseout="this.style.color=\'#6b7280\'">JCB Parts</a></li>'
    + '<li><a href="https://partstrading.com/pages/hubs/brand-liebherr.html" style="color: #6b7280; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color=\'#fbbf24\'" onmouseout="this.style.color=\'#6b7280\'">Liebherr Parts</a></li>'
    + '<li><a href="https://partstrading.com/atlas-copco-spare-parts-india.html" style="color: #6b7280; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color=\'#fbbf24\'" onmouseout="this.style.color=\'#6b7280\'">Atlas Copco</a></li>'
    + '<li><a href="https://partstrading.com/doosan-spare-parts-india.html" style="color: #6b7280; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color=\'#fbbf24\'" onmouseout="this.style.color=\'#6b7280\'">Doosan Parts</a></li>'
    + '<li><a href="https://partstrading.com/bell-equipment-parts.html" style="color: #6b7280; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color=\'#fbbf24\'" onmouseout="this.style.color=\'#6b7280\'">Bell Parts</a></li>'
    + '<li><a href="https://partstrading.com/wirtgen-spare-parts-india.html" style="color: #6b7280; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color=\'#fbbf24\'" onmouseout="this.style.color=\'#6b7280\'">Wirtgen Parts</a></li>'
    + '</ul>'
    + '</div>'
    + '</div>'
    + '<div style="border-top:1px solid #374151;padding-top:1.5rem;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;">'
    + '<p style="font-size:0.8rem;color:#6b7280;margin:0;">&copy; 2025 Parts Trading Company Pvt. Ltd. All rights reserved.</p>'
    + '<div style="display:flex;gap:1rem;">'
    + '<a href="https://partstrading.com/pages/sitemap.html" style="color:#6b7280;font-size:0.8rem;text-decoration:none;">Sitemap</a>'
    + '<a href="https://partstrading.com/#contact" style="color:#6b7280;font-size:0.8rem;text-decoration:none;">Privacy</a>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</footer>';

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

    // 3. Inject Product Schema (Price on Request)
    if (window.location.pathname.includes('/products/')) {
      var schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "offers": {
          "@type": "Offer",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": "0.00",
            "priceCurrency": "USD",
            "valueAddedTaxIncluded": "false"
          },
          "price": "0.00",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "description": "Price on Request"
        }
      };
      var script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    // Aggressively replace navigation and footer on non-homepage pages
    if (!isHomepage) {
      // 1. Handle Navigation
      var navs = document.querySelectorAll('nav');
      navs.forEach(function (n) {
        if (n.querySelector('img') || n.classList.contains('sticky') || n.classList.contains('bg-white')) {
          // Don't remove breadcrumbs (usually small margin)
          if (!n.classList.contains('mb-8') && !n.innerText.includes('/')) {
            n.remove();
          }
        }
      });

      // Remove the top "Fleet Overhaul" bar if present
      var topBar = document.querySelector('div.bg-gray-900.text-white');
      if (topBar) topBar.remove();

      // Inject standard NAV_HTML at the very top
      document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

      // 2. Handle Footer
      var eFoot = document.querySelector('footer');
      if (eFoot) {
        var current = eFoot;
        var toRemove = [];
        while (current) {
          toRemove.push(current);
          current = current.nextElementSibling;
        }
        toRemove.forEach(function (el) {
          if (el && el.tagName !== 'SCRIPT') el.remove();
        });
      }
      document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
    }

    // Geo IP detection
    setTimeout(function () {
      fetch('https://ipapi.co/json/')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var cc = (data && data.country_code) ? data.country_code : 'DEFAULT';
          var msg = COUNTRY_MESSAGES[cc] || COUNTRY_MESSAGES['DEFAULT'];
          var el = document.getElementById('ptc-geo-text');
          if (el) el.textContent = msg;
          var banner = document.getElementById('ptc-geo-banner');
          if (banner) {
            banner.style.display = 'block';
            banner.style.transform = 'translateY(100%)';
            setTimeout(function () {
              banner.style.transform = 'translateY(0)';
            }, 100);
          }
        })
        .catch(function () { });
    }, 2000);
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
