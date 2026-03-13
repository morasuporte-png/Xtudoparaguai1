const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.xlsx'));

let masterTree = {};

files.forEach(file => {
  const filePath = path.join(dir, file);
  try {
    const workbook = xlsx.readFile(filePath);
    masterTree[file] = {};

    workbook.SheetNames.forEach(sheetName => {
      // Ignore generic/empty sheets
      if (sheetName.toLowerCase().includes('planilha') || sheetName.toLowerCase().includes('página') || sheetName === 'MARCAS ' || sheetName === 'OUTLET' || sheetName === 'ONGS') {
        return;
      }

      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      
      let subcategories = [];
      data.forEach(row => {
        row.forEach(cell => {
          if (cell && typeof cell === 'string' && cell.trim() !== '' && cell !== sheetName) {
            subcategories.push(cell.trim());
          }
        });
      });

      // Deduplicate and clean up
      subcategories = [...new Set(subcategories)].filter(s => s.toLowerCase() !== 'subcategoria pai' && s.toLowerCase() !== 'xx');

      masterTree[file][sheetName] = subcategories;
    });

  } catch (error) {
    console.error(`Error reading ${file}: ${error.message}`);
  }
});

fs.writeFileSync('category_tree.json', JSON.stringify(masterTree, null, 2));
console.log('Category tree written to category_tree.json');
