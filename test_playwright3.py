from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('file:///Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io/index.html')
    page.wait_for_timeout(2000)
    
    sections = page.evaluate("""
        Array.from(document.querySelectorAll('section')).map(s => {
            return {
                id: s.id,
                height: s.offsetHeight,
                display: window.getComputedStyle(s).display,
                opacity: window.getComputedStyle(s).opacity
            };
        })
    """)
    print("Section geometries:")
    for s in sections:
        print(s)
        
    browser.close()
