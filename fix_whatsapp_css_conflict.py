#!/usr/bin/env python3
import re

def fix_whatsapp_css_conflict():
    """Fix WhatsApp CSS conflict in the original directory"""
    
    # Read the CSS file
    with open('assets/css/styles.css', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update the whatsapp-float CSS to work with Tailwind classes
    new_whatsapp_css = '''/* WhatsApp float button */
.whatsapp-float {
  position: fixed;
  bottom: 20px;
  right: 80px; /* Positioned to the left of back-to-top button */
  width: 50px; /* Same size as back-to-top button */
  height: 50px; /* Same size as back-to-top button */
  border-radius: 50%;
  text-align: center;
  font-size: 24px; /* Slightly smaller icon to fit better */
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  text-decoration: none;
}

.whatsapp-float:hover {
  transform: scale(1.1);
}'''
    
    # Replace the existing whatsapp-float CSS
    content = re.sub(r'/\* WhatsApp float button \*/\s*\.whatsapp-float \{[\s\S]*?\}\s*\.whatsapp-float:hover \{[\s\S]*?\}', 
                    new_whatsapp_css, 
                    content)
    
    # Write back the updated CSS
    with open('assets/css/styles.css', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ WhatsApp CSS conflict fixed!")

if __name__ == "__main__":
    fix_whatsapp_css_conflict()
