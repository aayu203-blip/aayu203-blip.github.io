from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))
    page.goto('file:///Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io/index.html')
    page.wait_for_timeout(2000)
    print("Body length:", len(page.evaluate("document.body.innerHTML")))
    browser.close()
