const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.xlsx'));

let analysis = '';

files.forEach(file => {
  const filePath = path.join(dir, file);
  try {
    const workbook = xlsx.readFile(filePath);
    analysis += `\n=========================================\n`;
    analysis += `FILE: ${file}\n`;
    analysis += `SHEETS: ${workbook.SheetNames.join(', ')}\n\n`;

    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      if (data.length > 0) {
        analysis += `  Sheet: ${sheetName}\n`;
        analysis += `  Headers: ${JSON.stringify(data[0])}\n`;
        analysis += `  First 2 rows of data:\n`;
        if (data[1]) analysis += `    Row 1: ${JSON.stringify(data[1])}\n`;
        if (data[2]) analysis += `    Row 2: ${JSON.stringify(data[2])}\n`;
      }
    });

  } catch (error) {
    analysis += `Error reading ${file}: ${error.message}\n`;
  }
});

fs.writeFileSync('excel_analysis.txt', analysis);
console.log('Analysis written to excel_analysis.txt');
