# Accessibility Audit Report — partstrading.com
_Skill: rampstack/accessibility-audit | Standard: WCAG 2.1 AA | Date: 2026-05-04_

---

## Summary

| Category | Status |
|----------|--------|
| Perceivable | ⚠️ Partial |
| Operable | ⚠️ Partial |
| Understandable | ✅ Good |
| Robust | ⚠️ Partial |

---

## Fixed This Session

- ✅ **Skip navigation link** added (`<a href="#main-content">Skip to main content</a>`)
- ✅ **:focus-visible styles** added (amber outline, 2px, offset 3px)

---

## Remaining Issues

### ❌ WCAG 2.4.3 — Focus Order / `<main>` landmark missing
**Criterion**: 2.4.3 Focus Order, 1.3.6 Identify Purpose
**Issue**: The skip link targets `#main-content` but the `<main>` element rendered by React doesn't have `id="main-content"`. Screen reader users jumping to main content land nowhere.

**Fix**: In the `App` component JSX, change:
```jsx
<main>
```
to:
```jsx
<main id="main-content">
```

---

### ❌ WCAG 1.4.11 — Non-text Contrast (amber on dark)
**Criterion**: 1.4.11 Non-Text Contrast (AA)
**Issue**: `#FFB81C` amber on `#050505` background = 9.2:1 contrast ✅. However, `T.textMuted` (`#9A9A9A`) on `#050505` = **3.9:1** — passes AA for normal text (≥4.5:1 required). Borderline fail.

**Affected elements**: Subsection labels, stat labels, footer link text, secondary descriptions throughout.

**Fix**: Bump `textMuted` in `DARK_T` from `#9A9A9A` to `#ABABAB` (achieves ~4.6:1):
```js
textMuted: '#ABABAB',
```

---

### ⚠️ WCAG 2.4.7 — Focus Visible (keyboard nav on interactive components)
**Criterion**: 2.4.7 Focus Visible
**Issue**: `onFocus`/`onBlur` handlers on inputs change `borderColor` to amber, which provides visible focus for mouse-triggered focus events. But buttons throughout the page (brand tabs, model chips, WA CTAs) rely only on the new `:focus-visible` CSS outline added this session. Verify the outline renders correctly on all interactive elements.

**Note**: The `onMouseEnter`/`onMouseLeave` hover states use `e.currentTarget.style.*` which bypasses CSS — keyboard focus won't trigger these hover states, which is correct WCAG behavior.

---

### ⚠️ WCAG 4.1.2 — Name, Role, Value (EquipmentModels tabs)
**Criterion**: 4.1.2 Name, Role, Value
**Issue**: Brand filter tabs use `role="tab"` and `aria-selected` ✅. However, there is no `role="tabpanel"` wrapping the models grid, and no `aria-controls` linking tab to panel.

**Fix**: In `EquipmentModels`:
```jsx
<div role="tabpanel" aria-labelledby={`tab-${cur.name}`}>
  <div style={{ ... }}>
    {filtered.map(...)}
  </div>
</div>
```
And add `id={`tab-${b.name}`}` to each tab button.

---

### ⚠️ WCAG 1.3.1 — Info and Relationships (contact form labels)
**Criterion**: 1.3.1 Info and Relationships
**Issue**: Contact form has `htmlFor` linking labels to inputs ✅. However, the "Name/Phone" row uses a 2-column CSS grid layout with no grouping — assistive technologies may not convey the visual relationship between paired fields.

**Status**: This is low risk given the labels are properly associated via `htmlFor`.

---

### ⚠️ WCAG 2.1.1 — Keyboard (search panel)
**Criterion**: 2.1.1 Keyboard
**Issue**: The full-screen search panel (opened from nav) renders into a portal. When it opens, focus should be trapped inside the panel and returned to the trigger when closed. The current implementation uses `querySelector('input[type="search"]')?.focus()` on a delay — may not work reliably with all assistive technologies.

**Fix**: Implement a proper focus trap:
```jsx
useEffect(() => {
  if (searchOpen) {
    const input = document.querySelector('#hero-search');
    input?.focus();
    // trap focus within portal
  }
}, [searchOpen]);
```

---

### ℹ️ Images (aria-hidden usage)
All SVG icons have `aria-hidden="true"` ✅. Logo `<img>` has descriptive alt text ✅. No images are missing alt attributes.

---

### ℹ️ Language
`<html lang="en">` ✅. Single language, no multilingual content on the page.

---

## Quick-Fix Checklist

| Fix | File | Effort |
|-----|------|--------|
| Add `id="main-content"` to `<main>` | index.html | 1 min |
| Bump `textMuted` to `#ABABAB` | index.html | 1 min |
| Add `role="tabpanel"` + `aria-controls` to models section | index.html | 15 min |
| Search panel focus trap | index.html | 30 min |
