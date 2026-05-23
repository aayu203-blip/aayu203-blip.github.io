# Bespoke Treatment — 30 Zero-Click Parts
*Sprint 10 | Created 2026-05-19*

30 pages with 2,100+ combined GSC impressions at ~0% CTR.
Root cause: generic titles, no schema, no spec depth.
Fix: Product JSON-LD + FAQPage JSON-LD + custom hero + 4 bespoke content sections.

---

## Common Rules (apply to every part)

### Title format
`{Brand} {PartNo} Specifications — {Part Name} | PTC`

### Meta description format
`{Brand} {PartNo} specifications: {Part Name}. In stock Mumbai. OEM-spec aftermarket. Ships worldwide — 60-min WhatsApp quote.`

### Product JSON-LD (generate from const P data)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{Brand} {PartNo} {Part Name}",
  "mpn": "{PartNo}",
  "sku": "{PartNo}",
  "brand": {"@type": "Brand", "name": "{Brand}"},
  "description": "{P.description}",
  "additionalProperty": [/* from P.specs + group-specific specs */],
  "aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "34", "bestRating": "5", "worstRating": "1"},
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "price": "0",
    "priceCurrency": "INR",
    "seller": {"@type": "Organization", "name": "Parts Trading Company", "url": "https://partstrading.com"},
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingDestination": [
        {"@type": "DefinedRegion", "addressCountry": "IN"},
        {"@type": "DefinedRegion", "addressCountry": "AE"},
        {"@type": "DefinedRegion", "addressCountry": "SA"},
        {"@type": "DefinedRegion", "addressCountry": "QA"},
        {"@type": "DefinedRegion", "addressCountry": "NG"},
        {"@type": "DefinedRegion", "addressCountry": "KE"}
      ]
    }
  },
  "itemCondition": "https://schema.org/NewCondition"
}
```

### FAQPage JSON-LD (generate from P.faq + inject "specifications" Q first)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the specifications of {Brand} part {PartNo}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{Brand} {PartNo} is a {Part Name}. {1-line spec summary from P.description}. OEM-specification aftermarket. Full spec sheet available on WhatsApp request."
      }
    }
    /* + remaining P.faq items */
  ]
}
```

### Custom Hero (window.PTC_CUSTOM_HERO — inject before product-page.js)
```js
window.PTC_CUSTOM_HERO = {
  headline: "{Brand} {PartNo} — {Part Name}",
  sub: "{1-line from P.description, model compatibility summary}",
  badges: ["In Stock", "OEM Specification", "Ships Worldwide", "60-min Quote"]
};
```

### 4 Bespoke Sections per part (window.PTC_CUSTOM_SECTIONS)
1. **Technical Specifications** — key/value table, group-specific fields (see each group below)
2. **Compatibility Matrix** — P.models reformatted into grouped grid by series
3. **Procurement & Shipping** — static 4-step order guide + shipping destination tags
4. **FAQ Accordion** — P.faq items with injected "specifications" Q at top

### Injection point
Inject `window.PTC_CUSTOM_HERO` and `window.PTC_CUSTOM_SECTIONS` immediately BEFORE the `<script src="/assets/js/product-page.js"></script>` line.
Inject JSON-LD blocks inside `<head>`, after the existing `<meta>` tags.

---

## Group 1 — Kits & Assemblies (6 parts) 🔴 START HERE

**Parts:**
| PartNo | Name | File |
|--------|------|------|
| 2866325 | L Kit Reg Kit | scania/filters/2866325.html |
| 2388680 | Repair Kit Universal Join Cross | scania/filters/2388680.html |
| 2979070 | Mounting Kit | scania/filters/2979070.html |
| 2585836 | Repair Kit Gearbox Housing | scania/transmission-parts/2585836.html |
| 2536983 | Gear Shift Cylinder Assembly | scania/hydraulic-parts/2536983.html |
| 2536881 | Oil Pump Assembly | scania/hydraulic-parts/2536881.html |

**Note:** 2866325, 2388680, 2979070 are miscategorized as "filters" in DB — their canonical URLs are correct but category label is wrong. Fix `P.category` and `P.catSlug` in the HTML.

**Spec template fields (Section 1 — Technical Specifications):**
- Part Number
- Brand
- Kit Type (Repair Kit / Mounting Kit / Assembly)
- Kit Contents (list what's in the box — gaskets, seals, bolts, etc.)
- Compatible Gearbox / System (e.g., GRS895, GRSO895, AT1202)
- OEM Part Number Supersedes (if known)
- Service Interval (km or hours)
- Required Fluid / Lubricant (e.g., SAF-XO, ATF Dexron)
- Condition: OEM-Specification Aftermarket
- Dispatch: Same-day from Mumbai (before 3 PM IST)
- GST Invoice: Available

**FAQ additions (on top of P.faq):**
1. "What are the specifications of {Brand} part {PartNo}?" → answer from P.description
2. "What is included in this kit?" → list kit contents
3. "What gearbox does this kit fit?" → from P.models

**Task checklist per part:**
- [ ] Read file, extract const P data
- [ ] Write Title (format: `{Brand} {PartNo} Specifications — {Kit Name} | PTC`)
- [ ] Write meta description
- [ ] Write Product JSON-LD (with kit-specific additionalProperty rows)
- [ ] Write FAQPage JSON-LD (spec Q + kit contents Q + gearbox Q + existing P.faq)
- [ ] Write PTC_CUSTOM_HERO object
- [ ] Write PTC_CUSTOM_SECTIONS (4 sections)
- [ ] Patch HTML file
- [ ] Fix miscategorized category label if applicable

---

## Group 2 — Gearbox & Drivetrain (4 parts)

**Parts:**
| PartNo | Name | File |
|--------|------|------|
| 1779734 | Piston Gearbox | scania/transmission-parts/1779734.html |
| 2027296 | Cassette Axle Gear | scania/transmission-parts/2027296.html |
| 20523491 | Differential Kit | volvo/seals-orings/20523491.html |
| 21447682 | Timing Gasket Cover | volvo/seals-orings/21447682.html |

**Note:** 20523491 and 21447682 are categorized under "seals-orings" — correct the P.category display label to "Drivetrain" for 20523491 and "Engine" for 21447682.

**Spec template fields:**
- Part Number
- Brand
- Component Type (Piston / Cassette Gear / Differential Kit / Gasket Cover)
- Compatible Gearbox / Axle (e.g., GRS895, RT series, VT / I-Shift)
- Input/Output Torque Capacity (Nm) if applicable
- Shaft / Spline Spec if applicable
- Recommended Oil / Fluid
- Seal Material (for 21447682 — rubber compound, temp range)
- Operating Temperature Range
- Condition: OEM-Specification Aftermarket
- Dispatch: Same-day from Mumbai

**FAQ additions:**
1. "What are the specifications of {Brand} part {PartNo}?"
2. "Which gearbox / axle does this part fit?"
3. "What fluid specification is required for this component?"

**Task checklist per part:** (same as Group 1)

---

## Group 3 — Hardware & Fasteners (5 parts)

**Parts:**
| PartNo | Name | File |
|--------|------|------|
| 2966989 | Flange Screw | scania/hardware-fasteners/2966989.html |
| 2397505 | Hub Nut | scania/hardware-fasteners/2397505.html |
| 1948837 | Screw | scania/hardware-fasteners/1948837.html |
| 1529445 | Spacer | scania/hardware-fasteners/1529445.html |
| 984852 | Flange Screw | volvo/hardware-fasteners/984852.html |

**Spec template fields:**
- Part Number
- Brand
- Fastener Type (Flange Screw / Hub Nut / Spacer)
- Thread Specification (e.g., M20 × 1.5)
- Thread Pitch
- Head Type (Hex / Flanged Hex)
- Material (High-Tensile Steel)
- Surface Treatment (Zinc Plated / Phosphate Coated)
- Strength Grade (e.g., Grade 10.9 / Grade 12.9)
- Tightening Torque (Nm)
- DIN / ISO Standard Reference
- Application Position (wheel hub / driveshaft flange / etc.)
- Condition: OEM-Specification Aftermarket

**FAQ additions:**
1. "What are the specifications of {Brand} part {PartNo}?"
2. "What is the torque specification for this fastener?"
3. "What thread size and grade is {PartNo}?"

**Task checklist per part:** (same as Group 1)

---

## Group 4 — Hydraulic & Pneumatic (5 parts)

**Parts:**
| PartNo | Name | File |
|--------|------|------|
| 2257727 | Quick Release Coupling | scania/hydraulic-parts/2257727.html |
| 2671939 | Protection Valve | scania/hydraulic-parts/2671939.html |
| 22416764 | Tube | volvo/hydraulic-parts/22416764.html |
| 991968 | Swivel | volvo/hydraulic-parts/991968.html |
| 2383058 | Service Brake Valve Component | scania/steering-parts/2383058.html |

**Note:** 2383058 is a brake valve component miscategorized under steering-parts.

**Spec template fields:**
- Part Number
- Brand
- Component Type (Valve / Coupling / Tube / Swivel)
- Working Pressure (bar / psi)
- Burst Pressure (bar) if applicable
- Flow Rate (L/min) if applicable
- Port Size / Thread (e.g., M22 × 1.5 / 3/8" BSP)
- Tube OD / ID (for 22416764)
- Operating Temperature Range (°C)
- Fluid Compatibility (air / hydraulic oil / brake fluid)
- Material (e.g., hardened steel, brass insert)
- Condition: OEM-Specification Aftermarket

**FAQ additions:**
1. "What are the specifications of {Brand} part {PartNo}?"
2. "What is the pressure rating of this component?"
3. "What fluid / medium is this component compatible with?"

**Task checklist per part:** (same as Group 1)

---

## Group 5 — Filters & Fluids (2 parts)

**Parts:**
| PartNo | Name | File |
|--------|------|------|
| 84425617 | Air Filter | volvo/filters/84425617.html |
| 24283117 | Gear Oil | volvo/filters/24283117.html |

**Note:** 24283117 "Gear Oil" is miscategorized as filters. Fix P.category to "Fluids & Lubricants".

**Spec template — Air Filter (84425617):**
- Filtration Efficiency (% at defined micron)
- Restriction Pressure (mbar at rated flow)
- Outer Diameter / Inner Diameter / Height (mm)
- Filter Media (cellulose / synthetic)
- Compatible Air Cleaner Housing
- Service Interval (hours or km)
- Meets Standard (ISO 5011)

**Spec template — Gear Oil (24283117):**
- Viscosity Grade (e.g., SAE 75W-90)
- API Service Classification (GL-4 / GL-5)
- Operating Temperature Range
- Viscosity at 40°C / 100°C (cSt)
- Flash Point (°C)
- Pour Point (°C)
- Compatible Systems (gearbox, axle, transfer case)
- Volume / Pack Size

**FAQ additions:**
1. "What are the specifications of {Brand} part {PartNo}?"
2. (Filter) "What is the service interval for this air filter?"
   (Oil) "What viscosity grade is Volvo gear oil 24283117?"
3. (Filter) "Which Volvo models use air filter 84425617?"
   (Oil) "Is this gear oil compatible with I-Shift gearboxes?"

**Task checklist per part:** (same as Group 1)

---

## Group 6 — Steering & Suspension — Ball Joints (2 parts)

**Parts:**
| PartNo | Name | File |
|--------|------|------|
| 2977070 | Ball Joint | scania/engine-parts/2977070.html |
| 2977059 | Ball Joint | scania/engine-parts/2977059.html |

**Note:** Both are miscategorized under engine-parts. These are almost certainly front axle L/R ball joints — check P.models and P.description to confirm LH/RH. Fix P.category to "Steering & Suspension".

**Spec template fields:**
- Part Number
- Brand
- Component Type (Ball Joint — Front Axle)
- Side (Left-Hand / Right-Hand)
- Taper Angle (°)
- Stud Diameter (mm)
- Thread Specification (e.g., M30 × 2.0)
- Overall Length (mm)
- Grease Nipple: Yes / No
- Grease Type (Molykote / Lithium EP)
- Max Axial Load (kN)
- Max Radial Load (kN)
- Tightening Torque (Nm)
- Replacement Interval (km / years)
- Compatible Axle (BPW / SAF / Scania own axle)
- Condition: OEM-Specification Aftermarket

**FAQ additions:**
1. "What are the specifications of Scania ball joint {PartNo}?"
2. "Is {PartNo} the left-hand or right-hand ball joint?"
3. "What is the torque specification for fitting this ball joint?"

**Task checklist per part:** (same as Group 1)

---

## Group 7 — Engine & Cooling (2 parts)

**Parts:**
| PartNo | Name | File |
|--------|------|------|
| 23003422 | Cooling Coil / Fan Ring FM | volvo/engine-parts/23003422.html |
| 2323478 | Radiator Bleed Nipple | scania/fuel-system/2323478.html |

**Note:** 2323478 is miscategorized under fuel-system — fix P.category to "Cooling System".

**Spec template — Fan Ring (23003422):**
- Outer Diameter (mm)
- Inner / Shroud Diameter (mm)
- Fan Blade Tip Clearance (mm)
- Material (polyamide / steel)
- Compatible Fan Size (inches)
- Compatible Models (FM12, FM9, Renault Premium)

**Spec template — Bleed Nipple (2323478):**
- Thread Specification (e.g., M8 × 1.0)
- Body Material (brass / steel)
- Wrench Size (mm)
- Operating Pressure (bar)
- Application (coolant system bleed point)

**FAQ additions:**
1. "What are the specifications of {Brand} part {PartNo}?"
2. (Fan Ring) "Which Volvo FM models does the fan ring 23003422 fit?"
   (Bleed Nipple) "What thread size is Scania radiator bleed nipple 2323478?"
3. (Fan Ring) "Is 23003422 compatible with Renault trucks?"
   (Bleed Nipple) "Where is the bleed nipple located on the Scania cooling system?"

**Task checklist per part:** (same as Group 1)

---

## Group 8 — Electrical & Cab (3 parts)

**Parts:**
| PartNo | Name | File |
|--------|------|------|
| 23413384 | Connector | volvo/spare-parts/23413384.html |
| 20938685 | Connector | volvo/spare-parts/20938685.html |
| 2641680 | Headlamp Trim Panel RH | scania/engine-parts/2641680.html |

**Note:** 2641680 is miscategorized under engine-parts — fix P.category to "Cab & Body Parts".

**Spec template — Connectors (23413384, 20938685):**
- Part Number
- Connector Type (AMP / Deutsch / Molex / OEM proprietary)
- Number of Pins / Poles
- Gender (Male / Female)
- IP Protection Rating (e.g., IP67)
- Wire Gauge Range (mm²)
- Maximum Current (A per pin)
- Operating Voltage (V)
- Operating Temperature Range (°C)
- Mating Connector Part Number (if known)
- Application (engine harness / instrument cluster / lighting / etc.)

**Spec template — Trim Panel (2641680):**
- Side (Right-Hand)
- Material (ABS plastic)
- Finish (textured / painted)
- Mounting (clip-fit / screw)
- Compatible Models (from P.models)

**FAQ additions:**
1. "What are the specifications of {Brand} part {PartNo}?"
2. (Connectors) "How many pins does Volvo connector {PartNo} have?"
3. (Connectors) "What is the IP rating of this connector?"
   (Trim Panel) "Is headlamp trim 2641680 left-hand or right-hand?"

**Task checklist per part:** (same as Group 1)

---

## Group 9 — Bearing, CAT (1 part)

**Parts:**
| PartNo | Name | File |
|--------|------|------|
| 676869 | Bearing | cat/bearing-bushing/676869.html |

**Spec template:**
- Part Number
- Brand
- Bearing Type (Tapered Roller / Deep Groove Ball / Cylindrical Roller)
- Bore Diameter (mm) — inner ID
- Outer Diameter (mm)
- Width / Height (mm)
- Dynamic Load Rating C (kN)
- Static Load Rating C₀ (kN)
- ABEC / ISO Precision Grade
- Lubrication (grease-packed / open / shielded / sealed)
- Operating Temperature Range (°C)
- Equivalent ISO / SKF / Timken Reference Number
- Application Position (final drive / swing bearing / travel motor / etc.)
- Compatible CAT Models (from P.models)

**FAQ additions:**
1. "What are the specifications of CAT bearing 676869?"
2. "What are the dimensions of bearing 676869?"
3. "Which CAT models use bearing 676869?"
4. "What is the load rating of CAT 676869?"

**Task checklist:**
- [ ] Read file, extract const P data
- [ ] Write Title, meta description
- [ ] Write Product JSON-LD
- [ ] Write FAQPage JSON-LD
- [ ] Write PTC_CUSTOM_HERO
- [ ] Write PTC_CUSTOM_SECTIONS (4 sections)
- [ ] Patch HTML file

---

## Miscategorized Parts — Fix List

When doing bespoke work on each part, also fix the `P.category` and `P.catSlug` display values in the const P data block:

| PartNo | Current Category | Correct Category | Correct catSlug |
|--------|-----------------|-----------------|-----------------|
| 2866325 | Filters | Maintenance Kits | maintenance-kits |
| 2388680 | Filters | Repair Kits | repair-kits |
| 2979070 | Filters | Mounting Kits | mounting-kits |
| 24283117 | Filters | Fluids & Lubricants | fluids |
| 2977070 | Engine Parts | Steering & Suspension | steering-suspension |
| 2977059 | Engine Parts | Steering & Suspension | steering-suspension |
| 2641680 | Engine Parts | Cab & Body Parts | cab-body-parts |
| 2323478 | Fuel System | Cooling System | cooling-system |
| 2383058 | Steering Parts | Brake System | brake-system |
| 20523491 | Seals & O-Rings | Drivetrain | drivetrain |
| 21447682 | Seals & O-Rings | Engine | engine-parts |

---

## Deployment

After each group is complete:
1. `git add` the changed files
2. Commit: `Sprint 10 Group {N}: bespoke {group name} — {N} parts`
3. Push

Don't batch all 9 groups into one commit — commit group by group so GSC impact is traceable.

---

## Status Tracker

| Group | Parts | Status |
|-------|-------|--------|
| 1 — Kits & Assemblies | 2866325, 2388680, 2979070, 2585836, 2536983, 2536881 | ⬜ Not started |
| 2 — Gearbox & Drivetrain | 1779734, 2027296, 20523491, 21447682 | ⬜ Not started |
| 3 — Hardware & Fasteners | 2966989, 2397505, 1948837, 1529445, 984852 | ⬜ Not started |
| 4 — Hydraulic & Pneumatic | 2257727, 2671939, 22416764, 991968, 2383058 | ⬜ Not started |
| 5 — Filters & Fluids | 84425617, 24283117 | ⬜ Not started |
| 6 — Ball Joints | 2977070, 2977059 | ⬜ Not started |
| 7 — Engine & Cooling | 23003422, 2323478 | ⬜ Not started |
| 8 — Electrical & Cab | 23413384, 20938685, 2641680 | ⬜ Not started |
| 9 — CAT Bearing | 676869 | ⬜ Not started |
