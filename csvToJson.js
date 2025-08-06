const fs = require('fs');

// read CSV file
const csv = fs.readFileSync('crimedataleeds.csv', 'utf-8');

// convert CSV to JSON
function parseCsv(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // ignore space
        const values = lines[i].split(',');
        const obj = {};

        headers.forEach((header, j) => {
            let value = values[j]?.trim();
            if (header.trim() === 'Latitude' || header.trim() === 'Longitude') {
                value = parseFloat(value); // convert string to number
            }
            obj[header.trim()] = value;
        });

        result.push(obj);
    }

    return result;
}

const jsonData = parseCsv(csv);
console.log(jsonData);

fs.writeFileSync('crimeData.json', JSON.stringify(jsonData, null, 2), 'utf-8');
console.log('✅ data has been stored as crimeData.json');
