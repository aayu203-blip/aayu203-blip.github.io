from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.on("console", lambda msg: print(f"PAGE LOG ({msg.type}): {msg.text}"))
    page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))
    page.on("requestfailed", lambda req: print(f"REQUEST FAILED: {req.url} - {req.failure}"))
    
    page.goto('file:///Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io/index.html')
    page.wait_for_timeout(2000)
    
    # Are elements hidden by aos?
    aos_hidden = page.evaluate("document.querySelectorAll('[data-aos]').length")
    aos_animate = page.evaluate("document.querySelectorAll('.aos-animate').length")
    print(f"AOS Elements: {aos_hidden}, Animated: {aos_animate}")
    
    # Check styles
    opacity = page.evaluate("window.getComputedStyle(document.body).opacity")
    print(f"Body opacity: {opacity}")
    
    # Check if a specific hero element is visible
    hero_opacity = page.evaluate("window.getComputedStyle(document.querySelector('#home h1')).opacity")
    print(f"Hero H1 opacity: {hero_opacity}")
    
    browser.close()
