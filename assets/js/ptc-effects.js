/*!
 * ptc-effects.js — Parts Trading Company
 * Premium progressive enhancement layer
 * All motion, animation, and interactivity for static pages
 */
(function () {
  'use strict';

  const AMBER = '#FFB81C';
  const WG = '#25D366';
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  // ─── 1. READING PROGRESS BAR ─────────────────────────────────────────────────
  function initProgressBar() {
    const bar = document.getElementById('ptc-progress');
    if (!bar) return;
    const fill = bar.querySelector('.ptc-progress-fill');
    if (!fill) return;
    window.addEventListener('scroll', () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      fill.style.width = (total > 0 ? Math.min(100, (scrolled / total) * 100) : 0) + '%';
    }, { passive: true });
  }

  // ─── 2. SECTION REVEAL ───────────────────────────────────────────────────────
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
  }

  // ─── 3. SCROLL SPY ───────────────────────────────────────────────────────────
  function initScrollSpy() {
    const links = document.querySelectorAll('.toc-link[data-target]');
    if (!links.length) return;
    const ids = Array.from(links).map(l => l.dataset.target);

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(l => {
          const active = l.dataset.target === e.target.id;
          l.classList.toggle('toc-active', active);
          const dot = l.querySelector('.toc-dot');
          if (dot) {
            dot.style.background = active ? AMBER : 'rgba(255,255,255,0.25)';
            dot.style.width = dot.style.height = active ? '7px' : '5px';
            dot.style.boxShadow = active ? `0 0 8px ${AMBER}99` : 'none';
          }
          const label = l.querySelector('.toc-label');
          if (label) {
            label.style.color = active ? '#fff' : 'rgba(255,255,255,0.4)';
            label.style.fontWeight = active ? '600' : '400';
          }
        });
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });

    links.forEach(l => l.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(l.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  // ─── 4. STAT COUNTUP ─────────────────────────────────────────────────────────
  function initCountup() {
    const els = document.querySelectorAll('[data-countup]');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        const el = e.target;
        const target = parseFloat(el.dataset.countup);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1600;
        const start = performance.now();
        const isInt = Number.isInteger(target);
        function step(now) {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          const val = target * ease;
          el.textContent = prefix + (isInt ? Math.floor(val).toLocaleString() : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.3 });
    els.forEach(el => obs.observe(el));
  }

  // ─── 5. PART NUMBER SCRAMBLE ─────────────────────────────────────────────────
  function scramble(el) {
    if (el._scrambling) return;
    el._scrambling = true;
    const original = el.dataset.original || el.textContent;
    el.dataset.original = original;
    let frame = 0;
    const totalFrames = 20;
    const id = setInterval(() => {
      if (frame >= totalFrames) {
        el.textContent = original;
        el._scrambling = false;
        clearInterval(id);
        return;
      }
      const reveal = Math.floor((frame / totalFrames) * original.length);
      el.textContent = original.split('').map((ch, i) => {
        if (i < reveal) return ch;
        if (ch === ' ' || ch === '-' || ch === '.') return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      frame++;
    }, 38);
  }

  function initScramble() {
    const els = document.querySelectorAll('[data-scramble]');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => scramble(e.target), 120);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 1.0 });
    els.forEach(el => {
      el.dataset.original = el.textContent;
      obs.observe(el);
      el.addEventListener('mouseenter', () => scramble(el));
    });
  }

  // ─── 6. CURSOR SPOTLIGHT ─────────────────────────────────────────────────────
  function initCursorSpotlight() {
    if (window.matchMedia('(hover: none)').matches) return; // skip touch devices
    const el = document.createElement('div');
    el.id = 'ptc-spotlight';
    el.style.cssText = [
      'position:fixed', 'pointer-events:none', 'z-index:0',
      'width:700px', 'height:700px', 'border-radius:50%',
      `background:radial-gradient(circle,rgba(255,184,28,0.05) 0%,transparent 65%)`,
      'transform:translate(-50%,-50%)', 'transition:opacity 0.5s ease',
      'opacity:0', 'top:0', 'left:0', 'will-change:transform',
    ].join(';');
    document.body.appendChild(el);

    let mx = 0, my = 0, cx = 0, cy = 0, raf;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function loop() {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      el.style.left = cx + 'px';
      el.style.top = cy + 'px';
      raf = requestAnimationFrame(loop);
    }
    loop();

    // Reveal only over dark sections
    document.addEventListener('mousemove', e => {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const inDark = target && target.closest('[data-spotlight], .spotlight-section');
      el.style.opacity = inDark ? '1' : '0';
    });
  }

  // ─── 7. 3D CARD TILT ─────────────────────────────────────────────────────────
  function initTilt() {
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('[data-tilt]').forEach(card => {
      let raf;
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';
      card.addEventListener('mousemove', e => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
          const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
          card.style.transition = 'transform 0.1s ease';
          card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateZ(6px)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        cancelAnimationFrame(raf);
        card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      });
    });
  }

  // ─── 8. SPLIT TEXT REVEAL ────────────────────────────────────────────────────
  function initSplitReveal() {
    const els = document.querySelectorAll('.split-reveal');
    if (!els.length) return;
    els.forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map((word, i) =>
        `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.22em;line-height:1.05">` +
        `<span class="split-inner" style="display:inline-block;transform:translateY(110%);opacity:0;` +
        `transition:transform 0.75s cubic-bezier(0.22,1,0.36,1) ${i * 0.065}s,` +
        `opacity 0.5s ease ${i * 0.065}s">${word}</span></span>`
      ).join('');
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('.split-inner').forEach(inner => {
          inner.style.transform = 'translateY(0)';
          inner.style.opacity = '1';
        });
        obs.unobserve(e.target);
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
  }

  // ─── 9. MAGNETIC BUTTONS ─────────────────────────────────────────────────────
  function initMagnetic() {
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.28;
        const y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.transition = 'transform 0.15s ease';
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ─── 10. SKELETON IMAGE LOADING ──────────────────────────────────────────────
  function initSkeletons() {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      const wrap = img.parentElement;
      if (!wrap) return;
      wrap.classList.add('skeleton-wrap');
      const onLoad = () => { wrap.classList.remove('skeleton-wrap'); img.classList.add('img-loaded'); };
      if (img.complete && img.naturalWidth) { onLoad(); return; }
      img.addEventListener('load', onLoad);
      img.addEventListener('error', () => wrap.classList.remove('skeleton-wrap'));
    });
  }

  // ─── 11. LENIS SMOOTH SCROLL ─────────────────────────────────────────────────
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    const lenis = new Lenis({
      duration: 1.25,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    window.ptcLenis = lenis;
  }

  // ─── 12. TOAST SOCIAL PROOF ──────────────────────────────────────────────────
  const TOASTS = [
    { name: 'Suresh N.', loc: 'Bengaluru, India', part: 'EC210 Hydraulic Pump', t: 9000 },
    { name: 'Mohammed Al F.', loc: 'Abu Dhabi, UAE', part: 'FH16 Alternator 24V', t: 24000 },
    { name: 'Dmitri V.', loc: 'Krasnoyarsk, Russia', part: 'PC200 Oil Filter', t: 40000 },
    { name: 'Rajesh K.', loc: 'Chennai, India', part: 'CAT 336 Track Roller', t: 58000 },
    { name: 'Ahmad S.', loc: 'Riyadh, Saudi Arabia', part: 'D13 Injector Set', t: 75000 },
    { name: 'Budi W.', loc: 'Jakarta, Indonesia', part: 'Komatsu Swing Motor', t: 95000 },
  ];

  function showToast({ name, loc, part }) {
    const el = document.createElement('div');
    el.className = 'ptc-toast';
    el.innerHTML =
      `<span class="ptc-toast-dot"></span>` +
      `<div><div class="ptc-toast-who">${name} <span>${loc}</span></div>` +
      `<div class="ptc-toast-what">Enquired about <strong>${part}</strong></div></div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('ptc-toast--in')));
    setTimeout(() => {
      el.classList.remove('ptc-toast--in');
      setTimeout(() => el.remove(), 450);
    }, 4200);
  }

  function initToasts() {
    TOASTS.forEach(d => setTimeout(() => showToast(d), d.t));
  }

  // ─── 13. GEO ANNOUNCEMENT BAR ────────────────────────────────────────────────
  function initGeo() {
    const target = document.querySelector('[data-geo-ship]');
    if (!target) return;
    const GULF = new Set(['AE','SA','KW','QA','BH','OM','YE','IQ','JO']);
    fetch('https://ipapi.co/json/?fields=country_code,country_name,continent_code')
      .then(r => r.json())
      .then(d => {
        const c = d.country_code, name = d.country_name;
        let text;
        if (c === 'IN') text = 'India domestic: 1–2 days · same-day dispatch available';
        else if (GULF.has(c)) text = `Ships to ${name} in 3–5 days via DHL Express`;
        else {
          const est = { AS:'4–8 days', EU:'6–9 days', AF:'5–10 days', NA:'7–12 days', SA:'9–14 days', OC:'7–10 days' };
          text = `Ships to ${name} in ${est[d.continent_code] || '5–12 days'} via DHL / FedEx`;
        }
        target.textContent = text;
      })
      .catch(() => {});
  }

  // ─── 14. DISPATCH COUNTDOWN ──────────────────────────────────────────────────
  function initCountdown() {
    const els = document.querySelectorAll('[data-countdown]');
    if (!els.length) return;
    function tick() {
      const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const day = ist.getDay(), nowM = ist.getHours() * 60 + ist.getMinutes();
      els.forEach(el => {
        if (day === 0 || nowM >= 900) {
          el.textContent = 'Ships next business day — order now';
          el.removeAttribute('data-urgent');
        } else {
          const rem = 900 - nowM;
          const h = Math.floor(rem / 60), m = rem % 60;
          el.textContent = `Order in ${h}h ${String(m).padStart(2,'0')}m — ships today from Mumbai`;
          if (rem <= 60) el.setAttribute('data-urgent', '');
          else el.removeAttribute('data-urgent');
        }
      });
    }
    tick();
    setInterval(tick, 30000);
  }

  // ─── 15. COPY PART NUMBER ────────────────────────────────────────────────────
  function initCopy() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.copy).then(() => {
          const orig = btn.innerHTML;
          btn.innerHTML = '✓ Copied';
          btn.style.color = '#4ade80';
          setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 2000);
        }).catch(() => {});
      });
    });
  }

  // ─── 16. WA FLOAT PILL ───────────────────────────────────────────────────────
  function initFloatPill() {
    const pill = document.getElementById('ptc-wa-pill');
    if (!pill) return;
    pill.style.transition = 'opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)';
    pill.style.opacity = '0';
    pill.style.transform = 'translateY(12px)';
    pill.style.pointerEvents = 'none';
    window.addEventListener('scroll', () => {
      const show = window.scrollY > 300;
      pill.style.opacity = show ? '1' : '0';
      pill.style.transform = show ? 'translateY(0)' : 'translateY(12px)';
      pill.style.pointerEvents = show ? 'auto' : 'none';
    }, { passive: true });
  }

  // ─── 17. ANIMATED NOISE GRAIN ────────────────────────────────────────────────
  function initGrain() {
    document.querySelectorAll('.noise-layer').forEach(section => {
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.035;z-index:0;mix-blend-mode:overlay';
      section.style.position = section.style.position || 'relative';
      section.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      let w, h;
      function resize() {
        w = canvas.width = section.offsetWidth;
        h = canvas.height = section.offsetHeight;
      }
      resize();
      new ResizeObserver(resize).observe(section);
      let rafId;
      function draw() {
        const img = ctx.createImageData(w, h);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = (Math.random() * 255) | 0;
          d[i] = d[i+1] = d[i+2] = v;
          d[i+3] = 255;
        }
        ctx.putImageData(img, 0, 0);
        rafId = requestAnimationFrame(draw);
      }
      // Only animate when visible
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { if (!rafId) draw(); }
        else { cancelAnimationFrame(rafId); rafId = null; }
      });
      obs.observe(section);
    });
  }

  // ─── 18. STICKY NAV SCROLL STATE ─────────────────────────────────────────────
  function initNav() {
    const nav = document.querySelector('nav[data-sticky]');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ─── 19. MEGA MENU HOVER DELAYS ──────────────────────────────────────────────
  function initMegaMenu() {
    document.querySelectorAll('[data-dropdown]').forEach(wrapper => {
      const menu = wrapper.querySelector('[data-dropdown-panel]');
      if (!menu) return;
      let t;
      wrapper.addEventListener('mouseenter', () => { clearTimeout(t); menu.classList.add('mega--open'); });
      wrapper.addEventListener('mouseleave', () => { t = setTimeout(() => menu.classList.remove('mega--open'), 160); });
    });
  }

  // ─── INIT ALL ─────────────────────────────────────────────────────────────────
  function init() {
    initProgressBar();
    initReveal();
    initScrollSpy();
    initCountup();
    initScramble();
    initCursorSpotlight();
    initTilt();
    initSplitReveal();
    initMagnetic();
    initSkeletons();
    initLenis();
    initToasts();
    initGeo();
    initCountdown();
    initCopy();
    initFloatPill();
    initGrain();
    initNav();
    initMegaMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
