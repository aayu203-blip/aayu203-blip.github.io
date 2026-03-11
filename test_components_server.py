from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.on("console", lambda msg: print(f"LOG: {msg.text}"))
    page.on("pageerror", lambda err: print(f"ERROR: {err}"))
    page.goto('http://localhost:8080/')
    
    page.wait_for_timeout(2000)
    
    wa_floaters = page.evaluate("document.querySelectorAll('#ptc-wa-float').length")
    print(f"WhatsApp Floaters: {wa_floaters}")
    
    geo_banners = page.evaluate("document.querySelectorAll('#shipping-popup').length")
    print(f"Geo IP Banners: {geo_banners}")
    
    navs = page.evaluate("document.querySelectorAll('nav').length")
    print(f"Navs: {navs}")
    
    browser.close()
