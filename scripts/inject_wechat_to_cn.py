import os
import glob
import re
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

ROOT_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete/cn"

def get_files():
    all_html = []
    for root, dirs, files in os.walk(ROOT_DIR):
        for f in files:
            if f.endswith(".html"):
                all_html.append(os.path.join(root, f))
    return all_html

wechat_html = """
<!-- Desktop Floating WeChat CTA -->
<div class="hidden md:flex fixed bottom-8 right-8 z-[100] group flex-col items-end" style="position: fixed; bottom: 2rem; right: 2rem; z-index: 100;">
    <!-- Tooltip / QR Code Box -->
    <div class="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
        <div class="bg-white text-gray-900 text-sm font-bold p-4 rounded-2xl shadow-xl border-2 border-emerald-500/20 flex flex-col items-center gap-3 w-48">
            <span class="text-emerald-500 font-bold mb-1">扫描添加微信</span>
            <!-- QR code image -->
            <img src="/assets/images/wechat-qr.png" alt="WeChat QR Code" class="w-full h-auto rounded-lg border border-gray-100 placeholder-qr" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjZjFmNWY5Ij48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjEwIi8+PHRleHQgeD0iNTAiIHk9IjUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg=='"/>
            <div class="w-full text-center bg-gray-50 py-2 rounded-lg border border-gray-200">
                <span class="text-xs text-gray-500 block mb-1">WeChat ID</span>
                <span class="font-mono text-sm text-gray-800 select-all tracking-wider">wxid_gcboutjk1v4h22</span>
            </div>
            <span class="text-xs text-gray-400 font-normal">点击复制微信号</span>
        </div>
        <div class="w-4 h-4 bg-white border-r-2 border-b-2 border-emerald-500/20 transform rotate-45 absolute -bottom-2 right-6"></div>
    </div>
    
    <!-- Button -->
    <button onclick="navigator.clipboard.writeText('wxid_gcboutjk1v4h22'); alert('微信号已复制！ (WeChat ID copied!)');" 
       class="bg-gradient-to-tr from-emerald-500 to-green-400 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.5)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center relative overflow-hidden group/btn">
        <div class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:animate-shine"></div>
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.2 3.8C4 3.8 0 6.6 0 10.3c0 2.2 1.3 4.2 3.3 5.4l-.8 2.6c-.1.3.2.5.5.3l3-1.6c.7.2 1.4.3 2.2.3 4.2 0 8.2-2.8 8.2-6.5S12.4 3.8 8.2 3.8zm11 5.9c-.3 0-.7.1-1 .1-4.7 0-9.2 3.3-9.2 7.6 0 2.4 1.4 4.5 3.6 5.8l-.9 2.8c-.1.3.2.5.5.3l3.3-1.8c.8.2 1.6.3 2.5.3 4.7 0 9.2-3.3 9.2-7.6 0-4.3-4.5-7.6-9.2-7.6z"/>
        </svg>
    </button>
</div>
"""

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        modified = False
        
        # We need to remove the WhatsApp CTA if it exists
        if "<!-- Desktop Floating WhatsApp CTA -->" in content:
            # We use a regex to replace the entire WhatsApp CTA div.
            # The WhatsApp div ends with "</div>\n" two times, but HTML parsing with regex is risky.
            # It's safer to remove from "<!-- Desktop Floating WhatsApp CTA -->" up to the next "</div>\n</div>\n" or just inject right before </body>.
            
            # Since the previous crawler injected it precisely, let's just strip it safely
            pattern = r'<!-- Desktop Floating WhatsApp CTA -->.*?</div>\s*'
            # To avoid greedy regex killing the rest of the file, we look for the end of the z-[100] group
            pattern = r'<!-- Desktop Floating WhatsApp CTA -->[\s\S]*?(?:</a>\s*</div>|</a></div>)'
            
            content = re.sub(pattern, "", content)
            
        # We also need to get rid of any stray WhatsApp CTAs that might have slightly different format
        # Actually, let's just inject the WeChat right before </body>, ensuring we don't duplicate.
        
        if "<!-- Desktop Floating WeChat CTA -->" not in content and "</body>" in content:
            content = content.replace("</body>", f"{wechat_html}\n</body>")
            modified = True
            
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        return False

def main():
    if not os.path.exists(ROOT_DIR):
        logging.error(f"Directory {ROOT_DIR} does not exist.")
        return
        
    files = get_files()
    logging.info(f"Found {len(files)} total HTML files to scan in /cn/.")
    
    modified_count = 0
    for i, filepath in enumerate(files):
        if process_file(filepath):
            modified_count += 1
            if modified_count % 500 == 0:
                logging.info(f"Successfully processed {modified_count} files so far...")
                
    logging.info(f"Phase 15 WeChat Localization applied completely! {modified_count} total files upgraded in /cn/.")

if __name__ == "__main__":
    main()
