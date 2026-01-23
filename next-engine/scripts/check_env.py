try:
    import playwright
    from playwright.sync_api import sync_playwright
    print("✅ Playwright is installed.")
    
    with sync_playwright() as p:
        print("  Launching browser...")
        browser = p.chromium.launch(headless=True)
        print("  Browser launched successfully.")
        browser.close()
        
except ImportError:
    print("❌ Playwright is NOT installed.")
except Exception as e:
    print(f"⚠️ Playwright installed but failed: {e}")
