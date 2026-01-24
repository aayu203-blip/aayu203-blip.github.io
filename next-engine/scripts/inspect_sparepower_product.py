import requests

def inspect_sparepower_product():
    # Valid product URL found in previous steps
    url = "https://www.sparepower.co.za/parts/parts-to-suit-volvo/"
    print(f"🕵️ Dumping Product HTML: {url}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        res = requests.get(url, headers=headers, timeout=15)
        with open('sparepower_product.html', 'w') as f:
            f.write(res.text)
        print("Saved to sparepower_product.html")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_sparepower_product()
