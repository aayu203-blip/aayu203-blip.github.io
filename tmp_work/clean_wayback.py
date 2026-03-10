import re
import sys

def clean_html(html_content):
    # 1. Remove Wayback Machine scripts and styles from head
    head_cleanup_patterns = [
        r'<script src="//archive\.org/includes/athena\.js".*?</script>',
        r'<script type="text/javascript" src="https://web-static\.archive\.org/_static/js/bundle-playback\.js.*?"></script>',
        r'<script type="text/javascript" src="https://web-static\.archive\.org/_static/js/wombat\.js.*?"></script>',
        r'<script>window\.RufflePlayer=.*?</script>',
        r'<script type="text/javascript" src="https://web-static\.archive\.org/_static/js/ruffle/ruffle\.js"></script>',
        r'<script type="text/javascript">\s*__wm\.init\(.*?\);\s*</script>',
        r'<link rel="stylesheet" type="text/css" href="https://web-static\.archive\.org/_static/css/banner-styles\.css.*?" />',
        r'<link rel="stylesheet" type="text/css" href="https://web-static\.archive\.org/_static/css/iconochive\.css.*?" />',
        r'<!-- End Wayback Rewrite JS Include -->',
    ]
    for pattern in head_cleanup_patterns:
        html_content = re.sub(pattern, '', html_content, flags=re.DOTALL)

    # 2. Remove Wayback Machine toolbar and overlay blocks
    body_cleanup_patterns = [
        r'<!-- BEGIN WAYBACK TOOLBAR INSERT -->.*?<!-- END WAYBACK TOOLBAR INSERT -->',
        r'<div id="wm-ipp-base".*?</div>\s*</div>\s*</div>\s*</div>', 
        r'<div id="wm-ipp-print">.*?</div>',
    ]
    # More robust removal for wm-ipp-base
    html_content = re.sub(r'<div id="wm-ipp-base".*?</div>\s*</div>\s*</div>\s*</div>', '', html_content, flags=re.DOTALL)
    html_content = re.sub(r'<div id="wm-ipp-print">.*?</div>', '', html_content, flags=re.DOTALL)
    html_content = re.sub(r'<!-- BEGIN WAYBACK TOOLBAR INSERT -->.*?<!-- END WAYBACK TOOLBAR INSERT -->', '', html_content, flags=re.DOTALL)

    # 3. Clean up rewritten URLs
    # Pattern: https://web.archive.org/web/20260118141730/https://partstrading.com/ -> /
    html_content = re.sub(r'https?://web\.archive\.org/web/\d+(?:im_|js_)?/https?://partstrading\.com/', '/', html_content)
    # Pattern: /web/20260118141730/https://partstrading.com/ -> /
    html_content = re.sub(r'/web/\d+(?:im_|js_)?/https?://partstrading\.com/', '/', html_content)
    # Pattern: https://web.archive.org/web/20260118141730/ -> /
    html_content = re.sub(r'https?://web\.archive\.org/web/\d+(?:im_|js_)?/', '/', html_content)
    # Pattern: /web/20260118141730/ -> /
    html_content = re.sub(r'/web/\d+(?:im_|js_)?/', '/', html_content)

    # 4. Final polish: remove double slashes if any (except protocol)
    html_content = re.sub(r'(?<!:)/{2,}', '/', html_content)
    
    # 5. Restore specific local paths that might have been mangled
    html_content = html_content.replace('//archive.org/includes/athena.js', '') # Fallback

    return html_content

if __name__ == "__main__":
    with open(sys.argv[1], 'r') as f:
        content = f.read()
    cleaned = clean_html(content)
    with open(sys.argv[2], 'w') as f:
        f.write(cleaned)
