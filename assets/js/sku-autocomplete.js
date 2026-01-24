(function () {
  const globalState = {
    index: [],
    loaded: false,
    loading: false,
    cache: new Map(),
    debounceDesktop: 200,
    debounceMobile: 250
  };

  function loadIndexOnce() {
    if (globalState.loaded || globalState.loading) return;
    globalState.loading = true;
    fetch('/data/parts-index.json', { cache: 'no-cache' })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load parts-index.json (${res.status})`);
        return res.json();
      })
      .then(data => {
        globalState.index = Array.isArray(data) ? data : [];
        globalState.loaded = true;
      })
      .catch(err => {
        console.error('[ptc-autocomplete] index load failed:', err);
        globalState.index = [];
      })
      .finally(() => {
        globalState.loading = false;
      });
  }

  function pushEvent(event, detail = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...detail });
  }

  function lruSet(cache, key, value) {
    if (cache.has(key)) cache.delete(key);
    cache.set(key, value);
    if (cache.size > 20) {
      const first = cache.keys().next().value;
      cache.delete(first);
    }
  }

  function highlight(text, query) {
    if (!query) return text;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    if (index === -1) return text;
    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);
    return `${before}<mark>${match}</mark>${after}`;
  }

  function filterIndex(cache, query) {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const lower = trimmed.toLowerCase();
    if (cache.has(lower)) return cache.get(lower);

    const skuMode = /\d/.test(trimmed);
    const results = [];

    if (skuMode) {
      const starts = [];
      const includes = [];
      for (const item of globalState.index) {
        const skuLower = (item.sku || '').toLowerCase();
        if (!skuLower) continue;
        if (skuLower.startsWith(lower)) {
          starts.push(item);
          if (starts.length >= 7) break;
        } else if (skuLower.includes(lower)) {
          includes.push(item);
        }
      }
      results.push(...starts);
      if (results.length < 7) {
        for (const item of includes) {
          if (results.length >= 7) break;
          if (!results.includes(item)) results.push(item);
        }
      }
    } else {
      for (const item of globalState.index) {
        const titleLower = (item.title || '').toLowerCase();
        if (titleLower.includes(lower)) {
          results.push(item);
        }
        if (results.length >= 7) break;
      }
    }

    lruSet(cache, lower, results);
    return results;
  }

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
      option.id = `${widget.idPrefix}-option-${idx}`;
      option.className = 'ptc_suggest_option';
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', idx === widget.activeIndex ? 'true' : 'false');
      option.dataset.index = String(idx);

      const skuHTML = skuMode ? highlight(item.sku, query) : item.sku;
      const titleHTML = skuMode ? item.title : highlight(item.title, query);

      option.innerHTML = `
        <div class="ptc_suggest_option-sku">${skuHTML}</div>
        <div>
          <div class="ptc_suggest_option-title">${titleHTML}</div>
          <div class="ptc_suggest_option-category">${item.category || 'Category unavailable'}</div>
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
    pushEvent('suggestions_shown', {
      query,
      count: results.length
    });
  }

  function selectResult(widget, index) {
    const item = widget.results[index];
    if (!item) return;
    pushEvent('suggestion_selected', {
      query: widget.lastQuery,
      sku: item.sku || null,
      url: item.url || null
    });

    if (item.url) {
      window.location.assign(item.url);
      return;
    }

    const isScania = /scania/i.test(item.title || '') || /scania/i.test(item.category || '');
    if (isScania) {
      window.location.assign(`/scania/hydraulics/${item.sku}-sku.html`);
      return;
    }

    if (widget.lastQuery) {
      const encoded = encodeURIComponent(widget.lastQuery.trim());
      window.location.assign(`/search?q=${encoded}`);
    }
  }

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

  function closePanel(widget) {
    widget.listbox.innerHTML = '';
    widget.listbox.setAttribute('aria-hidden', 'true');
    widget.input.setAttribute('aria-expanded', 'false');
    widget.input.setAttribute('aria-activedescendant', '');
    widget.status.textContent = '';
    widget.results = [];
    widget.activeIndex = -1;
  }

  function initWidget(root, index) {
    const input = root.querySelector('.ptc_suggest_input');
    const form = root.querySelector('.ptc_suggest_form');
    const submitBtn = root.querySelector('.ptc_suggest_submit');
    const listbox = root.querySelector('.ptc_suggest_list');
    const status = root.querySelector('.ptc_suggest_status');

    if (!input || !form || !listbox || !status) {
      console.warn('[ptc-autocomplete] Missing required elements in widget', root);
      return;
    }

    const widgetState = {
      idPrefix: `ptc_suggest_${index}`,
      root,
      input,
      form,
      submitBtn,
      listbox,
      status,
      results: [],
      activeIndex: -1,
      cache: globalState.cache,
      debounceTimer: null,
      debounceDelay:
        window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
          ? globalState.debounceMobile
          : globalState.debounceDesktop,
      lastQuery: ''
    };

    function handleInput(event) {
      const value = event.target.value;
      widgetState.lastQuery = value;

      if (!globalState.loaded) loadIndexOnce();

      clearTimeout(widgetState.debounceTimer);
      widgetState.debounceTimer = setTimeout(() => {
        const trimmed = value.trim();
        if (!trimmed) {
          closePanel(widgetState);
          return;
        }
        pushEvent('suggestions_requested', { query: trimmed });
        const results = filterIndex(widgetState.cache, trimmed);
        widgetState.results = results;
        widgetState.activeIndex = results.length ? 0 : -1;
        renderResults(widgetState, results, trimmed, /\d/.test(trimmed));
        if (results.length) {
          widgetState.input.setAttribute(
            'aria-activedescendant',
            `${widgetState.idPrefix}-option-0`
          );
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
      if (!root.contains(event.relatedTarget)) {
        closePanel(widgetState);
      }
    }

    function handleSubmit(event) {
      const query = widgetState.lastQuery.trim();
      if (!query) return;
      pushEvent('header_search_sku', { query, source: 'autocomplete_submit' });
    }

    input.addEventListener('focus', loadIndexOnce, { once: true });
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeyDown);
    input.addEventListener('blur', handleBlur);
    form.addEventListener('submit', handleSubmit);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const widgets = document.querySelectorAll('[data-ptc-autocomplete]');
    if (!widgets.length) return;
    widgets.forEach((widget, idx) => initWidget(widget, idx));
    loadIndexOnce();
  });
})();





