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
  var NAV_HTML = "<nav aria-label=\"Main Navigation\" class=\"sticky top-0 w-full z-50 bg-white/98 backdrop-blur-xl border-b-2 border-yellow-300/60 shadow-2xl\" x-data=\"{ mobileMenuOpen: false, scrolled: false }\" x-init=\"window.addEventListener('scroll', () => { scrolled = window.scrollY > 50; }); scrolled = window.scrollY > 50;\">\n\t<div class=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">\n\t<div class=\"flex justify-between items-center h-28\">\n\t<div class=\"flex items-center\">\n\t<div class=\"flex-shrink-0\">\n\t<a href=\"https://partstrading.com/#home\" class=\"flex items-center space-x-4 hover:scale-105 transition-transform duration-300\">\n\t<img src=\"/assets/images/ptc-logo.png?v=1\" alt=\"PTC Parts Trading Company\" class=\"h-36 w-auto transition-all duration-300\" id=\"nav-logo\">\n\t</a>\n\t</div>\n\t</div>\n\t<div class=\"hidden md:flex items-center space-x-2\">\n\t<a class=\"nav-link group relative px-6 py-4 font-bold transition-all duration-300 rounded-2xl flex items-center space-x-3 border-2 border-transparent drop-shadow-sm text-white\" href=\"https://partstrading.com/#home\">\n\t<svg class=\"w-5 h-5 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">HOME</span>\n\t</a>\n\t<a class=\"nav-link group relative px-6 py-4 font-bold transition-all duration-300 rounded-2xl flex items-center space-x-3 border-2 border-transparent drop-shadow-sm text-white\" href=\"https://partstrading.com/#brands\">\n\t<svg class=\"w-5 h-5 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">BRANDS</span>\n\t</a>\n\t<a class=\"nav-link group relative px-6 py-4 font-bold transition-all duration-300 rounded-2xl flex items-center space-x-3 border-2 border-transparent drop-shadow-sm text-white\" href=\"https://partstrading.com/#equipment-models\">\n\t<svg class=\"w-5 h-5 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">MODELS</span>\n\t</a>\n\t<a class=\"nav-link group relative px-6 py-4 font-bold transition-all duration-300 rounded-2xl flex items-center space-x-3 border-2 border-transparent drop-shadow-sm text-white\" href=\"https://partstrading.com/#product-categories\">\n\t<svg class=\"w-5 h-5 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">PRODUCTS</span>\n\t</a>\n\t<a class=\"nav-link group relative px-6 py-4 font-bold transition-all duration-300 rounded-2xl flex items-center space-x-3 border-2 border-transparent drop-shadow-sm text-white\" href=\"https://partstrading.com/blog/\">\n\t<svg class=\"w-5 h-5 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">BLOG</span>\n\t</a>\n\t<a class=\"nav-link group relative px-6 py-4 font-bold transition-all duration-300 rounded-2xl flex items-center space-x-3 border-2 border-transparent drop-shadow-sm text-white\" href=\"https://partstrading.com/#faq\">\n\t<svg class=\"w-5 h-5 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">FAQ</span>\n\t</a>\n\t<a class=\"group relative bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-4 rounded-2xl font-bold tracking-wide hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-yellow-300/50 flex items-center space-x-3\" href=\"https://partstrading.com/#contact\">\n\t<svg class=\"w-5 h-5 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">CONTACT</span>\n\t</a>\n\t</div>\n\t<div class=\"md:hidden\">\n\t<button @click=\"mobileMenuOpen = !mobileMenuOpen\" aria-expanded=\"false\" aria-label=\"Toggle mobile menu\" class=\"p-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 transition-all duration-300 border-2 border-transparent drop-shadow-sm text-white\" x-bind:aria-expanded=\"mobileMenuOpen\">\n\t<svg class=\"h-7 w-7\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\" x-show=\"!mobileMenuOpen\">\n\t<path d=\"M4 6h16M4 12h16M4 18h16\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<svg class=\"h-7 w-7\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\" x-show=\"mobileMenuOpen\">\n\t<path d=\"M6 18L18 6M6 6l12 12\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t</button>\n\t</div>\n\t</div>\n\t</div>\n\t<div class=\"md:hidden bg-white/98 backdrop-blur-xl border-t-2 border-yellow-300/60 shadow-2xl\" x-show=\"mobileMenuOpen\" x-transition:enter=\"transition ease-out duration-300\" x-transition:enter-end=\"opacity-100 transform translate-y-0\" x-transition:enter-start=\"opacity-0 transform -translate-y-4\" x-transition:leave=\"transition ease-in duration-200\" x-transition:leave-end=\"opacity-0 transform -translate-y-4\" x-transition:leave-start=\"opacity-100 transform translate-y-0\">\n\t<div class=\"px-6 py-6 space-y-3\">\n\t<a @click=\"mobileMenuOpen = false\" class=\"nav-link group flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 border-2 border-transparent drop-shadow-sm\" :class=\"scrolled ? 'text-gray-900' : 'text-white'\" href=\"https://partstrading.com/#home\">\n\t<svg class=\"w-6 h-6 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">HOME</span>\n\t</a>\n\t<a @click=\"mobileMenuOpen = false\" class=\"nav-link group flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 border-2 border-transparent drop-shadow-sm\" :class=\"scrolled ? 'text-gray-900' : 'text-white'\" href=\"https://partstrading.com/#brands\">\n\t<svg class=\"w-6 h-6 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">BRANDS</span>\n\t</a>\n\t<a @click=\"mobileMenuOpen = false\" class=\"nav-link group flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 border-2 border-transparent drop-shadow-sm\" :class=\"scrolled ? 'text-gray-900' : 'text-white'\" href=\"https://partstrading.com/#equipment-models\">\n\t<svg class=\"w-6 h-6 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">MODELS</span>\n\t</a>\n\t<a @click=\"mobileMenuOpen = false\" class=\"nav-link group flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 border-2 border-transparent drop-shadow-sm\" :class=\"scrolled ? 'text-gray-900' : 'text-white'\" href=\"https://partstrading.com/#product-categories\">\n\t<svg class=\"w-6 h-6 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">PRODUCTS</span>\n\t</a>\n\t<a @click=\"mobileMenuOpen = false\" class=\"nav-link group flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 border-2 border-transparent drop-shadow-sm\" :class=\"scrolled ? 'text-gray-900' : 'text-white'\" href=\"https://partstrading.com/blog/\">\n\t<svg class=\"w-6 h-6 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">BLOG</span>\n\t</a>\n\t<a @click=\"mobileMenuOpen = false\" class=\"nav-link group flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 border-2 border-transparent drop-shadow-sm\" :class=\"scrolled ? 'text-gray-900' : 'text-white'\" href=\"https://partstrading.com/#faq\">\n\t<svg class=\"w-6 h-6 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">FAQ</span>\n\t</a>\n\t<a @click=\"mobileMenuOpen = false\" class=\"nav-link group flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-2xl font-bold tracking-wide hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 border-2 border-yellow-300/50\" href=\"https://partstrading.com/#contact\">\n\t<svg class=\"w-6 h-6 group-hover:scale-125 transition-transform duration-300\" fill=\"none\" stroke=\"currentColor\" viewbox=\"0 0 24 24\">\n\t<path d=\"M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\"></path>\n\t</svg>\n\t<span class=\"font-bold tracking-wide\">CONTACT</span>\n\t</a>\n\t</div>\n\t</div>\n\t</nav>";

  var WA_FLOATER_HTML = '<a id="ptc-wa-float" href="#" target="_blank" rel="noopener" '
    + 'title="WhatsApp Parts Trading Company" '
    + 'style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:999999;'
    + 'background:#25d366;color:#fff;border-radius:50%;width:60px;height:60px;'
    + 'display:flex;align-items:center;justify-content:center;'
    + 'box-shadow:0 4px 20px rgba(37,211,102,0.5);'
    + 'cursor:pointer;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s; visibility: visible !important; opacity: 1 !important;"'
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
    console.log('--- INJECTING WA FLOATER ---'); document.body.insertAdjacentHTML('beforeend', WA_FLOATER_HTML);
    document.body.insertAdjacentHTML('beforeend', GEO_BANNER_HTML);

    // Set WhatsApp links
    var waMsg = getWAMessage();
    var waUrl = 'https://wa.me/' + WA_NUM + '?text=' + waMsg;
    var floatEl = document.getElementById('ptc-wa-float');
    if (floatEl) floatEl.href = waUrl;

    // Aggressively replace navigation and footer on non-homepage pages
    if (!isHomepage) {
      // 1. Handle Navigation
      // Remove any existing nav except breadcrumbs (which usually have "breadcrumb" in class or are small)
      // or simply remove the first nav if it looks like a header nav.
      // Better: find any nav that doesn't have 'mb-8' (standard breadcrumb margin in our generated pages)
      var navs = document.querySelectorAll('nav');
      navs.forEach(function (n) {
        // If it's the main header nav (usually sticky or has logo), remove it
        if (n.querySelector('img') || n.classList.contains('sticky')) {
          n.remove();
        }
      });

      // Remove the top "Fleet Overhaul" bar if present
      var topBar = document.querySelector('div.bg-gray-900.text-white.py-3.px-4');
      if (topBar) topBar.remove();

      // Inject standard NAV_HTML at the very top
      document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
      var navWa = document.getElementById('ptc-nav-wa');
      if (navWa) navWa.href = waUrl;

      // 2. Handle Footer
      // Remove any existing footer, footer bottom sections, and maps/share blocks that follow it
      var eFoot = document.querySelector('footer');
      if (eFoot) {
        // Try to remove everything from footer onwards to avoid "related parts in middle"
        var current = eFoot;
        var toRemove = [];
        while (current) {
          toRemove.push(current);
          current = current.nextElementSibling;
        }
        toRemove.forEach(function (el) {
          // Keep the scripts at the bottom!
          if (el.tagName !== 'SCRIPT') el.remove();
        });
      }

      // Inject standard FOOTER_HTML
      document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
    }

    // Geo IP detection
    setTimeout(function () {
      fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var cc = (data && data.country_code) ? data.country_code : 'DEFAULT';
          var msg = COUNTRY_MESSAGES[cc] || COUNTRY_MESSAGES['DEFAULT'];
          var el = document.getElementById('ptc-geo-text');
          if (el) el.textContent = msg;
          var banner = document.getElementById('ptc-geo-banner');
          if (banner) {
            banner.style.display = 'block';
            // Auto-hide after 6 seconds
            setTimeout(function () {
              if (banner) banner.style.opacity = '0';
              banner.style.transition = 'opacity 1s';
              setTimeout(function () { banner.style.display = 'none'; }, 1000);
            }, 7000);
          }
        })
        .catch(function () {
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
