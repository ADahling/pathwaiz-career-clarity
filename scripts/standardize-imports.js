const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript and TSX files
const files = glob.sync('src/**/*.{ts,tsx}');

// Regular expression to match relative imports within the src directory
const relativeImportRegex = /from\s+['"](\.\.\/?)+([^'"]+)['"]/g;

let updatedFilesCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const dirname = path.dirname(file);
  
  // Replace relative imports with alias imports
  const updatedContent = content.replace(relativeImportRegex, (match, dots, importPath) => {
    // Calculate the absolute path from the relative path
    const absolutePath = path.resolve(dirname, dots, importPath);
    
    // Convert to alias path if it's within src
    if (absolutePath.includes('/src/')) {
      const aliasPath = absolutePath.split('/src/')[1];
      return `from '@/${aliasPath}'`;
    }
    
    return match;
  });
  
  if (content !== updatedContent) {
    fs.writeFileSync(file, updatedContent, 'utf8');
    console.log(`Updated imports in ${file}`);
    updatedFilesCount++;
  }
});

console.log(`\nStandardization complete. Updated ${updatedFilesCount} files.`);
