#!/usr/bin/env python3
"""
fix_brand_mislabels.py
Finds parts in wrong brand directories (based on OEM part number prefix)
and corrects the brand label throughout the page.

Currently detects: CAT (Caterpillar) parts in non-CAT directories.

USAGE
-----
  python3 fix_brand_mislabels.py            # dry run (lists affected files)
  python3 fix_brand_mislabels.py --write    # apply fixes

WHAT IT CHANGES (in each mislabeled file)
------------------------------------------
  - Title:       "Komatsu Camshaft Gp" → "Caterpillar Camshaft Gp"
  - H1:          same
  - Body tags:   brand chip "Komatsu" → "Caterpillar"
  - Description: "Komatsu Camshaft" → "Caterpillar Camshaft" (part name only)
  - Schema.org:  brand.name, additionalProperty value, seller.name etc.
  - Keywords meta, OG tags, Twitter tags
  - Does NOT change: /komatsu/ in URLs, directory paths, href attributes
"""

import re
import sys
import argparse
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parent

# OEM brand directories to scan (exclude /cat/ since those are already correct)
BRAND_DIRS = ["komatsu", "hitachi", "volvo", "kobelco", "john-deere", "scania"]

# CAT (Caterpillar) part number prefixes — 2-char alphanumeric, exclusive to CAT
CAT_PREFIXES = {
    "0R","1R","2P","2W","3G","3S","4I","4P","4T","4V",
    "5I","5P","5S","5V","6I","6T","6V","7C","7E","7F",
    "7G","7K","7N","7T","7W","7X","8E","8I","8L","8N",
    "8P","8T","8W","8Y","9C","9J","9K","9L","9M","9N",
    "9P","9R","9S","9W","9X","9Y",
}

# Maps directory brand → correct brand name when CAT prefix is detected
# (wrong_brand_in_page → correct_brand)
BRAND_CORRECTIONS = {
    "komatsu":   ("Komatsu",   "Caterpillar"),
    "hitachi":   ("Hitachi",   "Caterpillar"),
    "volvo":     ("Volvo",     "Caterpillar"),
    "kobelco":   ("Kobelco",   "Caterpillar"),
    "john-deere":("John Deere","Caterpillar"),
    "scania":    ("Scania",    "Caterpillar"),
}


def is_cat_part(filename: str) -> bool:
    stem = Path(filename).stem.upper().replace("-", "")
    # Must be at least 6 chars (e.g. 7W3798) and third char must be a digit
    if len(stem) < 6:
        return False
    if not stem[2].isdigit():
        return False
    prefix = stem[:2]
    return prefix in CAT_PREFIXES


def fix_brand(html: str, wrong: str, correct: str) -> str:
    """
    Replace brand label `wrong` with `correct` in visible content and metadata,
    but NOT inside href/src/url attributes (to preserve URL paths like /komatsu/).
    """

    # 1. JSON-LD schema.org: "name": "Komatsu" → "name": "Caterpillar"
    #    Only within the <script type="application/ld+json"> blocks
    def fix_schema_block(m):
        return m.group(0).replace(f'"{wrong}"', f'"{correct}"')
    html = re.sub(
        r'<script\s+type="application/ld\+json">[\s\S]*?</script>',
        fix_schema_block,
        html
    )

    # 2. <title> text
    html = re.sub(
        rf'(<title>[^<]*){re.escape(wrong)}([^<]*</title>)',
        rf'\g<1>{correct}\2',
        html
    )

    # 3. <meta name="description"/"keywords"> content (NOT href attributes)
    html = re.sub(
        rf'(content="[^"]*){re.escape(wrong)}([^"]*")',
        rf'\g<1>{correct}\2',
        html
    )

    # 4. OG / Twitter meta content attributes (already covered by step 3)

    # 5. Visible text in the body — brand chip tags, H1, description text, table cells
    #    Strategy: replace "Komatsu" when NOT immediately preceded by "/" or "=" (URL context)
    #    and not in href/src attributes
    def replace_in_text(m):
        before = m.group(1)
        after = m.group(3)
        return before + correct + after

    # Match "Komatsu" NOT preceded by / or = or other URL-context chars
    html = re.sub(
        rf'((?<![/=\w])){re.escape(wrong)}((?![/\w]))',
        lambda m: correct,
        html
    )

    return html


def process_file(path: Path, wrong: str, correct: str, write: bool) -> bool:
    original = path.read_text(encoding="utf-8")
    fixed = fix_brand(original, wrong, correct)
    if fixed == original:
        return False
    if write:
        path.write_text(fixed, encoding="utf-8")
    return True


def main():
    parser = argparse.ArgumentParser(description="Fix brand mislabels on product pages.")
    parser.add_argument("--write", action="store_true", help="Write fixes (default: dry run)")
    args = parser.parse_args()

    total_found = 0
    total_fixed = 0

    for brand_dir in BRAND_DIRS:
        d = SITE_ROOT / brand_dir
        if not d.is_dir():
            continue

        wrong, correct = BRAND_CORRECTIONS[brand_dir]
        found = 0
        fixed = 0

        for path in d.rglob("*.html"):
            if not is_cat_part(path.stem):
                continue
            found += 1
            if process_file(path, wrong, correct, args.write):
                fixed += 1
                if not args.write and fixed <= 3:
                    print(f"  [WOULD FIX] {path.relative_to(SITE_ROOT)}: {wrong} → {correct}")

        if found:
            action = "Fixed" if args.write else "Would fix"
            print(f"{brand_dir}: {found} CAT parts found, {action} {fixed}")
        total_found += found
        total_fixed += fixed

    print(f"\nTotal: {total_found} mislabeled parts — {'fixed' if args.write else 'would fix'} {total_fixed}")
    if not args.write and total_found:
        print("Run with --write to apply.")


if __name__ == "__main__":
    main()
