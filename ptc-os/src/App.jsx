/**
 * PTC OS — Parts Trading Company Operating System
 * Frontend v2  |  SolidJS + Tailwind + Canvas API
 *
 * Views: Watchdog · Part Hub · Quote Engine · PO Console · Horizon
 * Design: Solarized Cognitive Ergonomics, IBM Plex Mono, No Glassmorphism
 */

import {
  createSignal, createEffect, onMount, onCleanup,
  For, Show, createMemo,
} from "solid-js";

// ─── Formatting helpers ───────────────────────────────────────────────────────

const fmt  = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const fmtD = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });
const currency  = (v) => fmt.format(v || 0);
const currencyD = (v) => fmtD.format(v || 0);
const pct = (v) => `${(v || 0).toFixed(1)}%`;
const num = (v) => new Intl.NumberFormat("en-IN").format(Math.round(v || 0));

// ─── NLP / Fuzzy-match engine ─────────────────────────────────────────────────

function tokenise(str) {
  return str.toLowerCase().split(/[\s\-\/()]+/).filter(t => t.length > 1);
}

function fuzzyScore(query, item) {
  const q = query.toLowerCase().trim();
  // Exact part number match — highest priority
  if (item.part_no && (item.part_no.toLowerCase() === q || item.part_no.toLowerCase().includes(q))) return 2.0;
  const qTok = new Set(tokenise(query));
  const nTok  = new Set(tokenise(item.name));
  const intersection = [...qTok].filter(t => nTok.has(t)).length;
  const union = new Set([...qTok, ...nTok]).size;
  const jaccard = union > 0 ? intersection / union : 0;
  const sub = item.name.toLowerCase().includes(q) ? 0.4 : 0;
  // Partial part number match
  const pnoBonus = item.part_no && item.part_no.toLowerCase().includes(q) ? 0.8 : 0;
  return jaccard + sub + pnoBonus;
}

function searchCatalog(query, catalog, limit = 80) {
  if (!query || query.length < 2) return catalog.slice(0, limit);
  const q = query.trim();
  return catalog
    .map(i => ({ ...i, _score: fuzzyScore(q, i) }))
    .filter(i => i._score > 0.08)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);
}

/**
 * Parse raw inquiry/email text and extract probable line items.
 * Completely client-side — no API required.
 */
function parseInquiry(text, catalog) {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 3);
  const results = [];

  for (const line of lines) {
    if (/^(hi|hello|dear|from|to|re:|subject:|thanks|regards|please|kindly|attached|note:|as per)/i.test(line)) continue;
    if (/^[-–—*#>]?\s*$/.test(line)) continue;

    const qtyRx    = /(\d+(?:\.\d+)?)\s*(?:nos?\.?|pcs?\.?|units?|sets?)\b/i;
    const qtyX     = /\bx\s*(\d+(?:\.\d+)?)\b/i;
    const qtyColon = /\bqty[:\s]+(\d+(?:\.\d+)?)/i;
    const qtyMatch = qtyRx.exec(line) || qtyX.exec(line) || qtyColon.exec(line);
    const qty = qtyMatch ? parseFloat(qtyMatch[1]) : 1;

    const hsnMatch = /\b(\d{6,8})\b/.exec(line);
    const pnoMatch = /(?:p\.?n\.?o?\.?|part[\s#]?no\.?|p\/n)[:\s#]+([A-Z0-9\-/]+)/i.exec(line);

    let clean = line
      .replace(qtyRx, "").replace(qtyX, "").replace(qtyColon, "")
      .replace(/(?:p\.?n\.?o?\.?|part[\s#]?no\.?|p\/n)[:\s#]+\S+/gi, "")
      .replace(/\b\d{6,8}\b/g, "")
      .replace(/[-–—*•·]\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

    if (clean.length < 3) continue;

    const candidates = catalog
      .map(i => ({ ...i, _s: fuzzyScore(clean, i) }))
      .filter(i => i._s > 0.12)
      .sort((a, b) => b._s - a._s)
      .slice(0, 3);

    if (candidates.length === 0) continue;
    results.push({ original: line, qty, partNo: pnoMatch?.[1], hsn: hsnMatch?.[1], candidates });
  }
  return results;
}

// ─── Price trend ─────────────────────────────────────────────────────────────
// Returns { slope, dir } where dir = "up"|"down"|"flat"
function computePriceTrend(monthly) {
  const pts = (monthly || []).filter(r => r.ar != null);
  if (pts.length < 2) return null;
  const n  = pts.length;
  const xs = pts.map((_, i) => i);
  const ys = pts.map(r => r.ar);
  const mx = xs.reduce((a, x) => a + x, 0) / n;
  const my = ys.reduce((a, y) => a + y, 0) / n;
  const num = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
  const den = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
  if (den === 0) return null;
  const slope = num / den;          // ₹ per month
  const relSlope = slope / (my || 1);
  const dir = relSlope > 0.01 ? "up" : relSlope < -0.01 ? "down" : "flat";
  return { slope: Math.round(slope * 100) / 100, dir };
}

function TrendArrow(props) {
  const t = () => computePriceTrend(props.monthly);
  return (
    <Show when={t()}>
      {(tr) => (
        <span class={`text-xs font-bold ${tr().dir === "up" ? "text-ptc-green" : tr().dir === "down" ? "text-ptc-red" : "text-ptc-base0/30"}`}
          title={`${tr().dir === "up" ? "+" : ""}₹${tr().slope}/mo trend`}>
          {tr().dir === "up" ? "↑" : tr().dir === "down" ? "↓" : "→"}
        </span>
      )}
    </Show>
  );
}

// ─── Canvas rendering ─────────────────────────────────────────────────────────

function drawHorizon(canvas, horizonSkus, months) {
  if (!canvas || !horizonSkus.length) return;
  const ctx   = canvas.getContext("2d");
  const W     = canvas.width;
  const H     = canvas.height;
  const count = horizonSkus.length;
  const ROW_H = Math.floor(H / count);
  const CELL_W = W / months.length;
  const BANDS  = 3;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, W, H);

  let maxVal = 0;
  for (const sku of horizonSkus)
    for (const d of sku.monthly) maxVal = Math.max(maxVal, Math.abs(d.cum));
  if (maxVal === 0) return;

  const bandSize = maxVal / BANDS;

  for (let si = 0; si < count; si++) {
    const sku = horizonSkus[si];
    const y0  = si * ROW_H;
    const monthMap = Object.fromEntries(sku.monthly.map(d => [d.m, d.cum]));

    for (let mi = 0; mi < months.length; mi++) {
      const val = monthMap[months[mi]] || 0;
      const x   = mi * CELL_W;

      if (val > 0) {
        for (let band = 0; band < BANDS; band++) {
          const bMin = band * bandSize;
          if (val <= bMin) continue;
          const h  = Math.min(val - bMin, bandSize) / bandSize * ROW_H;
          const op = 0.35 + 0.3 * band;
          ctx.fillStyle = `rgba(112,175,112,${op})`;
          ctx.fillRect(x, y0 + ROW_H - h, CELL_W - 0.5, h);
        }
      } else if (val < 0) {
        const abs = -val;
        for (let band = 0; band < BANDS; band++) {
          const bMin = band * bandSize;
          if (abs <= bMin) continue;
          const h  = Math.min(abs - bMin, bandSize) / bandSize * ROW_H;
          const op = 0.35 + 0.3 * band;
          ctx.fillStyle = `rgba(181,137,0,${op})`;
          ctx.fillRect(x, y0 + ROW_H - h, CELL_W - 0.5, h);
        }
      }
    }
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, y0 + ROW_H - 1, W, 1);
  }
}

function drawHeatmap(canvas, heatData, months) {
  if (!canvas || !heatData.length) return;
  const ctx  = canvas.getContext("2d");
  const W    = canvas.width;
  const H    = canvas.height;
  const ROWS = heatData.length;
  const COLS = months.length;
  const cW   = W / COLS;
  const cH   = H / ROWS;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#161616";
  ctx.fillRect(0, 0, W, H);

  let maxQ = 0;
  for (const s of heatData) for (const m of s.monthly) maxQ = Math.max(maxQ, m.sq);
  if (maxQ === 0) return;

  for (let i = 0; i < ROWS; i++) {
    const sku = heatData[i];
    for (let j = 0; j < COLS; j++) {
      const q = sku.monthly[j]?.sq || 0;
      const t = q / maxQ;
      if (t < 0.01) continue;
      const r = Math.round(7  + 174 * t);
      const g = Math.round(54 + 83  * t);
      const b = Math.round(66 * (1  - t));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(j * cW, i * cH, cW - 0.5, cH - 0.5);
    }
  }
}

function drawSparkline(canvas, monthly, months, type) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W   = canvas.width;
  const H   = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const vals = months.map(m => {
    const row = monthly?.find(r => r.m === m);
    return type === "sell" ? (row?.sq || 0) : (row?.bq || 0);
  });
  const maxV = Math.max(...vals, 1);
  const cW   = W / vals.length;
  const color = type === "sell" ? "rgba(112,175,112,0.85)" : "rgba(204,147,147,0.85)";

  vals.forEach((v, i) => {
    const h = (v / maxV) * (H - 2);
    ctx.fillStyle = color;
    ctx.fillRect(i * cW, H - h, cW - 1, h);
  });
}

// ─── Bullet Graph ─────────────────────────────────────────────────────────────

function BulletGraph(props) {
  const safePct = (v) => Math.max(0, Math.min(100, ((v || 0) / Math.max(props.max, 1)) * 100));
  return (
    <div class="relative h-4 w-full bg-ptc-base03 border border-ptc-base02 overflow-hidden">
      <div class="absolute inset-0 flex">
        <div class="w-1/3 h-full bg-ptc-base02/70" />
        <div class="w-1/3 h-full bg-ptc-base02/40" />
        <div class="w-1/3 h-full bg-ptc-base02/20" />
      </div>
      <div
        class={`absolute top-[25%] bottom-[25%] z-10 ${props.current < props.target ? "bg-ptc-yellow" : "bg-ptc-base0"}`}
        style={{ width: `${safePct(props.current)}%` }}
      />
      <div class="absolute top-0 bottom-0 w-[2px] z-20 bg-ptc-base0" style={{ left: `${safePct(props.target)}%` }} />
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [data, setData]       = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [view, setView]       = createSignal("watchdog");

  // Command palette
  const [paletteOpen, setPaletteOpen]   = createSignal(false);
  const [paletteQuery, setPaletteQuery] = createSignal("");

  // Watchdog
  const [selectedAnomaly, setSelectedAnomaly] = createSignal(null);

  // Part Hub
  const [hubQuery, setHubQuery]       = createSignal("");
  const [selectedSku, setSelectedSku] = createSignal(null);

  // Quote Engine
  const [inquiryText, setInquiryText]     = createSignal("");
  const [parsedLines, setParsedLines]     = createSignal([]);
  const [quoteItems, setQuoteItems]       = createSignal([]);
  const [targetMargin, setTargetMargin]   = createSignal(15);
  const [quoteQuery, setQuoteQuery]       = createSignal("");

  // PO Console
  const [poItems, setPoItems] = createSignal([]);
  const [poQuery, setPoQuery] = createSignal("");

  // Quote customer + history
  const [quoteCustomer, setQuoteCustomer] = createSignal("");
  const [quoteHistory, setQuoteHistory]   = createSignal(
    JSON.parse(localStorage.getItem("ptcos_quote_history") || "[]")
  );
  const [showHistory, setShowHistory] = createSignal(false);

  // PO supplier
  const [poSupplier, setPoSupplier] = createSignal("");

  // Manual suggested prices: { [sku_id]: number }
  const [manualPrices, setManualPrices] = createSignal(
    JSON.parse(localStorage.getItem("ptcos_manual_prices") || "{}")
  );

  // Part aliases: { [sku_id]: string[] }  — IDs that are cross-refs of this SKU
  const [aliases, setAliases] = createSignal(
    JSON.parse(localStorage.getItem("ptcos_aliases") || "{}")
  );
  const [aliasInput, setAliasInput] = createSignal("");

  // Network (Clients / Suppliers)
  const [networkTab, setNetworkTab]           = createSignal("clients");
  const [networkQuery, setNetworkQuery]       = createSignal("");
  const [selectedProfile, setSelectedProfile] = createSignal(null);

  // Orders pipeline
  const [orders, setOrders] = createSignal(
    JSON.parse(localStorage.getItem("ptcos_orders") || "[]")
  );
  const [orderFilter, setOrderFilter] = createSignal("all");
  const [selectedOrder, setSelectedOrder] = createSignal(null);

  // Transport history: { [clientName]: string }
  const [transportLog, setTransportLog] = createSignal(
    JSON.parse(localStorage.getItem("ptcos_transport") || "{}")
  );

  // Manual inventory overrides: { [sku_id]: { stock_adj, warehouse, hsn, notes } }
  const [inventoryOverrides, setInventoryOverrides] = createSignal(
    JSON.parse(localStorage.getItem("ptcos_inventory") || "{}")
  );
  // Custom products (not in Tally): array of product objects
  const [customProducts, setCustomProducts] = createSignal(
    JSON.parse(localStorage.getItem("ptcos_custom_products") || "[]")
  );
  const [invQuery, setInvQuery] = createSignal("");
  const [editingInv, setEditingInv] = createSignal(null); // sku id being edited
  const [showAddProduct, setShowAddProduct] = createSignal(false);
  const [newProduct, setNewProduct] = createSignal({ name:"", part_no:"", hsn:"", avg_cost:0, avg_sell:0, warehouse:"", notes:"" });

  // FX rates for multi-currency PO
  const [poCurrency, setPoCurrency] = createSignal("INR");
  const [fxRates, setFxRates] = createSignal(
    JSON.parse(localStorage.getItem("ptcos_fx_rates") || '{"USD":84,"EUR":91}')
  );
  const saveFxRate = (ccy, rate) => {
    setFxRates(prev => { const next = { ...prev, [ccy]: parseFloat(rate) || prev[ccy] }; localStorage.setItem("ptcos_fx_rates", JSON.stringify(next)); return next; });
  };
  const toINR  = (v) => poCurrency() === "INR" ? v : v * (fxRates()[poCurrency()] || 1);
  const fromINR = (v) => poCurrency() === "INR" ? v : v / (fxRates()[poCurrency()] || 1);
  const ccySymbol = () => ({ INR: "₹", USD: "$", EUR: "€" })[poCurrency()] || "₹";

  // Supplier P/N maps: { [supplierName]: [ {their_pn, our_pn, name} ] }
  const [supplierMaps, setSupplierMaps] = createSignal(
    JSON.parse(localStorage.getItem("ptcos_supplier_maps") || "{}")
  );
  const [mapSupplierName, setMapSupplierName] = createSignal("");
  const [mapPasteText, setMapPasteText]       = createSignal("");
  const [mapQuery, setMapQuery]               = createSignal("");

  // ── Load data ────────────────────────────────────────────────────────────
  onMount(async () => {
    try {
      const res  = await fetch("/data.json");
      const json = await res.json();
      setData(json);
      setLoading(false);
      const saved = localStorage.getItem("ptcos_quote");
      if (saved) try { setQuoteItems(JSON.parse(saved)); } catch(_) {}
    } catch (e) { console.error("data.json load failed:", e); }

    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPaletteOpen(p => !p); setPaletteQuery(""); }
      if (e.key === "Escape") { setPaletteOpen(false); setSelectedAnomaly(null); setSelectedSku(null); }
    };
    window.addEventListener("keydown", onKey);
    onCleanup(() => window.removeEventListener("keydown", onKey));
  });

  // ── Derived ───────────────────────────────────────────────────────────────
  const catalog = () => data()?.catalog || [];
  const months  = () => data()?.months  || [];
  const kpis    = () => data()?.kpis    || {};

  const filteredHub          = createMemo(() => searchCatalog(hubQuery(), catalog()));
  const filteredQuoteCatalog = createMemo(() => searchCatalog(quoteQuery(), catalog()));

  // Alerts memos — stock_deficit flags SKUs sold beyond purchase data window
  const negativeStockSkus = createMemo(() =>
    catalog().filter(s => s.stock_deficit < -0.5)
      .sort((a, b) => a.stock_deficit - b.stock_deficit)
      .slice(0, 100)
  );
  const reorderRiskSkus = createMemo(() => {
    const cutoff = new Date("2026-01-08"); // 90 days before data end
    return catalog()
      .filter(s => s.sold_count > 0 && (!s.last_bought || new Date(s.last_bought) < cutoff))
      .sort((a, b) => b.sold_count - a.sold_count)
      .slice(0, 80);
  });
  const lossMakingSkus = createMemo(() =>
    catalog()
      .filter(s => s.realized_margin_pct !== null && s.realized_margin_pct < 0)
      .sort((a, b) => a.realized_margin - b.realized_margin)
      .slice(0, 100)
  );

  // Dead stock: has stock but not sold in 6+ months — capital tied up
  const deadStockSkus = createMemo(() => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 6);
    return catalog()
      .filter(s => s.net_stock_qty > 0.5 && (!s.last_sold || new Date(s.last_sold) < cutoff))
      .map(s => ({ ...s, capital_tied: s.net_stock_qty * s.avg_cost }))
      .sort((a, b) => b.capital_tied - a.capital_tied)
      .slice(0, 100);
  });

  // Margin erosion: sell price trending down — will become loss-making
  const marginErosionSkus = createMemo(() =>
    catalog()
      .filter(s => {
        const trend = computePriceTrend(s.monthly);
        return trend && trend.dir === "down" && s.avg_cost > 0 && s.avg_sell > s.avg_cost;
      })
      .map(s => {
        const trend = computePriceTrend(s.monthly);
        const marginNow = (s.avg_sell - s.avg_cost) / s.avg_sell * 100;
        const monthsToLoss = trend.slope < 0 ? Math.abs((s.avg_sell - s.avg_cost) / trend.slope) : null;
        return { ...s, trendSlope: trend.slope, marginNow, monthsToLoss };
      })
      .sort((a, b) => a.trendSlope - b.trendSlope)
      .slice(0, 80)
  );

  // Missing HSN
  const missingHsnSkus = createMemo(() =>
    catalog().filter(s => !s.hsn && (s.sold_count > 0 || s.bought_count > 0))
      .sort((a, b) => (b.sold_count + b.bought_count) - (a.sold_count + a.bought_count))
  );

  // Client activity tracker (proxy for debtors — true AR needs Tally ledger)
  const clientActivity = createMemo(() => {
    const today = new Date();
    return (data()?.clients || [])
      .map(c => {
        const lastDate = c.last_date ? new Date(c.last_date) : null;
        const daysSince = lastDate ? Math.floor((today - lastDate) / 86400000) : 9999;
        const bucket = daysSince <= 30 ? "0-30" : daysSince <= 60 ? "31-60" : daysSince <= 90 ? "61-90" : "90+";
        // RFM
        const recencyScore = daysSince <= 30 ? 4 : daysSince <= 60 ? 3 : daysSince <= 90 ? 2 : 1;
        const freqScore    = c.invoice_count >= 50 ? 4 : c.invoice_count >= 20 ? 3 : c.invoice_count >= 5 ? 2 : 1;
        const allClients   = data()?.clients || [];
        const maxTotal     = Math.max(...allClients.map(x => x.total), 1);
        const moneyScore   = c.total >= maxTotal * 0.5 ? 4 : c.total >= maxTotal * 0.2 ? 3 : c.total >= maxTotal * 0.05 ? 2 : 1;
        const rfm          = recencyScore + freqScore + moneyScore;
        return { ...c, daysSince, bucket, recencyScore, freqScore, moneyScore, rfm };
      })
      .sort((a, b) => b.total - a.total);
  });

  // Network memo
  const filteredNetwork = createMemo(() => {
    const q    = networkQuery().toLowerCase().trim();
    const list = networkTab() === "clients" ? (data()?.clients || []) : (data()?.suppliers || []);
    if (!q) return list;
    return list.filter(p => p.name.toLowerCase().includes(q));
  });

  const paletteSuggestions = createMemo(() => {
    const q = paletteQuery().trim().toLowerCase();
    if (!q) return [
      { label: "→ Watchdog",       sub: "",          action: () => { setView("watchdog"); setPaletteOpen(false); } },
      { label: "→ Part Hub",       sub: "",          action: () => { setView("hub");      setPaletteOpen(false); } },
      { label: "→ Quote Engine",   sub: "",          action: () => { setView("quote");    setPaletteOpen(false); } },
      { label: "→ PO Console",     sub: "",          action: () => { setView("po");       setPaletteOpen(false); } },
      { label: "→ Alerts",         sub: "",          action: () => { setView("alerts");   setPaletteOpen(false); } },
      { label: "→ Network",        sub: "",          action: () => { setView("network");  setPaletteOpen(false); } },
      { label: "→ Horizon Charts", sub: "",          action: () => { setView("horizon");  setPaletteOpen(false); } },
    ];
    const skuResults = searchCatalog(q, catalog(), 5).map(sku => ({
      label: sku.name,
      sub:   sku.part_no || sku.id,
      tag:   "PART",
      action: () => { setSelectedSku(sku); setView("hub"); setPaletteOpen(false); },
    }));
    const clientResults = (data()?.clients || [])
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(p => ({
        label: p.name,
        sub:   currency(p.total),
        tag:   "CLIENT",
        action: () => { setNetworkTab("clients"); setSelectedProfile(p); setView("network"); setPaletteOpen(false); },
      }));
    const supplierResults = (data()?.suppliers || [])
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(p => ({
        label: p.name,
        sub:   currency(p.total),
        tag:   "SUPPLIER",
        action: () => { setNetworkTab("suppliers"); setSelectedProfile(p); setView("network"); setPaletteOpen(false); },
      }));
    return [...skuResults, ...clientResults, ...supplierResults];
  });

  // ── Quote helpers ─────────────────────────────────────────────────────────
  const saveQuote = (items) => localStorage.setItem("ptcos_quote", JSON.stringify(items));

  const addToQuote = (sku, qty = 1) => {
    const mp = manualPrices()[sku.id];
    const defaultPrice = mp ?? (sku.avg_sell > 0 ? sku.avg_sell : sku.avg_cost * 1.2);
    setQuoteItems(prev => {
      const exists = prev.find(i => i.id === sku.id);
      const next = exists
        ? prev.map(i => i.id === sku.id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { ...sku, qty, quotedPrice: defaultPrice }];
      saveQuote(next);
      return next;
    });
  };

  const updateQuoteItem = (id, field, val) => {
    setQuoteItems(prev => { const next = prev.map(i => i.id === id ? { ...i, [field]: val } : i); saveQuote(next); return next; });
  };

  const removeFromQuote = (id) => {
    setQuoteItems(prev => { const next = prev.filter(i => i.id !== id); saveQuote(next); return next; });
  };

  const saveQuoteToHistory = () => {
    const items = quoteItems();
    if (!items.length) return;
    const totals = quoteTotals();
    const entry = {
      id:       `Q-${Date.now()}`,
      date:     new Date().toISOString().slice(0, 10),
      customer: quoteCustomer().trim() || "Unnamed",
      items:    items,
      total:    totals.revenue,
      margin:   totals.marginPct,
    };
    setQuoteHistory(prev => {
      const next = [entry, ...prev].slice(0, 30);
      localStorage.setItem("ptcos_quote_history", JSON.stringify(next));
      return next;
    });
  };

  const loadQuoteFromHistory = (entry) => {
    setQuoteCustomer(entry.customer);
    setQuoteItems(entry.items);
    saveQuote(entry.items);
    setShowHistory(false);
  };

  // ── Manual price helpers ──────────────────────────────────────────────────
  const setManualPrice = (skuId, price) => {
    setManualPrices(prev => {
      const next = { ...prev, [skuId]: price };
      localStorage.setItem("ptcos_manual_prices", JSON.stringify(next));
      return next;
    });
  };

  const clearManualPrice = (skuId) => {
    setManualPrices(prev => {
      const next = { ...prev };
      delete next[skuId];
      localStorage.setItem("ptcos_manual_prices", JSON.stringify(next));
      return next;
    });
  };

  // ── Alias helpers ─────────────────────────────────────────────────────────
  const addAlias = (skuId, aliasId) => {
    if (!aliasId || aliasId === skuId) return;
    setAliases(prev => {
      const existing = prev[skuId] || [];
      if (existing.includes(aliasId)) return prev;
      const next = { ...prev, [skuId]: [...existing, aliasId] };
      localStorage.setItem("ptcos_aliases", JSON.stringify(next));
      return next;
    });
  };

  const removeAlias = (skuId, aliasId) => {
    setAliases(prev => {
      const next = { ...prev, [skuId]: (prev[skuId] || []).filter(id => id !== aliasId) };
      localStorage.setItem("ptcos_aliases", JSON.stringify(next));
      return next;
    });
  };

  // ── Order pipeline helpers ────────────────────────────────────────────────
  const STATUSES = ["Draft","Sent","Confirmed","Dispatched","Fulfilled","Cancelled"];
  const STATUS_COLOR = { Draft:"text-ptc-base0/40", Sent:"text-ptc-yellow", Confirmed:"text-ptc-green", Dispatched:"text-ptc-yellow", Fulfilled:"text-ptc-green", Cancelled:"text-ptc-red" };

  const promoteQuoteToOrder = () => {
    const items = quoteItems();
    if (!items.length) return;
    const totals = quoteTotals();
    const order = {
      id:        `ORD-${Date.now()}`,
      date:      new Date().toISOString().slice(0,10),
      customer:  quoteCustomer().trim() || "Unnamed",
      transport: transportLog()[quoteCustomer().trim()] || "",
      status:    "Draft",
      items:     items,
      total:     totals.revenue,
      margin:    totals.marginPct,
      delivery_date: "",
      notes:     "",
    };
    setOrders(prev => { const next = [order, ...prev]; localStorage.setItem("ptcos_orders", JSON.stringify(next)); return next; });
    saveQuoteToHistory();
  };

  const updateOrder = (id, patch) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === id ? { ...o, ...patch } : o);
      localStorage.setItem("ptcos_orders", JSON.stringify(next));
      return next;
    });
    if (selectedOrder()?.id === id) setSelectedOrder(prev => ({ ...prev, ...patch }));
  };

  const deleteOrder = (id) => {
    setOrders(prev => { const next = prev.filter(o => o.id !== id); localStorage.setItem("ptcos_orders", JSON.stringify(next)); return next; });
    if (selectedOrder()?.id === id) setSelectedOrder(null);
  };

  // ── Transport helpers ─────────────────────────────────────────────────────
  const setTransport = (client, carrier) => {
    setTransportLog(prev => { const next = { ...prev, [client]: carrier }; localStorage.setItem("ptcos_transport", JSON.stringify(next)); return next; });
  };

  // ── Inventory helpers ─────────────────────────────────────────────────────
  const saveInvOverride = (skuId, patch) => {
    setInventoryOverrides(prev => {
      const next = { ...prev, [skuId]: { ...(prev[skuId] || {}), ...patch } };
      localStorage.setItem("ptcos_inventory", JSON.stringify(next));
      return next;
    });
  };

  const saveCustomProduct = (p) => {
    const prod = { ...p, id: `CUSTOM-${Date.now()}`, is_custom: true, net_stock_qty: parseFloat(p.stock || 0), avg_cost: parseFloat(p.avg_cost || 0), avg_sell: parseFloat(p.avg_sell || 0) };
    setCustomProducts(prev => { const next = [...prev, prod]; localStorage.setItem("ptcos_custom_products", JSON.stringify(next)); return next; });
    setNewProduct({ name:"", part_no:"", hsn:"", avg_cost:0, avg_sell:0, warehouse:"", notes:"", stock:0 });
    setShowAddProduct(false);
  };

  const deleteCustomProduct = (id) => {
    setCustomProducts(prev => { const next = prev.filter(p => p.id !== id); localStorage.setItem("ptcos_custom_products", JSON.stringify(next)); return next; });
  };

  // Combined catalog including custom products
  const fullCatalog = createMemo(() => [...catalog(), ...customProducts()]);

  // ── Supplier P/N map helpers ──────────────────────────────────────────────
  const parseSupplierMap = () => {
    const name = mapSupplierName().trim();
    if (!name || !mapPasteText().trim()) return;
    const lines = mapPasteText().trim().split("\n").map(l => l.trim()).filter(Boolean);
    const entries = [];
    for (const line of lines) {
      // Accepts: TAB, comma, pipe, 2+ spaces as delimiter
      const parts = line.split(/\t|,|\|{2,}\s*/).map(p => p.trim());
      if (parts.length >= 2) {
        entries.push({ their_pn: parts[0], our_pn: parts[1], name: parts[2] || "" });
      }
    }
    if (!entries.length) return;
    setSupplierMaps(prev => {
      const existing = prev[name] || [];
      const merged = [...existing];
      for (const e of entries) {
        const idx = merged.findIndex(x => x.their_pn === e.their_pn);
        if (idx >= 0) merged[idx] = e; else merged.push(e);
      }
      const next = { ...prev, [name]: merged };
      localStorage.setItem("ptcos_supplier_maps", JSON.stringify(next));
      return next;
    });
    setMapPasteText("");
  };

  const lookupSupplierPn = (supplierPn) => {
    // Search across all supplier maps
    for (const [supplier, entries] of Object.entries(supplierMaps())) {
      const match = entries.find(e => e.their_pn.toLowerCase() === supplierPn.toLowerCase());
      if (match) return { supplier, ...match };
    }
    return null;
  };

  // ── PO helpers ────────────────────────────────────────────────────────────
  const addToPO = (sku, qty = 1) => {
    setPoItems(prev => {
      const exists = prev.find(i => i.id === sku.id);
      return exists
        ? prev.map(i => i.id === sku.id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { ...sku, qty, unitCost: sku.avg_cost || 0 }];
    });
  };

  // ── Inquiry parser ────────────────────────────────────────────────────────
  const runParser = () => setParsedLines(parseInquiry(inquiryText(), catalog()));

  // ── Quote PDF generator ───────────────────────────────────────────────────
  const generateQuote = () => {
    const items = quoteItems();
    if (!items.length) return;
    const totals   = quoteTotals();
    const customer = quoteCustomer().trim() || "Valued Customer";
    const fmtIN    = (v) => v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const today    = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const valid    = new Date(); valid.setDate(valid.getDate() + 30);
    const validStr = valid.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const refNo    = `PTC-Q-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Math.floor(Math.random()*900)+100}`;

    const rows = items.map((it, i) => `
      <tr>
        <td>${i + 1}</td>
        <td style="font-weight:bold;color:#000000">${it.part_no || "—"}</td>
        <td>${it.name}</td>
        <td class="num">${it.qty}</td>
        <td class="num">&#8377;${fmtIN(it.quotedPrice)}</td>
        <td class="num" style="font-weight:bold">&#8377;${fmtIN(it.qty * it.quotedPrice)}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Quotation ${refNo}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:"Courier New",monospace;font-size:11px;color:#222;padding:40px;max-width:820px;margin:0 auto}
  .hdr{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #000;padding-bottom:14px;margin-bottom:20px}
  .co{font-size:20px;font-weight:bold;letter-spacing:.12em}
  .co-sub{font-size:10px;color:#666;margin-top:3px}
  .doc-title{font-size:16px;font-weight:bold;letter-spacing:.3em}
  .meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:22px}
  .ml label{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#888}
  .ml div{font-weight:bold;font-size:13px;margin-top:2px}
  .mr{text-align:right}.mr label{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#888}
  .mr div{font-weight:bold;font-size:13px;margin-top:2px}
  table{width:100%;border-collapse:collapse;margin-bottom:18px}
  thead tr{border-top:2px solid #000;border-bottom:1px solid #666}
  thead th{padding:6px 8px;text-align:left;font-size:9px;letter-spacing:.12em;text-transform:uppercase}
  thead th.num,tbody td.num,tfoot td.num{text-align:right}
  tbody td{padding:6px 8px;border-bottom:1px solid #e0e0e0;font-size:11px}
  tfoot td{padding:4px 8px;font-size:11px}
  tfoot tr.grand td{font-weight:bold;font-size:14px;border-top:2px solid #000;padding-top:8px}
  .terms{margin-top:28px;padding-top:12px;border-top:1px solid #ccc;font-size:9px;color:#888;line-height:1.9}
  @media print{body{padding:18px}}
</style></head><body>
<div class="hdr">
  <div><div class="co">PARTS TRADING COMPANY</div><div class="co-sub">Heavy Equipment Parts &middot; Wholesale &amp; Retail</div></div>
  <div class="doc-title">QUOTATION</div>
</div>
<div class="meta">
  <div class="ml"><label>To</label><div>${customer}</div></div>
  <div class="mr"><label>Ref No.</label><div>${refNo}</div></div>
  <div class="ml"><label>Date</label><div>${today}</div></div>
  <div class="mr"><label>Valid Till</label><div>${validStr}</div></div>
</div>
<table>
  <thead><tr>
    <th style="width:28px">#</th><th style="width:110px">Part No.</th><th>Description</th>
    <th class="num" style="width:44px">Qty</th><th class="num" style="width:90px">Rate</th><th class="num" style="width:100px">Amount</th>
  </tr></thead>
  <tbody>${rows}</tbody>
  <tfoot>
    <tr><td colspan="5" style="text-align:right;color:#666">Cost Basis</td><td class="num">&#8377;${fmtIN(totals.cost)}</td></tr>
    <tr><td colspan="5" style="text-align:right;color:#666">Gross Margin</td><td class="num">&#8377;${fmtIN(totals.margin)} (${totals.marginPct.toFixed(1)}%)</td></tr>
    <tr class="grand"><td colspan="5" style="text-align:right">TOTAL</td><td class="num">&#8377;${fmtIN(totals.revenue)}</td></tr>
  </tfoot>
</table>
<div class="terms"><strong>Terms &amp; Conditions:</strong><br>
&bull; Prices in INR, exclusive of applicable GST &bull; Valid 30 days from issue date<br>
&bull; Delivery subject to stock availability &bull; Payment as per agreed terms<br>
&bull; System-generated document &mdash; Parts Trading Company
</div></body></html>`;

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.setTimeout(() => w.print(), 400);
  };

  // ── PO PDF/CSV generator ─────────────────────────────────────────────────
  const generatePO = (format = "pdf") => {
    const items = poItems();
    if (!items.length) return;
    const total    = poTotals();
    const supplier = poSupplier().trim() || "Supplier";
    const fmtIN    = (v) => v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const today    = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const refNo    = `PTC-PO-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Math.floor(Math.random()*900)+100}`;

    if (format === "csv") {
      const header = "S.No,Part No.,Description,HSN,Qty,Unit Cost (INR),Total (INR)";
      const rows   = items.map((it, i) =>
        `${i+1},"${it.part_no || "—"}","${it.name}","${it.hsn || "—"}",${it.qty},${it.unitCost.toFixed(2)},${(it.qty * it.unitCost).toFixed(2)}`
      );
      const csv = [header, ...rows, `,,,,,,${total.toFixed(2)}`].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${refNo}.csv`;
      a.click();
      return;
    }

    const rows = items.map((it, i) => `
      <tr>
        <td>${i + 1}</td>
        <td style="font-weight:bold;color:#000000">${it.part_no || "—"}</td>
        <td>${it.name}</td>
        <td class="num">${it.hsn || "—"}</td>
        <td class="num">${it.qty}</td>
        <td class="num">&#8377;${fmtIN(it.unitCost)}</td>
        <td class="num" style="font-weight:bold">&#8377;${fmtIN(it.qty * it.unitCost)}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Purchase Order ${refNo}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:"Courier New",monospace;font-size:11px;color:#222;padding:40px;max-width:820px;margin:0 auto}
  .hdr{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #000;padding-bottom:14px;margin-bottom:20px}
  .co{font-size:20px;font-weight:bold;letter-spacing:.12em}
  .co-sub{font-size:10px;color:#666;margin-top:3px}
  .doc-title{font-size:16px;font-weight:bold;letter-spacing:.3em}
  .meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:22px}
  .ml label,.mr label{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#888}
  .ml div,.mr div{font-weight:bold;font-size:13px;margin-top:2px}
  .mr{text-align:right}
  table{width:100%;border-collapse:collapse;margin-bottom:18px}
  thead tr{border-top:2px solid #000;border-bottom:1px solid #666}
  thead th{padding:6px 8px;text-align:left;font-size:9px;letter-spacing:.12em;text-transform:uppercase}
  thead th.num,tbody td.num,tfoot td.num{text-align:right}
  tbody td{padding:6px 8px;border-bottom:1px solid #e0e0e0;font-size:11px}
  tfoot td{padding:6px 8px;font-size:12px;font-weight:bold;border-top:2px solid #000}
  .terms{margin-top:28px;padding-top:12px;border-top:1px solid #ccc;font-size:9px;color:#888;line-height:1.9}
  @media print{body{padding:18px}}
</style></head><body>
<div class="hdr">
  <div><div class="co">PARTS TRADING COMPANY</div><div class="co-sub">Heavy Equipment Parts &middot; Wholesale &amp; Retail</div></div>
  <div class="doc-title">PURCHASE ORDER</div>
</div>
<div class="meta">
  <div class="ml"><label>To (Supplier)</label><div>${supplier}</div></div>
  <div class="mr"><label>PO No.</label><div>${refNo}</div></div>
  <div class="ml"><label>Date</label><div>${today}</div></div>
  <div class="mr"><label>Items</label><div>${items.length}</div></div>
</div>
<table>
  <thead><tr>
    <th style="width:24px">#</th><th style="width:100px">Part No.</th><th>Description</th>
    <th class="num" style="width:70px">HSN</th>
    <th class="num" style="width:40px">Qty</th><th class="num" style="width:90px">Unit Cost</th><th class="num" style="width:100px">Total</th>
  </tr></thead>
  <tbody>${rows}</tbody>
  <tfoot>
    <tr><td colspan="6" style="text-align:right">PO TOTAL</td><td class="num">&#8377;${fmtIN(total)}</td></tr>
  </tfoot>
</table>
<div class="terms"><strong>Terms &amp; Conditions:</strong><br>
&bull; Prices in INR, subject to GST as applicable &bull; Please confirm availability before dispatch<br>
&bull; Delivery as per agreed schedule &bull; Invoice must reference PO No. ${refNo}<br>
&bull; System-generated document &mdash; Parts Trading Company
</div></body></html>`;

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.setTimeout(() => w.print(), 400);
  };

  // ── Canvas refs ───────────────────────────────────────────────────────────
  let horizonCanvas, heatmapCanvas, sellCanvas, buyCanvas;

  createEffect(() => {
    if (view() !== "horizon" || !data()) return;
    setTimeout(() => {
      drawHorizon(horizonCanvas, data().horizon || [], months());
      drawHeatmap(heatmapCanvas, data().heatmap  || [], months());
    }, 60);
  });

  createEffect(() => {
    const sku = selectedSku();
    if (!sku) return;
    setTimeout(() => {
      drawSparkline(sellCanvas, sku.monthly, months(), "sell");
      drawSparkline(buyCanvas,  sku.monthly, months(), "buy");
    }, 60);
  });

  // ── Totals ────────────────────────────────────────────────────────────────
  const quoteTotals = createMemo(() => {
    const items = quoteItems();
    const cost    = items.reduce((a, i) => a + i.avg_cost    * i.qty, 0);
    const revenue = items.reduce((a, i) => a + i.quotedPrice * i.qty, 0);
    return { cost, revenue, margin: revenue - cost, marginPct: revenue > 0 ? (revenue - cost) / revenue * 100 : 0 };
  });

  const poTotals = createMemo(() => poItems().reduce((a, i) => a + i.unitCost * i.qty, 0));

  // ─── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div class="h-screen w-screen flex flex-col overflow-hidden bg-ptc-base03 text-ptc-base0 font-mono select-none text-sm">

      {/* ── Command Palette ──────────────────────────────────────────────── */}
      <Show when={paletteOpen()}>
        <div class="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-ptc-base03/90"
          onClick={(e) => { if (e.target === e.currentTarget) setPaletteOpen(false); }}>
          <div class="bg-ptc-base02 border border-ptc-base0/30 w-full max-w-xl shadow-xl flex flex-col">
            <div class="flex items-center border-b border-ptc-base0/20 px-4 py-3">
              <span class="text-ptc-base0/30 mr-3 text-xs tracking-widest">⌘K</span>
              <input autofocus type="text"
                class="flex-1 bg-transparent outline-none text-ptc-base0 font-mono placeholder:text-ptc-base0/30 text-sm"
                placeholder="Navigate, search SKUs, find parts..."
                value={paletteQuery()}
                onInput={(e) => setPaletteQuery(e.target.value)} />
            </div>
            <div class="max-h-72 overflow-y-auto">
              <For each={paletteSuggestions()}>
                {(s) => (
                  <button class="w-full text-left px-4 py-2.5 hover:bg-ptc-base0/10 flex items-center gap-3 text-sm border-b border-ptc-base0/5"
                    onClick={s.action}>
                    {s.tag && (
                      <span class={`text-xs px-1.5 py-0.5 border shrink-0 uppercase tracking-widest ${
                        s.tag === "CLIENT"   ? "text-ptc-green border-ptc-green/30" :
                        s.tag === "SUPPLIER" ? "text-ptc-red border-ptc-red/30"    :
                        "text-ptc-yellow border-ptc-yellow/30"
                      }`}>{s.tag}</span>
                    )}
                    <span class="flex-1">{s.label}</span>
                    {s.sub && <span class="text-ptc-base0/30 text-xs shrink-0">{s.sub}</span>}
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>
      </Show>

      {/* ── Nav Bar ──────────────────────────────────────────────────────── */}
      <nav class="flex items-center border-b border-ptc-base02 px-4 py-2.5 bg-ptc-base03 shrink-0 gap-1.5">
        <div class="font-bold tracking-[0.2em] text-ptc-yellow text-base uppercase mr-5">PTC OS</div>
        <For each={[
          ["hub","Part Hub"], ["quote","Quote"], ["po","PO"], ["orders","Orders"],
          ["alerts","Alerts"], ["debtors","Debtors"], ["network","Network"], ["inventory","Inventory"],
          ["supplier-maps","Supplier Maps"], ["horizon","Horizon"],
        ]}>
          {([v, label]) => (
            <button onClick={() => setView(v)}
              class={`px-3 py-2 text-sm font-bold uppercase tracking-widest border transition-colors ${
                view() === v ? "bg-ptc-base0 text-ptc-base03 border-ptc-base0" :
                v === "alerts"  ? "border-ptc-red/50 text-ptc-red hover:border-ptc-red hover:bg-ptc-red/10" :
                v === "debtors" ? "border-ptc-orange/50 text-ptc-orange hover:border-ptc-orange hover:bg-ptc-orange/10" :
                v === "orders"  ? "border-ptc-yellow/40 text-ptc-yellow/80 hover:border-ptc-yellow hover:text-ptc-yellow" :
                "border-ptc-base02 text-ptc-base0/70 hover:border-ptc-base0/60 hover:text-ptc-base0 hover:bg-ptc-base02/50"
              }`}>
              {label}
              {v === "alerts" && (negativeStockSkus().length + deadStockSkus().length) > 0 && view() !== "alerts" &&
                <span class="ml-1.5 bg-ptc-red text-white text-xs px-1.5 rounded-sm">{negativeStockSkus().length + deadStockSkus().length}</span>
              }
              {v === "debtors" && clientActivity().filter(c => c.daysSince > 90 && c.total > 50000).length > 0 && view() !== "debtors" &&
                <span class="ml-1.5 bg-ptc-orange text-white text-xs px-1.5 rounded-sm">{clientActivity().filter(c => c.daysSince > 90 && c.total > 50000).length}</span>
              }
              {v === "orders" && orders().filter(o => o.status !== "Fulfilled" && o.status !== "Cancelled").length > 0 && view() !== "orders" &&
                <span class="ml-1.5 bg-ptc-yellow text-ptc-base03 text-xs px-1.5 rounded-sm font-bold">{orders().filter(o => o.status !== "Fulfilled" && o.status !== "Cancelled").length}</span>
              }
            </button>
          )}
        </For>
        <div class="w-px bg-ptc-base02 mx-1 self-stretch" />
        <button onClick={() => setView("watchdog")}
          class={`px-3 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
            view() === "watchdog" ? "bg-ptc-base0/20 text-ptc-base0 border-ptc-base0/40" : "border-ptc-base02 text-ptc-base0/30 hover:text-ptc-base0/60 hover:border-ptc-base0/20"
          }`}>
          Watchdog
        </button>
        <button onClick={() => setPaletteOpen(true)}
          class="ml-auto text-xs text-ptc-base0/30 border border-ptc-base02 px-3 py-1.5 hover:border-ptc-base0/30 hover:text-ptc-base0/60 tracking-widest uppercase">
          ⌘K
        </button>
        <Show when={!loading()}>
          <div class="text-xs text-ptc-base0/25 uppercase tracking-widest ml-3">
            {num(kpis().totalTransactions)} txs · {num(kpis().uniqueSkus)} skus
          </div>
        </Show>
      </nav>

      <Show when={loading()}>
        <div class="flex-1 flex items-center justify-center text-ptc-base0/30 tracking-widest uppercase text-xs">
          Loading enterprise data...
        </div>
      </Show>

      <Show when={!loading()}>
        <div class="flex-1 flex overflow-hidden relative">

          {/* ════════════════════════════════════════════════════
              WATCHDOG
          ════════════════════════════════════════════════════ */}
          <Show when={view() === "watchdog"}>
            <div class="flex-1 flex flex-col overflow-hidden p-3 gap-3">

              {/* KPIs */}
              <div class="grid grid-cols-5 gap-3 shrink-0">
                <For each={[
                  { label: "Enterprise Revenue",   val: currency(kpis().totalSales),        sub: "Total invoiced FY 24–26" },
                  { label: "Total Procurement",    val: currency(kpis().totalPurchases),     sub: "Cost of goods acquired" },
                  { label: "Gross Margin (Avg)",   val: currency(kpis().grossMargin),        sub: pct(kpis().marginPct) + " blended avg", accent: "yellow" },
                  { label: "Realized Margin (FIFO)",val: currency(kpis().realizedMargin),    sub: pct(kpis().realizedMarginPct) + " on matched lots", accent: "green" },
                  { label: "Network",              val: num(kpis().uniqueClients) + " clients", sub: num(kpis().uniqueSuppliers) + " suppliers" },
                ]}>
                  {(k) => (
                    <div class={`border p-4 flex flex-col gap-1 ${
                      k.accent === "yellow" ? "border-ptc-yellow/40 bg-ptc-yellow/5" :
                      k.accent === "green"  ? "border-ptc-green/40 bg-ptc-green/5"  :
                      "border-ptc-base02"
                    }`}>
                      <div class="text-xs uppercase tracking-widest text-ptc-base0/50 mb-1">{k.label}</div>
                      <div class={`text-3xl font-bold tabular-nums leading-none ${
                        k.accent === "yellow" ? "text-ptc-yellow" :
                        k.accent === "green"  ? "text-ptc-green"  : "text-ptc-base0"
                      }`}>{k.val}</div>
                      <div class="text-sm text-ptc-base0/40 mt-1">{k.sub}</div>
                    </div>
                  )}
                </For>
              </div>

              <div class="flex-1 grid grid-cols-2 gap-3 overflow-hidden min-h-0">

                {/* Monthly P&L */}
                <div class="border border-ptc-base02 flex flex-col overflow-hidden">
                  <div class="px-4 py-2 border-b border-ptc-base02 text-xs uppercase tracking-widest font-bold text-ptc-base0/50 shrink-0">
                    Monthly Liquidity & Margin Flow
                  </div>
                  <div class="flex-1 overflow-y-auto">
                    <table class="w-full text-xs">
                      <thead class="sticky top-0 bg-ptc-base02 z-10">
                        <tr>
                          {["Month", "Revenue", "Cost", "Margin (vs 15% target)"].map((h, i) => (
                            <th class={`px-4 py-3 font-bold uppercase tracking-widest text-xs ${i > 0 ? "text-right" : "text-left"} ${i === 3 ? "text-left w-32" : ""}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <For each={data()?.timeSeries}>
                          {(ts) => (
                            <tr class="border-b border-ptc-base02/50 hover:bg-ptc-base02/40">
                              <td class="px-4 py-3 tabular-nums text-ptc-base0/60">{ts.month}</td>
                              <td class="px-4 py-3 tabular-nums text-right text-ptc-green">{currency(ts.sales)}</td>
                              <td class="px-4 py-3 tabular-nums text-right text-ptc-red">{currency(ts.purchases)}</td>
                              <td class="px-4 py-2 w-32">
                                <BulletGraph current={ts.margin} target={ts.sales * 0.15} max={Math.max(ts.sales * 0.5, 1)} />
                              </td>
                            </tr>
                          )}
                        </For>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Anomaly feed */}
                <div class="border border-ptc-yellow/20 flex flex-col overflow-hidden">
                  <div class="px-4 py-2 border-b border-ptc-yellow/20 text-xs uppercase tracking-widest font-bold text-ptc-yellow/70 shrink-0">
                    ⚑ Watchdog — High-Magnitude Transaction Feed
                  </div>
                  <div class="flex-1 overflow-y-auto">
                    <table class="w-full text-xs">
                      <thead class="sticky top-0 bg-ptc-base02 z-10">
                        <tr>
                          {["Date", "Entity", "Type", "Value"].map((h, i) => (
                            <th class={`px-4 py-2 uppercase tracking-widest font-bold text-xs ${i === 3 ? "text-right" : "text-left"}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <For each={data()?.topAnomalies?.slice(0, 100)}>
                          {(tx) => (
                            <tr class="border-b border-ptc-base02/50 hover:bg-ptc-base02/40 cursor-pointer"
                              onClick={() => setSelectedAnomaly(tx)}>
                              <td class="px-4 py-3 tabular-nums text-ptc-base0/50 whitespace-nowrap">{tx.date}</td>
                              <td class="px-4 py-2 max-w-[180px] truncate" title={tx.particulars}>{tx.particulars}</td>
                              <td class="px-4 py-2">
                                <span class={`text-xs px-1.5 py-0.5 border uppercase ${tx.type === "Sales" ? "text-ptc-green border-ptc-green/30" : "text-ptc-red border-ptc-red/30"}`}>
                                  {tx.type}
                                </span>
                              </td>
                              <td class={`px-4 py-2 text-right tabular-nums font-bold ${tx.type === "Sales" ? "text-ptc-green" : "text-ptc-yellow"}`}>
                                {currency(tx.value)}
                              </td>
                            </tr>
                          )}
                        </For>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Watchdog side panel */}
            <div class={`absolute top-0 right-0 bottom-0 w-72 bg-ptc-base02 border-l border-ptc-base02 flex flex-col z-30 transition-transform duration-200 ${selectedAnomaly() ? "translate-x-0" : "translate-x-full"}`}>
              <div class="p-4 border-b border-ptc-base0/10 flex items-center justify-between shrink-0">
                <span class="text-xs uppercase tracking-widest font-bold">Transaction Intel</span>
                <button class="text-ptc-base0/40 hover:text-ptc-base0 text-xl leading-none" onClick={() => setSelectedAnomaly(null)}>×</button>
              </div>
              <Show when={selectedAnomaly()}>
                {(tx) => (
                  <div class="p-4 flex flex-col gap-4 text-xs overflow-y-auto flex-1">
                    <div>
                      <div class="text-xs text-ptc-base0/40 uppercase tracking-widest mb-1">Counterparty</div>
                      <div class="font-bold leading-snug">{tx().particulars}</div>
                    </div>
                    <div class="grid grid-cols-2 gap-3 border-y border-ptc-base0/10 py-4">
                      <div><div class="text-xs text-ptc-base0/40 uppercase tracking-widest mb-1">Date</div><div class="tabular-nums">{tx().date}</div></div>
                      <div><div class="text-xs text-ptc-base0/40 uppercase tracking-widest mb-1">Voucher No.</div><div class="tabular-nums">{tx().vch_no || "—"}</div></div>
                      <div><div class="text-xs text-ptc-base0/40 uppercase tracking-widest mb-1">Voucher Type</div>
                        <span class={`text-xs px-1.5 py-0.5 border uppercase ${tx().type === "Sales" ? "text-ptc-green border-ptc-green/30" : "text-ptc-red border-ptc-red/30"}`}>{tx().vch_type}</span>
                      </div>
                      <div><div class="text-xs text-ptc-base0/40 uppercase tracking-widest mb-1">Value</div>
                        <div class={`tabular-nums text-lg font-bold ${tx().type === "Sales" ? "text-ptc-green" : "text-ptc-yellow"}`}>{currency(tx().value)}</div>
                      </div>
                    </div>
                    <div class="text-xs text-ptc-base0/30 uppercase tracking-widest">
                      Click any row in the feed to see transaction context.
                    </div>
                  </div>
                )}
              </Show>
            </div>
          </Show>

          {/* ════════════════════════════════════════════════════
              PART HUB  (360° Intelligence)
          ════════════════════════════════════════════════════ */}
          <Show when={view() === "hub"}>
            <div class="flex-1 flex overflow-hidden">

              <div class="flex-1 flex flex-col overflow-hidden">
                <div class="p-3 border-b border-ptc-base02 shrink-0">
                  <input type="text"
                    class="w-full bg-ptc-base02 border border-ptc-base0/20 px-4 py-2.5 font-mono text-sm placeholder:text-ptc-base0/25 focus:outline-none focus:border-ptc-yellow/40"
                    placeholder="Search 1,204 SKUs — part name, HSN code, brand, model..."
                    value={hubQuery()} onInput={(e) => setHubQuery(e.target.value)} autofocus />
                </div>
                <div class="flex-1 overflow-y-auto">
                  <table class="w-full text-xs">
                    <thead class="sticky top-0 bg-ptc-base02 z-10">
                      <tr>
                        {[["Part No.","text-left"],["Part Name","text-left"],["HSN","text-left"],["Avg Cost","text-right"],["Avg Sell","text-right"],["Top Supplier","text-left"],["Realized Mgn","text-right"],["Est. Stock","text-right"],["",""]].map(([h, cls]) => (
                          <th class={`px-4 py-3 font-bold uppercase tracking-widest text-xs ${cls}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <For each={filteredHub()}>
                        {(sku) => (
                          <tr class={`border-b border-ptc-base02/50 hover:bg-ptc-base02/50 cursor-pointer ${selectedSku()?.id === sku.id ? "bg-ptc-base02" : ""}`}
                            onClick={() => setSelectedSku(sku)}>
                            <td class="px-4 py-3 tabular-nums text-ptc-yellow font-bold text-base">{sku.part_no || <span class="text-ptc-base0/25 text-sm">—</span>}</td>
                            <td class="px-4 py-3 font-bold text-base max-w-[220px] truncate" title={sku.name}>{sku.name}</td>
                            <td class="px-4 py-3 tabular-nums text-ptc-base0/40 text-sm">{sku.hsn || "—"}</td>
                            <td class="px-4 py-3 tabular-nums text-right text-base text-ptc-red">{currency(sku.avg_cost)}</td>
                            <td class="px-4 py-3 tabular-nums text-right text-base text-ptc-green font-bold">
                              <span class="inline-flex items-center gap-1 justify-end">
                                {sku.avg_sell > 0 ? currency(sku.avg_sell) : <span class="text-ptc-base0/20">—</span>}
                                <TrendArrow monthly={sku.monthly} />
                              </span>
                            </td>
                            <td class="px-4 py-2 text-xs text-ptc-base0/40 max-w-[130px] truncate" title={sku.top_suppliers?.[0]?.n}>
                              {sku.top_suppliers?.[0]?.n?.split(" ").slice(0, 3).join(" ") || "—"}
                            </td>
                            <td class={`px-4 py-3 tabular-nums text-right font-bold text-sm ${
                              sku.realized_margin_pct == null ? "text-ptc-base0/20" :
                              sku.realized_margin_pct < 0    ? "text-ptc-red" :
                              sku.realized_margin_pct < 10   ? "text-ptc-orange" :
                              "text-ptc-green"
                            }`}>
                              {sku.realized_margin_pct != null ? pct(sku.realized_margin_pct) : "—"}
                            </td>
                            <td class={`px-4 py-3 tabular-nums text-right font-bold text-sm ${sku.net_stock_qty > 0 ? "text-ptc-yellow" : "text-ptc-base0/30"}`}>
                              {num(sku.net_stock_qty)}
                            </td>
                            <td class="px-4 py-2">
                              <button class="text-xs px-2 py-1 border border-ptc-base0/20 hover:bg-ptc-yellow hover:text-ptc-base03 hover:border-ptc-yellow uppercase tracking-widest"
                                onClick={(e) => { e.stopPropagation(); addToQuote(sku); }}>+Q</button>
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 360° side panel */}
              <div class={`border-l border-ptc-base02 bg-ptc-base02 flex flex-col transition-all duration-200 ${selectedSku() ? "w-96" : "w-0 overflow-hidden"}`}>
                <div class="p-4 border-b border-ptc-base0/10 flex items-center justify-between shrink-0">
                  <span class="text-xs uppercase tracking-widest font-bold text-ptc-yellow">360° Part Intelligence</span>
                  <button class="text-ptc-base0/40 hover:text-ptc-base0 text-xl leading-none" onClick={() => setSelectedSku(null)}>×</button>
                </div>
                <Show when={selectedSku()}>
                  {(sku) => (
                    <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-5 text-xs">

                      <div>
                        {sku().part_no ? (
                          <div class="text-ptc-yellow font-bold tracking-widest text-2xl mb-2 tabular-nums">{sku().part_no}</div>
                        ) : (
                          <div class="text-ptc-base0/25 font-bold text-base mb-2 tracking-widest uppercase">No Part No.</div>
                        )}
                        <div class="flex items-start gap-2 mb-1">
                          <div class="font-bold text-sm leading-snug flex-1">{sku().name}</div>
                          <Show when={sku().realized_margin_pct != null && sku().realized_margin_pct < 0}>
                            <span class="shrink-0 text-xs border border-ptc-red/50 text-ptc-red px-1.5 py-0.5 uppercase tracking-widest bg-ptc-red/10">⚠ Loss</span>
                          </Show>
                        </div>
                        <div class="flex gap-3 text-ptc-base0/40 text-xs">
                          {!sku().part_no && <span class="text-ptc-base0/30">{sku().id}</span>}
                          {sku().hsn && <span>HSN {sku().hsn}</span>}
                        </div>
                        {sku().hsn_desc && <div class="text-ptc-base0/30 mt-1 italic text-xs">{sku().hsn_desc}</div>}
                      </div>

                      {/* Pricing waterfall */}
                      <div class="border border-ptc-base0/10 p-3 flex flex-col gap-2.5">
                        <div class="text-xs uppercase tracking-widest font-bold text-ptc-base0/40 mb-1">Factual Pricing</div>
                        <div class="flex justify-between items-baseline">
                          <span class="text-ptc-base0/40 text-xs">Avg Purchase Cost</span>
                          <span class="tabular-nums text-ptc-red text-sm font-bold">{currencyD(sku().avg_cost)}</span>
                        </div>
                        <div class="flex justify-between items-baseline">
                          <span class="text-ptc-base0/40 text-xs">Floor (cost + 15%)</span>
                          <span class="tabular-nums text-ptc-orange text-sm">{currencyD(sku().price_floor)}</span>
                        </div>
                        <div class="flex justify-between items-center">
                          <span class="text-ptc-base0/40 text-xs">Avg Historical Sell</span>
                          <span class="inline-flex items-center gap-1.5">
                            <TrendArrow monthly={sku().monthly} />
                            <span class="tabular-nums text-ptc-green text-sm font-bold">{currencyD(sku().avg_sell)}</span>
                          </span>
                        </div>
                        {/* Manual suggested price */}
                        <div class="border-t border-ptc-base0/10 pt-2.5 mt-0.5">
                          <div class="text-xs uppercase tracking-widest text-ptc-base0/40 mb-1.5">Manual Suggested Price</div>
                          <div class="flex gap-1.5 items-center">
                            <input type="number"
                              class="flex-1 bg-ptc-base03 border border-ptc-base0/20 px-2 py-1 text-sm tabular-nums font-bold text-ptc-yellow focus:outline-none focus:border-ptc-yellow/50"
                              placeholder={String((manualPrices()[sku().id] || sku().avg_sell || sku().avg_cost * 1.2).toFixed(2))}
                              value={manualPrices()[sku().id] != null ? manualPrices()[sku().id] : ""}
                              onInput={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v > 0) setManualPrice(sku().id, v); }} />
                            <Show when={manualPrices()[sku().id] != null}>
                              <button class="text-xs px-2 py-1 border border-ptc-base0/20 hover:border-ptc-red/40 hover:text-ptc-red uppercase tracking-widest"
                                onClick={() => clearManualPrice(sku().id)}>✕</button>
                            </Show>
                          </div>
                          <Show when={manualPrices()[sku().id] != null}>
                            <div class="text-xs text-ptc-yellow mt-1">
                              Manual override active — used as default quote price
                            </div>
                          </Show>
                        </div>
                      </div>

                      {/* Stock & velocity grid */}
                      <div class="grid grid-cols-2 gap-2 text-center">
                        <For each={[
                          { label: "Total Sold",    val: num(sku().sold_count) },
                          { label: "Total Bought",  val: num(sku().bought_count) },
                          { label: "Est. Stock",    val: num(sku().net_stock_qty) },
                          { label: "Last Sold",     val: sku().last_sold?.substring(0, 7) || "—" },
                        ]}>
                          {(s) => (
                            <div class="border border-ptc-base0/10 p-2">
                              <div class="text-xs text-ptc-base0/30 uppercase tracking-widest">{s.label}</div>
                              <div class="font-bold tabular-nums mt-1">{s.val}</div>
                            </div>
                          )}
                        </For>
                      </div>

                      {/* Sparklines */}
                      <div>
                        <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-1.5">Sales Volume by Month</div>
                        <canvas ref={sellCanvas} width="330" height="36" class="w-full" />
                        <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-1.5 mt-3">Purchase Volume by Month</div>
                        <canvas ref={buyCanvas}  width="330" height="36" class="w-full" />
                      </div>

                      {/* Seasonal demand forecast */}
                      <Show when={(() => {
                        const thisMonth = new Date().getMonth(); // 0-indexed
                        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        const curName = monthNames[thisMonth];
                        const nextName = monthNames[(thisMonth + 1) % 12];
                        const monthly = sku().monthly || [];
                        const sameMonthSales = monthly.filter(r => r.m && r.m.startsWith(curName) && r.sq > 0);
                        return sameMonthSales.length >= 1;
                      })()}>
                        {() => {
                          const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                          const thisMonth = new Date().getMonth();
                          const curName = monthNames[thisMonth];
                          const nextName = monthNames[(thisMonth + 1) % 12];
                          const monthly = sku().monthly || [];
                          const sameMonthRows = monthly.filter(r => r.m?.startsWith(curName) && r.sq > 0);
                          const nextMonthRows = monthly.filter(r => r.m?.startsWith(nextName) && r.sq > 0);
                          const avgThis = sameMonthRows.length ? sameMonthRows.reduce((a, r) => a + r.sq, 0) / sameMonthRows.length : 0;
                          const avgNext = nextMonthRows.length ? nextMonthRows.reduce((a, r) => a + r.sq, 0) / nextMonthRows.length : 0;
                          const stock = sku().net_stock_qty || 0;
                          return (
                            <div class="border border-ptc-base0/10 p-3">
                              <div class="text-xs uppercase tracking-widest font-bold text-ptc-base0/40 mb-2">Seasonal Forecast</div>
                              <div class="flex flex-col gap-1.5 text-xs">
                                <div class="flex justify-between">
                                  <span class="text-ptc-base0/40">{curName} avg (past years)</span>
                                  <span class="tabular-nums font-bold">{avgThis.toFixed(1)} units</span>
                                </div>
                                <Show when={avgNext > 0}>
                                  <div class="flex justify-between">
                                    <span class="text-ptc-base0/40">{nextName} avg (past years)</span>
                                    <span class="tabular-nums font-bold">{avgNext.toFixed(1)} units</span>
                                  </div>
                                </Show>
                                <div class={`flex justify-between border-t border-ptc-base0/10 pt-1.5 mt-0.5 font-bold ${stock < avgThis ? "text-ptc-red" : "text-ptc-green"}`}>
                                  <span>Stock vs {curName} demand</span>
                                  <span class="tabular-nums">{stock < avgThis ? `SHORT ${(avgThis - stock).toFixed(1)}` : `OK +${(stock - avgThis).toFixed(1)}`}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      </Show>

                      {/* Top clients & suppliers */}
                      <div class="grid grid-cols-2 gap-3">
                        {[{ label: "Top Clients", data: sku().top_clients, cls: "text-ptc-green" }, { label: "Top Suppliers", data: sku().top_suppliers, cls: "text-ptc-red" }].map(col => (
                          <div>
                            <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-2">{col.label}</div>
                            <For each={col.data?.slice(0, 3)}>
                              {(c) => (
                                <div class="flex justify-between border-b border-ptc-base0/10 py-1">
                                  <span class="truncate flex-1 mr-2 text-ptc-base0/60 text-xs" title={c.n}>{c.n.split(" ").slice(0, 2).join(" ")}</span>
                                  <span class={`tabular-nums text-xs shrink-0 ${col.cls}`}>{num(c.q)}</span>
                                </div>
                              )}
                            </For>
                          </div>
                        ))}
                      </div>

                      {/* Recent transactions */}
                      <div>
                        <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-2">Recent Transactions</div>
                        <For each={sku().recent?.slice(0, 8)}>
                          {(tx) => (
                            <div class="flex items-center gap-2 border-b border-ptc-base0/10 py-1.5">
                              <span class={`shrink-0 text-xs border px-1.5 py-0.5 uppercase ${tx.t === "S" ? "border-ptc-green/30 text-ptc-green" : "border-ptc-red/30 text-ptc-red"}`}>
                                {tx.t === "S" ? "SALE" : "BUY"}
                              </span>
                              <span class="tabular-nums text-ptc-base0/40 shrink-0 text-xs">{tx.d.substring(0, 7)}</span>
                              <span class="flex-1 truncate text-ptc-base0/50 text-xs" title={tx.p}>{tx.p}</span>
                              <span class="tabular-nums shrink-0 text-xs">{num(tx.q)}×{currencyD(tx.r)}</span>
                            </div>
                          )}
                        </For>
                      </div>

                      {/* FIFO Purchase→Sale Match Log */}
                      <Show when={sku().recent_matches?.length > 0} fallback={
                        <div class="border border-ptc-base0/10 p-3">
                          <div class="text-xs uppercase tracking-widest text-ptc-base0/30 mb-1">Purchase → Sale Matching</div>
                          <div class="text-xs text-ptc-base0/25 italic">No matched lots — purchase records may use a different part name or predate this dataset.</div>
                        </div>
                      }>
                        <div>
                          <div class="flex items-center justify-between mb-2">
                            <div class="text-xs uppercase tracking-widest text-ptc-base0/30">FIFO Purchase → Sale Match Log</div>
                            <div class={`text-xs font-bold tabular-nums px-2 py-0.5 border ${
                              sku().realized_margin_pct < 0 ? "text-ptc-red border-ptc-red/30 bg-ptc-red/5" : "text-ptc-green border-ptc-green/30 bg-ptc-green/5"
                            }`}>
                              {pct(sku().realized_margin_pct)} realized
                            </div>
                          </div>
                          <div class="border border-ptc-base0/10 overflow-hidden">
                            <div class="grid grid-cols-5 text-xs uppercase tracking-widest text-ptc-base0/30 px-2 py-1.5 bg-ptc-base03 border-b border-ptc-base0/10">
                              <span>Bought</span>
                              <span>Sold</span>
                              <span class="text-right">Qty</span>
                              <span class="text-right">Buy→Sell</span>
                              <span class="text-right">Margin</span>
                            </div>
                            <For each={sku().recent_matches}>
                              {(m) => (
                                <div class={`grid grid-cols-5 text-xs px-2 py-1.5 border-b border-ptc-base0/10 tabular-nums ${m.m < 0 ? "bg-ptc-red/5" : ""}`}>
                                  <span class="text-ptc-base0/40">{m.bd}</span>
                                  <span class="text-ptc-base0/40">{m.sd}</span>
                                  <span class="text-right">{num(m.q)}</span>
                                  <span class="text-right text-xs">
                                    <span class="text-ptc-red">{currencyD(m.br)}</span>
                                    <span class="text-ptc-base0/30 mx-0.5">→</span>
                                    <span class="text-ptc-green">{currencyD(m.sr)}</span>
                                  </span>
                                  <span class={`text-right font-bold ${m.m < 0 ? "text-ptc-red" : "text-ptc-green"}`}>
                                    {m.m < 0 ? "-" : "+"}{currencyD(Math.abs(m.m))}
                                  </span>
                                </div>
                              )}
                            </For>
                          </div>
                        </div>
                      </Show>

                      {/* Co-purchased related parts */}
                      <Show when={sku().related?.length > 0}>
                        <div>
                          <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-2">Frequently Co-Purchased</div>
                          <div class="flex flex-wrap gap-1.5">
                            <For each={sku().related?.slice(0, 5)}>
                              {(rid) => {
                                const rel = catalog().find(c => c.id === rid);
                                return rel ? (
                                  <button class="text-xs border border-ptc-base0/20 px-2 py-1 hover:border-ptc-yellow/50 hover:text-ptc-yellow max-w-[150px] truncate"
                                    onClick={() => setSelectedSku(rel)} title={rel.name}>
                                    {rel.name.split(" ").slice(0, 3).join(" ")}
                                  </button>
                                ) : null;
                              }}
                            </For>
                          </div>
                        </div>
                      </Show>

                      {/* Cross-reference / Aliases */}
                      <div class="border border-ptc-base0/10 p-3">
                        <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-2">Cross-Reference / Aliases</div>
                        <div class="flex flex-wrap gap-1.5 mb-2">
                          <For each={aliases()[sku().id] || []}>
                            {(aid) => {
                              const rel = catalog().find(c => c.id === aid);
                              return (
                                <div class="flex items-center gap-0.5 border border-ptc-base0/20 pl-2 text-xs">
                                  <button class="text-ptc-yellow hover:text-ptc-base0 truncate max-w-[120px]"
                                    onClick={() => { if (rel) setSelectedSku(rel); }}
                                    title={rel?.name || aid}>
                                    {rel ? (rel.part_no || rel.name.split(" ").slice(0,2).join(" ")) : aid}
                                  </button>
                                  <button class="px-1.5 py-1 text-ptc-base0/20 hover:text-ptc-red"
                                    onClick={() => removeAlias(sku().id, aid)}>×</button>
                                </div>
                              );
                            }}
                          </For>
                        </div>
                        <div class="flex gap-1.5">
                          <input type="text"
                            class="flex-1 bg-ptc-base03 border border-ptc-base0/15 px-2 py-1 text-xs font-mono outline-none focus:border-ptc-yellow/40 placeholder:text-ptc-base0/20"
                            placeholder="Add Part No. or SKU ID..."
                            value={aliasInput()}
                            onInput={e => setAliasInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                const v = aliasInput().trim();
                                const found = catalog().find(c => c.id === v || c.part_no === v);
                                if (found) { addAlias(sku().id, found.id); setAliasInput(""); }
                              }
                            }} />
                          <button class="px-2 py-1 text-xs border border-ptc-base0/20 hover:border-ptc-yellow/40 hover:text-ptc-yellow uppercase tracking-widest"
                            onClick={() => {
                              const v = aliasInput().trim();
                              const found = catalog().find(c => c.id === v || c.part_no === v);
                              if (found) { addAlias(sku().id, found.id); setAliasInput(""); }
                            }}>Link</button>
                        </div>
                        <div class="text-xs text-ptc-base0/20 mt-1">Type a P/N or SKU ID and press Enter or Link</div>
                      </div>

                      {/* CTAs */}
                      <div class="flex gap-2 pt-2 border-t border-ptc-base0/10">
                        <button class="flex-1 border border-ptc-yellow/40 text-ptc-yellow py-2 text-xs uppercase tracking-widest font-bold hover:bg-ptc-yellow hover:text-ptc-base03 transition-colors"
                          onClick={() => addToQuote(sku())}>+ Quote</button>
                        <button class="flex-1 border border-ptc-red/30 text-ptc-red py-2 text-xs uppercase tracking-widest font-bold hover:bg-ptc-red/20 transition-colors"
                          onClick={() => addToPO(sku())}>+ PO</button>
                      </div>
                    </div>
                  )}
                </Show>
              </div>
            </div>
          </Show>

          {/* ════════════════════════════════════════════════════
              QUOTE ENGINE
          ════════════════════════════════════════════════════ */}
          <Show when={view() === "quote"}>
            <div class="flex-1 flex overflow-hidden">

              {/* NLP inquiry pane */}
              <div class="w-64 border-r border-ptc-base02 flex flex-col shrink-0">
                <div class="px-4 py-2 border-b border-ptc-base02 text-sm uppercase tracking-widest font-bold text-ptc-base0/60 shrink-0">
                  Inquiry Parser (NLP)
                </div>
                <textarea class="flex-1 bg-ptc-base03 outline-none font-mono text-xs p-4 resize-none placeholder:text-ptc-base0/20"
                  placeholder={"Paste raw client inquiry...\n\nExample:\n- Cylinder Head x 3\n- Turbocharger 2 pcs\n- Oil Filter (84212300) qty 10\n\nThen click Parse."}
                  value={inquiryText()} onInput={(e) => setInquiryText(e.target.value)} />
                <div class="p-3 border-t border-ptc-base02 shrink-0">
                  <button class="w-full bg-ptc-yellow text-ptc-base03 font-bold text-xs uppercase tracking-widest py-2 hover:bg-ptc-green transition-colors"
                    onClick={runParser}>⚡ Parse Inquiry</button>
                </div>
              </div>

              {/* Matched candidates / manual search */}
              <div class="flex-1 flex flex-col overflow-hidden border-r border-ptc-base02">
                <div class="px-4 py-2 border-b border-ptc-base02 text-sm uppercase tracking-widest font-bold text-ptc-base0/60 shrink-0">
                  {parsedLines().length > 0 ? `${parsedLines().length} Lines Detected` : "Manual Catalog Search"}
                </div>

                <Show when={parsedLines().length > 0} fallback={
                  <div class="flex flex-col flex-1 overflow-hidden">
                    <div class="p-3 shrink-0">
                      <input type="text" class="w-full bg-ptc-base02 border border-ptc-base0/20 px-3 py-2 font-mono text-xs placeholder:text-ptc-base0/25 outline-none focus:border-ptc-yellow/40"
                        placeholder="Search parts to quote..." value={quoteQuery()} onInput={e => setQuoteQuery(e.target.value)} />
                    </div>
                    <div class="flex-1 overflow-y-auto">
                      <For each={filteredQuoteCatalog()}>
                        {(sku) => (
                          <div class="flex items-center px-4 py-2 border-b border-ptc-base02/50 hover:bg-ptc-base02/40 gap-3">
                            <div class="flex-1 min-w-0">
                              {sku.part_no && <div class="text-ptc-yellow font-bold text-sm tabular-nums mb-0.5">{sku.part_no}</div>}
                              <div class="font-bold text-xs truncate">{sku.name}</div>
                              <div class="text-xs text-ptc-base0/30">
                                {!sku.part_no && (sku.id + ' · ')}HSN {sku.hsn || "—"}
                              </div>
                            </div>
                            <div class="text-right shrink-0">
                              <div class="text-ptc-green tabular-nums text-sm font-bold">{sku.avg_sell > 0 ? currencyD(sku.avg_sell) : "—"}</div>
                              <div class="text-ptc-base0/30 text-xs">cost {currencyD(sku.avg_cost)}</div>
                            </div>
                            <button class="border border-ptc-base0/20 px-2 py-1 text-xs uppercase hover:bg-ptc-yellow hover:text-ptc-base03 hover:border-ptc-yellow shrink-0"
                              onClick={() => addToQuote(sku)}>+</button>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                }>
                  <div class="flex-1 overflow-y-auto">
                    <For each={parsedLines()}>
                      {(line) => (
                        <div class="border-b border-ptc-base02 p-4">
                          <div class="text-ptc-base0/30 text-xs mb-2 italic truncate">"{line.original}"</div>
                          <For each={line.candidates.slice(0, 2)}>
                            {(cand, i) => (
                              <div class={`flex items-center gap-3 py-1.5 ${i() > 0 ? "opacity-40" : ""}`}>
                                <div class="flex-1 min-w-0">
                                  {cand.part_no && <div class="text-ptc-yellow font-bold text-sm tabular-nums mb-0.5">{cand.part_no}</div>}
                                  <div class="font-bold text-xs truncate">{cand.name}</div>
                                  <div class="text-xs text-ptc-base0/30">{(cand._s * 100).toFixed(0)}% match</div>
                                </div>
                                <div class="text-right shrink-0 text-xs">
                                  <div class="text-ptc-green tabular-nums text-sm font-bold">{cand.avg_sell > 0 ? currencyD(cand.avg_sell) : "—"}</div>
                                  <div class="text-ptc-base0/30 text-xs">qty: {line.qty}</div>
                                </div>
                                <Show when={i() === 0}>
                                  <button class="border border-ptc-yellow/40 text-ptc-yellow px-2 py-1 text-xs uppercase hover:bg-ptc-yellow hover:text-ptc-base03 shrink-0"
                                    onClick={() => { addToQuote(cand, line.qty); setParsedLines(p => p.filter(l => l !== line)); }}>
                                    Accept
                                  </button>
                                </Show>
                              </div>
                            )}
                          </For>
                        </div>
                      )}
                    </For>
                  </div>
                  <div class="p-3 border-t border-ptc-base02 shrink-0">
                    <button class="w-full border border-ptc-base0/20 text-ptc-base0/40 text-xs uppercase py-1.5 hover:border-ptc-base0/30"
                      onClick={() => setParsedLines([])}>← Clear / Manual Search</button>
                  </div>
                </Show>
              </div>

              {/* Quote builder */}
              <div class="w-96 flex flex-col shrink-0">
                <div class="px-4 py-2 border-b border-ptc-base02 shrink-0 flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs uppercase tracking-widest font-bold text-ptc-base0/40">Quote Draft — {quoteItems().length} Items</span>
                    <div class="flex items-center gap-1.5 text-ptc-base0/30 text-xs">
                      <span>Floor:</span>
                      <input type="number" class="w-10 bg-ptc-base02 border border-ptc-base0/20 px-1 py-0.5 text-center tabular-nums text-xs"
                        value={targetMargin()} onInput={e => setTargetMargin(+e.target.value || 15)} />
                      <span>%</span>
                    </div>
                  </div>
                  <input type="text"
                    class="w-full bg-ptc-base03 border border-ptc-base0/15 px-3 py-1.5 font-mono text-sm placeholder:text-ptc-base0/20 focus:outline-none focus:border-ptc-yellow/40"
                    placeholder="Customer / Company name..."
                    value={quoteCustomer()} onInput={e => setQuoteCustomer(e.target.value)} />
                  <Show when={quoteCustomer().trim() && transportLog()[quoteCustomer().trim()]}>
                    <div class="text-xs text-ptc-base0/40 mt-0.5">
                      Last transport: <span class="text-ptc-yellow font-bold">{transportLog()[quoteCustomer().trim()]}</span>
                    </div>
                  </Show>
                </div>
                <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                  <For each={quoteItems()} fallback={<div class="text-center text-ptc-base0/20 italic mt-10 text-xs">No items. Parse an inquiry or add from catalog.</div>}>
                    {(item) => {
                      const floor = item.avg_cost * (1 + targetMargin() / 100);
                      const under = item.quotedPrice < floor;
                      const profit = (item.quotedPrice - item.avg_cost) * item.qty;
                      return (
                        <div class={`border p-3 text-sm ${under ? "border-ptc-red/40 bg-ptc-red/5" : "border-ptc-base02"}`}>
                          <div class="flex justify-between mb-1">
                            <div class="flex-1 pr-2 min-w-0">
                              {item.part_no && <div class="text-ptc-yellow font-bold text-base tabular-nums leading-tight">{item.part_no}</div>}
                              <div class="font-bold truncate text-sm leading-snug" title={item.name}>{item.name}</div>
                            </div>
                            <button class="text-ptc-base0/25 hover:text-ptc-red leading-none text-lg shrink-0" onClick={() => removeFromQuote(item.id)}>×</button>
                          </div>
                          <div class="grid grid-cols-2 gap-1 text-xs text-ptc-base0/40 mb-2">
                            <span>Cost: {currencyD(item.avg_cost)}</span>
                            <span class="text-right">Floor: {currencyD(floor)}</span>
                          </div>
                          <div class="flex gap-1.5 items-center">
                            <span class="text-xs text-ptc-base0/30 w-5">QTY</span>
                            <input type="number" min="1" class="w-12 bg-ptc-base02 border border-ptc-base0/20 px-1 py-1 text-center tabular-nums font-bold focus:outline-none text-xs"
                              value={item.qty} onInput={e => updateQuoteItem(item.id, "qty", +e.target.value || 1)} />
                            <span class="text-xs text-ptc-base0/30 ml-1">RATE</span>
                            <input type="number" class={`flex-1 bg-ptc-base02 border px-2 py-1 text-right tabular-nums font-bold focus:outline-none text-xs ${under ? "border-ptc-red text-ptc-red" : "border-ptc-base0/20 text-ptc-green"}`}
                              value={item.quotedPrice?.toFixed(2)} onInput={e => updateQuoteItem(item.id, "quotedPrice", +e.target.value)} />
                          </div>
                          <div class="flex justify-between mt-1.5 text-xs">
                            <span class={profit < 0 ? "text-ptc-red" : "text-ptc-yellow"}>Margin: {currencyD(profit)}</span>
                            <span class="font-bold">Sub: {currencyD(item.qty * item.quotedPrice)}</span>
                          </div>
                        </div>
                      );
                    }}
                  </For>
                </div>
                <div class="border-t-2 border-ptc-base02 p-4 text-xs flex flex-col gap-1 shrink-0">
                  <div class="flex justify-between text-ptc-base0/40"><span>Cost Basis</span><span class="tabular-nums">{currency(quoteTotals().cost)}</span></div>
                  <div class="flex justify-between text-ptc-yellow font-bold"><span>Gross Margin</span><span class="tabular-nums">{currency(quoteTotals().margin)} ({pct(quoteTotals().marginPct)})</span></div>
                  <div class="flex justify-between text-2xl font-bold mt-1 pt-2 border-t border-ptc-base0/10">
                    <span class="text-sm uppercase tracking-widest self-center">Total</span>
                    <span class="tabular-nums text-ptc-green">{currency(quoteTotals().revenue)}</span>
                  </div>
                  <div class="flex gap-1.5 mt-3">
                    <button
                      class={`flex-1 font-bold py-2.5 uppercase tracking-widest text-xs transition-colors ${
                        quoteItems().length > 0
                          ? "bg-ptc-yellow text-ptc-base03 hover:bg-ptc-green cursor-pointer"
                          : "bg-ptc-base02 text-ptc-base0/20 cursor-not-allowed"
                      }`}
                      onClick={generateQuote}>
                      ↗ Print
                    </button>
                    <button
                      class={`flex-1 font-bold py-2.5 uppercase tracking-widest text-xs border transition-colors ${
                        quoteItems().length > 0
                          ? "border-ptc-yellow/60 text-ptc-yellow hover:bg-ptc-yellow/10 cursor-pointer"
                          : "border-ptc-base02 text-ptc-base0/20 cursor-not-allowed"
                      }`}
                      title="Promote to Order"
                      onClick={() => { promoteQuoteToOrder(); setView("orders"); }}>
                      → Order
                    </button>
                    <button
                      class={`px-3 py-2.5 border text-xs uppercase tracking-widest font-bold transition-colors ${
                        quoteItems().length > 0
                          ? "border-ptc-base0/30 hover:border-ptc-base0/60 cursor-pointer"
                          : "border-ptc-base02 text-ptc-base0/20 cursor-not-allowed"
                      }`}
                      title="Save to history"
                      onClick={saveQuoteToHistory}>
                      💾
                    </button>
                    <button
                      class="px-3 py-2.5 border border-ptc-base02 text-xs uppercase tracking-widest hover:border-ptc-base0/40 cursor-pointer"
                      title="Quote history"
                      onClick={() => setShowHistory(h => !h)}>
                      ☰
                    </button>
                  </div>
                  {/* Quote history drawer */}
                  <Show when={showHistory()}>
                    <div class="border-t border-ptc-base02 mt-2 pt-2 flex flex-col gap-1 max-h-52 overflow-y-auto">
                      <div class="text-xs uppercase tracking-widest text-ptc-base0/30 mb-1">Saved Quotes ({quoteHistory().length})</div>
                      <Show when={quoteHistory().length === 0}>
                        <div class="text-xs text-ptc-base0/20 italic">No saved quotes yet.</div>
                      </Show>
                      <For each={quoteHistory()}>
                        {(q) => (
                          <div class="flex items-center gap-2 border border-ptc-base02 px-2 py-1.5 hover:bg-ptc-base02/40 cursor-pointer"
                            onClick={() => loadQuoteFromHistory(q)}>
                            <div class="flex-1 min-w-0">
                              <div class="text-xs font-bold truncate">{q.customer}</div>
                              <div class="text-xs text-ptc-base0/30">{q.date} · {q.items.length} items</div>
                            </div>
                            <div class="text-xs text-ptc-green tabular-nums shrink-0">{currency(q.total)}</div>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
              </div>
            </div>
          </Show>

          {/* ════════════════════════════════════════════════════
              PO CONSOLE
          ════════════════════════════════════════════════════ */}
          <Show when={view() === "po"}>
            <div class="flex-1 flex overflow-hidden">

              <div class="flex-1 flex flex-col overflow-hidden border-r border-ptc-base02">
                <div class="p-3 border-b border-ptc-base02 shrink-0">
                  <input type="text" class="w-full bg-ptc-base02 border border-ptc-base0/20 px-4 py-2.5 font-mono text-sm placeholder:text-ptc-base0/25 focus:outline-none focus:border-ptc-yellow/40"
                    placeholder="Search parts to add to purchase order..." value={poQuery()} onInput={e => setPoQuery(e.target.value)} />
                </div>
                <div class="flex-1 overflow-y-auto">
                  <table class="w-full text-xs">
                    <thead class="sticky top-0 bg-ptc-base02 z-10">
                      <tr>
                        {[["Part","text-left"],["HSN · Classification","text-left"],["Last Cost","text-right"],["Est. Stock","text-right"],["Top Supplier","text-left"],["",""]].map(([h, cls]) => (
                          <th class={`px-4 py-3 font-bold uppercase tracking-widest text-xs ${cls}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <For each={searchCatalog(poQuery(), catalog())}>
                        {(sku) => (
                          <tr class="border-b border-ptc-base02/50 hover:bg-ptc-base02/40">
                            <td class="px-4 py-3 font-bold max-w-[180px] truncate" title={sku.name}>{sku.name}</td>
                            <td class="px-4 py-2">
                              <div class="tabular-nums text-ptc-yellow font-bold text-xs">{sku.hsn || "—"}</div>
                              <div class="text-xs text-ptc-base0/30 truncate max-w-[180px]">{sku.hsn_desc || "—"}</div>
                            </td>
                            <td class="px-4 py-3 tabular-nums text-right text-ptc-red">{currencyD(sku.avg_cost)}</td>
                            <td class={`px-4 py-3 tabular-nums text-right font-bold ${sku.net_stock_qty > 0 ? "text-ptc-yellow" : "text-ptc-base0/25"}`}>
                              {num(sku.net_stock_qty)}
                            </td>
                            <td class="px-4 py-2 text-ptc-base0/40 text-xs truncate max-w-[140px]">
                              {sku.top_suppliers?.[0]?.n?.split(" ").slice(0, 3).join(" ") || "—"}
                            </td>
                            <td class="px-4 py-2">
                              <button class="text-xs px-2 py-1 border border-ptc-base0/20 hover:bg-ptc-red/20 hover:border-ptc-red/40 uppercase tracking-widest"
                                onClick={() => addToPO(sku)}>+ PO</button>
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PO draft panel */}
              <div class="w-[480px] flex flex-col shrink-0">
                <div class="px-4 py-2 border-b border-ptc-base02 text-sm uppercase tracking-widest font-bold text-ptc-base0/60 shrink-0">
                  PO Draft — {poItems().length} Line Items
                </div>
                <div class="flex-1 overflow-y-auto">
                  <Show when={poItems().length > 0} fallback={
                    <div class="text-center text-ptc-base0/20 italic mt-10 text-xs">Add parts from the catalog to begin drafting your PO.</div>
                  }>
                    <table class="w-full text-xs">
                      <thead class="sticky top-0 bg-ptc-base02 z-10">
                        <tr>
                          {["Item","HSN ↗","Qty",`Unit Cost (${poCurrency()})`,`Total (${poCurrency()})`, ""].map((h, i) => (
                            <th class={`px-3 py-2 font-bold uppercase tracking-widest text-xs ${i >= 2 ? "text-right" : "text-left"}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <For each={poItems()}>
                          {(item) => (
                            <tr class="border-b border-ptc-base02/50">
                              <td class="px-3 py-2.5">
                                {item.part_no && <div class="text-ptc-yellow font-bold text-base tabular-nums leading-tight">{item.part_no}</div>}
                                <div class="font-bold truncate max-w-[130px] text-sm" title={item.name}>{item.name}</div>
                                {item.top_suppliers?.[0] && <div class="text-xs text-ptc-base0/30 truncate">{item.top_suppliers[0].n.split(" ").slice(0, 2).join(" ")}</div>}
                              </td>
                              <td class="px-3 py-2">
                                <div class="tabular-nums text-ptc-yellow font-bold">{item.hsn || "—"}</div>
                                <div class="text-xs text-ptc-base0/25 truncate max-w-[80px]">{item.hsn_desc?.split(" ").slice(0, 2).join(" ") || ""}</div>
                              </td>
                              <td class="px-3 py-2 text-right">
                                <input type="number" min="1" class="w-12 bg-ptc-base02 border border-ptc-base0/20 px-1 py-0.5 text-center tabular-nums font-bold focus:outline-none"
                                  value={item.qty} onInput={e => setPoItems(prev => prev.map(i => i.id === item.id ? { ...i, qty: +e.target.value || 1 } : i))} />
                              </td>
                              <td class="px-3 py-2 text-right">
                                <input type="number" class="w-20 bg-ptc-base02 border border-ptc-base0/20 px-1 py-0.5 text-right tabular-nums font-bold focus:outline-none"
                                  value={fromINR(item.unitCost).toFixed(2)}
                                  onInput={e => setPoItems(prev => prev.map(i => i.id === item.id ? { ...i, unitCost: toINR(+e.target.value) } : i))} />
                              </td>
                              <td class="px-3 py-2 text-right tabular-nums font-bold text-ptc-red">
                                {ccySymbol()}{fromINR(item.qty * item.unitCost).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                              </td>
                              <td class="px-2 py-2">
                                <button class="text-ptc-base0/25 hover:text-ptc-red" onClick={() => setPoItems(prev => prev.filter(i => i.id !== item.id))}>×</button>
                              </td>
                            </tr>
                          )}
                        </For>
                      </tbody>
                    </table>
                  </Show>
                </div>
                <div class="border-t-2 border-ptc-base02 p-4 flex flex-col gap-2 shrink-0">
                  <input type="text"
                    class="w-full bg-ptc-base03 border border-ptc-base0/15 px-3 py-1.5 font-mono text-sm placeholder:text-ptc-base0/20 focus:outline-none focus:border-ptc-red/40"
                    placeholder="Supplier / Vendor name..."
                    value={poSupplier()} onInput={e => setPoSupplier(e.target.value)} />
                  {/* Currency selector */}
                  <div class="flex gap-1.5 items-center">
                    <span class="text-xs uppercase tracking-widest text-ptc-base0/30">Currency</span>
                    <For each={["INR","USD","EUR"]}>
                      {(ccy) => (
                        <button onClick={() => setPoCurrency(ccy)}
                          class={`px-2 py-0.5 text-xs font-bold border uppercase tracking-widest transition-colors ${poCurrency() === ccy ? "bg-ptc-base0 text-ptc-base03 border-ptc-base0" : "border-ptc-base02 text-ptc-base0/40 hover:border-ptc-base0/40"}`}>
                          {ccy}
                        </button>
                      )}
                    </For>
                    <Show when={poCurrency() !== "INR"}>
                      <span class="text-xs text-ptc-base0/30 ml-1">1 {poCurrency()} =</span>
                      <input type="number"
                        class="w-16 bg-ptc-base03 border border-ptc-base0/20 px-2 py-0.5 text-xs tabular-nums text-right font-mono outline-none focus:border-ptc-yellow/40"
                        value={fxRates()[poCurrency()] || ""}
                        onInput={e => saveFxRate(poCurrency(), e.target.value)} />
                      <span class="text-xs text-ptc-base0/30">INR</span>
                    </Show>
                  </div>
                  <div class="flex justify-between text-xl font-bold mt-1">
                    <span class="text-xs uppercase tracking-widest self-center text-ptc-base0/50">PO Total</span>
                    <div class="text-right">
                      <span class="tabular-nums text-ptc-red">{currency(poTotals())}</span>
                      <Show when={poCurrency() !== "INR"}>
                        <div class="text-sm text-ptc-base0/40 tabular-nums">
                          {ccySymbol()}{fromINR(poTotals()).toLocaleString("en-IN", { maximumFractionDigits: 2 })} {poCurrency()}
                        </div>
                      </Show>
                    </div>
                  </div>
                  <div class="flex gap-1.5">
                    <button
                      class={`flex-1 font-bold py-2.5 uppercase tracking-widest text-xs transition-colors ${
                        poItems().length > 0
                          ? "bg-ptc-base0 text-ptc-base03 hover:bg-ptc-yellow cursor-pointer"
                          : "bg-ptc-base02 text-ptc-base0/20 cursor-not-allowed"
                      }`}
                      onClick={() => generatePO("pdf")}>↗ Print PO</button>
                    <button
                      class={`px-3 py-2.5 border text-xs uppercase tracking-widest font-bold transition-colors ${
                        poItems().length > 0
                          ? "border-ptc-base0/30 hover:border-ptc-green/50 hover:text-ptc-green cursor-pointer"
                          : "border-ptc-base02 text-ptc-base0/20 cursor-not-allowed"
                      }`}
                      title="Export as CSV"
                      onClick={() => generatePO("csv")}>CSV</button>
                  </div>
                  <button class="border border-ptc-base02 text-ptc-base0/30 py-1.5 uppercase tracking-widest text-xs hover:border-ptc-base0/20"
                    onClick={() => setPoItems([])}>Clear PO</button>
                </div>
              </div>
            </div>
          </Show>

          {/* ════════════════════════════════════════════════════
              ALERTS — Stock · Reorder Risk · Loss-Making
          ════════════════════════════════════════════════════ */}
          <Show when={view() === "alerts"}>
            <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-4">

              {/* Negative Stock */}
              <div class="border border-ptc-red/40 flex flex-col overflow-hidden" style="max-height:36vh">
                <div class="px-4 py-2.5 border-b border-ptc-red/20 bg-ptc-red/5 shrink-0 flex items-center gap-3">
                  <span class="text-sm font-bold uppercase tracking-widest text-ptc-red">⚠ Negative Stock</span>
                  <span class="text-xs text-ptc-base0/40">{negativeStockSkus().length} SKUs — sold beyond purchase records</span>
                </div>
                <div class="overflow-y-auto">
                  <table class="w-full text-sm">
                    <thead class="sticky top-0 bg-ptc-base02 z-10">
                      <tr>
                        {[["Part No.","text-left"],["Description","text-left"],["Net Stock","text-right"],["Sold","text-right"],["Bought","text-right"],["Top Supplier","text-left"]].map(([h,c]) => (
                          <th class={`px-4 py-2.5 text-sm font-bold uppercase tracking-widest ${c}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <For each={negativeStockSkus()}>
                        {(sku) => (
                          <tr class="border-b border-ptc-base02/50 hover:bg-ptc-base02/40 cursor-pointer"
                            onClick={() => { setSelectedSku(sku); setView("hub"); }}>
                            <td class="px-4 py-2 text-ptc-yellow font-bold tabular-nums">{sku.part_no || "—"}</td>
                            <td class="px-4 py-3 font-bold max-w-[220px] truncate" title={sku.name}>{sku.name}</td>
                            <td class="px-4 py-2 text-right tabular-nums text-ptc-red font-bold">{num(sku.net_stock_qty)}</td>
                            <td class="px-4 py-2 text-right tabular-nums">{num(sku.sold_count)}</td>
                            <td class="px-4 py-2 text-right tabular-nums">{num(sku.bought_count)}</td>
                            <td class="px-4 py-2 text-xs text-ptc-base0/40 truncate max-w-[160px]" title={sku.top_suppliers?.[0]?.n}>
                              {sku.top_suppliers?.[0]?.n?.split(" ").slice(0,3).join(" ") || "—"}
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reorder Risk */}
              <div class="border border-ptc-yellow/40 flex flex-col overflow-hidden" style="max-height:36vh">
                <div class="px-4 py-2.5 border-b border-ptc-yellow/20 bg-ptc-yellow/5 shrink-0 flex items-center gap-3">
                  <span class="text-sm font-bold uppercase tracking-widest text-ptc-yellow">⚑ Reorder Risk</span>
                  <span class="text-xs text-ptc-base0/40">{reorderRiskSkus().length} active SKUs — no purchase in 90+ days</span>
                </div>
                <div class="overflow-y-auto">
                  <table class="w-full text-sm">
                    <thead class="sticky top-0 bg-ptc-base02 z-10">
                      <tr>
                        {[["Part No.","text-left"],["Description","text-left"],["Last Bought","text-left"],["Sold","text-right"],["Stock","text-right"],["Top Supplier","text-left"],["",""]].map(([h,c]) => (
                          <th class={`px-4 py-2.5 text-sm font-bold uppercase tracking-widest ${c}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <For each={reorderRiskSkus()}>
                        {(sku) => (
                          <tr class="border-b border-ptc-base02/50 hover:bg-ptc-base02/40 cursor-pointer"
                            onClick={() => { setSelectedSku(sku); setView("hub"); }}>
                            <td class="px-4 py-2 text-ptc-yellow font-bold tabular-nums">{sku.part_no || "—"}</td>
                            <td class="px-4 py-3 font-bold max-w-[220px] truncate" title={sku.name}>{sku.name}</td>
                            <td class="px-4 py-3 tabular-nums text-ptc-orange">
                              {sku.last_bought?.substring(0,7) || <span class="text-ptc-red font-bold">Never</span>}
                            </td>
                            <td class="px-4 py-2 text-right tabular-nums">{num(sku.sold_count)}</td>
                            <td class={`px-4 py-2 text-right tabular-nums font-bold ${sku.net_stock_qty > 0 ? "text-ptc-yellow" : "text-ptc-red"}`}>
                              {num(sku.net_stock_qty)}
                            </td>
                            <td class="px-4 py-2 text-xs text-ptc-base0/40 truncate max-w-[160px]" title={sku.top_suppliers?.[0]?.n}>
                              {sku.top_suppliers?.[0]?.n?.split(" ").slice(0,3).join(" ") || "—"}
                            </td>
                            <td class="px-4 py-2">
                              <button class="text-xs px-2 py-1 border border-ptc-base0/20 hover:bg-ptc-red/20 hover:border-ptc-red/40 uppercase tracking-widest whitespace-nowrap"
                                onClick={e => { e.stopPropagation(); addToPO(sku); setView("po"); }}>+ PO</button>
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dead Stock */}
              <div class="border border-ptc-base0/20 flex flex-col overflow-hidden" style="max-height:36vh">
                <div class="px-4 py-2.5 border-b border-ptc-base0/10 bg-ptc-base02/50 shrink-0 flex items-center gap-3">
                  <span class="text-sm font-bold uppercase tracking-widest">⬛ Dead Stock</span>
                  <span class="text-xs text-ptc-base0/40">{deadStockSkus().length} SKUs — in stock but not sold in 6+ months</span>
                  <span class="ml-auto text-xs text-ptc-base0/40 tabular-nums">
                    Capital tied up: {currency(deadStockSkus().reduce((a, s) => a + s.capital_tied, 0))}
                  </span>
                </div>
                <div class="overflow-y-auto">
                  <table class="w-full text-sm">
                    <thead class="sticky top-0 bg-ptc-base02 z-10">
                      <tr>
                        {[["Part No.","text-left"],["Description","text-left"],["Last Sold","text-left"],["Stock","text-right"],["Avg Cost","text-right"],["Capital Tied","text-right"],["",""]].map(([h,c]) => (
                          <th class={`px-4 py-2.5 text-sm font-bold uppercase tracking-widest ${c}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <For each={deadStockSkus()}>
                        {(sku) => (
                          <tr class="border-b border-ptc-base02/50 hover:bg-ptc-base02/40 cursor-pointer"
                            onClick={() => { setSelectedSku(sku); setView("hub"); }}>
                            <td class="px-4 py-2 text-ptc-yellow font-bold tabular-nums">{sku.part_no || "—"}</td>
                            <td class="px-4 py-3 font-bold max-w-[220px] truncate" title={sku.name}>{sku.name}</td>
                            <td class="px-4 py-3 tabular-nums text-ptc-base0/40">
                              {sku.last_sold ? sku.last_sold.substring(0,7) : <span class="text-ptc-red">Never sold</span>}
                            </td>
                            <td class="px-4 py-2 text-right tabular-nums text-ptc-yellow font-bold">{num(sku.net_stock_qty)}</td>
                            <td class="px-4 py-2 text-right tabular-nums text-ptc-base0/50">{currencyD(sku.avg_cost)}</td>
                            <td class="px-4 py-2 text-right tabular-nums font-bold text-ptc-red">{currency(sku.capital_tied)}</td>
                            <td class="px-4 py-2">
                              <button class="text-xs px-2 py-1 border border-ptc-base0/20 hover:bg-ptc-yellow/10 hover:border-ptc-yellow/40 uppercase tracking-widest"
                                onClick={e => { e.stopPropagation(); addToQuote(sku); setView("quote"); }}>Quote</button>
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Margin Erosion */}
              <div class="border border-ptc-yellow/30 flex flex-col overflow-hidden" style="max-height:36vh">
                <div class="px-4 py-2.5 border-b border-ptc-yellow/20 bg-ptc-yellow/5 shrink-0 flex items-center gap-3">
                  <span class="text-sm font-bold uppercase tracking-widest text-ptc-yellow">↘ Margin Erosion</span>
                  <span class="text-xs text-ptc-base0/40">{marginErosionSkus().length} SKUs — sell price falling, will become loss-making</span>
                </div>
                <div class="overflow-y-auto">
                  <table class="w-full text-sm">
                    <thead class="sticky top-0 bg-ptc-base02 z-10">
                      <tr>
                        {[["Part No.","text-left"],["Description","text-left"],["Trend","text-right"],["Margin Now","text-right"],["Months to Loss","text-right"],["Avg Cost","text-right"],["Avg Sell","text-right"]].map(([h,c]) => (
                          <th class={`px-4 py-2.5 text-sm font-bold uppercase tracking-widest ${c}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <For each={marginErosionSkus()}>
                        {(sku) => (
                          <tr class="border-b border-ptc-base02/50 hover:bg-ptc-base02/40 cursor-pointer"
                            onClick={() => { setSelectedSku(sku); setView("hub"); }}>
                            <td class="px-4 py-2 text-ptc-yellow font-bold tabular-nums">{sku.part_no || "—"}</td>
                            <td class="px-4 py-3 font-bold max-w-[220px] truncate" title={sku.name}>{sku.name}</td>
                            <td class="px-4 py-2 text-right tabular-nums text-ptc-red font-bold">
                              ↓ {currencyD(Math.abs(sku.trendSlope))}/mo
                            </td>
                            <td class={`px-4 py-2 text-right tabular-nums font-bold ${sku.marginNow < 10 ? "text-ptc-orange" : "text-ptc-base0/60"}`}>
                              {sku.marginNow.toFixed(1)}%
                            </td>
                            <td class={`px-4 py-2 text-right tabular-nums font-bold ${sku.monthsToLoss != null && sku.monthsToLoss < 6 ? "text-ptc-red" : "text-ptc-base0/40"}`}>
                              {sku.monthsToLoss != null ? `~${sku.monthsToLoss.toFixed(0)} mo` : "—"}
                            </td>
                            <td class="px-4 py-2 text-right tabular-nums text-ptc-red">{currencyD(sku.avg_cost)}</td>
                            <td class="px-4 py-2 text-right tabular-nums text-ptc-green">{currencyD(sku.avg_sell)}</td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Loss-Making SKUs */}
              <div class="border border-ptc-orange/40 flex flex-col overflow-hidden" style="max-height:36vh">
                <div class="px-4 py-2.5 border-b border-ptc-orange/20 bg-ptc-orange/5 shrink-0 flex items-center gap-3">
                  <span class="text-sm font-bold uppercase tracking-widest text-ptc-orange">↓ Loss-Making SKUs</span>
                  <span class="text-xs text-ptc-base0/40">{lossMakingSkus().length} SKUs with negative realized margin</span>
                </div>
                <div class="overflow-y-auto">
                  <table class="w-full text-sm">
                    <thead class="sticky top-0 bg-ptc-base02 z-10">
                      <tr>
                        {[["Part No.","text-left"],["Description","text-left"],["Mgn %","text-right"],["Total Loss","text-right"],["Avg Cost","text-right"],["Avg Sell","text-right"],["Top Buyer","text-left"]].map(([h,c]) => (
                          <th class={`px-4 py-2.5 text-sm font-bold uppercase tracking-widest ${c}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <For each={lossMakingSkus()}>
                        {(sku) => (
                          <tr class="border-b border-ptc-base02/50 hover:bg-ptc-base02/40 cursor-pointer"
                            onClick={() => { setSelectedSku(sku); setView("hub"); }}>
                            <td class="px-4 py-2 text-ptc-yellow font-bold tabular-nums">{sku.part_no || "—"}</td>
                            <td class="px-4 py-3 font-bold max-w-[220px] truncate" title={sku.name}>{sku.name}</td>
                            <td class="px-4 py-2 text-right tabular-nums text-ptc-red font-bold">{pct(sku.realized_margin_pct)}</td>
                            <td class="px-4 py-2 text-right tabular-nums text-ptc-red font-bold">{currency(sku.realized_margin)}</td>
                            <td class="px-4 py-2 text-right tabular-nums">{currencyD(sku.avg_cost)}</td>
                            <td class="px-4 py-2 text-right tabular-nums">{currencyD(sku.avg_sell)}</td>
                            <td class="px-4 py-2 text-xs text-ptc-base0/40 truncate max-w-[160px]" title={sku.top_clients?.[0]?.n}>
                              {sku.top_clients?.[0]?.n?.split(" ").slice(0,3).join(" ") || "—"}
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </Show>

          {/* ════════════════════════════════════════════════════
              NETWORK — Clients & Suppliers
          ════════════════════════════════════════════════════ */}
          <Show when={view() === "network"}>
            <div class="flex-1 flex overflow-hidden">

              {/* Left: search + list */}
              <div class="w-80 flex flex-col border-r border-ptc-base02 shrink-0 overflow-hidden">
                <div class="flex border-b border-ptc-base02 shrink-0">
                  <button onClick={() => { setNetworkTab("clients"); setSelectedProfile(null); setNetworkQuery(""); }}
                    class={`flex-1 py-2.5 text-xs uppercase tracking-widest font-bold border-r border-ptc-base02 transition-colors ${networkTab() === "clients" ? "bg-ptc-base0 text-ptc-base03" : "hover:bg-ptc-base02/50"}`}>
                    Clients ({data()?.clients?.length || 0})
                  </button>
                  <button onClick={() => { setNetworkTab("suppliers"); setSelectedProfile(null); setNetworkQuery(""); }}
                    class={`flex-1 py-2.5 text-xs uppercase tracking-widest font-bold transition-colors ${networkTab() === "suppliers" ? "bg-ptc-base0 text-ptc-base03" : "hover:bg-ptc-base02/50"}`}>
                    Suppliers ({data()?.suppliers?.length || 0})
                  </button>
                </div>
                <div class="p-2 border-b border-ptc-base02 shrink-0">
                  <input type="text" class="w-full bg-ptc-base03 border border-ptc-base0/20 px-3 py-2 text-xs font-mono outline-none focus:border-ptc-yellow/40 placeholder:text-ptc-base0/20"
                    placeholder="Search by name..." value={networkQuery()} onInput={e => setNetworkQuery(e.target.value)} />
                </div>
                <div class="flex-1 overflow-y-auto">
                  <For each={filteredNetwork()}>
                    {(p) => (
                      <div class={`px-4 py-3 border-b border-ptc-base02/50 cursor-pointer hover:bg-ptc-base02/40 ${selectedProfile()?.name === p.name ? "bg-ptc-base02" : ""}`}
                        onClick={() => setSelectedProfile(p)}>
                        <div class="font-bold text-sm truncate" title={p.name}>{p.name}</div>
                        <div class="flex justify-between mt-0.5">
                          <span class={`text-xs tabular-nums font-bold ${networkTab() === "clients" ? "text-ptc-green" : "text-ptc-red"}`}>
                            {currency(p.total)}
                          </span>
                          <span class="text-xs text-ptc-base0/30">{p.invoice_count} invoices</span>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              {/* Right: profile detail */}
              <div class="flex-1 flex flex-col overflow-hidden">
                <Show when={selectedProfile()} fallback={
                  <div class="flex-1 flex items-center justify-center text-ptc-base0/20 text-xs uppercase tracking-widest">
                    Select a {networkTab() === "clients" ? "client" : "supplier"} to view profile
                  </div>
                }>
                  {(p) => {
                    const maxV = () => Math.max(...(p().monthly || []).map(r => r.v), 1);
                    return (
                      <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

                        <div>
                          <div class="text-2xl font-bold leading-snug">{p().name}</div>
                          <div class="flex gap-4 mt-1.5 text-xs text-ptc-base0/40 uppercase tracking-widest">
                            <span>Last: {p().last_date?.substring(0,7) || "—"}</span>
                            <span>{p().invoice_count} invoices</span>
                          </div>
                        </div>

                        <div class="grid grid-cols-3 gap-3">
                          <For each={[
                            { label: networkTab() === "clients" ? "Total Revenue" : "Total Spend", val: currency(p().total), cls: networkTab() === "clients" ? "text-ptc-green" : "text-ptc-red" },
                            { label: "Invoices",        val: num(p().invoice_count), cls: "" },
                            { label: "Avg Order Value", val: currency(p().total / Math.max(p().invoice_count, 1)), cls: "" },
                            ...(() => {
                              if (networkTab() !== "clients") return [];
                              const ca = clientActivity().find(c => c.name === p().name);
                              if (!ca) return [];
                              const grade = ca.rfm >= 10 ? "A" : ca.rfm >= 7 ? "B" : ca.rfm >= 5 ? "C" : "D";
                              const gradeColor = grade === "A" ? "text-ptc-green" : grade === "B" ? "text-ptc-yellow" : grade === "C" ? "text-ptc-orange" : "text-ptc-red";
                              return [
                                { label: "RFM Score", val: `${ca.rfm}/12 (${grade})`, cls: gradeColor },
                                { label: "Last Order", val: ca.last_date?.substring(0,7) || "—", cls: ca.daysSince > 90 ? "text-ptc-red" : "text-ptc-base0" },
                                { label: "Days Since Order", val: ca.daysSince < 9999 ? `${ca.daysSince}d ago` : "—", cls: ca.daysSince > 90 ? "text-ptc-red" : "text-ptc-green" },
                              ];
                            })(),
                          ]}>
                            {(k) => (
                              <div class="border border-ptc-base02 p-4">
                                <div class="text-xs uppercase tracking-widest text-ptc-base0/40">{k.label}</div>
                                <div class={`text-2xl font-bold tabular-nums mt-1 ${k.cls}`}>{k.val}</div>
                              </div>
                            )}
                          </For>
                        </div>

                        <div>
                          <div class="text-xs uppercase tracking-widest text-ptc-base0/40 mb-3">
                            Top Parts {networkTab() === "clients" ? "Purchased" : "Supplied"}
                          </div>
                          <table class="w-full">
                            <thead>
                              <tr class="border-b border-ptc-base02">
                                {[["Part No.","text-left"],["Description","text-left"],["Qty","text-right"]].map(([h,c]) => (
                                  <th class={`pb-2 text-xs font-bold uppercase tracking-widest text-ptc-base0/40 ${c}`}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <For each={p().top_parts}>
                                {(part) => (
                                  <tr class="border-b border-ptc-base02/40 hover:bg-ptc-base02/30 cursor-pointer"
                                    onClick={() => { const sku = catalog().find(c => c.id === part.id); if (sku) { setSelectedSku(sku); setView("hub"); } }}>
                                    <td class="py-2.5 pr-4 tabular-nums text-ptc-yellow font-bold text-sm">{part.part_no || "—"}</td>
                                    <td class="py-2.5 pr-4 text-sm">{part.name}</td>
                                    <td class="py-2.5 text-right tabular-nums font-bold text-sm">{num(part.qty)}</td>
                                  </tr>
                                )}
                              </For>
                            </tbody>
                          </table>
                        </div>

                        <div>
                          <div class="text-xs uppercase tracking-widest text-ptc-base0/40 mb-3">Monthly Activity</div>
                          <div class="flex items-end gap-px h-24 border-b border-ptc-base02/40 pb-0">
                            <For each={p().monthly}>
                              {(row) => {
                                const h = Math.round((row.v / maxV()) * 100);
                                return (
                                  <div class="flex-1 flex flex-col justify-end" style="min-width:0" title={`${row.m}: ${currency(row.v)}`}>
                                    <div class={`w-full transition-all ${networkTab() === "clients" ? "bg-ptc-green/70" : "bg-ptc-red/70"}`} style={{ height: `${h}%` }} />
                                  </div>
                                );
                              }}
                            </For>
                          </div>
                          <div class="flex justify-between mt-1 text-xs text-ptc-base0/25">
                            <span>{p().monthly?.[0]?.m}</span>
                            <span>{p().monthly?.[p().monthly.length - 1]?.m}</span>
                          </div>
                        </div>

                      </div>
                    );
                  }}
                </Show>
              </div>
            </div>
          </Show>

          {/* ════════════════════════════════════════════════════
              ORDERS — pipeline tracker
          ════════════════════════════════════════════════════ */}
          <Show when={view() === "orders"}>
            <div class="flex-1 flex overflow-hidden">

              {/* Order list */}
              <div class="flex-1 flex flex-col overflow-hidden border-r border-ptc-base02">
                <div class="px-4 py-3 border-b border-ptc-base02 shrink-0 flex items-center gap-3">
                  <span class="text-sm font-bold uppercase tracking-widest text-ptc-base0/60">Orders</span>
                  <div class="flex gap-1.5 ml-auto flex-wrap">
                    <For each={["all", ...STATUSES]}>
                      {(s) => (
                        <button onClick={() => setOrderFilter(s)}
                          class={`px-2.5 py-1 text-xs uppercase tracking-widest border font-bold transition-colors ${orderFilter() === s ? "bg-ptc-base0 text-ptc-base03 border-ptc-base0" : "border-ptc-base02 text-ptc-base0/40 hover:border-ptc-base0/40"}`}>
                          {s}
                        </button>
                      )}
                    </For>
                  </div>
                </div>
                <div class="flex-1 overflow-y-auto">
                  <Show when={orders().length === 0}>
                    <div class="flex flex-col items-center justify-center h-40 text-ptc-base0/20 text-sm uppercase tracking-widest gap-2">
                      <span>No orders yet</span>
                      <span class="text-xs">Build a quote and click → Order</span>
                    </div>
                  </Show>
                  <For each={orders().filter(o => orderFilter() === "all" || o.status === orderFilter())}>
                    {(o) => (
                      <div class={`border-b border-ptc-base02/60 px-4 py-3 hover:bg-ptc-base02/40 cursor-pointer ${selectedOrder()?.id === o.id ? "bg-ptc-base02" : ""}`}
                        onClick={() => setSelectedOrder(o)}>
                        <div class="flex items-start justify-between gap-4">
                          <div class="flex-1 min-w-0">
                            <div class="font-bold text-base truncate">{o.customer}</div>
                            <div class="text-sm text-ptc-base0/40 mt-0.5">{o.id} · {o.date} · {o.items?.length} items</div>
                            {o.transport && <div class="text-xs text-ptc-base0/30 mt-0.5">via {o.transport}</div>}
                            {o.delivery_date && <div class="text-xs text-ptc-yellow mt-0.5">Deliver by {o.delivery_date}</div>}
                          </div>
                          <div class="text-right shrink-0">
                            <div class={`text-xs font-bold uppercase tracking-widest border px-2 py-0.5 ${STATUS_COLOR[o.status]} border-current/30`}>{o.status}</div>
                            <div class="text-base font-bold tabular-nums text-ptc-green mt-1">{currency(o.total)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              {/* Order detail panel */}
              <div class={`flex flex-col border-l border-ptc-base02 transition-all duration-150 overflow-hidden ${selectedOrder() ? "w-[460px]" : "w-0"}`}>
                <Show when={selectedOrder()}>
                  {(o) => {
                    const ord = () => orders().find(x => x.id === o().id) || o();
                    return (
                      <div class="flex flex-col h-full overflow-hidden">
                        <div class="px-4 py-3 border-b border-ptc-base02 flex items-center justify-between shrink-0">
                          <span class="font-bold text-sm uppercase tracking-widest">{ord().id}</span>
                          <button class="text-ptc-base0/30 hover:text-ptc-red text-xl" onClick={() => setSelectedOrder(null)}>×</button>
                        </div>
                        <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                          <div>
                            <div class="text-base font-bold">{ord().customer}</div>
                            <div class="text-sm text-ptc-base0/40">{ord().date}</div>
                          </div>

                          {/* Status selector */}
                          <div>
                            <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-2">Status</div>
                            <div class="flex flex-wrap gap-1.5">
                              <For each={STATUSES}>
                                {(s) => (
                                  <button onClick={() => updateOrder(ord().id, { status: s })}
                                    class={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest border transition-colors ${ord().status === s ? "bg-ptc-base0 text-ptc-base03 border-ptc-base0" : "border-ptc-base02 text-ptc-base0/40 hover:border-ptc-base0/50"}`}>
                                    {s}
                                  </button>
                                )}
                              </For>
                            </div>
                          </div>

                          {/* Delivery date + transport */}
                          <div class="grid grid-cols-2 gap-3">
                            <div>
                              <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-1">Delivery Date</div>
                              <input type="date" class="w-full bg-ptc-base03 border border-ptc-base0/20 px-3 py-1.5 text-sm font-mono outline-none focus:border-ptc-yellow/40"
                                value={ord().delivery_date || ""}
                                onInput={e => updateOrder(ord().id, { delivery_date: e.target.value })} />
                            </div>
                            <div>
                              <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-1">Transport / Carrier</div>
                              <input type="text" class="w-full bg-ptc-base03 border border-ptc-base0/20 px-3 py-1.5 text-sm font-mono outline-none focus:border-ptc-yellow/40"
                                placeholder={transportLog()[ord().customer] || "e.g. BlueDart"}
                                value={ord().transport || ""}
                                onInput={e => {
                                  updateOrder(ord().id, { transport: e.target.value });
                                  if (e.target.value.trim()) setTransport(ord().customer, e.target.value.trim());
                                }} />
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-1">Notes</div>
                            <textarea class="w-full bg-ptc-base03 border border-ptc-base0/20 px-3 py-1.5 text-sm font-mono outline-none resize-none focus:border-ptc-yellow/40 h-16"
                              placeholder="Internal notes..."
                              value={ord().notes || ""}
                              onInput={e => updateOrder(ord().id, { notes: e.target.value })} />
                          </div>

                          {/* Line items */}
                          <div>
                            <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-2">Items ({ord().items?.length})</div>
                            <div class="border border-ptc-base02 overflow-hidden">
                              <For each={ord().items}>
                                {(item) => (
                                  <div class="flex items-center gap-3 px-3 py-2.5 border-b border-ptc-base02/50">
                                    <div class="flex-1 min-w-0">
                                      {item.part_no && <div class="text-ptc-yellow font-bold text-sm tabular-nums">{item.part_no}</div>}
                                      <div class="text-sm font-bold truncate">{item.name}</div>
                                    </div>
                                    <div class="text-right shrink-0 text-sm">
                                      <div class="tabular-nums">{item.qty} × {currencyD(item.quotedPrice)}</div>
                                      <div class="text-ptc-green font-bold tabular-nums">{currencyD(item.qty * item.quotedPrice)}</div>
                                    </div>
                                  </div>
                                )}
                              </For>
                              <div class="px-3 py-2.5 flex justify-between font-bold text-base bg-ptc-base02/40">
                                <span>Total</span>
                                <span class="text-ptc-green tabular-nums">{currency(ord().total)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div class="flex gap-2 pt-2 border-t border-ptc-base02">
                            <button class="flex-1 border border-ptc-yellow/40 text-ptc-yellow py-2 text-xs uppercase tracking-widest font-bold hover:bg-ptc-yellow hover:text-ptc-base03"
                              onClick={() => { setQuoteCustomer(ord().customer); setQuoteItems(ord().items); saveQuote(ord().items); setView("quote"); }}>
                              ← Edit in Quote
                            </button>
                            <button class="border border-ptc-red/30 text-ptc-red py-2 px-3 text-xs uppercase tracking-widest hover:bg-ptc-red/10"
                              onClick={() => deleteOrder(ord().id)}>Delete</button>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Show>
              </div>
            </div>
          </Show>

          {/* ════════════════════════════════════════════════════
              INVENTORY — stock, warehouse, HSN, custom products
          ════════════════════════════════════════════════════ */}
          <Show when={view() === "inventory"}>
            <div class="flex-1 flex flex-col overflow-hidden">
              <div class="px-4 py-3 border-b border-ptc-base02 shrink-0 flex items-center gap-3">
                <input type="text" class="flex-1 bg-ptc-base02 border border-ptc-base0/20 px-4 py-2 font-mono text-sm placeholder:text-ptc-base0/25 focus:outline-none focus:border-ptc-yellow/40"
                  placeholder="Search parts to adjust stock, warehouse, HSN..."
                  value={invQuery()} onInput={e => setInvQuery(e.target.value)} />
                <button class="px-4 py-2 border border-ptc-green/50 text-ptc-green text-sm font-bold uppercase tracking-widest hover:bg-ptc-green/10"
                  onClick={() => setShowAddProduct(p => !p)}>+ Add Product</button>
              </div>

              {/* Add custom product form */}
              <Show when={showAddProduct()}>
                <div class="border-b border-ptc-base02 bg-ptc-base02/40 p-4 shrink-0">
                  <div class="text-sm font-bold uppercase tracking-widest text-ptc-base0/60 mb-3">New Custom Product</div>
                  <div class="grid grid-cols-3 gap-3 mb-3">
                    {[
                      ["Part No.", "part_no", "text"], ["Name", "name", "text"], ["HSN", "hsn", "text"],
                      ["Avg Cost", "avg_cost", "number"], ["Avg Sell", "avg_sell", "number"], ["Opening Stock", "stock", "number"],
                    ].map(([label, field, type]) => (
                      <div>
                        <div class="text-xs uppercase tracking-widest text-ptc-base0/40 mb-1">{label}</div>
                        <input type={type} class="w-full bg-ptc-base03 border border-ptc-base0/20 px-3 py-1.5 text-sm font-mono outline-none focus:border-ptc-yellow/40"
                          value={newProduct()[field] || ""}
                          onInput={e => setNewProduct(p => ({ ...p, [field]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div class="mb-3">
                    <div class="text-xs uppercase tracking-widest text-ptc-base0/40 mb-1">Warehouse / Location</div>
                    <input type="text" class="w-full bg-ptc-base03 border border-ptc-base0/20 px-3 py-1.5 text-sm font-mono outline-none focus:border-ptc-yellow/40"
                      placeholder="e.g. Rack A3, Delhi Warehouse"
                      value={newProduct().warehouse || ""}
                      onInput={e => setNewProduct(p => ({ ...p, warehouse: e.target.value }))} />
                  </div>
                  <div class="flex gap-2">
                    <button class="px-4 py-2 bg-ptc-green text-ptc-base03 font-bold text-sm uppercase tracking-widest hover:bg-ptc-green/80"
                      onClick={() => saveCustomProduct(newProduct())}>Save Product</button>
                    <button class="px-4 py-2 border border-ptc-base02 text-ptc-base0/40 text-sm uppercase tracking-widest hover:border-ptc-base0/30"
                      onClick={() => setShowAddProduct(false)}>Cancel</button>
                  </div>
                </div>
              </Show>

              {/* Missing HSN panel */}
              <Show when={missingHsnSkus().length > 0}>
                <div class="border-b border-ptc-orange/30 bg-ptc-orange/5 px-4 py-2 shrink-0 flex items-center gap-3">
                  <span class="text-xs font-bold uppercase tracking-widest text-ptc-orange">⚠ {missingHsnSkus().length} SKUs Missing HSN</span>
                  <span class="text-xs text-ptc-base0/40">Click Edit on any row below to assign an HSN code</span>
                  <button class="ml-auto text-xs border border-ptc-orange/40 text-ptc-orange px-2 py-0.5 hover:bg-ptc-orange/10"
                    onClick={() => setInvQuery("")}>Show All</button>
                  <button class="text-xs border border-ptc-base0/20 text-ptc-base0/40 px-2 py-0.5 hover:border-ptc-orange/40 hover:text-ptc-orange"
                    onClick={() => setInvQuery("__missing_hsn__")}>Show Missing Only</button>
                </div>
              </Show>

              <div class="flex-1 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky top-0 bg-ptc-base02 z-10">
                    <tr>
                      {[["Part No.","text-left"],["Name","text-left"],["HSN","text-left"],["Tally Stock","text-right"],["Adj.","text-right"],["Effective Stock","text-right"],["Warehouse","text-left"],["",""]].map(([h,c]) => (
                        <th class={`px-4 py-2.5 text-sm font-bold uppercase tracking-widest ${c}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Custom products first */}
                    <For each={customProducts().filter(p => !invQuery() || p.name.toLowerCase().includes(invQuery().toLowerCase()) || (p.part_no || "").includes(invQuery()))}>
                      {(prod) => (
                        <tr class="border-b border-ptc-base02/50 bg-ptc-green/5 hover:bg-ptc-base02/40">
                          <td class="px-4 py-3 text-ptc-yellow font-bold tabular-nums">{prod.part_no || "—"}</td>
                          <td class="px-4 py-3 font-bold max-w-[200px] truncate">
                            {prod.name} <span class="text-xs text-ptc-green ml-1">CUSTOM</span>
                          </td>
                          <td class="px-4 py-3 text-ptc-base0/40">{prod.hsn || "—"}</td>
                          <td class="px-4 py-3 text-right text-ptc-base0/30">—</td>
                          <td class="px-4 py-3 text-right">—</td>
                          <td class="px-4 py-3 text-right font-bold text-ptc-yellow tabular-nums">{prod.net_stock_qty ?? 0}</td>
                          <td class="px-4 py-3 text-ptc-base0/40 text-sm">{prod.warehouse || "—"}</td>
                          <td class="px-4 py-3">
                            <button class="text-xs text-ptc-red/50 hover:text-ptc-red" onClick={() => deleteCustomProduct(prod.id)}>✕</button>
                          </td>
                        </tr>
                      )}
                    </For>
                    {/* Tally catalog with overrides */}
                    <For each={invQuery() === "__missing_hsn__" ? missingHsnSkus() : searchCatalog(invQuery(), catalog(), 200)}>
                      {(sku) => {
                        const ov = () => inventoryOverrides()[sku.id] || {};
                        const effStock = () => sku.net_stock_qty + (parseFloat(ov().stock_adj) || 0);
                        const isEditing = () => editingInv() === sku.id;
                        return (
                          <tr class={`border-b border-ptc-base02/50 hover:bg-ptc-base02/40 ${isEditing() ? "bg-ptc-base02" : ""}`}>
                            <td class="px-4 py-3 text-ptc-yellow font-bold tabular-nums">{sku.part_no || "—"}</td>
                            <td class="px-4 py-3 font-bold max-w-[200px] truncate" title={sku.name}>{sku.name}</td>
                            <td class="px-4 py-3 text-ptc-base0/40">
                              <Show when={isEditing()} fallback={ov().hsn || sku.hsn || "—"}>
                                <input type="text" class="w-24 bg-ptc-base03 border border-ptc-base0/20 px-2 py-0.5 text-sm font-mono outline-none focus:border-ptc-yellow/40"
                                  value={ov().hsn || sku.hsn || ""}
                                  onInput={e => saveInvOverride(sku.id, { hsn: e.target.value })} />
                              </Show>
                            </td>
                            <td class="px-4 py-3 text-right tabular-nums text-ptc-base0/50">{num(sku.net_stock_qty)}</td>
                            <td class="px-4 py-3 text-right">
                              <Show when={isEditing()} fallback={
                                <span class={`tabular-nums text-sm ${(parseFloat(ov().stock_adj) || 0) !== 0 ? "text-ptc-yellow" : "text-ptc-base0/20"}`}>
                                  {(parseFloat(ov().stock_adj) || 0) >= 0 ? "+" : ""}{ov().stock_adj || "0"}
                                </span>
                              }>
                                <input type="number" class="w-20 bg-ptc-base03 border border-ptc-base0/20 px-2 py-0.5 text-sm tabular-nums text-right font-mono outline-none focus:border-ptc-yellow/40"
                                  value={ov().stock_adj || 0}
                                  onInput={e => saveInvOverride(sku.id, { stock_adj: e.target.value })} />
                              </Show>
                            </td>
                            <td class={`px-4 py-3 text-right font-bold tabular-nums ${effStock() > 0 ? "text-ptc-yellow" : "text-ptc-base0/30"}`}>{num(effStock())}</td>
                            <td class="px-4 py-3 text-sm text-ptc-base0/40">
                              <Show when={isEditing()} fallback={ov().warehouse || "—"}>
                                <input type="text" class="w-28 bg-ptc-base03 border border-ptc-base0/20 px-2 py-0.5 text-sm font-mono outline-none focus:border-ptc-yellow/40"
                                  placeholder="e.g. Rack A3"
                                  value={ov().warehouse || ""}
                                  onInput={e => saveInvOverride(sku.id, { warehouse: e.target.value })} />
                              </Show>
                            </td>
                            <td class="px-4 py-3">
                              <button class="text-xs px-2 py-1 border border-ptc-base0/20 hover:border-ptc-yellow/40 hover:text-ptc-yellow uppercase tracking-widest"
                                onClick={() => setEditingInv(isEditing() ? null : sku.id)}>
                                {isEditing() ? "Done" : "Edit"}
                              </button>
                            </td>
                          </tr>
                        );
                      }}
                    </For>
                  </tbody>
                </table>
              </div>
            </div>
          </Show>

          {/* ════════════════════════════════════════════════════
              SUPPLIER MAPS — their P/N → our P/N (e.g. PAL)
          ════════════════════════════════════════════════════ */}
          <Show when={view() === "supplier-maps"}>
            <div class="flex-1 flex overflow-hidden">

              {/* Left: import pane */}
              <div class="w-80 flex flex-col border-r border-ptc-base02 shrink-0">
                <div class="px-4 py-3 border-b border-ptc-base02 text-sm font-bold uppercase tracking-widest text-ptc-base0/60 shrink-0">
                  Import Supplier List
                </div>
                <div class="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
                  <div>
                    <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-1">Supplier Name</div>
                    <input type="text" class="w-full bg-ptc-base03 border border-ptc-base0/20 px-3 py-2 text-sm font-mono outline-none focus:border-ptc-yellow/40"
                      placeholder="e.g. PAL, TATA, Bosch"
                      value={mapSupplierName()} onInput={e => setMapSupplierName(e.target.value)} />
                  </div>
                  <div>
                    <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-1">Paste List</div>
                    <div class="text-xs text-ptc-base0/30 mb-1.5">One row per part. Columns: <span class="text-ptc-yellow">Their P/N</span> · Our P/N · Description</div>
                    <div class="text-xs text-ptc-base0/20 mb-2">Separated by tab, comma, or pipe (|)</div>
                    <textarea class="w-full bg-ptc-base03 border border-ptc-base0/20 px-3 py-2 text-sm font-mono outline-none resize-none h-52 focus:border-ptc-yellow/40"
                      placeholder={"PALXXX123\t1234567\tGEAR PUMP\nPALXXX456\t7654321\tOIL SEAL"}
                      value={mapPasteText()} onInput={e => setMapPasteText(e.target.value)} />
                  </div>
                  <button class="w-full bg-ptc-yellow text-ptc-base03 font-bold py-2.5 text-sm uppercase tracking-widest hover:bg-ptc-green transition-colors"
                    onClick={parseSupplierMap}>
                    ↗ Import / Merge
                  </button>
                  {/* Supplier selector */}
                  <div class="border-t border-ptc-base02 pt-3">
                    <div class="text-sm uppercase tracking-widest text-ptc-base0/50 mb-2">Loaded Suppliers</div>
                    <For each={Object.keys(supplierMaps())}>
                      {(name) => (
                        <button class="w-full text-left px-3 py-2 text-sm border border-ptc-base02 mb-1 hover:border-ptc-yellow/40 hover:text-ptc-yellow truncate"
                          onClick={() => setMapSupplierName(name)}>
                          {name} <span class="text-ptc-base0/30 text-xs">({supplierMaps()[name]?.length} parts)</span>
                        </button>
                      )}
                    </For>
                  </div>
                </div>
              </div>

              {/* Right: lookup + table */}
              <div class="flex-1 flex flex-col overflow-hidden">
                <div class="px-4 py-3 border-b border-ptc-base02 shrink-0 flex items-center gap-3">
                  <input type="text" class="flex-1 bg-ptc-base02 border border-ptc-base0/20 px-4 py-2 font-mono text-sm placeholder:text-ptc-base0/25 focus:outline-none focus:border-ptc-yellow/40"
                    placeholder="Search by supplier P/N or our P/N or name..."
                    value={mapQuery()} onInput={e => setMapQuery(e.target.value)} />
                </div>
                <div class="flex-1 overflow-y-auto">
                  <table class="w-full text-sm">
                    <thead class="sticky top-0 bg-ptc-base02 z-10">
                      <tr>
                        {[["Supplier","text-left"],["Their P/N","text-left"],["Our P/N","text-left"],["Description","text-left"],["In Catalog","text-left"]].map(([h,c]) => (
                          <th class={`px-4 py-2.5 text-sm font-bold uppercase tracking-widest ${c}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <For each={
                        Object.entries(supplierMaps()).flatMap(([supplier, entries]) =>
                          entries
                            .filter(e => !mapQuery() || e.their_pn.toLowerCase().includes(mapQuery().toLowerCase()) || e.our_pn.toLowerCase().includes(mapQuery().toLowerCase()) || (e.name || "").toLowerCase().includes(mapQuery().toLowerCase()))
                            .map(e => ({ supplier, ...e }))
                        )
                      }>
                        {(row) => {
                          const inCatalog = fullCatalog().find(s => s.part_no === row.our_pn || s.id === row.our_pn);
                          return (
                            <tr class="border-b border-ptc-base02/50 hover:bg-ptc-base02/40">
                              <td class="px-4 py-3 text-ptc-base0/40">{row.supplier}</td>
                              <td class="px-4 py-3 text-ptc-yellow font-bold tabular-nums">{row.their_pn}</td>
                              <td class="px-4 py-3 font-bold tabular-nums">{row.our_pn}</td>
                              <td class="px-4 py-3 text-ptc-base0/60 max-w-[200px] truncate">{row.name || "—"}</td>
                              <td class="px-4 py-3">
                                {inCatalog
                                  ? <button class="text-ptc-green text-sm hover:underline" onClick={() => { setSelectedSku(inCatalog); setView("hub"); }}>{inCatalog.name.slice(0,25)}</button>
                                  : <span class="text-ptc-base0/20 text-xs">Not in catalog</span>
                                }
                              </td>
                            </tr>
                          );
                        }}
                      </For>
                    </tbody>
                  </table>
                  <Show when={Object.keys(supplierMaps()).length === 0}>
                    <div class="flex flex-col items-center justify-center h-40 text-ptc-base0/20 text-sm uppercase tracking-widest gap-2">
                      <span>No supplier maps yet</span>
                      <span class="text-xs">Paste a P/N list on the left to get started</span>
                    </div>
                  </Show>
                </div>
              </div>
            </div>
          </Show>

          {/* ════════════════════════════════════════════════════
              DEBTORS — client activity & RFM
          ════════════════════════════════════════════════════ */}
          <Show when={view() === "debtors"}>
            <div class="flex-1 flex flex-col overflow-hidden">
              <div class="px-4 py-3 border-b border-ptc-base02 shrink-0 flex items-center gap-4">
                <span class="text-sm font-bold uppercase tracking-widest text-ptc-base0/60">Client Activity & RFM Ranking</span>
                <span class="text-xs text-ptc-base0/30">
                  Outstanding balance requires Tally Ledger — this shows last transaction date & spend ranking
                </span>
                <div class="ml-auto flex gap-3 text-xs">
                  {["0-30","31-60","61-90","90+"].map(b => (
                    <span class={`px-2 py-0.5 border ${
                      b === "0-30"  ? "border-ptc-green/40 text-ptc-green" :
                      b === "31-60" ? "border-ptc-yellow/40 text-ptc-yellow" :
                      b === "61-90" ? "border-ptc-orange/40 text-ptc-orange" :
                      "border-ptc-red/40 text-ptc-red"
                    }`}>{b} days</span>
                  ))}
                </div>
              </div>
              <div class="flex-1 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="sticky top-0 bg-ptc-base02 z-10">
                    <tr>
                      {[["Client","text-left"],["Total Revenue","text-right"],["Last Order","text-left"],["Days Since","text-right"],["Invoices","text-right"],["Avg Order","text-right"],["RFM Score","text-right"],["Grade","text-center"]].map(([h,c]) => (
                        <th class={`px-4 py-2.5 text-sm font-bold uppercase tracking-widest ${c}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <For each={clientActivity()}>
                      {(c) => {
                        const grade = c.rfm >= 10 ? "A" : c.rfm >= 7 ? "B" : c.rfm >= 5 ? "C" : "D";
                        const gradeColor = grade === "A" ? "text-ptc-green border-ptc-green/40" : grade === "B" ? "text-ptc-yellow border-ptc-yellow/40" : grade === "C" ? "text-ptc-orange border-ptc-orange/40" : "text-ptc-red border-ptc-red/40";
                        const bucketColor = c.bucket === "0-30" ? "text-ptc-green" : c.bucket === "31-60" ? "text-ptc-yellow" : c.bucket === "61-90" ? "text-ptc-orange" : "text-ptc-red";
                        return (
                          <tr class="border-b border-ptc-base02/50 hover:bg-ptc-base02/40 cursor-pointer"
                            onClick={() => { setNetworkTab("clients"); setSelectedProfile(data()?.clients?.find(x => x.name === c.name)); setView("network"); }}>
                            <td class="px-4 py-3 font-bold max-w-[220px] truncate" title={c.name}>{c.name}</td>
                            <td class="px-4 py-3 text-right tabular-nums text-ptc-green font-bold">{currency(c.total)}</td>
                            <td class="px-4 py-3 tabular-nums text-ptc-base0/50">{c.last_date?.substring(0,7) || "—"}</td>
                            <td class={`px-4 py-3 text-right tabular-nums font-bold ${bucketColor}`}>
                              {c.daysSince < 9999 ? c.daysSince : "—"}
                            </td>
                            <td class="px-4 py-3 text-right tabular-nums">{num(c.invoice_count)}</td>
                            <td class="px-4 py-3 text-right tabular-nums text-ptc-base0/50">{currency(c.total / Math.max(c.invoice_count, 1))}</td>
                            <td class="px-4 py-3 text-right tabular-nums font-bold">{c.rfm}/12</td>
                            <td class="px-4 py-3 text-center">
                              <span class={`text-xs font-bold border px-2 py-0.5 ${gradeColor}`}>{grade}</span>
                            </td>
                          </tr>
                        );
                      }}
                    </For>
                  </tbody>
                </table>
              </div>
            </div>
          </Show>

          {/* ════════════════════════════════════════════════════
              HORIZON CHARTS
          ════════════════════════════════════════════════════ */}
          <Show when={view() === "horizon"}>
            <div class="flex-1 flex flex-col overflow-hidden p-3 gap-3">

              {/* Horizon chart */}
              <div class="flex-1 border border-ptc-base02 flex flex-col overflow-hidden min-h-0">
                <div class="px-4 py-2 border-b border-ptc-base02 shrink-0 flex items-center justify-between">
                  <div>
                    <div class="text-xs uppercase tracking-widest font-bold text-ptc-base0/50">Inventory Aging — Horizon Chart</div>
                    <div class="text-xs text-ptc-base0/25 mt-0.5">Top 30 SKUs by estimated on-hand stock · Bands = stock intensity · Green = accumulating · Yellow = depleting</div>
                  </div>
                  <div class="flex gap-4 text-xs text-ptc-base0/30">
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 bg-[rgba(112,175,112,0.8)] inline-block" /> Accumulating</span>
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 bg-[rgba(181,137,0,0.8)] inline-block" /> Depleting</span>
                  </div>
                </div>
                <div class="flex flex-1 min-h-0 overflow-hidden">
                  {/* Labels */}
                  <div class="w-44 shrink-0 border-r border-ptc-base02 flex flex-col overflow-hidden">
                    <For each={data()?.horizon || []}>
                      {(sku) => (
                        <div class="flex-1 text-xs px-3 border-b border-ptc-base02/50 text-ptc-base0/40 flex items-center justify-between min-h-0 overflow-hidden">
                          <span class="truncate" title={sku.name}>{sku.name.split(" ").slice(0, 2).join(" ")}</span>
                          <span class="tabular-nums text-ptc-yellow shrink-0 ml-1">{num(sku.net)}</span>
                        </div>
                      )}
                    </For>
                  </div>
                  <div class="flex-1 relative">
                    <canvas ref={horizonCanvas} class="absolute inset-0" width="1000" height="600" style={{ width: "100%", height: "100%" }} />
                  </div>
                </div>
                <div class="flex border-t border-ptc-base02 pl-44 shrink-0">
                  <For each={months().filter((_, i) => i % 3 === 0)}>
                    {(m) => <div class="flex-1 text-xs text-ptc-base0/25 px-1 py-1 truncate">{m}</div>}
                  </For>
                </div>
              </div>

              {/* Demand heatmap */}
              <div class="h-60 border border-ptc-base02 flex flex-col overflow-hidden shrink-0">
                <div class="px-4 py-2 border-b border-ptc-base02 shrink-0">
                  <div class="text-xs uppercase tracking-widest font-bold text-ptc-base0/50">Sales Demand Heatmap — Top 25 SKUs by Volume</div>
                  <div class="text-xs text-ptc-base0/25 mt-0.5">Color intensity = monthly sales quantity · Bright yellow = high demand</div>
                </div>
                <div class="flex flex-1 overflow-hidden min-h-0">
                  <div class="w-44 shrink-0 border-r border-ptc-base02 flex flex-col overflow-hidden">
                    <For each={data()?.heatmap || []}>
                      {(sku) => (
                        <div class="flex-1 text-xs px-3 border-b border-ptc-base02/50 text-ptc-base0/40 flex items-center min-h-0 overflow-hidden">
                          <span class="truncate" title={sku.name}>{sku.name}</span>
                        </div>
                      )}
                    </For>
                  </div>
                  <div class="flex-1 relative">
                    <canvas ref={heatmapCanvas} class="absolute inset-0" width="1000" height="400" style={{ width: "100%", height: "100%" }} />
                  </div>
                </div>
              </div>
            </div>
          </Show>

        </div>
      </Show>
    </div>
  );
}
