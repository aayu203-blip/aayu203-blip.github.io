# PTC OS — Roadmap & Checklist

Last updated: 2026-04-09

---

## Tonight — Tally Integration

- [ ] Confirm Tally version (ERP9 / Prime / Prime 2.1+)
- [ ] Confirm if Tally is on the same machine as PTC OS or networked
- [ ] Confirm company name in Tally
- [ ] Build `tally_bridge.py` — replaces Excel exports with live Tally XML API (localhost:9000)
- [ ] Full historical pull on first run
- [ ] Incremental sync — new vouchers every N minutes
- [ ] Auto-refresh `data.json` so frontend updates without manual reload
- [ ] Retire all 5 Excel file imports permanently

---

## Tonight — Phone Notifications

- [ ] Choose notification channel: Telegram (recommended) / ntfy.sh / WhatsApp
- [ ] Set up Telegram bot via BotFather (~2 min)
- [ ] Wire notifications into Tally bridge for:

  **Transaction events (every voucher)**
  - [ ] New purchase bill — party + amount
  - [ ] New sales invoice — party + amount
  - [ ] Credit note — party + amount + reason if available
  - [ ] Debit note — party + amount + reason if available
  - [ ] Large transaction alert (configurable threshold, e.g. ₹5 lakh)

  **Margin / price-drop alerts (per line item, not invoice total)**
  - [ ] Sale below cost price — "⚠️ LOSS: [PART] to [CLIENT] at ₹X, cost ₹Y (−Z%)"
  - [ ] Sale below threshold margin (configurable, e.g. < 10%) — "LOW MARGIN: [PART] at Y% margin"
  - [ ] Sale more than X% below last sale of same part — "PRICE DROP: [PART] sold at ₹X, last sold at ₹Y (−Z%) to [LAST CLIENT] on [DATE]"
  - [ ] Sale more than X% below last sale of same part to same customer — "CLIENT PRICE DROP: [PART] to [CLIENT] at ₹X, last sold to them at ₹Y (−Z%) on [DATE]"
  - [ ] Both thresholds configurable (e.g. 15% global drop, 10% per-customer drop)
  - [ ] "Last sale" tracked in bridge memory per SKU and per SKU+party — updated on every new invoice seen

  **Overdue customer alerts**
  - [ ] Sale to customer with outstanding overdue > 90 days — "⚠️ OVERDUE: [CLIENT] has ₹X outstanding since [DATE], new sale ₹Y"
  - [ ] Sale to customer whose total outstanding exceeds configurable credit limit (e.g. ₹2 lakh) — "CREDIT LIMIT: [CLIENT] at ₹X outstanding, new sale ₹Y"
  - [ ] Daily morning digest at 9 AM — top 5 overdue accounts with amounts and age

  **Inventory / stock alerts**
  - [ ] Stock hits zero after a sale — "[PART] now OUT OF STOCK after sale to [CLIENT]"
  - [ ] Stock drops below reorder point — "[PART] low: X units left, avg monthly demand Y"

  **Requires**: `client_ledger` from Tally (outstanding balance per party) — pull alongside vouchers

---

## Compliance & Money

- [ ] GST filing prep — real-time GSTR-1 summary by HSN rate, GSTR-3B totals, mismatch detection before filing
- [ ] Outstanding payments / debtors tracker — who owes, since when, age buckets: 0-30 / 31-60 / 61-90 / 90+ days
- [ ] Dead stock report — parts bought but not sold in 6+ months; capital tied up in warehouse

---

## Operations

- [ ] Purchase order follow-up — flag POs older than X days with no corresponding purchase bill received in Tally
- [ ] Seasonal demand forecasting — 3-month moving average per SKU; "last April you sold 40 of this, you have 5 in stock"
- [ ] Margin erosion alerts — flag parts where avg sell price is trending down while cost is flat or rising, before they go loss-making

---

## Workflow

- [ ] Kit / BOM builder — define seal kits, gasket sets, service kits as named bundles; add to quote as one line item that explodes into components
- [ ] Email-ready quote — one button opens mail client with quote pre-formatted in body, customer name in To field
- [ ] Duplicate SKU detector — flag parts with different P/Ns but near-identical names (same part entered differently in Tally over years); merge tool
- [ ] Barcode / QR lookup — use phone camera to scan a part barcode and jump straight to its Part Hub entry (browser-native, no app needed)

---

## Analytics

- [ ] Customer RFM scoring — rank clients by Recency, Frequency, Monetary value; identify who is churning and who to prioritize
- [ ] Multi-currency display — USD/EUR equivalent on export quotes using a manually-set exchange rate
- [ ] Missing HSN bulk-assign — filter all parts with no HSN code and assign from a dropdown of known codes; compliance hygiene

---

## Already Built

- [x] Medallion ETL pipeline (Bronze → Silver → Gold)
- [x] FIFO purchase → sale cost matching per SKU
- [x] Part name cleaning — extracts embedded P/N and HSN from raw Tally names
- [x] Client + supplier profile aggregation
- [x] Price trend computation (linear regression on monthly avg sell rate)
- [x] Part Hub — searchable catalog, P/N-centric, with 360° intelligence panel
- [x] Quote engine — NLP inquiry parser, manual catalog search
- [x] Quote PDF export + print
- [x] Quote history — save and reload up to 30 quotes
- [x] Quote → Order pipeline — promote quote to order, track status (Draft → Sent → Confirmed → Dispatched → Fulfilled → Cancelled)
- [x] Transport / carrier tracking per client — auto-suggested on next quote
- [x] PO console — draft, PDF export, CSV export
- [x] Alerts tab — reorder risk, loss-making SKUs, pre-data-window stock deficit
- [x] Network tab — client and supplier profiles with top parts, invoice count, monthly activity chart
- [x] Inventory tab — stock adjustments, warehouse location, HSN overrides, custom products
- [x] Supplier P/N maps — paste PAL / TATA / Bosch lists, cross-reference their P/N to our P/N, linked to catalog
- [x] Manual suggested prices per SKU (localStorage, used as default quote price)
- [x] Part cross-reference / aliases — link alternate P/Ns to the same SKU
- [x] Price trend arrows in Part Hub table and 360° panel
- [x] Enhanced command palette (Cmd+K) — searches parts, clients, and suppliers
- [x] Horizon chart — inventory aging for top 30 SKUs
- [x] Demand heatmap — top 25 SKUs by sales volume over time
- [x] Watchdog — high-magnitude transaction feed
- [x] Black and white high-contrast UI, IBM Plex Mono, large fonts
- [x] Phone notification architecture planned
