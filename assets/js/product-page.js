(function(){
'use strict';
// Constants
const AMBER='#FFB81C',WG='#25D366',D="'Barlow Condensed',sans-serif",B="'Barlow',sans-serif";
const T={bg:'#050505',bgAlt:'#080808',bgCard:'#0D0D0D',text:'#F0ECE6',muted:'rgba(255,255,255,0.45)',border:'rgba(255,255,255,0.07)',navBg:'rgba(5,5,5,0.97)',footerBg:'#030303',tagBg:'rgba(255,184,28,0.08)',amberDim:'rgba(255,184,28,0.08)'};
const WA=t=>`https://wa.me/919821037990?text=${encodeURIComponent(t)}`;
const EMAIL='parts@partstrading.com';
const CAT_IMG_MAP={'seals-orings':'seals-o-rings','spare-parts':'engine-parts'};
const catImg=t=>`/assets/images/categories/${CAT_IMG_MAP[t]||t}.jpg`;
const partLink=(b,c,n)=>`/${b||P.brandSlug}/${c||P.catSlug}/${n}`;
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const BRANDS_NAV=[{name:'Volvo',slug:'volvo'},{name:'Scania',slug:'scania'},{name:'Komatsu',slug:'komatsu'},{name:'CAT',slug:'cat'},{name:'Hitachi',slug:'hitachi'},{name:'Hyundai',slug:'hyundai'},{name:'BEML',slug:'beml'},{name:'LiuGong',slug:'liugong'}];
const CATS_NAV=["Engine Parts","Hydraulic Parts","Filters","Electrical Parts","Transmission Parts","Undercarriage","Brake Parts","Cooling System","Exhaust & Turbo","Seals & O-Rings","Cab & Body Parts","Bearing & Bushing","Fuel System","Drive & Swing Parts","Ground Engaging Tools","Hardware & Fasteners","Suspension & Chassis","Gearbox & Differential","Steering Parts"];
const CATS_URLS={"Engine Parts":"engine-parts","Hydraulic Parts":"hydraulic-parts","Filters":"filters","Electrical Parts":"electrical-parts","Transmission Parts":"transmission-parts","Undercarriage":"undercarriage","Brake Parts":"brake-parts","Cooling System":"cooling-system","Exhaust & Turbo":"exhaust-turbo","Seals & O-Rings":"seals-orings","Cab & Body Parts":"cab-body-parts","Bearing & Bushing":"bearing-bushing","Fuel System":"fuel-system","Drive & Swing Parts":"drive-swing-parts","Ground Engaging Tools":"ground-engaging-tools","Hardware & Fasteners":"hardware-fasteners","Suspension & Chassis":"suspension-chassis","Gearbox & Differential":"gearbox-differential","Steering Parts":"steering-parts"};
const PROD_SECS=[{id:'sec-compatible',label:'Compatible Models'},{id:'sec-specs',label:'Specifications'},{id:'sec-related',label:'Related Parts'},{id:'sec-reviews',label:'Reviews'},{id:'sec-faq',label:'FAQ'},{id:'sec-quickref',label:'Quick Reference'},{id:'sec-order',label:'Order Now'}];

let DISPLAY_NAME=P.name;
try{const m=document.title.match(/ — (.+?) \|/);if(m){const n=m[1];DISPLAY_NAME=n.startsWith(P.brand+' ')?n.slice(P.brand.length+1):n;}}catch(e){}

// CSS
const style=document.createElement('style');
style.textContent=`
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{overflow-x:hidden;font-family:${B};background:#050505;color:#F0ECE6;}
:focus-visible{outline:2px solid ${AMBER};outline-offset:3px;border-radius:3px;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#080808;}
::-webkit-scrollbar-thumb{background:${AMBER};border-radius:3px;}
a{color:inherit;text-decoration:none;}
button{cursor:pointer;}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes act{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{left:-100%}100%{left:200%}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(255,184,28,.1)}50%{box-shadow:0 0 40px rgba(255,184,28,.2)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes modalIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
.act-inner{animation:act 28s linear infinite;display:flex;width:max-content;}
.card-shine{position:relative;overflow:hidden;}
.card-shine::after{content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,184,28,.04),transparent);pointer-events:none;}
.card-shine:hover::after{animation:shimmer .7s ease forwards;}
.reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease;}
.reveal.in{opacity:1;transform:none;}
.section-ghost{position:absolute;top:-20px;right:-10px;font-family:${D};font-size:clamp(80px,12vw,140px);font-weight:900;color:rgba(255,255,255,.018);line-height:1;pointer-events:none;user-select:none;z-index:0;}
.hero-2col{display:grid;grid-template-columns:260px 1fr;gap:48px;align-items:start;}
.spec-2col{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start;}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.sidebar-col{width:200px;flex-shrink:0;}
.toc-link{display:flex;align-items:center;gap:10px;padding:8px 0;background:none;border:none;width:100%;text-align:left;cursor:pointer;transition:opacity .2s;}
.toc-dot{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.3);flex-shrink:0;transition:all .2s;}
.toc-link.active .toc-dot{background:${AMBER};box-shadow:0 0 8px ${AMBER}99;width:7px;height:7px;}
.toc-link.active span{color:${T.text};font-weight:600;}
.desktop-only{display:flex;}
.mob-hbg{display:none!important;}
.mob-menu-overlay{display:none!important;}
.mega-anim{animation:fadeUp .15s ease both;}
@media(max-width:768px){
  .desktop-only{display:none!important;}
  .mob-hbg{display:flex!important;}
  .mob-hide-cta{display:none!important;}
  .hero-2col{grid-template-columns:1fr;}
  .spec-2col{grid-template-columns:1fr;}
  .related-grid{grid-template-columns:1fr 1fr;}
  .reviews-grid{grid-template-columns:1fr;}
  .sidebar-col{display:none;}
}
@media(max-width:480px){.related-grid{grid-template-columns:1fr;}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;}}
#ptc-mobile-menu{display:none;position:fixed;top:68px;left:0;right:0;bottom:0;background:rgba(5,5,5,.98);z-index:999;overflow-y:auto;padding:16px;}
#ptc-mobile-menu.open{display:block;}
#ptc-brand-menu,#ptc-cat-menu{display:none;position:absolute;top:100%;left:-16px;background:#080808;border:1px solid ${T.border};border-top:2px solid ${AMBER};border-radius:0 0 16px 16px;padding:18px;box-shadow:0 40px 80px rgba(0,0,0,.97);z-index:200;}
#ptc-brand-menu.open,#ptc-cat-menu.open{display:block;}
.ptc-faq-answer{display:none;padding:0 24px 20px;}
.ptc-faq-item.open .ptc-faq-answer{display:block;}
.ptc-faq-chevron{transition:transform .25s;}
.ptc-faq-item.open .ptc-faq-chevron{transform:rotate(180deg);}
`;
document.head.appendChild(style);

// WA SVG
const waSvg=(size=16,color='#fff')=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" style="flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
const stars=n=>[1,2,3,4,5].map(i=>`<svg width="13" height="13" viewBox="0 0 24 24" fill="${i<=n?AMBER:'rgba(255,255,255,.1)'}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`).join('');

// ── ANNOUNCEMENT BAR ──
function buildAnnouncement(){
  const msgs=['Order before 3 PM IST — ships same day','Shipping to 50+ countries worldwide','70,000+ parts ready to dispatch, Mumbai','WhatsApp · Email · SWIFT & UPI accepted','Est. 1956 — 70 years of trusted supply'];
  const items=[...msgs,...msgs].map(m=>`<span style="font-family:${B};font-size:13px;font-weight:600;color:#050505;white-space:nowrap">${esc(m)}</span>`).join('<span style="margin:0 32px;opacity:.4;color:#050505">·</span>');
  return `<div style="background:${AMBER};overflow:hidden;padding:9px 0"><div class="act-inner">${items}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${items}</div></div>`;
}

// ── NAV ──
function buildNav(){
  const brandItems=BRANDS_NAV.map(b=>{
    const active=b.slug===P.brandSlug;
    return `<a href="/${b.slug}/" style="display:flex;align-items:center;justify-content:space-between;padding:9px 11px;border-radius:8px;border:1px solid ${active?'rgba(255,184,28,.4)':T.border};background:${active?T.amberDim:'rgba(255,255,255,.025)'};color:${active?AMBER:T.text};font-family:${B};font-size:12px;font-weight:600;transition:all .18s" onmouseenter="this.style.borderColor='${AMBER}';this.style.color='${AMBER}';this.style.background='${T.amberDim}'" onmouseleave="if(!${active})this.style.cssText+='border-color:${T.border};color:${T.text};background:rgba(255,255,255,.025)'">${b.name}${active?`<span style="font-size:9px;color:${AMBER};letter-spacing:.08em">YOU'RE HERE</span>`:''}</a>`;
  }).join('');
  const catItems=CATS_NAV.map(c=>{
    const active=c===P.category;
    const slug=CATS_URLS[c]||c.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
    return `<a href="/${P.brandSlug}/${slug}/" style="display:block;padding:7px 10px;border-radius:6px;border:1px solid ${active?'rgba(255,184,28,.35)':T.border};background:${active?T.amberDim:'rgba(255,255,255,.018)'};color:${active?AMBER:T.text};font-family:${B};font-size:11px;font-weight:${active?700:500};transition:all .15s" onmouseenter="this.style.color='${AMBER}';this.style.borderColor='rgba(255,184,28,.3)';this.style.background='${T.amberDim}'" onmouseleave="if(!${active})this.style.cssText+='color:${T.text};border-color:${T.border};background:rgba(255,255,255,.018)'">${esc(c)}</a>`;
  }).join('');
  const waMsg=`Hi, I need part ${P.partNo} — ${P.name} (${P.brand}). Please confirm availability and pricing.`;
  const btnStyle=`background:none;border:none;font-family:${B};font-size:13px;font-weight:500;color:${T.text};padding:0 13px;height:68px;display:flex;align-items:center;gap:5px;opacity:.75;transition:opacity .18s;white-space:nowrap;cursor:pointer`;
  const chevron=`<svg width="8" height="5" viewBox="0 0 8 5" fill="none" style="transition:transform .2s;flex-shrink:0"><path d="M1 1l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  return `
<nav id="ptc-nav" style="position:sticky;top:0;z-index:1000;background:${T.navBg};backdrop-filter:blur(28px);border-bottom:1px solid transparent;transition:all .3s">
  <div style="max-width:1360px;margin:0 auto;padding:0 32px;height:68px;display:flex;align-items:center">
    <a href="/" style="margin-right:32px;flex-shrink:0;display:flex;align-items:center"><img src="/assets/images/ptc-logo.webp" alt="Parts Trading Company" style="height:48px;width:auto"></a>
    <div class="desktop-only" style="flex:1;align-items:center">
      <a href="/" style="${btnStyle};opacity:.6" onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=.6">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Home</a>
      <div id="ptc-brand-trigger" style="position:relative" onmouseenter="document.getElementById('ptc-brand-menu').classList.add('open')" onmouseleave="document.getElementById('ptc-brand-menu').classList.remove('open')">
        <button style="${btnStyle}" onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=.75">By Brand ${chevron}</button>
        <div id="ptc-brand-menu" style="width:360px">
          <div style="font-family:${B};font-size:9px;font-weight:700;letter-spacing:.15em;color:${T.muted};text-transform:uppercase;margin-bottom:12px">Browse by Brand</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px">${brandItems}</div>
        </div>
      </div>
      <div id="ptc-cat-trigger" style="position:relative" onmouseenter="document.getElementById('ptc-cat-menu').classList.add('open')" onmouseleave="document.getElementById('ptc-cat-menu').classList.remove('open')">
        <button style="${btnStyle}" onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=.75">By Category ${chevron}</button>
        <div id="ptc-cat-menu" style="width:510px">
          <div style="font-family:${B};font-size:9px;font-weight:700;letter-spacing:.15em;color:${T.muted};text-transform:uppercase;margin-bottom:12px">Browse by Category</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px">${catItems}</div>
        </div>
      </div>
      <a href="/blog/" style="${btnStyle}" onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=.75">Blog</a>
      <a href="/about.html" style="${btnStyle}" onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=.75">About</a>
    </div>
    <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
      <button id="ptc-search-btn" aria-label="Search parts" title="Search parts" style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:7px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.07);color:rgba(255,255,255,.7);cursor:pointer;transition:all .2s;flex-shrink:0" onmouseenter="this.style.borderColor='${AMBER}';this.style.color='${AMBER}';this.style.background='rgba(255,184,28,.1)'" onmouseleave="this.style.borderColor='rgba(255,255,255,.2)';this.style.color='rgba(255,255,255,.7)';this.style.background='rgba(255,255,255,.07)'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </button>
      <a href="${WA(waMsg)}" target="_blank" class="mob-hide-cta" style="display:inline-flex;align-items:center;gap:7px;background:${WG};color:#fff;text-decoration:none;border-radius:8px;padding:8px 16px;font-family:${B};font-size:13px;font-weight:700;transition:opacity .2s" onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'">${waSvg(13)} WhatsApp</a>
      <a href="#sec-order" class="mob-hide-cta" style="background:${AMBER};color:#050505;text-decoration:none;padding:8px 18px;border-radius:8px;font-family:${D};font-weight:700;font-size:13px;letter-spacing:.06em;text-transform:uppercase;transition:opacity .2s" onmouseenter="this.style.opacity='.82'" onmouseleave="this.style.opacity='1'">Get Quote</a>
      <button id="ptc-menu-btn" class="mob-hbg" aria-label="Menu" style="background:none;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.8);border-radius:6px;width:34px;height:34px;align-items:center;justify-content:center;flex-shrink:0;padding:0" onclick="document.getElementById('ptc-mobile-menu').classList.toggle('open')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>
  ${buildSearchModal()}
  <div id="ptc-mobile-menu">
    <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div style="font-family:${D};font-size:9px;font-weight:700;letter-spacing:.15em;color:${T.muted};text-transform:uppercase;margin-bottom:10px">By Brand</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">${BRANDS_NAV.map(b=>`<a href="/${b.slug}/" onclick="document.getElementById('ptc-mobile-menu').classList.remove('open')" style="padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.08);color:${T.text};font-family:${B};font-size:13px;font-weight:600;background:rgba(255,255,255,.03)">${b.name}</a>`).join('')}</div>
    </div>
    <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,.07)">
      <div style="font-family:${D};font-size:9px;font-weight:700;letter-spacing:.15em;color:${T.muted};text-transform:uppercase;margin-bottom:10px">By Category</div>
      <div style="display:flex;flex-direction:column;gap:3px">${CATS_NAV.map(c=>{const slug=CATS_URLS[c]||c.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');return`<a href="/${P.brandSlug}/${slug}/" onclick="document.getElementById('ptc-mobile-menu').classList.remove('open')" style="padding:9px 12px;border-radius:6px;border:1px solid rgba(255,255,255,.07);color:${T.text};font-family:${B};font-size:13px;background:rgba(255,255,255,.025)">${esc(c)}</a>`;}).join('')}</div>
    </div>
    <a href="/blog/" style="display:block;padding:12px 4px;color:${T.muted};font-family:${B};font-size:13px;font-weight:600;border-bottom:1px solid rgba(255,255,255,.07)">Blog</a>
    <a href="/about.html" style="display:block;padding:12px 4px;color:${T.muted};font-family:${B};font-size:13px;font-weight:600;border-bottom:1px solid rgba(255,255,255,.07)">About</a>
    <div style="margin-top:16px;display:flex;gap:8px">
      <a href="${WA('Hi, I need a quote for a part. Can you help?')}" target="_blank" style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;background:${WG};color:#fff;padding:12px 8px;border-radius:8px;font-family:${B};font-size:14px;font-weight:700">${waSvg(16)} WhatsApp</a>
      <a href="#sec-order" onclick="document.getElementById('ptc-mobile-menu').classList.remove('open')" style="flex:1;display:flex;align-items:center;justify-content:center;background:${AMBER};color:#050505;padding:12px 8px;border-radius:8px;font-family:${D};font-weight:700;font-size:14px;letter-spacing:.06em;text-transform:uppercase">Get Quote</a>
    </div>
  </div>
</nav>`;
}

// ── SEARCH MODAL ──
const SEARCH_BRANDS=['All','Volvo','Scania','Komatsu','CAT','Hitachi'];
function buildSearchModal(){
  const chips=SEARCH_BRANDS.map(b=>`<button type="button" class="ptc-search-brand${b==='All'?' active':''}" data-brand="${b}" style="font-family:${B};font-size:12px;font-weight:700;padding:5px 14px;border-radius:20px;border:1px solid ${b==='All'?AMBER:'rgba(255,255,255,.1)'};cursor:pointer;background:${b==='All'?AMBER:'transparent'};color:${b==='All'?'#050505':'rgba(255,255,255,.5)'};transition:all .15s">${b}</button>`).join('');
  return `<div id="ptc-search-overlay" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.88);backdrop-filter:blur(8px);align-items:flex-start;justify-content:center;padding-top:80px">
  <div id="ptc-search-panel" style="animation:modalIn .2s ease both;width:100%;max-width:720px;margin:0 16px;background:${T.bgCard};border:1px solid ${T.border};border-radius:16px;overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.8)">
    <div style="display:flex;gap:8px;padding:16px 20px 0;flex-wrap:wrap" id="ptc-search-brands">${chips}
      <button type="button" id="ptc-search-close" style="margin-left:auto;background:transparent;border:none;cursor:pointer;color:${T.muted};padding:4px 8px;display:flex;align-items:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>
    <div style="display:flex;align-items:center;border-bottom:1px solid ${T.border};margin:12px 0 0">
      <div style="padding:0 20px;flex-shrink:0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${T.muted}" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div>
      <input id="ptc-search-input" type="search" placeholder="Part number or description — e.g. VOE20450734 or hydraulic pump" style="flex:1;padding:18px 16px 18px 0;font-size:16px;font-family:${B};font-weight:500;background:transparent;border:none;color:${T.text};outline:none">
    </div>
    <div id="ptc-search-results"></div>
  </div>
</div>`;
}
function ptcSearchResultRow(r){
  return `<a href="${r.url||WA(`Hi, I need part ${r.partNo} — ${r.name} (${r.brand}). Please confirm availability and pricing.`)}" ${r.url?'':'target="_blank"'} style="display:flex;align-items:center;justify-content:space-between;padding:13px 20px;border-bottom:1px solid ${T.border};text-decoration:none;transition:background .15s;gap:12px" onmouseenter="this.style.background='rgba(255,184,28,.04)'" onmouseleave="this.style.background='transparent'">
    <div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:3px;flex-wrap:wrap">
        <span style="font-family:monospace;font-weight:700;font-size:14px;color:${AMBER}">${esc(r.partNo)}</span>
        <span style="font-family:${B};font-size:11px;color:${T.muted};background:rgba(255,255,255,.04);padding:2px 8px;border-radius:4px;border:1px solid ${T.border}">${esc(r.brand)}</span>
        <span style="font-family:${B};font-size:11px;color:${T.muted};background:rgba(255,255,255,.04);padding:2px 8px;border-radius:4px;border:1px solid ${T.border}">${esc(r.cat)}</span>
      </div>
      <div style="font-family:${B};font-size:13px;color:${T.muted}">${esc(r.name)}</div>
    </div>
  </a>`;
}
function ptcRenderSearchResults(q,brand){
  const box=document.getElementById('ptc-search-results');
  if(!box) return;
  if(q.length<2){box.innerHTML='';return;}
  const DB=window.productSearchDB||null;
  const lq=q.toLowerCase();
  const results=DB?DB.filter(p=>((p.part||'').toLowerCase().includes(lq)||(p.desc||'').toLowerCase().includes(lq)||(p.brand||'').toLowerCase().includes(lq))&&(brand==='All'||p.brand===brand)).slice(0,12).map(p=>({partNo:p.part,name:p.desc,brand:p.brand,cat:p.cat,url:p.url})):[];
  if(!results.length){
    box.innerHTML=`<div style="padding:24px 20px;display:flex;justify-content:space-between;align-items:center;gap:12px">
      <div>
        <div style="font-family:${D};font-weight:700;font-size:16px;color:${T.text};margin-bottom:4px">No match found</div>
        <div style="font-family:${B};font-size:13px;color:${T.muted}">Full database has 75,000+ parts — WhatsApp us directly.</div>
      </div>
      <a href="${WA(`Hi, I'm searching for: ${q}. Please check availability and pricing.`)}" target="_blank" style="display:flex;align-items:center;gap:8px;background:${WG};color:#fff;text-decoration:none;padding:11px 18px;border-radius:9px;font-family:${D};font-weight:700;font-size:14px;white-space:nowrap;flex-shrink:0">${waSvg(16)} Ask on WhatsApp</a>
    </div>`;
  }else{
    box.innerHTML=results.map(ptcSearchResultRow).join('');
  }
}
let _ptcSearchDbRequested=false;
function ptcEnsureSearchDBLoaded(cb){
  if(window.productSearchDB&&window.productSearchDB.length){if(cb)cb();return;}
  if(_ptcSearchDbRequested){if(cb){const iv=setInterval(()=>{if(window.productSearchDB&&window.productSearchDB.length){clearInterval(iv);cb();}},100);}return;}
  _ptcSearchDbRequested=true;
  const s=document.createElement('script');
  s.src='/assets/js/search-db.js';
  s.onload=()=>{if(cb)cb();};
  document.head.appendChild(s);
}
function initSearch(){
  const btn=document.getElementById('ptc-search-btn');
  const overlay=document.getElementById('ptc-search-overlay');
  const panel=document.getElementById('ptc-search-panel');
  const closeBtn=document.getElementById('ptc-search-close');
  const input=document.getElementById('ptc-search-input');
  const brandsBox=document.getElementById('ptc-search-brands');
  if(!btn||!overlay) return;
  let brand='All';
  const open=()=>{
    overlay.style.display='flex';
    ptcEnsureSearchDBLoaded(()=>ptcRenderSearchResults(input.value,brand));
    setTimeout(()=>input.focus(),80);
  };
  const close=()=>{overlay.style.display='none';input.value='';document.getElementById('ptc-search-results').innerHTML='';};
  btn.addEventListener('click',open);
  closeBtn.addEventListener('click',close);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
  panel.addEventListener('click',e=>e.stopPropagation());
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.style.display==='flex')close();});
  input.addEventListener('input',()=>ptcRenderSearchResults(input.value,brand));
  brandsBox.querySelectorAll('.ptc-search-brand').forEach(chip=>{
    chip.addEventListener('click',()=>{
      brand=chip.dataset.brand;
      brandsBox.querySelectorAll('.ptc-search-brand').forEach(c=>{
        const active=c===chip;
        c.style.border=`1px solid ${active?AMBER:'rgba(255,255,255,.1)'}`;
        c.style.background=active?AMBER:'transparent';
        c.style.color=active?'#050505':'rgba(255,255,255,.5)';
        c.classList.toggle('active',active);
      });
      ptcRenderSearchResults(input.value,brand);
    });
  });
}

// ── STICKY FILTER BAR ──
function buildStickyFilter(){
  const chips=CATS_NAV.map(c=>{
    const active=c===P.category;
    const slug=CATS_URLS[c]||c.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
    return `<a href="/${P.brandSlug}/${slug}/" style="display:inline-flex;align-items:center;white-space:nowrap;padding:6px 14px;border-radius:20px;border:1px solid ${active?AMBER:'rgba(255,255,255,.1)'};background:${active?T.amberDim:'transparent'};color:${active?AMBER:'rgba(255,255,255,.55)'};font-family:${B};font-size:12px;font-weight:${active?700:500};flex-shrink:0;transition:all .15s">${esc(c)}</a>`;
  }).join('');
  const models=(P.models||[]).slice(0,12).map(m=>`<span style="display:inline-flex;align-items:center;white-space:nowrap;padding:5px 12px;border-radius:20px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:rgba(255,255,255,.35);font-family:${B};font-size:11px;font-weight:500;flex-shrink:0">${esc(m)}</span>`).join('');
  const sep=models?`<div style="width:1px;height:20px;background:rgba(255,255,255,.1);flex-shrink:0;margin:0 8px"></div>`:'';
  return `<div style="position:sticky;top:68px;z-index:100;background:rgba(5,5,5,.97);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.06)"><div style="max-width:1360px;margin:0 auto;padding:0 32px;display:flex;align-items:center;height:44px;overflow-x:auto;-ms-overflow-style:none;scrollbar-width:none;gap:6px"><a href="/${P.brandSlug}/" style="display:inline-flex;align-items:center;white-space:nowrap;padding:6px 14px;border-radius:20px;border:1px solid rgba(255,255,255,.1);background:transparent;color:rgba(255,255,255,.55);font-family:${B};font-size:12px;font-weight:500;flex-shrink:0;margin-right:2px">All ${esc(P.brand)}</a>${chips}${sep}${models}</div></div>`;
}

// ── READING PROGRESS ──
function buildProgress(){
  return `<div style="position:fixed;top:0;left:0;right:0;z-index:10000;height:3px;background:transparent;pointer-events:none"><div id="ptc-progress" style="height:100%;background:${AMBER};width:0%;transition:width .1s linear;box-shadow:0 0 10px ${AMBER}66"></div></div>`;
}

// ── HERO ──
function buildHero(){
  const waMsg=`Hi, I need part ${P.partNo} — ${P.name} (${P.brand}). Please confirm availability and pricing.`;
  const quoteMsg=`Hi, I'd like a formal quotation for ${P.partNo} — ${P.name} (${P.brand} ${P.category}). Please send proforma invoice.`;
  const breadcrumb=[['Home','/'],[(P.brand+' Parts'),`/${P.brandSlug}/`],[P.category,`/${P.brandSlug}/${P.catSlug}/`],[P.partNo,null]]
    .map(([label,href],i,arr)=>`<span style="display:flex;align-items:center;gap:8px">${href?`<a href="${href}" style="color:${T.muted};transition:color .15s" onmouseenter="this.style.color='${AMBER}'" onmouseleave="this.style.color='${T.muted}'">${esc(label)}</a>`:`<span style="color:${T.text};font-weight:600">${esc(label)}</span>`}${i<arr.length-1?`<span style="opacity:.2">›</span>`:''}</span>`).join('');
  const miniSpecs=(P.specs||[]).slice(0,5).map((s,i)=>`<div style="display:flex;border-bottom:${i<4?`1px solid ${T.border}`:'none'};background:${i%2===0?'rgba(255,255,255,.015)':'transparent'}"><div style="padding:11px 16px;width:130px;flex-shrink:0;font-family:${D};font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${T.muted}">${esc(s.key)}</div><div style="padding:11px 16px;font-family:${B};font-size:13px;color:${T.text};font-weight:500;word-break:break-word">${esc(s.val)}</div></div>`).join('');
  const xrefPreview=(P.xref||[]).slice(0,3).join(' · ');
  const badges=[{i:'⚡',t:'Same-day dispatch before 3 PM IST'},{i:'📦',t:'India delivery 2–4 days'},{i:'🌍',t:'Ships to 50+ countries'},{i:'🧾',t:'GST invoice included'},{i:'💬',t:'Responds in 60 min'}]
    .map(b=>`<div style="display:flex;align-items:center;gap:8px"><span style="font-size:15px">${b.i}</span><span style="font-family:${B};font-size:12px;color:${T.muted};font-weight:500">${esc(b.t)}</span></div>`).join('');
  return `
<section style="background:${T.bg};border-bottom:1px solid ${T.border}">
  <div style="max-width:1360px;margin:0 auto;padding:20px 32px 0">
    <nav aria-label="Breadcrumb" style="display:flex;align-items:center;gap:8px;font-family:${B};font-size:12px;color:${T.muted}">${breadcrumb}</nav>
  </div>
  <div class="hero-2col" style="max-width:1360px;margin:0 auto;padding:32px 32px 64px">
    <div style="animation:fadeUp .6s .12s ease both;display:flex;flex-direction:column;gap:14px">
      <div style="width:100%;height:200px;background:${T.bgAlt};border:1px solid ${T.border};border-radius:12px;overflow:hidden;position:relative">
        <img src="${catImg(P.catSlug)}" alt="${esc(P.brand)} ${esc(P.category)}" onerror="this.style.display='none'" style="width:100%;height:100%;object-fit:cover;transition:opacity .4s;opacity:0" onload="this.style.opacity=1">
        <div style="position:absolute;top:10px;left:10px;background:rgba(5,5,5,.72);backdrop-filter:blur(8px);border:1px solid ${T.border};border-radius:4px;padding:3px 9px;font-family:${D};font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${T.muted}">${esc(P.condition||'OEM Aftermarket')}</div>
      </div>
      <div style="background:${T.bgCard};border:1px solid ${T.border};border-radius:12px;overflow:hidden">${miniSpecs}</div>
    </div>
    <div style="animation:fadeUp .6s ease both">
      <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;align-items:center">
        <span style="font-family:${D};font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;background:${T.tagBg};color:${AMBER};border:1px solid rgba(255,184,28,.2);padding:5px 13px;border-radius:4px">${esc(P.brand)}</span>
        <span style="font-family:${D};font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;background:rgba(255,255,255,.04);color:${T.muted};border:1px solid ${T.border};padding:5px 13px;border-radius:4px">${esc(P.category)}</span>
        <span style="font-family:${D};font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;background:rgba(74,222,128,.08);color:#4ade80;border:1px solid rgba(74,222,128,.2);padding:5px 13px;border-radius:4px;display:flex;align-items:center;gap:6px"><span style="width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block;flex-shrink:0"></span>In Stock</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <span style="display:inline-flex;gap:2px">${stars(5)}</span>
        <span style="font-family:${B};font-size:13px;font-weight:700;color:${T.text}">4.8</span>
        <span style="font-family:${B};font-size:13px;color:${T.muted}">· 213 verified orders</span>
      </div>
      <div style="display:flex;gap:18px;align-items:flex-start;margin-bottom:16px">
        <div style="width:4px;background:${AMBER};border-radius:2px;flex-shrink:0;align-self:stretch;min-height:52px;margin-top:4px"></div>
        <h1 style="font-family:${D};font-weight:900;font-size:clamp(38px,5vw,68px);line-height:.92;color:${T.text};letter-spacing:-.02em;text-transform:uppercase">${esc(DISPLAY_NAME)}</h1>
      </div>
      <div style="margin-bottom:20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <code style="font-family:monospace;font-size:20px;font-weight:700;color:${AMBER};background:${T.tagBg};border:1px solid rgba(255,184,28,.2);padding:6px 16px;border-radius:6px;letter-spacing:.06em">${esc(P.partNo)}</code>
        <button id="ptc-copy" title="Copy part number" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.04);border:1px solid ${T.border};color:${T.muted};border-radius:6px;padding:5px 11px;font-family:${B};font-size:11px;font-weight:700;letter-spacing:.04em;transition:all .2s">
          <svg id="ptc-copy-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy
        </button>
        ${xrefPreview?`<span style="font-family:${B};font-size:12px;color:${T.muted}">Also: ${esc(xrefPreview)}</span>`:''}
      </div>
      <p style="font-family:${B};font-size:15px;color:${T.muted};line-height:1.78;max-width:580px;margin-bottom:28px">${esc(P.description)}</p>
      <div id="ptc-countdown-wrap" style="display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,.04);border:1px solid ${T.border};border-radius:8px;padding:9px 16px;margin-bottom:24px">
        <span style="width:7px;height:7px;border-radius:50%;background:${T.muted};display:inline-block;flex-shrink:0" id="ptc-cd-dot"></span>
        <span style="font-family:${B};font-size:13px;font-weight:700;color:${T.text}" id="ptc-cd-text">Order in <strong style="font-family:monospace"><span id="ptc-h">--</span>h <span id="ptc-m">--</span>m</strong> — ships today from Mumbai</span>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px">
        <a href="${WA(waMsg)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;background:${WG};color:#fff;padding:15px 28px;border-radius:10px;font-family:${D};font-weight:800;font-size:16px;letter-spacing:.05em;text-transform:uppercase;box-shadow:0 6px 28px rgba(37,211,102,.25);transition:all .2s" onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 10px 36px rgba(37,211,102,.35)'" onmouseleave="this.style.transform='none';this.style.boxShadow='0 6px 28px rgba(37,211,102,.25)'">${waSvg(18)} WhatsApp — Price & Availability</a>
        <a href="${WA(quoteMsg)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;background:transparent;color:${T.text};padding:15px 28px;border-radius:10px;border:1.5px solid ${T.border};font-family:${D};font-weight:700;font-size:16px;letter-spacing:.05em;text-transform:uppercase;transition:all .2s" onmouseenter="this.style.borderColor='${AMBER}';this.style.color='${AMBER}'" onmouseleave="this.style.borderColor='${T.border}';this.style.color='${T.text}'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Get Formal Quote
        </a>
      </div>
      <div style="display:flex;gap:0;flex-wrap:wrap;border-top:1px solid ${T.border};padding-top:20px">${badges}</div>
    </div>
  </div>
</section>`;
}

// ── XREF STRIP ──
function buildXrefStrip(){
  const xrefs=(P.xref||[P.partNo]).map((x,i)=>`<span style="font-family:monospace;font-size:12px;font-weight:700;color:${i===0?AMBER:T.muted};background:rgba(255,255,255,.035);border:1px solid ${T.border};border-radius:5px;padding:4px 10px;letter-spacing:.04em">${esc(x)}</span>`).join('');
  return `<div style="background:${T.bgAlt};border-top:1px solid ${T.border};border-bottom:1px solid ${T.border};padding:14px 0"><div style="max-width:1360px;margin:0 auto;padding:0 32px;display:flex;align-items:center;gap:16px;flex-wrap:wrap"><span style="font-family:${D};font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${T.muted};flex-shrink:0">Also known as</span><div style="display:flex;gap:8px;flex-wrap:wrap">${xrefs}</div><span class="desktop-only" style="font-family:${B};font-size:11px;color:${T.muted};margin-left:auto">All numbers refer to the same component</span></div></div>`;
}

// ── SIDEBAR ──
function buildSidebar(){
  const links=PROD_SECS.map(s=>`<button class="toc-link" data-target="${s.id}" onclick="document.getElementById('${s.id}')&&document.getElementById('${s.id}').scrollIntoView({behavior:'smooth',block:'start'})"><div class="toc-dot"></div><span style="font-family:${B};font-size:13px;font-weight:400;color:${T.muted};transition:color .2s">${s.label}</span></button>`).join('');
  const waMsg=`Hi, I need a quote for ${P.partNo} — ${P.name} (${P.brand}). Please confirm availability and pricing.`;
  return `<div class="sidebar-col"><div style="position:sticky;top:88px;display:flex;flex-direction:column;gap:2px">
    <div style="font-family:${D};font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${T.muted};margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid ${T.border}">On this page</div>
    ${links}
    <div style="margin-top:28px;background:${T.bgCard};border:1px solid ${T.border};border-radius:12px;padding:16px">
      <div style="font-family:${D};font-weight:800;font-size:14px;color:${T.text};text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Ready to Order?</div>
      <p style="font-family:${B};font-size:12px;color:${T.muted};line-height:1.6;margin-bottom:12px">Pricing and availability in under 60 minutes.</p>
      <a href="${WA(waMsg)}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:7px;background:${WG};color:#fff;padding:10px 14px;border-radius:8px;font-family:${D};font-weight:700;font-size:13px;letter-spacing:.04em;transition:opacity .2s" onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'">${waSvg(14)} WhatsApp Now</a>
    </div>
  </div></div>`;
}

// ── COMPATIBLE MODELS ──
function buildCompatibleModels(){
  const models=(P.models||[]).map((m,i)=>`<a href="/equipment-models/${P.brandSlug}/${P.brandSlug}-${String(m).toLowerCase().replace(/[^a-z0-9]+/g,'-')}-parts.html" class="card-shine" style="background:${T.bgCard};border:1px solid ${T.border};border-radius:8px;padding:10px 20px;transition:all .2s;display:block" onmouseenter="this.style.borderColor='${AMBER}';this.querySelector('span').style.color='${AMBER}'" onmouseleave="this.style.borderColor='${T.border}';this.querySelector('span').style.color='${T.text}'"><span style="font-family:${D};font-weight:700;font-size:15px;color:${T.text};letter-spacing:.04em;transition:color .2s">${esc(m)}</span></a>`).join('');
  const waMsg=`Hi, I need part ${P.partNo} for my ${P.brand}. Please check compatibility with my serial number.`;
  return `<div id="sec-compatible" style="position:relative;overflow:hidden;padding:72px 0 64px;border-bottom:1px solid ${T.border}">
    <div class="section-ghost">01</div>
    <div class="reveal" style="position:relative;z-index:1">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div style="width:24px;height:2px;background:${AMBER}"></div><span style="font-family:${D};font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${AMBER}">Fitment</span></div>
      <h2 style="font-family:${D};font-weight:900;font-size:clamp(26px,3.5vw,48px);color:${T.text};text-transform:uppercase;letter-spacing:-.02em;margin-bottom:8px">Compatible Equipment Models</h2>
      <p style="font-family:${B};font-size:14px;color:${T.muted};margin-bottom:32px">Verify using your machine's serial number — same model may use different part numbers across production runs.</p>
      <div style="display:flex;flex-wrap:wrap;gap:10px">${models}</div>
      <p style="font-family:${B};font-size:12px;color:${T.muted};margin-top:20px">Not your model? <a href="${WA(waMsg)}" target="_blank" style="color:${AMBER};font-weight:600">WhatsApp us your serial number →</a></p>
    </div>
  </div>`;
}

// ── SPECIFICATIONS ──
function buildSpecifications(){
  const specRows=(P.specs||[]).map((s,i)=>`<div style="display:flex;border-bottom:${i<(P.specs.length-1)?`1px solid ${T.border}`:'none'};background:${i%2===0?'rgba(255,255,255,.015)':'transparent'}"><div style="padding:13px 18px;width:150px;flex-shrink:0;font-family:${D};font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${T.muted}">${esc(s.key)}</div><div style="padding:13px 18px;font-family:${B};font-size:13px;color:${T.text};font-weight:500;word-break:break-word">${esc(s.val)}</div></div>`).join('');
  const shipRows=[{r:'India — Metro',t:'2–3 days',d:'Mumbai, Delhi, Chennai, Bengaluru, Hyderabad, Kolkata'},{r:'India — Other',t:'3–5 days',d:'All major cities, state capitals, industrial zones'},{r:'Gulf & UAE',t:'3–5 days',d:'DHL / FedEx Express · door-to-door'},{r:'Africa',t:'5–10 days',d:'DHL, specialist freight forwarders'},{r:'SE Asia',t:'4–7 days',d:'Singapore, Indonesia, Malaysia, Vietnam'},{r:'Russia / CIS',t:'7–14 days',d:'Specialist freight · full customs documentation'}]
    .map(s=>`<div class="card-shine" style="background:${T.bgCard};border:1px solid ${T.border};border-radius:10px;padding:13px 18px;display:flex;justify-content:space-between;align-items:center;gap:16px"><div><div style="font-family:${D};font-weight:700;font-size:14px;color:${T.text};margin-bottom:3px">${esc(s.r)}</div><div style="font-family:${B};font-size:11px;color:${T.muted}">${esc(s.d)}</div></div><div style="font-family:${D};font-weight:800;font-size:15px;color:${AMBER};flex-shrink:0">${esc(s.t)}</div></div>`).join('');
  return `<div id="sec-specs" style="position:relative;overflow:hidden;padding:72px 0 64px;border-bottom:1px solid ${T.border}">
    <div class="section-ghost">02</div>
    <div class="reveal spec-2col" style="position:relative;z-index:1">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div style="width:24px;height:2px;background:${AMBER}"></div><span style="font-family:${D};font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${AMBER}">Technical Data</span></div>
        <h2 style="font-family:${D};font-weight:900;font-size:clamp(26px,3.5vw,44px);color:${T.text};text-transform:uppercase;letter-spacing:-.02em;margin-bottom:32px">Full Specifications</h2>
        <div style="border:1px solid ${T.border};border-radius:12px;overflow:hidden">${specRows}</div>
      </div>
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div style="width:24px;height:2px;background:${AMBER}"></div><span style="font-family:${D};font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${AMBER}">Logistics</span></div>
        <h2 style="font-family:${D};font-weight:900;font-size:clamp(26px,3.5vw,44px);color:${T.text};text-transform:uppercase;letter-spacing:-.02em;margin-bottom:32px">Shipping & Dispatch</h2>
        <div style="display:flex;flex-direction:column;gap:10px">${shipRows}</div>
        <div style="margin-top:16px;padding:14px 18px;background:${T.amberDim};border:1px solid rgba(255,184,28,.2);border-radius:10px">
          <div style="font-family:${D};font-weight:700;font-size:13px;color:${AMBER};letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px">Same-day dispatch</div>
          <p style="font-family:${B};font-size:13px;color:${T.muted}">Orders confirmed before 3 PM IST ship same day from Mumbai.</p>
        </div>
      </div>
    </div>
  </div>`;
}

// ── WORKSHOP & SOURCING NOTES ──
// Recovers the {type:"workshop",...} block from pages that set PTC_CUSTOM_SECTIONS
// as a plain array/object instead of a function. Those pages' array never rendered
// (only a function is honored — see sectionsBlock below), so this reads the array
// directly and renders just the workshop entry into the default section flow.
// Pages using the correct function-based PTC_CUSTOM_SECTIONS are unaffected — this
// only fires when window.PTC_CUSTOM_SECTIONS exists and is NOT a function.
function buildWorkshopNotes(){
  const arr=window.PTC_CUSTOM_SECTIONS;
  if(!arr || typeof arr==='function' || !Array.isArray(arr)) return '';
  const w=arr.find(s=>s && s.type==='workshop');
  if(!w) return '';
  const rows=[['Failure Mode',w.failure],['Commonly Paired',w.paired],['Installation Note',w.install],['Sourcing',w.sourcing]]
    .filter(([,v])=>v)
    .map(([label,val])=>`<div style="padding:18px 0;border-bottom:1px solid ${T.border}">
      <div style="font-family:${D};font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${AMBER};margin-bottom:8px">${esc(label)}</div>
      <p style="font-family:${B};font-size:14px;color:${T.muted};line-height:1.75">${esc(val)}</p>
    </div>`).join('');
  return `<div id="sec-workshop" style="position:relative;overflow:hidden;padding:72px 0 64px;border-bottom:1px solid ${T.border}">
    <div class="section-ghost">WS</div>
    <div class="reveal" style="position:relative;z-index:1">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div style="width:24px;height:2px;background:${AMBER}"></div><span style="font-family:${D};font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${AMBER}">From The Bench</span></div>
      <h2 style="font-family:${D};font-weight:900;font-size:clamp(26px,3.5vw,44px);color:${T.text};text-transform:uppercase;letter-spacing:-.02em;margin-bottom:24px">${esc(w.title||'Workshop & Sourcing Notes')}</h2>
      <div>${rows}</div>
    </div>
  </div>`;
}

// ── RELATED PARTS ──
function buildRelatedParts(){
  const parts=(P.relatedParts||[]).map(e=>{
    const waMsg=`Hi, I need part ${e.partNo} — ${e.name} (${e.brand||P.brand}). Please confirm availability and pricing.`;
    const href=partLink(e.brandSlug,e.catSlug,e.partNo);
    return `<article class="card-shine" style="background:${T.bgCard};border:1px solid ${T.border};border-radius:10px;overflow:hidden;transition:all .2s" onmouseenter="this.style.borderColor='${AMBER}';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='${T.border}';this.style.transform='none'">
      <div style="height:88px;overflow:hidden;position:relative;background:${T.bgAlt}">
        <img src="${catImg(e.catSlug||P.catSlug)}" alt="${esc(e.name)}" style="width:100%;height:100%;object-fit:cover;filter:brightness(.55) saturate(.7);transition:transform .4s" onerror="this.style.display='none'" onmouseenter="this.style.transform='scale(1.05)'" onmouseleave="this.style.transform='scale(1)'">
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(13,13,13,.9),rgba(13,13,13,.1))"></div>
        <div style="position:absolute;bottom:8px;left:14px;font-family:${D};font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.5)">${esc(e.brand||P.brand)} · ${esc(e.cat||P.category)}</div>
      </div>
      <div style="padding:16px 18px 18px">
        <code style="font-family:monospace;font-size:13px;color:${AMBER};font-weight:700;letter-spacing:.04em;display:block;margin-bottom:6px">${esc(e.partNo)}</code>
        <div style="font-family:${D};font-weight:800;font-size:18px;color:${T.text};line-height:1.2;margin-bottom:16px;letter-spacing:-.01em">${esc(e.name)}</div>
        <div style="display:flex;gap:8px">
          <a href="${href}" style="flex:1;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid ${T.border};color:${T.muted};padding:9px 0;border-radius:7px;font-family:${D};font-weight:700;font-size:12px;letter-spacing:.06em;text-transform:uppercase;transition:all .2s" onmouseenter="this.style.background='${AMBER}';this.style.borderColor='${AMBER}';this.style.color='#050505'" onmouseleave="this.style.background='transparent';this.style.borderColor='${T.border}';this.style.color='${T.muted}'">View Details →</a>
          <a href="${WA(waMsg)}" target="_blank" style="width:38px;display:flex;align-items:center;justify-content:center;background:${WG};border-radius:7px;flex-shrink:0;transition:opacity .18s" onmouseenter="this.style.opacity='.8'" onmouseleave="this.style.opacity='1'">${waSvg(14)}</a>
        </div>
      </div>
    </article>`;
  }).join('');
  if(!parts) return '';
  return `<div id="sec-related" style="position:relative;overflow:hidden;padding:72px 0 64px;border-bottom:1px solid ${T.border}">
    <div class="section-ghost">03</div>
    <div class="reveal" style="position:relative;z-index:1">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div style="width:24px;height:2px;background:${AMBER}"></div><span style="font-family:${D};font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${AMBER}">Often Ordered Together</span></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:32px;flex-wrap:wrap;gap:12px">
        <h2 style="font-family:${D};font-weight:900;font-size:clamp(26px,3.5vw,44px);color:${T.text};text-transform:uppercase;letter-spacing:-.02em">Related ${esc(P.brand)} Parts</h2>
        <a href="/${P.brandSlug}/${P.catSlug}/" style="font-family:${B};font-size:13px;color:${AMBER};font-weight:600">All ${esc(P.brand)} ${esc(P.category)} →</a>
      </div>
      <div class="related-grid">${parts}</div>
    </div>
  </div>`;
}

// ── REVIEWS ──
function buildReviews(){
  const cards=(P.reviews||[]).map(r=>`<div class="card-shine" style="background:${T.bgCard};border:1px solid ${T.border};border-radius:14px;padding:28px 26px 24px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
      <div>
        <div style="font-family:${D};font-weight:800;font-size:17px;color:${T.text};text-transform:uppercase;letter-spacing:.03em">${esc(r.name)}</div>
        <div style="font-family:${B};font-size:11px;color:${T.muted};margin-top:3px">${esc(r.loc)}</div>
      </div>
      <span style="display:inline-flex;gap:2px">${stars(r.rating||5)}</span>
    </div>
    <p style="font-family:${B};font-size:14px;color:${T.muted};line-height:1.7">"${esc(r.text)}"</p>
  </div>`).join('');
  if(!cards) return '';
  return `<div id="sec-reviews" style="position:relative;overflow:hidden;padding:72px 0 64px;border-bottom:1px solid ${T.border}">
    <div class="section-ghost">04</div>
    <div class="reveal" style="position:relative;z-index:1">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div style="width:24px;height:2px;background:${AMBER}"></div><span style="font-family:${D};font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${AMBER}">Customer Feedback</span></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:32px;flex-wrap:wrap;gap:12px">
        <h2 style="font-family:${D};font-weight:900;font-size:clamp(26px,3.5vw,44px);color:${T.text};text-transform:uppercase;letter-spacing:-.02em">Reviews</h2>
        <div style="display:flex;align-items:center;gap:10px"><span style="display:inline-flex;gap:2px">${stars(5)}</span><span style="font-family:${D};font-weight:800;font-size:22px;color:${T.text}">4.8</span><span style="font-family:${B};font-size:13px;color:${T.muted}">/ 5 · 213 verified orders</span></div>
      </div>
      <div class="reviews-grid">${cards}</div>
    </div>
  </div>`;
}

// ── FAQ ──
function buildFAQ(){
  const items=(P.faq||[]).map((f,i)=>`<div class="ptc-faq-item" style="background:${T.bgCard};border:1px solid ${T.border};border-radius:12px;overflow:hidden;transition:border-color .2s">
    <button class="ptc-faq-btn" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:18px 24px;background:transparent;border:none;gap:16px;text-align:left" onclick="this.closest('.ptc-faq-item').classList.toggle('open');this.closest('.ptc-faq-item').style.borderColor=this.closest('.ptc-faq-item').classList.contains('open')?'${AMBER}':'${T.border}'">
      <span style="font-family:${D};font-weight:800;font-size:16px;color:${T.text};text-transform:uppercase;letter-spacing:.03em">${esc(f.q)}</span>
      <svg class="ptc-faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${T.muted}" stroke-width="2.5" style="flex-shrink:0"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div class="ptc-faq-answer"><p style="font-family:${B};font-size:14px;color:${T.muted};line-height:1.78">${esc(f.a)}</p></div>
  </div>`).join('');
  if(!items) return '';
  return `<div id="sec-faq" style="position:relative;overflow:hidden;padding:72px 0 64px;border-bottom:1px solid ${T.border}">
    <div class="section-ghost">05</div>
    <div class="reveal" style="position:relative;z-index:1;max-width:720px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div style="width:24px;height:2px;background:${AMBER}"></div><span style="font-family:${D};font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${AMBER}">Questions Answered</span></div>
      <h2 style="font-family:${D};font-weight:900;font-size:clamp(26px,3.5vw,48px);color:${T.text};text-transform:uppercase;letter-spacing:-.02em;margin-bottom:40px;text-align:center">Frequently Asked</h2>
      <div style="display:flex;flex-direction:column;gap:8px">${items}</div>
    </div>
  </div>`;
}

// ── QUICK REFERENCE (static visible Q&A — feeds Featured Snippets / PAA) ──
function buildQuickReference(){
  const qas=(P.faq&&P.faq.length>0)?P.faq:[
    {q:`Is ${P.partNo} — ${P.name} available in India?`,a:`Yes. Parts Trading Company stocks ${P.partNo} in Mumbai. Same-day dispatch for orders placed before 3 PM IST. WhatsApp or email to confirm current stock and pricing.`},
    {q:`What is the minimum order quantity for ${P.partNo}?`,a:`MOQ is 1 piece. Fleet pricing applies at 10+ pieces. PTC supplies fleet operators, authorised ${P.brand} workshops, and parts distributors across India and internationally.`},
    {q:`Does PTC ship ${P.partNo} internationally?`,a:`Yes — PTC exports from Mumbai to UAE, Saudi Arabia, Qatar, Nigeria, Kenya, South Africa, Bangladesh, Indonesia, Malaysia, UK, Germany, Sweden, and 40+ more countries. Airfreight for urgent orders; sea freight for bulk.`},
    {q:`What documents come with an order for ${P.partNo}?`,a:`India orders include a GST invoice with correct HSN code. Export orders include commercial invoice, packing list, and certificate of origin. DDP available for select destinations.`},
    {q:`How do I confirm ${P.partNo} fits my ${P.brand} machine?`,a:`Send your chassis serial number (VIN) on WhatsApp. PTC cross-references the ${P.brand} parts catalogue before dispatch — we confirm fitment before processing any order.`},
    {q:`Is ${P.partNo} a genuine ${P.brand} part or aftermarket?`,a:`OEM-specification aftermarket — manufactured to original ${P.brand} tolerances and quality standards. PTC does not supply genuine OEM parts or counterfeit parts.`}
  ];
  const items=qas.map(f=>`<div style="padding:22px 24px;background:${T.bg}">
    <h3 style="font-family:${D};font-size:14px;font-weight:800;color:${AMBER};text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px">${esc(f.q)}</h3>
    <p style="font-family:${B};font-size:14px;color:${T.muted};line-height:1.75">${esc(f.a)}</p>
  </div>`).join('');
  return `<div id="sec-quickref" style="position:relative;overflow:hidden;padding:72px 0 64px;border-bottom:1px solid ${T.border}">
    <div class="section-ghost">06</div>
    <div class="reveal" style="position:relative;z-index:1">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div style="width:24px;height:2px;background:${AMBER}"></div><span style="font-family:${D};font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${AMBER}">Quick Reference</span></div>
      <h2 style="font-family:${D};font-weight:900;font-size:clamp(26px,3.5vw,48px);color:${T.text};text-transform:uppercase;letter-spacing:-.02em;margin-bottom:40px">Technical Quick Reference</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:1px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.06);border-radius:12px;overflow:hidden">${items}</div>
    </div>
  </div>`;
}

// ── CATEGORY DESC ──
function buildCategoryDesc(){
  return `<div id="sec-order" style="position:relative;overflow:hidden;padding:64px 0">
    <div class="reveal" style="position:relative;z-index:1;max-width:680px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div style="width:24px;height:2px;background:${AMBER}"></div><span style="font-family:${D};font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${AMBER}">About This Category</span></div>
      <h2 style="font-family:${D};font-weight:900;font-size:clamp(22px,3vw,36px);color:${T.text};text-transform:uppercase;letter-spacing:-.01em;margin-bottom:20px">${esc(P.brand)} ${esc(P.category)}</h2>
      <p style="font-family:${B};font-size:15px;color:${T.muted};line-height:1.85">${esc(P.categoryDesc||'')}</p>
    </div>
  </div>`;
}

// ── BOTTOM CTA ──
function buildBottomCTA(){
  const waMsg=`Hi, I need a quote for ${P.partNo} — ${P.name} (${P.brand}). Please confirm availability, pricing, and shipping to my country.`;
  return `<section style="background:${AMBER};padding:80px 32px;text-align:center">
    <div style="max-width:640px;margin:0 auto">
      <div style="font-family:monospace;font-size:12px;font-weight:700;letter-spacing:.14em;color:rgba(5,5,5,.4);text-transform:uppercase;margin-bottom:14px">${esc(P.partNo)} · ${esc(P.brand)}</div>
      <h2 style="font-family:${D};font-weight:900;font-size:clamp(36px,6vw,64px);color:#050505;letter-spacing:-.02em;line-height:.92;margin-bottom:16px;text-transform:uppercase">Get a Quote<br>for This Part</h2>
      <p style="font-family:${B};font-size:15px;color:rgba(5,5,5,.6);line-height:1.7;margin-bottom:8px">We respond in 60 minutes with availability, a formal proforma invoice, and exact shipping cost to your country.</p>
      <p style="font-family:${B};font-size:13px;color:rgba(5,5,5,.45);margin-bottom:32px">No commitment required — free quote, no spam.</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <a href="${WA(waMsg)}" target="_blank" style="display:inline-flex;align-items:center;gap:10px;background:${WG};color:#fff;padding:15px 32px;border-radius:10px;font-family:${D};font-weight:800;font-size:17px;letter-spacing:.04em;text-transform:uppercase;box-shadow:0 6px 24px rgba(37,211,102,.2);transition:all .2s" onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 12px 40px rgba(37,211,102,.35)'" onmouseleave="this.style.transform='none';this.style.boxShadow='0 6px 24px rgba(37,211,102,.2)'">${waSvg(18)} WhatsApp for a Quote</a>
        <a href="mailto:${EMAIL}?subject=${encodeURIComponent(`Quote Request: ${P.partNo} — ${P.name}`)}" style="display:inline-flex;align-items:center;gap:8px;background:transparent;border:1.5px solid rgba(5,5,5,.3);color:rgba(5,5,5,.65);padding:15px 28px;border-radius:10px;font-family:${D};font-weight:700;font-size:16px;letter-spacing:.04em;text-transform:uppercase;transition:all .2s" onmouseenter="this.style.borderColor='rgba(5,5,5,.7)';this.style.color='rgba(5,5,5,.9)'" onmouseleave="this.style.borderColor='rgba(5,5,5,.3)';this.style.color='rgba(5,5,5,.65)'">Email Enquiry</a>
      </div>
    </div>
  </section>`;
}

// ── FOOTER ──
function buildFooter(){
  const waMsg=`Hi, I need a quote for ${P.partNo} — ${P.name}.`;
  const cols=[
    {h:'Browse Brands',links:[['Volvo Parts','/volvo/'],['Komatsu Parts','/komatsu/'],['CAT Parts','/cat/'],['Scania Parts','/scania/'],['Hitachi Parts','/hitachi/'],['All Brands','/']]},
    {h:'Part Categories',links:[['Engine Parts',`/${P.brandSlug}/engine-parts/`],['Hydraulic Parts',`/${P.brandSlug}/hydraulic-parts/`],['Filters',`/${P.brandSlug}/filters/`],['Undercarriage',`/${P.brandSlug}/undercarriage/`],['Transmission',`/${P.brandSlug}/transmission-parts/`],['All Categories',`/${P.brandSlug}/`]]},
    {h:'Company',links:[['About PTC','/about.html'],['Blog & Guides','/blog/'],['Contact Us','/contact.html'],['Get a Quote','/get-a-quote.html']]}
  ];
  const colsHtml=cols.map(c=>`<div><div style="font-family:${D};font-size:9px;font-weight:700;letter-spacing:.14em;color:${AMBER};text-transform:uppercase;margin-bottom:16px">${esc(c.h)}</div><div style="display:flex;flex-direction:column;gap:11px">${c.links.map(([l,h])=>`<a href="${h}" style="font-family:${B};font-size:13px;color:${T.muted};transition:color .18s" onmouseenter="this.style.color='${AMBER}'" onmouseleave="this.style.color='${T.muted}'">${esc(l)}</a>`).join('')}</div></div>`).join('');
  return `<footer style="background:${T.footerBg};padding:56px 32px 32px;border-top:1px solid ${T.border}" role="contentinfo">
    <div style="max-width:1360px;margin:0 auto">
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px">
        <div>
          <img src="/assets/images/ptc-logo.webp" alt="Parts Trading Company" style="height:34px;width:auto;margin-bottom:18px">
          <p style="font-family:${B};font-size:13px;color:${T.muted};line-height:1.75;max-width:270px;margin-bottom:20px">Globally trusted supplier of OEM & aftermarket heavy equipment spare parts. Established 1956. Shipping to 50+ countries.</p>
          <div style="display:flex;gap:10px">
            <a href="${WA(waMsg)}" target="_blank" aria-label="WhatsApp" style="width:36px;height:36px;border-radius:50%;background:${WG};display:flex;align-items:center;justify-content:center;transition:opacity .18s" onmouseenter="this.style.opacity='.8'" onmouseleave="this.style.opacity='1'">${waSvg(16)}</a>
            <a href="mailto:${EMAIL}" aria-label="Email" style="width:36px;height:36px;border-radius:50%;background:#1a1a1a;display:flex;align-items:center;justify-content:center;transition:opacity .18s" onmouseenter="this.style.opacity='.8'" onmouseleave="this.style.opacity='1'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></a>
            <a href="tel:+919821037990" aria-label="Phone" style="width:36px;height:36px;border-radius:50%;background:#1a1a1a;display:flex;align-items:center;justify-content:center;transition:opacity .18s" onmouseenter="this.style.opacity='.8'" onmouseleave="this.style.opacity='1'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.16 6.16l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></a>
            <a href="https://www.instagram.com/partstradingco" target="_blank" aria-label="Instagram" style="width:36px;height:36px;border-radius:50%;background:#1a1a1a;display:flex;align-items:center;justify-content:center;transition:opacity .18s" onmouseenter="this.style.opacity='.8'" onmouseleave="this.style.opacity='1'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none"/></svg></a>
          </div>
        </div>
        ${colsHtml}
      </div>
      <div style="height:1px;background:${T.border};margin-bottom:22px"></div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px">
          <span style="font-family:${B};font-size:11px;color:rgba(255,255,255,.15)">© 2026 Parts Trading Company · All rights reserved</span>
          <span style="font-family:${B};font-size:11px;color:rgba(255,255,255,.15)">Vijay Chambers, Grant Road East, Mumbai 400004, India</span>
        </div>
        <span style="font-family:${B};font-size:10px;color:rgba(255,255,255,.06);line-height:1.5">Part numbers, brand names, and OEM references on this website are used solely for identification and compatibility purposes. Parts Trading Company is an independent aftermarket supplier and is not affiliated with, endorsed by, or sponsored by Volvo CE, Komatsu, Caterpillar, Scania, Hitachi, or any other OEM.</span>
      </div>
    </div>
  </footer>`;
}

// ── WA FLOAT ──
function buildWAFloat(){
  const waMsg=`Hi, I need a quote for ${P.partNo} — ${P.name} (${P.brand}). Please confirm availability and pricing.`;
  return `<a id="ptc-wa-float" href="${WA(waMsg)}" target="_blank" rel="noopener noreferrer" style="position:fixed;bottom:32px;right:32px;z-index:997;display:flex;align-items:center;gap:10px;background:#111;border:1px solid rgba(255,255,255,.08);border-radius:40px;padding:11px 20px 11px 14px;text-decoration:none;box-shadow:0 8px 32px rgba(0,0,0,.5);opacity:0;transform:translateY(12px);transition:all .35s cubic-bezier(.4,0,.2,1);pointer-events:none">
    <div style="width:28px;height:28px;border-radius:50%;background:${WG};display:flex;align-items:center;justify-content:center;flex-shrink:0">${waSvg(14)}</div>
    <span style="font-family:${B};font-size:13px;font-weight:700;color:rgba(255,255,255,.7);letter-spacing:.02em">Quote: ${esc(P.partNo)}</span>
  </a>`;
}

// ── RENDER ──
function render(){
  const sections=`
    ${buildCompatibleModels()}
    <div style="height:1px;background:${T.border}"></div>
    ${buildSpecifications()}
    <div style="height:1px;background:${T.border}"></div>
    ${buildWorkshopNotes()}
    <div style="height:1px;background:${T.border}"></div>
    ${buildRelatedParts()}
    <div style="height:1px;background:${T.border}"></div>
    ${buildReviews()}
    <div style="height:1px;background:${T.border}"></div>
    ${buildFAQ()}
    <div style="height:1px;background:${T.border}"></div>
    ${buildQuickReference()}
    <div style="height:1px;background:${T.border}"></div>
    ${buildCategoryDesc()}
  `;
  // BESPOKE HOOK — no-op on all standard pages (they never define these globals)
  if(window.PTC_CUSTOM_SECS) PROD_SECS.splice(0,PROD_SECS.length,...window.PTC_CUSTOM_SECS);
  const heroBlock=typeof window.PTC_CUSTOM_HERO==='function'?window.PTC_CUSTOM_HERO():buildHero()+buildXrefStrip();
  const sectionsBlock=typeof window.PTC_CUSTOM_SECTIONS==='function'?window.PTC_CUSTOM_SECTIONS():sections;
  const html=`
    ${buildProgress()}
    ${buildAnnouncement()}
    ${buildNav()}
    ${buildStickyFilter()}
    <main>
      ${heroBlock}
      <div style="max-width:1360px;margin:0 auto;padding:0 32px;display:flex;gap:56px">
        ${buildSidebar()}
        <div style="flex:1;min-width:0;padding-bottom:80px">${sectionsBlock}</div>
      </div>
      ${buildBottomCTA()}
    </main>
    ${buildFooter()}
    ${buildWAFloat()}
  `;
  document.getElementById('root').innerHTML=html;
}

// ── INIT ──
function initProgress(){
  const bar=document.getElementById('ptc-progress');
  if(!bar) return;
  window.addEventListener('scroll',()=>{
    const el=document.documentElement;
    const pct=el.scrollHeight-el.clientHeight;
    bar.style.width=(pct>0?Math.min(100,(el.scrollTop||document.body.scrollTop)/pct*100):0)+'%';
  },{passive:true});
}

function initCountdown(){
  const wrap=document.getElementById('ptc-countdown-wrap');
  const dot=document.getElementById('ptc-cd-dot');
  const txt=document.getElementById('ptc-cd-text');
  const hEl=document.getElementById('ptc-h');
  const mEl=document.getElementById('ptc-m');
  if(!wrap||!hEl||!mEl) return;
  function tick(){
    const now=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
    const day=now.getDay(),mins=now.getHours()*60+now.getMinutes();
    if(day===0||mins>=900){
      wrap.style.background='rgba(255,255,255,.03)';
      wrap.style.borderColor=T.border;
      txt.innerHTML='Ships next business day · order now for tomorrow dispatch';
      if(dot) dot.style.background=T.muted;
      return;
    }
    const left=900-mins;
    const urgent=left<=60;
    hEl.textContent=Math.floor(left/60);
    mEl.textContent=String(left%60).padStart(2,'0');
    wrap.style.background=urgent?T.amberDim:'rgba(255,255,255,.04)';
    wrap.style.borderColor=urgent?'rgba(255,184,28,.35)':T.border;
    if(dot){dot.style.background=urgent?AMBER:T.muted;dot.style.animation=urgent?'pulse 2s ease-in-out infinite':'none';}
    if(txt){txt.style.color=urgent?AMBER:T.text;}
  }
  tick();
  setInterval(tick,1000);
}

function initCopy(){
  const btn=document.getElementById('ptc-copy');
  if(!btn) return;
  btn.addEventListener('click',()=>{
    navigator.clipboard&&navigator.clipboard.writeText(P.partNo).then(()=>{
      btn.style.background='rgba(37,211,102,.1)';
      btn.style.borderColor='rgba(37,211,102,.4)';
      btn.style.color=WG;
      btn.innerHTML=`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      setTimeout(()=>{
        btn.style.background='rgba(255,255,255,.04)';
        btn.style.borderColor=T.border;
        btn.style.color=T.muted;
        btn.innerHTML=`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
      },2000);
    }).catch(()=>{});
  });
}

function initReveal(){
  const els=document.querySelectorAll('.reveal');
  if(!els.length) return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.07});
  els.forEach(el=>io.observe(el));
}

function initScrollSpy(){
  const links=document.querySelectorAll('.toc-link');
  if(!links.length) return;
  const ids=PROD_SECS.map(s=>s.id);
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const id=e.target.id;
        links.forEach(l=>{
          const active=l.dataset.target===id;
          l.classList.toggle('active',active);
          const dot=l.querySelector('.toc-dot');
          const span=l.querySelector('span');
          if(dot){dot.style.background=active?AMBER:'rgba(255,255,255,.3)';}
          if(span){span.style.color=active?T.text:T.muted;span.style.fontWeight=active?'600':'400';}
        });
      }
    });
  },{rootMargin:'-20% 0px -70% 0px'});
  ids.forEach(id=>{const el=document.getElementById(id);if(el) io.observe(el);});
}

function initWAFloat(){
  const pill=document.getElementById('ptc-wa-float');
  if(!pill) return;
  window.addEventListener('scroll',()=>{
    const show=window.scrollY>300;
    pill.style.opacity=show?'1':'0';
    pill.style.transform=show?'translateY(0)':'translateY(12px)';
    pill.style.pointerEvents=show?'auto':'none';
  },{passive:true});
}

function initNav(){
  const nav=document.getElementById('ptc-nav');
  if(!nav) return;
  window.addEventListener('scroll',()=>{
    const scrolled=window.scrollY>20;
    nav.style.background=scrolled?T.navBg:'rgba(5,5,5,.9)';
    nav.style.borderBottomColor=scrolled?T.border:'transparent';
  },{passive:true});
}

// Run
render();
initProgress();
initCountdown();
initCopy();
initReveal();
initScrollSpy();
initWAFloat();
initNav();
initSearch();
})();
