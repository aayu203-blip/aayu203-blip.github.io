import requests
from bs4 import BeautifulSoup

def verify_miner():
    # Target: SRP Search Page
    url = "https://srp.com.tr/page/spare-parts"
    print(f"⛏️ Miner requesting: {url}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        res = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {res.status_code}")
        
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            title = soup.title.string.strip() if soup.title else "No Title"
            print(f"Page Title: {title}")
            
            # Check for search input
            inputs = soup.find_all('input')
            print(f"Found {len(inputs)} input fields.")
            for i in inputs:
                print(f" - Input Name: {i.get('name')}, ID: {i.get('id')}, Type: {i.get('type')}")
                
    except Exception as e:
        print(f"Miner Failed: {e}")

if __name__ == "__main__":
    verify_miner()
