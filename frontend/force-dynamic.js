// Script to add 'export const dynamic = "force-dynamic"' to all page files
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function addDynamicExport() {
  const pageFiles = await glob('src/app/**/page.{ts,tsx,js,jsx}', { cwd: __dirname });
  
  for (const file of pageFiles) {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if dynamic export already exists
    if (!content.includes('export const dynamic')) {
      // Add at the top after imports
      const lines = content.split('\n');
      const insertIndex = lines.findIndex(line => 
        !line.trim().startsWith('import') && 
        !line.trim().startsWith('//') && 
        !line.trim().startsWith('/*') &&
        !line.trim().startsWith('*') &&
        !line.trim().startsWith('*/') &&
        line.trim() !== ''
      );
      
      if (insertIndex !== -1) {
        lines.splice(insertIndex, 0, '\nexport const dynamic = "force-dynamic";\n');
        fs.writeFileSync(filePath, lines.join('\n'));
        console.log(`✅ Added dynamic export to: ${file}`);
      }
    }
  }
  
  console.log('✅ All pages configured for dynamic rendering');
}

addDynamicExport().catch(console.error);
