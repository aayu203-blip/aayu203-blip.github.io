import subprocess
import os
import sys

def build_styles():
    """Run the Tailwind CSS build process."""
    print("🎨 Building Styles...")
    
    # Paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    tailwind_binary = os.path.join(base_dir, "tailwindcss")
    input_css = os.path.join(base_dir, "src", "input.css")
    output_css = os.path.join(base_dir, "assets", "css", "main.css")
    
    # Check if binary exists
    if not os.path.exists(tailwind_binary):
        print(f"❌ Tailwind binary not found at: {tailwind_binary}")
        return False
        
    # Build command
    cmd = [
        tailwind_binary,
        "-i", input_css,
        "-o", output_css,
        "--minify"
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"✅ Styles built successfully: {output_css}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Style build failed: {e.stderr.decode()}")
        return False

if __name__ == "__main__":
    success = build_styles()
    if not success:
        sys.exit(1)
