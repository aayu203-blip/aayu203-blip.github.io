import requests
from bs4 import BeautifulSoup
import os
import urllib.parse

def find_and_download_pdf():
    query = "Epiroc COP spare parts filetype:pdf"
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    pdf_url = None
    for a in soup.find_all('a', class_='result__url'):
        href = a.get('href', '')
        if '.pdf' in href.lower():
            # Sometimes DDG obscures the URL
            actual_url = href
            if 'uddg=' in href:
                actual_url = urllib.parse.unquote(href.split('uddg=')[1].split('&')[0])
            if actual_url.startswith('http') and actual_url.lower().endswith('.pdf'):
                pdf_url = actual_url
                break
                
    if not pdf_url:
        print("Couldn't find a PDF link in the search results.")
        # Fallback to a hardcoded known parts manual URL if DDG blocks us
        pdf_url = "https://www.epiroc.com/content/dam/epiroc/water-well/secoroc-cop-m6-down-the-hole-hammer/Secoroc_COP_M6_down-the-hole_hammer_-_Epiroc.pdf"
        
    print(f"Downloading PDF from: {pdf_url}")
    
    pdf_resp = requests.get(pdf_url, headers=headers, stream=True)
    if pdf_resp.status_code == 200:
        os.makedirs("tools/intelligence_engine/oem_manuals", exist_ok=True)
        filename = "tools/intelligence_engine/oem_manuals/epiroc_sample_manual.pdf"
        with open(filename, 'wb') as f:
            for chunk in pdf_resp.iter_content(1024):
                f.write(chunk)
        print(f"Saved to {filename}")
    else:
        print(f"Failed to download PDF. Status code: {pdf_resp.status_code}")

find_and_download_pdf()
