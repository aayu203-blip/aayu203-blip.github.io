
(function() {
    const data = {
        url: window.location.href,
        player_id: window.location.href.match(/cricketers\/[^/]+-(\d+)/)?.[1] || '',
        personal_info: {},
        statistics: { batting: {}, bowling: {} }
    };
    
    // Extract player name
    const nameElem = document.querySelector('h1.ds-text-title-xl');
    if (nameElem) {
        data.personal_info.name = nameElem.textContent.trim();
    }
    
    // Extract personal information from grid
    const infoGrids = document.querySelectorAll('.ds-grid');
    infoGrids.forEach(grid => {
        const labels = grid.querySelectorAll('p.ds-text-tight-s');
        const values = grid.querySelectorAll('span.ds-text-title-xs');
        
        labels.forEach((label, idx) => {
            if (idx < values.length) {
                const labelText = label.textContent.trim().toLowerCase();
                const valueText = values[idx].textContent.trim();
                
                if (labelText.includes('full name') || labelText === 'name') {
                    data.personal_info.full_name = valueText;
                } else if (labelText.includes('born')) {
                    data.personal_info.date_of_birth = valueText;
                } else if (labelText.includes('age')) {
                    data.personal_info.age = valueText;
                } else if (labelText.includes('role') || labelText.includes('playing role')) {
                    data.personal_info.playing_role = valueText;
                } else if (labelText.includes('batting style') || labelText.includes('bat')) {
                    data.personal_info.batting_hand = valueText;
                } else if (labelText.includes('bowling style') || labelText.includes('bowl')) {
                    data.personal_info.bowling_style = valueText;
                }
            }
        });
    });
    
    // Extract teams
    const teams = new Set();
    const teamLinks = document.querySelectorAll('a[href*="/teams/"]');
    teamLinks.forEach(link => {
        const teamName = link.textContent.trim();
        if (teamName && teamName.length > 2) {
            teams.add(teamName);
        }
    });
    data.personal_info.teams = Array.from(teams);
    
    // Extract statistics from tables
    const tables = document.querySelectorAll('table.ds-table');
    tables.forEach(table => {
        const tableText = table.textContent.toLowerCase();
        let tableType = null;
        
        // Determine table type
        if (tableText.includes('runs') && tableText.includes('average')) {
            tableType = 'batting';
        } else if (tableText.includes('wickets') || tableText.includes('wkts')) {
            tableType = 'bowling';
        }
        
        if (!tableType) return;
        
        // Extract headers
        const headers = [];
        const headerCells = table.querySelectorAll('thead th');
        headerCells.forEach(cell => {
            headers.push(cell.textContent.trim());
        });
        
        // Extract rows
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 0) return;
            
            const formatName = cells[0].textContent.trim();
            const stats = {};
            
            for (let i = 1; i < cells.length && i < headers.length; i++) {
                stats[headers[i]] = cells[i].textContent.trim();
            }
            
            data.statistics[tableType][formatName] = stats;
        });
    });
    
    return JSON.stringify(data, null, 2);
})();
