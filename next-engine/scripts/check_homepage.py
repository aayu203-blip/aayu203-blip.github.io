import requests
from bs4 import BeautifulSoup

def check_homepage():
    url = "https://www.sparepower.co.za/"
    print(f"🏠 Checking Homepage: {url}")
    
    try:
        res = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=15)
        soup = BeautifulSoup(res.text, 'html.parser')
        
        # Find all links
        links = soup.find_all('a', href=True)
        
        # Filter for potential brand categories
        potential_brands = []
        keywords = ['scania', 'caterpillar', 'komatsu', 'jcb', 'perkins', 'deutz', 'cummins']
        
        for l in links:
            href = l['href']
            text = l.text.lower()
            if any(k in href.lower() or k in text for k in keywords):
                print(f"  Found Potential Brand: {l.text.strip()} -> {href}")
                potential_brands.append(href)
                
    except Exception as e:
        print(f"Homepage Check Failed: {e}")

if __name__ == "__main__":
    check_homepage()
