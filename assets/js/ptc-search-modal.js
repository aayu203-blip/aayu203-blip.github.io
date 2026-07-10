/**
 * Standalone lazy-loading search modal for pages that don't use the full
 * React product-page/brand-page templates (kobelco/john-deere/liugong).
 * Include this script, add a button with id="ptc-search-btn" to the page,
 * and it wires itself up automatically.
 */
(function(){
'use strict';
const AMBER='#FFB81C',WG='#25D366',D="'Barlow Condensed',sans-serif",B="'Barlow',sans-serif";
const T={bgCard:'#0D0D0D',text:'#F0ECE6',muted:'rgba(255,255,255,0.45)',border:'rgba(255,255,255,0.07)'};
const WA=t=>`https://wa.me/919821037990?text=${encodeURIComponent(t)}`;
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const waSvg=(size=16)=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#fff" style="flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const BRANDS=['All','Volvo','Scania','Komatsu','CAT','Hitachi'];

function buildModal(){
  const chips=BRANDS.map(b=>`<button type="button" class="ptc-search-brand${b==='All'?' active':''}" data-brand="${b}" style="font-family:${B};font-size:12px;font-weight:700;padding:5px 14px;border-radius:20px;border:1px solid ${b==='All'?AMBER:'rgba(255,255,255,.1)'};cursor:pointer;background:${b==='All'?AMBER:'transparent'};color:${b==='All'?'#050505':'rgba(255,255,255,.5)'};transition:all .15s">${b}</button>`).join('');
  const wrap=document.createElement('div');
  wrap.innerHTML=`<div id="ptc-search-overlay" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.88);backdrop-filter:blur(8px);align-items:flex-start;justify-content:center;padding-top:80px">
  <div id="ptc-search-panel" style="width:100%;max-width:720px;margin:0 16px;background:${T.bgCard};border:1px solid ${T.border};border-radius:16px;overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.8)">
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
  document.body.appendChild(wrap.firstElementChild);
}

function resultRow(r){
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

function renderResults(q,brand){
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
    box.innerHTML=results.map(resultRow).join('');
  }
}

let dbRequested=false;
function ensureDB(cb){
  if(window.productSearchDB&&window.productSearchDB.length){cb();return;}
  if(dbRequested){const iv=setInterval(()=>{if(window.productSearchDB&&window.productSearchDB.length){clearInterval(iv);cb();}},100);return;}
  dbRequested=true;
  const s=document.createElement('script');
  s.src='/assets/js/search-db.js';
  s.onload=cb;
  document.head.appendChild(s);
}

function init(){
  buildModal();
  const overlay=document.getElementById('ptc-search-overlay');
  const panel=document.getElementById('ptc-search-panel');
  const closeBtn=document.getElementById('ptc-search-close');
  const input=document.getElementById('ptc-search-input');
  const brandsBox=document.getElementById('ptc-search-brands');
  let brand='All';
  const open=()=>{
    overlay.style.display='flex';
    ensureDB(()=>renderResults(input.value,brand));
    setTimeout(()=>input.focus(),80);
  };
  const close=()=>{overlay.style.display='none';input.value='';document.getElementById('ptc-search-results').innerHTML='';};
  document.querySelectorAll('#ptc-search-btn').forEach(btn=>btn.addEventListener('click',open));
  closeBtn.addEventListener('click',close);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
  panel.addEventListener('click',e=>e.stopPropagation());
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.style.display==='flex')close();});
  input.addEventListener('input',()=>renderResults(input.value,brand));
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
      renderResults(input.value,brand);
    });
  });
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
else init();
})();
