import os
import time
import json
import subprocess
from datetime import datetime

# Configuration
INTERVAL_HOURS = 4
LOG_FILE = "daemon_log.txt"
STATS_FILE = "stats_tracker.json"
ENGINE_SCRIPT = "run_autonomous_extraction.py"
OUTPUT_CSV = "master_autonomous_export.csv"

def log_message(message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"[{timestamp}] {message}"
    print(entry)
    with open(LOG_FILE, "a") as f:
        f.write(entry + "\n")

def get_part_count():
    if not os.path.exists(OUTPUT_CSV):
        return 0
    try:
        with open(OUTPUT_CSV, "r") as f:
            # -1 for header
            return max(0, sum(1 for line in f) - 1)
    except:
        return 0

def update_stats(new_parts_found):
    stats = {"history": [], "total_parts": 0}
    if os.path.exists(STATS_FILE):
        try:
            with open(STATS_FILE, "r") as f:
                stats = json.load(f)
        except:
            pass
    
    total = get_part_count()
    stats["history"].append({
        "timestamp": datetime.now().isoformat(),
        "new_parts": new_parts_found,
        "total_so_far": total
    })
    stats["total_parts"] = total
    stats["last_run"] = datetime.now().isoformat()
    
    with open(STATS_FILE, "w") as f:
        json.dump(stats, f, indent=4)

def run_cycle():
    log_message("🚀 Starting new intelligence extraction cycle...")
    
    start_count = get_part_count()
    
    try:
        # Run the V7 engine
        result = subprocess.run(
            ["python3", ENGINE_SCRIPT],
            capture_output=True,
            text=True,
            timeout=1800 # 30 min timeout
        )
        
        if result.returncode == 0:
            log_message("✅ Cycle completed successfully.")
            end_count = get_part_count()
            found = end_count - start_count
            log_message(f"📊 Analysis: Discovered {found} new parts. Total in DB: {end_count}")
            update_stats(found)
        else:
            log_message(f"❌ Cycle failed with exit code {result.returncode}")
            log_message(f"Error details: {result.stderr[:500]}")
            
    except subprocess.TimeoutExpired:
        log_message("⚠️ Cycle timed out after 30 minutes.")
    except Exception as e:
        log_message(f"💥 Unexpected error: {str(e)}")

if __name__ == "__main__":
    log_message("⚙️ PTC Intelligence Daemon Initialized.")
    log_message(f"🕒 Schedule: Every {INTERVAL_HOURS} hours.")
    
    # Run first cycle immediately
    run_cycle()
    
    while True:
        log_message(f"💤 Sleeping for {INTERVAL_HOURS} hours until next sweep...")
        time.sleep(INTERVAL_HOURS * 3600)
        run_cycle()
