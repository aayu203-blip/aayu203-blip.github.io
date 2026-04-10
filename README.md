# Cricket Data Scraper

A comprehensive web scraper for extracting domestic cricket player statistics and information from ESPNcricinfo.

## Features

- **Player Information**: Name, date of birth, age, playing role, batting/bowling hand
- **Team History**: All teams played for
- **Comprehensive Statistics**: First Class, List A, and T20s formats
  - Batting: Matches, runs, average, strike rate, centuries, fifties
  - Bowling: Wickets, average, economy, best figures
  - Fielding: Catches, stumpings
- **Multiple Export Formats**: JSON, CSV, SQLite database
- **Flexible Input**: Single player, multiple players, tournament squads, or search by name

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Scrape a Single Player

```bash
python main.py --url "https://www.espncricinfo.com/cricketers/ashwin-hebbar-801019" --format json
```

### Scrape Multiple Players from File

Create a text file with player URLs (one per line):
```
https://www.espncricinfo.com/cricketers/player1-123456
https://www.espncricinfo.com/cricketers/player2-789012
```

Then run:
```bash
python main.py --urls-file players.txt --format csv
```

### Find Players from Tournament

```bash
python main.py --tournament-url "https://www.espncricinfo.com/series/vijay-hazare-trophy-2024-25/squads" --format sqlite
```

### Search for Player by Name

```bash
python main.py --search "Virat Kohli" --format json
```

### Export to All Formats

```bash
python main.py --url "https://www.espncricinfo.com/cricketers/ashwin-hebbar-801019" --format all
```

## Command Line Options

- `--url`: Single player profile URL to scrape
- `--urls-file`: File containing player URLs (one per line)
- `--tournament-url`: Tournament page URL to find players
- `--team-url`: Team page URL to find players
- `--search`: Search for player by name
- `--format`: Output format (json, csv, sqlite, all) - default: json
- `--output-dir`: Output directory - default: output
- `--output-name`: Output filename prefix - default: players_data
- `--delay`: Delay between requests in seconds - default: 1.5
- `--max-players`: Maximum number of players to scrape (optional)

## Output Formats

### JSON
Single file with all player data in nested structure:
```json
[
  {
    "player_id": "801019",
    "url": "https://www.espncricinfo.com/cricketers/ashwin-hebbar-801019",
    "personal_info": {
      "name": "Ashwin Hebbar",
      "full_name": "Kattingeri Ashwin Hebbar",
      "date_of_birth": "November 15, 1995",
      "playing_role": "Opening Batter",
      "batting_hand": "Right hand Bat",
      "teams": ["Andhra", "Delhi Capitals"]
    },
    "statistics": {
      "batting": {
        "FC": {"Mat": "50", "Runs": "3500", ...},
        "List A": {"Mat": "30", "Runs": "1200", ...}
      },
      "bowling": {...}
    }
  }
]
```

### CSV
Three separate files:
- `players_personal_info.csv`: Personal information
- `players_batting_stats.csv`: Batting statistics by format
- `players_bowling_stats.csv`: Bowling statistics by format

### SQLite
Relational database with three tables:
- `players`: Personal information
- `batting_stats`: Batting statistics
- `bowling_stats`: Bowling statistics

## Data Fields

### Personal Information
- Player ID
- Name / Full Name
- Date of Birth
- Age
- Playing Role (e.g., Opening Batter, All-rounder)
- Batting Hand (e.g., Right hand Bat)
- Bowling Style (e.g., Right arm Medium)
- Teams Played For

### Batting Statistics (per format)
- Matches, Innings, Not Outs
- Runs, High Score, Average
- Balls Faced, Strike Rate
- 100s, 50s, 4s, 6s
- Catches, Stumpings

### Bowling Statistics (per format)
- Matches, Innings, Balls
- Runs, Wickets
- Best Bowling in Innings (BBI)
- Best Bowling in Match (BBM)
- Average, Economy, Strike Rate
- 4-wicket hauls, 5-wicket hauls, 10-wicket hauls

## Important Notes

⚠️ **Terms of Service**: Web scraping may violate ESPNcricinfo's Terms of Service. This tool is for educational purposes only. For production use, consider using official cricket data APIs.

⚠️ **Rate Limiting**: The scraper includes a delay between requests (default 1.5 seconds) to be respectful to the server. Adjust with `--delay` if needed.

⚠️ **Website Changes**: The scraper may break if ESPNcricinfo changes their website structure.

## Examples

### Example 1: Scrape a domestic player and export to JSON
```bash
python main.py --url "https://www.espncricinfo.com/cricketers/sarfaraz-khan-642525" --format json
```

### Example 2: Scrape multiple players and export to CSV
```bash
# Create players.txt with URLs
echo "https://www.espncricinfo.com/cricketers/ashwin-hebbar-801019" > players.txt
echo "https://www.espncricinfo.com/cricketers/sarfaraz-khan-642525" >> players.txt

# Run scraper
python main.py --urls-file players.txt --format csv --output-name domestic_players
```

### Example 3: Export to SQLite database for analysis
```bash
python main.py --urls-file players.txt --format sqlite --output-name cricket_db
```

Then query the database:
```bash
sqlite3 output/cricket_db.db "SELECT name, playing_role, teams FROM players;"
```

## Project Structure

```
.
├── main.py              # CLI interface
├── scraper.py           # Core scraping logic
├── player_finder.py     # Player URL discovery
├── data_exporter.py     # Data export (JSON/CSV/SQLite)
├── requirements.txt     # Python dependencies
├── README.md           # This file
└── output/             # Output directory (created automatically)
```

## License

This project is for educational purposes only. Please respect ESPNcricinfo's Terms of Service and use responsibly.
