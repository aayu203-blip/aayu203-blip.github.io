#!/usr/bin/env python3
"""
stamp_chrome.py — Stamp canonical nav + footer onto every HTML page of the PTC website.

Usage:
    python3 stamp_chrome.py            # dry run (reports what would change)
    python3 stamp_chrome.py --write    # actually write changed files
    python3 stamp_chrome.py --write --backup  # write + keep .bak of originals

What it does:
  1. Walks all .html files under the site root (defined as this script's directory).
  2. Skips:
       - /index.html  (root homepage — has custom scroll-aware nav)
       - anything under ptc-os/
       - any file ending in .bak
       - any file whose name starts with debug_
  3. For each eligible file:
       a. Replaces the first <nav …>…</nav> block with CANONICAL_NAV
       b. Replaces the first <footer …>…</footer> block with CANONICAL_FOOTER
       c. If the page has no Alpine.js <script> tag, injects the local Alpine script
          tag just before </head>.
       d. Only writes the file when content actually changed.
  4. Prints a summary: changed / skipped-no-chrome / unchanged / total.

Notes:
  - All reads/writes use utf-8.
  - The regex for nav/footer uses re.DOTALL so it spans multiple lines.
  - count=1 is passed to re.sub so only the first nav/footer is replaced (breadcrumb
    <nav> tags that appear later in the page are left alone).
  - Run without --write first to preview what will be touched.
"""

import os
import re
import sys
import shutil
import argparse
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Root of the site (same directory as this script)
SITE_ROOT = Path(__file__).resolve().parent

# Root homepage — has a custom scroll-aware nav, excluded from stamping
SKIP_ROOT_FILE = "index.html"

# Allowlist: only walk these top-level directories (and root-level .html files).
# Everything else in the repo (ptc-os, .venv, Portals, Working Website, Back, etc.)
# is either a non-website project or build/tool artefact and must be left alone.
ALLOWED_DIRS = {
    "blog",
    "pages",
    "equipment-models",
    # Product brand directories
    "cat", "komatsu", "volvo", "scania", "hitachi", "kobelco", "john-deere", "jcb",
    # Localised mirrors
    "ar", "es", "fr", "hi", "kn", "ml", "ta", "te",
}

# Alpine.js script tag to inject when missing
ALPINE_SCRIPT_TAG = '<script src="/assets/js/alpine.min.js" defer></script>'

# Microsoft Clarity tag to inject when missing
CLARITY_SCRIPT_TAG = """\
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "wek6sq3u0u");
</script>"""

# Regex patterns
RE_NAV    = re.compile(r'<nav\b[^>]*>[\s\S]*?</nav>', re.DOTALL)
RE_FOOTER = re.compile(r'<footer\b[^>]*>[\s\S]*?</footer>', re.DOTALL)
RE_ALPINE = re.compile(r'alpine(?:\.min)?\.js', re.IGNORECASE)
RE_CLARITY = re.compile(r'clarity\.ms/tag/', re.IGNORECASE)

# ---------------------------------------------------------------------------
# Canonical NAV
# ---------------------------------------------------------------------------

CANONICAL_NAV = """\
<!-- Canonical nav: white, sticky, clean -->
<nav id="site-nav" class="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm" x-data="{ open: false }">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16 md:h-20">
      <!-- Logo -->
      <a href="/" class="flex items-center flex-shrink-0">
        <img src="/assets/images/ptc-logo.png?v=1" alt="Parts Trading Company — Heavy Equipment Spare Parts Mumbai"
             class="h-10 md:h-12 w-auto" width="120" height="48" loading="eager"/>
      </a>
      <!-- Desktop links -->
      <div class="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-700">
        <a href="/" class="nav-item px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">Home</a>
        <a href="/#equipment-models" class="nav-item px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">Models</a>
        <a href="/#product-categories" class="nav-item px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">Products</a>
        <a href="/#brands" class="nav-item px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">Brands</a>
        <a href="/blog/index.html" class="nav-item px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">Blog</a>
        <a href="/about.html" class="nav-item px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">About</a>
        <a href="/get-a-quote.html" class="ml-1 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold transition-colors whitespace-nowrap text-sm">Get a Quote</a>
        <a href="https://wa.me/919821037990?text=Hi%21%20I%20need%20help%20with%20a%20spare%20part." target="_blank" rel="noopener"
           class="ml-1 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
      </div>
      <!-- Mobile hamburger -->
      <button @click="open = !open" class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100" aria-label="Toggle menu">
        <svg x-show="!open" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        <svg x-show="open" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  </div>
  <!-- Mobile menu -->
  <div x-show="open" x-transition class="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 text-sm font-semibold text-gray-700">
    <a href="/" class="block px-3 py-2.5 rounded-lg hover:bg-gray-100">Home</a>
    <a href="/#equipment-models" class="block px-3 py-2.5 rounded-lg hover:bg-gray-100">Models</a>
    <a href="/#product-categories" class="block px-3 py-2.5 rounded-lg hover:bg-gray-100">Products</a>
    <a href="/#brands" class="block px-3 py-2.5 rounded-lg hover:bg-gray-100">Brands</a>
    <a href="/blog/index.html" class="block px-3 py-2.5 rounded-lg hover:bg-gray-100">Blog</a>
    <a href="/about.html" class="block px-3 py-2.5 rounded-lg hover:bg-gray-100">About</a>
    <a href="/get-a-quote.html" class="block px-3 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold">Get a Quote</a>
    <a href="https://wa.me/919821037990?text=Hi%21%20I%20need%20help%20with%20a%20spare%20part." target="_blank" rel="noopener"
       class="flex items-center gap-2 px-3 py-2.5 rounded-lg text-green-600 hover:bg-green-50">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      WhatsApp Us
    </a>
  </div>
</nav>"""

# ---------------------------------------------------------------------------
# Canonical FOOTER
# ---------------------------------------------------------------------------

CANONICAL_FOOTER = """\
<footer class="bg-gray-900 text-white">
  <!-- Row 1: 3-column grid -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

      <!-- Col 1: Brand / address -->
      <div>
        <a href="/" class="inline-block mb-3">
          <img src="/assets/images/ptc-logo.png?v=1" alt="Parts Trading Company" class="h-10 w-auto brightness-0 invert"/>
        </a>
        <p class="text-sm text-gray-400 mb-4">Est. 1956, Mumbai</p>
        <address class="not-italic text-sm text-gray-400 space-y-1">
          <p>Parts Trading Company</p>
          <p>Mumbai, Maharashtra, India</p>
          <p class="mt-2">GST: 27AAAFP1087E1ZG</p>
        </address>
      </div>

      <!-- Col 2: Navigate + Brand Parts (two sub-columns) -->
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-3">Navigate</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="/" class="hover:text-white transition-colors">Home</a></li>
            <li><a href="/#equipment-models" class="hover:text-white transition-colors">Models</a></li>
            <li><a href="/#product-categories" class="hover:text-white transition-colors">Products</a></li>
            <li><a href="/#brands" class="hover:text-white transition-colors">Brands</a></li>
            <li><a href="/blog/index.html" class="hover:text-white transition-colors">Blog</a></li>
            <li><a href="/about.html" class="hover:text-white transition-colors">About</a></li>
            <li><a href="https://wa.me/919821037990?text=Hi%21%20I%20need%20help%20with%20a%20spare%20part." target="_blank" rel="noopener" class="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-3">Brand Parts</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="/pages/hubs/brand-volvo.html" class="hover:text-white transition-colors">Volvo</a></li>
            <li><a href="/pages/hubs/brand-scania.html" class="hover:text-white transition-colors">Scania</a></li>
            <li><a href="/pages/hubs/brand-komatsu.html" class="hover:text-white transition-colors">Komatsu</a></li>
            <li><a href="/pages/hubs/brand-cat.html" class="hover:text-white transition-colors">CAT</a></li>
            <li><a href="/pages/hubs/brand-hitachi.html" class="hover:text-white transition-colors">Hitachi</a></li>
            <li><a href="/pages/hubs/brand-kobelco.html" class="hover:text-white transition-colors">Kobelco</a></li>
          </ul>
        </div>
      </div>

      <!-- Col 3: Contact -->
      <div>
        <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-3">Contact Us</h3>
        <ul class="space-y-3 text-sm text-gray-400">
          <li>
            <a href="https://wa.me/919821037990?text=Hi%21%20I%20need%20help%20with%20a%20spare%20part."
               target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors font-semibold">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
          </li>
          <li>
            <span class="text-gray-500 text-xs uppercase tracking-wider">Landline</span><br/>
            <a href="tel:+912240755999" class="hover:text-white transition-colors">+91 22407 55999</a>
          </li>
          <li>
            <span class="text-gray-500 text-xs uppercase tracking-wider">Mobile</span><br/>
            <a href="tel:+919821037990" class="hover:text-white transition-colors">+91 98210 37990</a>
          </li>
          <li>
            <span class="text-gray-500 text-xs uppercase tracking-wider">Email</span><br/>
            <a href="mailto:parts@partstrading.com" class="hover:text-white transition-colors">parts@partstrading.com</a>
          </li>
          <li>
            <span class="text-gray-500 text-xs uppercase tracking-wider">Hours</span><br/>
            Mon–Sat 9:00–18:00 IST
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Row 2: Social icons + copyright + legal links -->
  <div class="border-t border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
      <!-- Social icons -->
      <div class="flex items-center gap-4">
        <a href="https://www.instagram.com/partstradingco" target="_blank" rel="noopener" aria-label="Instagram"
           class="hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a href="https://www.linkedin.com/company/81588687/" target="_blank" rel="noopener" aria-label="LinkedIn"
           class="hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
      <!-- Copyright + legal links -->
      <div class="flex flex-wrap items-center justify-center gap-4">
        <span>© 2026 Parts Trading Company. All rights reserved.</span>
        <a href="/privacy-policy.html" class="hover:text-white transition-colors">Privacy Policy</a>
        <a href="/terms.html" class="hover:text-white transition-colors">Terms of Use</a>
      </div>
    </div>
  </div>

  <!-- Row 3: Disclaimer -->
  <div class="border-t border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <p class="text-xs text-gray-500 leading-relaxed">
        Disclaimer: All brand names, logos, images, and part numbers used on this website are for identification and
        reference purposes only. Parts Trading Company is not affiliated with any original equipment manufacturers
        (OEMs) unless specifically stated. We offer a range of products that may include genuine OEM parts or
        compatible high-quality aftermarket alternatives, based on availability and customer requirements.
      </p>
    </div>
  </div>
</footer>"""


# ---------------------------------------------------------------------------
# Core processing
# ---------------------------------------------------------------------------

def should_skip(path: Path) -> Optional[str]:
    """
    Return a skip reason string if this file should be skipped, else None.
    Only called for files already confirmed to be in an allowed location.
    """
    # Skip the root homepage
    if path == SITE_ROOT / SKIP_ROOT_FILE:
        return "root index.html (homepage)"

    # Skip .bak files
    if path.suffix == ".bak":
        return ".bak file"

    # Skip debug_*.html
    if path.name.startswith("debug_"):
        return "debug_ file"

    return None


def iter_html_files():
    """
    Yield all .html files that belong to the live website:
      - Root-level .html files (e.g. about.html)
      - All .html files inside ALLOWED_DIRS subdirectories
    Everything else in the repo (ptc-os, .venv, Portals, Working Website, etc.)
    is excluded at the walk level so we never even open those files.
    """
    # Root-level .html files
    for p in SITE_ROOT.glob("*.html"):
        yield p

    # Subdirectory trees that are part of the live site
    for dir_name in sorted(ALLOWED_DIRS):
        subdir = SITE_ROOT / dir_name
        if subdir.is_dir():
            yield from subdir.rglob("*.html")


def process_file(path: Path, write: bool, backup: bool) -> str:
    """
    Process a single HTML file.

    Returns one of: 'changed', 'unchanged', 'no_chrome'
    """
    original = path.read_text(encoding="utf-8")
    html = original

    nav_found = bool(RE_NAV.search(html))
    footer_found = bool(RE_FOOTER.search(html))

    if not nav_found and not footer_found:
        return "no_chrome"

    # Replace nav (first occurrence only)
    if nav_found:
        html = RE_NAV.sub(CANONICAL_NAV, html, count=1)

    # Replace footer (first occurrence only)
    if footer_found:
        html = RE_FOOTER.sub(CANONICAL_FOOTER, html, count=1)

    # Inject Alpine.js if the page now has x-data/x-show but no Alpine script
    # (The canonical nav uses Alpine directives, so every stamped page needs it)
    if not RE_ALPINE.search(html):
        # Insert just before </head>
        html = html.replace("</head>", f"  {ALPINE_SCRIPT_TAG}\n</head>", 1)

    # Inject Microsoft Clarity if not already present
    if not RE_CLARITY.search(html):
        html = html.replace("</head>", f"  {CLARITY_SCRIPT_TAG}\n</head>", 1)

    if html == original:
        return "unchanged"

    if write:
        if backup:
            shutil.copy2(path, path.with_suffix(path.suffix + ".bak"))
        path.write_text(html, encoding="utf-8")

    return "changed"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Stamp canonical nav + footer onto PTC website HTML pages."
    )
    parser.add_argument(
        "--write",
        action="store_true",
        help="Actually write changed files. Without this flag the script is a dry run.",
    )
    parser.add_argument(
        "--backup",
        action="store_true",
        help="Before overwriting a file, save the original as <file>.bak. Only meaningful with --write.",
    )
    args = parser.parse_args()

    if not args.write:
        print("DRY RUN — no files will be written. Pass --write to apply changes.\n")

    counts = {"changed": 0, "unchanged": 0, "no_chrome": 0, "skipped": 0}
    skipped_log = []

    for html_path in sorted(iter_html_files()):
        skip_reason = should_skip(html_path)
        if skip_reason:
            counts["skipped"] += 1
            skipped_log.append(f"  SKIP  {html_path.relative_to(SITE_ROOT)}  ({skip_reason})")
            continue

        result = process_file(html_path, write=args.write, backup=args.backup)
        counts[result] += 1

        # Print verbose output only for changed / no_chrome to avoid flooding the terminal
        if result == "changed":
            action = "WROTE " if args.write else "WOULD "
            print(f"  {action} {html_path.relative_to(SITE_ROOT)}")
        elif result == "no_chrome":
            print(f"  NO-CHROME  {html_path.relative_to(SITE_ROOT)}")

    # Print skip log at the end (usually short)
    if skipped_log:
        print("\n--- Skipped files ---")
        for line in skipped_log:
            print(line)

    # Summary
    total = sum(counts.values())
    print("\n" + "=" * 60)
    print(f"  Total files examined : {total}")
    print(f"  Changed              : {counts['changed']}" + (" (written)" if args.write else " (dry run)"))
    print(f"  Already up-to-date   : {counts['unchanged']}")
    print(f"  No nav/footer found  : {counts['no_chrome']}")
    print(f"  Skipped (excluded)   : {counts['skipped']}")
    print("=" * 60)


if __name__ == "__main__":
    main()
