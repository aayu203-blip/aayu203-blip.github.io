from playwright.sync_api import sync_playwright
import time
import json

def mine_pilot():
    target_id = "Filter"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        print(f"🌍 Navigating to SRP Spare Parts Page...")
        page.goto("https://srp.com.tr/page/spare-parts", timeout=90000)
        
        # Debug: Print title
        print(f"  Page Title: {page.title()}")
        
        # Determine Selector
        # Trying specific ID found in previous HTML dumps for this page
        selector = '#volvoFind'
        
        # Wait for selector explicitly
        try:
            page.wait_for_selector(selector, timeout=10000)
            page.fill(selector, target_id)
            page.press(selector, 'Enter')
        except Exception as e:
            print(f"❌ Selection failed: {e}")
            # Dump HTML anyway
            with open('srp_failure.html', 'w') as f:
                f.write(page.content())
            print("  📄 Saved srp_failure.html")
            browser.close()
            return
        
        print("⏳ Waiting for results...")
        # We don't know what to wait for exactly, so let's wait for network idle 
        # or a reasonable timeout
        page.wait_for_timeout(5000) 
        
        # Take screenshot to verify what happened
        page.screenshot(path='srp_search_result.png')
        print("📸 Screenshot saved to srp_search_result.png")
        
        # Dump content
        content = page.content()
        with open('srp_pilot.html', 'w') as f:
            f.write(content)
            
        # Try to find product card text
        # If the search worked, maybe there is a new element?
        # Let's check for the ID in the body text
        body_text = page.inner_text('body')
        if target_id in body_text:
            print("✅ ID found in page text!")
        else:
            print("❌ ID NOT found in page text (Search might have failed).")
            
        browser.close()

if __name__ == "__main__":
    mine_pilot()
