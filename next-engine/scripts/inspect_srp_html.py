import requests

def inspect_srp_html():
    part_id = "3115359480" # Known valid part
    url = "https://srp.com.tr/search/?keyword=Volvo"
    print(f"🕵️ Dumping HTML for: {url}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        res = requests.get(url, headers=headers, timeout=15)
        with open('srp_debug.html', 'w') as f:
            f.write(res.text)
        print("Saved to srp_debug.html")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_srp_html()
