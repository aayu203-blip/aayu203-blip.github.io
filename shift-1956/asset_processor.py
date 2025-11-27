import os

import cv2
import numpy as np

INPUT_FILE = "Gemini_Generated_Image_kxgzj0kxgzj0kxgz.png"
OUTPUT_DIR = "assets"
BG_THRESHOLD = 240


def process_spritesheet():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: {INPUT_FILE} not found.")
        return

    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    img = cv2.imread(INPUT_FILE)
    original = img.copy()
    h, w, _ = img.shape
    bg_height = int(h * 0.22)
    bg_y_start = h - bg_height
    background_strip = original[bg_y_start:h, 0:w]
    cv2.imwrite(f"{OUTPUT_DIR}/bg_tunnel.jpg", background_strip)
    print(f"Saved: {OUTPUT_DIR}/bg_tunnel.jpg")
    objects_area = img[0:bg_y_start, 0:w]
    gray = cv2.cvtColor(objects_area, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, BG_THRESHOLD, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    item_count = 0
    contours = sorted(contours, key=cv2.contourArea, reverse=True)
    for i, cnt in enumerate(contours):
        area = cv2.contourArea(cnt)
        if area < 500:
            continue
        x, y, cw, ch = cv2.boundingRect(cnt)
        sprite = objects_area[y:y + ch, x:x + cw]
        b, g, r = cv2.split(sprite)
        alpha = np.ones(b.shape, dtype=b.dtype) * 255
        sprite_gray = gray[y:y + ch, x:x + cw]
        _, mask = cv2.threshold(sprite_gray, BG_THRESHOLD, 255, cv2.THRESH_BINARY)
        alpha[mask == 255] = 0
        rgba = cv2.merge([b, g, r, alpha])
        if i == 0:
            filename = "dumper.png"
        elif i == 1:
            filename = "rock.png"
        elif i == 2:
            filename = "beam.png"
        else:
            filename = f"part_{item_count}.png"
            item_count += 1
        cv2.imwrite(f"{OUTPUT_DIR}/{filename}", rgba)
        print(f"Saved: {OUTPUT_DIR}/{filename}")
    print("\nProcessing Complete! Check the 'assets' folder.")


if __name__ == "__main__":
    process_spritesheet()

