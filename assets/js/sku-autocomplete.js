(function () {
  // ── CONSTANTS ────────────────────────────────────────────────────────────────
  // Centralised so changing behaviour never requires a grep across the file.
  const AUTOCOMPLETE_MAX_RESULTS    = 7;
  const AUTOCOMPLETE_CACHE_SIZE     = 20;
  const AUTOCOMPLETE_DEBOUNCE_DESK  = 200;   // ms — pointer device
  const AUTOCOMPLETE_DEBOUNCE_TOUCH = 250;   // ms — touch device
  const AUTOCOMPLETE_MAX_QUERY_LEN  = 100;   // chars — guards against oversized inputs

  // ── GLOBAL STATE ─────────────────────────────────────────────────────────────
  const globalState = {
    index:   [],
    loaded:  false,
    loading: false,
    error:   false,          // set true when the index fetch fails permanently
    cache:   new Map(),
    debounceDesktop: AUTOCOMPLETE_DEBOUNCE_DESK,
    debounceMobile:  AUTOCOMPLETE_DEBOUNCE_TOUCH,
  };

  // ── INDEX LOADER ─────────────────────────────────────────────────────────────
  function loadIndexOnce() {
    if (globalState.loaded || globalState.loading) return;
    globalState.loading = true;
    fetch('/data/parts-index.json', { cache: 'no-cache' })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load parts-index.json (${res.status})`);
        return res.json();
      })
      .then(data => {
        globalState.index  = Array.isArray(data) ? data : [];
        globalState.loaded = true;
        globalState.error  = false;
      })
      .catch(err => {
        console.error('[ptc-autocomplete] index load failed:', err);
        globalState.index = [];
        globalState.error = true;   // surface error to widgets
      })
      .finally(() => {
        globalState.loading = false;
      });
  }

  // ── ANALYTICS ────────────────────────────────────────────────────────────────
  function pushEvent(event, detail = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...detail });
  }

  // ── LRU CACHE HELPER ─────────────────────────────────────────────────────────
  function lruSet(cache, key, value) {
    if (cache.has(key)) cache.delete(key);
    cache.set(key, value);
    if (cache.size > AUTOCOMPLETE_CACHE_SIZE) {
      cache.delete(cache.keys().next().value);
    }
  }

  // ── HTML ESCAPE ──────────────────────────────────────────────────────────────
  // Used before inserting any external string (product title, SKU) into innerHTML.
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ── HIGHLIGHT ────────────────────────────────────────────────────────────────
  // Wraps the first occurrence of `query` in `text` with <mark>.
  // Both arguments are HTML-escaped before insertion.
  function highlight(text, query) {
    const safeText = escapeHtml(text);
    if (!query) return safeText;
    const lower      = safeText.toLowerCase();
    const lowerQuery = escapeHtml(query).toLowerCase();
    const idx        = lower.indexOf(lowerQuery);
    if (idx === -1) return safeText;
    const before = safeText.slice(0, idx);
    const match  = safeText.slice(idx, idx + lowerQuery.length);
    const after  = safeText.slice(idx + lowerQuery.length);
    return `${before}<mark>${match}</mark>${after}`;
  }

  // ── FILTER ───────────────────────────────────────────────────────────────────
  function filterIndex(cache, query) {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const lower = trimmed.toLowerCase();
    if (cache.has(lower)) return cache.get(lower);

    const skuMode = /\d/.test(trimmed);
    const results = [];

    if (skuMode) {
      const starts   = [];
      const includes = [];
      for (const item of globalState.index) {
        const skuLower = (item.sku || '').toLowerCase();
        if (!skuLower) continue;
        if (skuLower.startsWith(lower)) {
          starts.push(item);
          if (starts.length >= AUTOCOMPLETE_MAX_RESULTS) break;
        } else if (skuLower.includes(lower)) {
          includes.push(item);
        }
      }
      results.push(...starts);
      for (const item of includes) {
        if (results.length >= AUTOCOMPLETE_MAX_RESULTS) break;
        if (!results.includes(item)) results.push(item);
      }
    } else {
      for (const item of globalState.index) {
        const titleLower = (item.title || '').toLowerCase();
        if (titleLower.includes(lower)) results.push(item);
        if (results.length >= AUTOCOMPLETE_MAX_RESULTS) break;
      }
    }

    lruSet(cache, lower, results);
    return results;
  }

  // ── RENDER RESULTS ────────────────────────────────────────────────────────────
  function renderResults(widget, results, query, skuMode) {
    const { listbox, input, status } = widget;
    listbox.innerHTML = '';
    const hasResults = results.length > 0;
    listbox.setAttribute('aria-hidden', hasResults ? 'false' : 'true');
    input.setAttribute('aria-expanded', hasResults ? 'true' : 'false');

    if (!hasResults) {
      status.textContent = query ? 'No matches found.' : '';
      return;
    }

    const frag = document.createDocumentFragment();
    results.forEach((item, idx) => {
      const option = document.createElement('li');
      option.id        = `${widget.idPrefix}-option-${idx}`;
      option.className = 'ptc_suggest_option';
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', idx === widget.activeIndex ? 'true' : 'false');
      option.dataset.index = String(idx);

      // Escape all external data before placing into innerHTML
      const skuHTML   = skuMode ? highlight(item.sku, query)   : escapeHtml(item.sku);
      const titleHTML = skuMode ? escapeHtml(item.title)        : highlight(item.title, query);
      const catHTML   = escapeHtml(item.category || 'Category unavailable');

      option.innerHTML = `
        <div class="ptc_suggest_option-sku">${skuHTML}</div>
        <div>
          <div class="ptc_suggest_option-title">${titleHTML}</div>
          <div class="ptc_suggest_option-category">${catHTML}</div>
        </div>
      `;

      option.addEventListener('mousedown', evt => {
        evt.preventDefault();
        selectResult(widget, idx);
      });

      frag.appendChild(option);
    });

    listbox.appendChild(frag);
    status.textContent = `${results.length} suggestion${results.length > 1 ? 's' : ''} available.`;
    pushEvent('suggestions_shown', { query, count: results.length });
  }

  // ── SELECT RESULT ────────────────────────────────────────────────────────────
  function selectResult(widget, index) {
    const item = widget.results[index];
    if (!item) return;
    pushEvent('suggestion_selected', {
      query: widget.lastQuery,
      sku:   item.sku  || null,
      url:   item.url  || null,
    });

    if (item.url) {
      window.location.assign(item.url);
      return;
    }

    const isScania = /scania/i.test(item.title || '') || /scania/i.test(item.category || '');
    if (isScania) {
      window.location.assign(`/scania/hydraulics/${encodeURIComponent(item.sku)}-sku.html`);
      return;
    }

    if (widget.lastQuery) {
      window.location.assign(`/search?q=${encodeURIComponent(widget.lastQuery.trim())}`);
    }
  }

  // ── KEYBOARD NAVIGATION ───────────────────────────────────────────────────────
  function moveFocus(widget, direction) {
    if (!widget.results.length) return;
    if (direction === 'next') {
      widget.activeIndex = (widget.activeIndex + 1) % widget.results.length;
    } else {
      widget.activeIndex =
        widget.activeIndex - 1 < 0 ? widget.results.length - 1 : widget.activeIndex - 1;
    }
    const activeId = `${widget.idPrefix}-option-${widget.activeIndex}`;
    widget.input.setAttribute('aria-activedescendant', activeId);
    [...widget.listbox.children].forEach((node, idx) => {
      node.setAttribute('aria-selected', idx === widget.activeIndex ? 'true' : 'false');
    });
  }

  // ── CLOSE PANEL ───────────────────────────────────────────────────────────────
  function closePanel(widget) {
    widget.listbox.innerHTML = '';
    widget.listbox.setAttribute('aria-hidden', 'true');
    widget.input.setAttribute('aria-expanded', 'false');
    widget.input.setAttribute('aria-activedescendant', '');
    widget.status.textContent = '';
    widget.results      = [];
    widget.activeIndex  = -1;
  }

  // ── INIT WIDGET ───────────────────────────────────────────────────────────────
  // Returns a destroy() function that removes all event listeners — preventing
  // memory leaks if the widget root is removed from / re-added to the DOM.
  function initWidget(root, index) {
    const input     = root.querySelector('.ptc_suggest_input');
    const form      = root.querySelector('.ptc_suggest_form');
    const submitBtn = root.querySelector('.ptc_suggest_submit');
    const listbox   = root.querySelector('.ptc_suggest_list');
    const status    = root.querySelector('.ptc_suggest_status');

    if (!input || !form || !listbox || !status) {
      console.warn('[ptc-autocomplete] Missing required elements in widget', root);
      return null;
    }

    const widgetState = {
      idPrefix:      `ptc_suggest_${index}`,
      root, input, form, submitBtn, listbox, status,
      results:       [],
      activeIndex:   -1,
      cache:         globalState.cache,
      debounceTimer: null,
      debounceDelay:
        window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
          ? globalState.debounceMobile
          : globalState.debounceDesktop,
      lastQuery: '',
    };

    function handleInput(event) {
      // Cap query length to prevent excessively large filter passes
      const value = event.target.value.slice(0, AUTOCOMPLETE_MAX_QUERY_LEN);
      widgetState.lastQuery = value;

      if (!globalState.loaded && !globalState.error) loadIndexOnce();

      clearTimeout(widgetState.debounceTimer);
      widgetState.debounceTimer = setTimeout(() => {
        const trimmed = value.trim();
        if (!trimmed) { closePanel(widgetState); return; }

        // If index failed to load, don't silently hang — show nothing
        if (globalState.error) { closePanel(widgetState); return; }

        pushEvent('suggestions_requested', { query: trimmed });
        const results = filterIndex(widgetState.cache, trimmed);
        widgetState.results     = results;
        widgetState.activeIndex = results.length ? 0 : -1;
        renderResults(widgetState, results, trimmed, /\d/.test(trimmed));
        if (results.length) {
          widgetState.input.setAttribute('aria-activedescendant', `${widgetState.idPrefix}-option-0`);
        } else {
          closePanel(widgetState);
        }
      }, widgetState.debounceDelay);
    }

    function handleKeyDown(event) {
      if (!widgetState.results.length) return;
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          moveFocus(widgetState, 'next');
          break;
        case 'ArrowUp':
          event.preventDefault();
          moveFocus(widgetState, 'prev');
          break;
        case 'Enter':
          if (widgetState.activeIndex > -1) {
            event.preventDefault();
            selectResult(widgetState, widgetState.activeIndex);
          }
          break;
        case 'Escape':
          closePanel(widgetState);
          widgetState.input.blur();
          break;
        case 'Tab':
          if (widgetState.activeIndex > -1) selectResult(widgetState, widgetState.activeIndex);
          break;
        default:
          break;
      }
    }

    function handleBlur(event) {
      if (!root.contains(event.relatedTarget)) closePanel(widgetState);
    }

    function handleSubmit() {
      const query = widgetState.lastQuery.trim();
      if (!query) return;
      pushEvent('header_search_sku', { query, source: 'autocomplete_submit' });
    }

    // Attach listeners and store references for later cleanup
    input.addEventListener('focus',   loadIndexOnce, { once: true });
    input.addEventListener('input',   handleInput);
    input.addEventListener('keydown', handleKeyDown);
    input.addEventListener('blur',    handleBlur);
    form.addEventListener('submit',   handleSubmit);

    // Expose a destroy() so callers can clean up if the widget is torn down
    return function destroy() {
      clearTimeout(widgetState.debounceTimer);
      input.removeEventListener('input',   handleInput);
      input.removeEventListener('keydown', handleKeyDown);
      input.removeEventListener('blur',    handleBlur);
      form.removeEventListener('submit',   handleSubmit);
    };
  }

  // ── BOOT ──────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const widgets = document.querySelectorAll('[data-ptc-autocomplete]');
    if (!widgets.length) return;
    widgets.forEach((widget, idx) => initWidget(widget, idx));
    loadIndexOnce();
  });
})();
