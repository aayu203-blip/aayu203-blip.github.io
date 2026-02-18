import requests

def test_ajax():
    session = requests.Session()
    
    # Step 1: Get Homepage for cookies
    print("🕵️ Getting Homepage for cookies...")
    try:
        session.get("https://srp.com.tr/", headers={'User-Agent': 'Mozilla/5.0'})
        print(f"  Cookies: {session.cookies.get_dict()}")
    except Exception as e:
        print(f"  Failed to get homepage: {e}")
        return

    url = "https://srp.com.tr/view/front/modules_/volvo/controller.php"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://srp.com.tr/page/spare-parts',
        'Origin': 'https://srp.com.tr'
    }
    
    part_id = "3115359480" 
    
    # Attempt 1: POST with Session
    print("  👉 Trying POST with action='search' + Cookies...")
    try:
        data = {'action': 'search', 'keyword': part_id}
        res = session.post(url, data=data, headers=headers, timeout=10)
        print(f"  Status: {res.status_code}")
        print(f"  Response: {res.text[:1000]}") # Show more
        
        # Check if json
        try:
            print(f"  JSON: {res.json()}")
        except:
            pass
            
    except Exception as e:
        print(f"  Error: {e}")

if __name__ == "__main__":
    test_ajax()
