from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('file:///Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io/index.html')
    
    # Wait for ptc-components.js and internal logic to fully fire
    page.wait_for_timeout(3500)
    
    # Count WhatsApp Floaters
    wa_floaters = page.evaluate("document.querySelectorAll('#ptc-wa-float').length")
    print(f"WhatsApp Floaters: {wa_floaters}")
    
    # Count Geo Banners
    geo_banners = page.evaluate("document.querySelectorAll('#shipping-popup').length")
    print(f"Geo IP Banners: {geo_banners}")
    
    # Check Nav count
    navs = page.evaluate("document.querySelectorAll('nav').length")
    print(f"Navs: {navs}")
    
    browser.close()
