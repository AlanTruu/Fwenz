import fs from 'fs';
import path from 'path';
const __dirname = import.meta.dirname;

// Common patterns to replace
const replacements = [
  // Colors
  { from: /rgb\(135, 206, 235\)/g, to: '$primary-color' },
  { from: /rgb\(41, 47, 54\)/g, to: '$dark-bg' },
  { from: /white/g, to: '$white' },
  { from: /black/g, to: '$black' },
  { from: /red/g, to: '$red' },
  { from: /lightblue/g, to: '$lightblue' },
  { from: /#D94126/g, to: '$danger' },
  { from: /#ddd/g, to: '$border-color' },
  
  // Spacing
  { from: /5px/g, to: '$spacing-xs' },
  { from: /10px/g, to: '$spacing-sm' },
  { from: /15px/g, to: '$spacing-md' },
  { from: /20px/g, to: '$spacing-lg' },
  { from: /30px/g, to: '$spacing-xl' },
  { from: /40px/g, to: '$spacing-xxl' },
  
  // Border radius
  { from: /border-radius: 5px/g, to: 'border-radius: $border-radius-sm' },
  { from: /border-radius: 6px/g, to: 'border-radius: $border-radius-md' },
  { from: /border-radius: 10px/g, to: 'border-radius: $border-radius-lg' },
  { from: /border-radius: 50%/g, to: 'border-radius: $border-radius-circle' },
  
  // Common sizes
  { from: /width : 300px/g, to: 'width: $input-width' },
  { from: /height : 40px/g, to: 'height: $input-height' },
  { from: /height : 30px/g, to: 'height: $button-height' },
  { from: /width : 300px/g, to: 'width: $button-width' },
  
  // Breakpoints
  { from: /@media\(min-width : 575px\)/g, to: '@include mobile' },
  { from: /@media \(min-width : 576px\)/g, to: '@include tablet' },
  
  // Font family
  { from: /font-family: "Karla", sans-serif/g, to: 'font-family: $font-family' },
  
  // Transitions
  { from: /transition: color 1 ease/g, to: 'transition: color $transition-normal' },
];

function convertCssToScss(cssContent) {
  let scssContent = cssContent;
  
  // Apply replacements
  replacements.forEach(({ from, to }) => {
    scssContent = scssContent.replace(from, to);
  });
  
  // Add imports at the top
  const imports = `@import '../variables';
@import '../mixins';

`;
  
  return imports + scssContent;
}

function convertFile(filePath) {
  try {
    const cssContent = fs.readFileSync(filePath, 'utf8');
    const scssContent = convertCssToScss(cssContent);
    
    // Create new file path
    const dir = path.dirname(filePath);
    const basename = path.basename(filePath, '.css');
    const newPath = path.join(dir, `${basename}.scss`);
    
    // Write new file
    fs.writeFileSync(newPath, scssContent);
    console.log(`Converted: ${filePath} -> ${newPath}`);
    
    return newPath;
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error.message);
    return null;
  }
}

// Convert all CSS files in theme directory
const themeDir = path.join(__dirname, 'src', 'theme');
const stylesDir = path.join(__dirname, 'src', 'styles', 'components');

if (!fs.existsSync(stylesDir)) {
  fs.mkdirSync(stylesDir, { recursive: true });
}

const cssFiles = fs.readdirSync(themeDir).filter(file => file.endsWith('.css'));

console.log('Converting CSS files to Sass...\n');

cssFiles.forEach(file => {
  const filePath = path.join(themeDir, file);
  const convertedPath = convertFile(filePath);
  
  if (convertedPath) {
    // Move to styles/components directory
    const newPath = path.join(stylesDir, file.replace('.css', '.scss'));
    fs.renameSync(convertedPath, newPath);
    console.log(`Moved to: ${newPath}`);
  }
});

console.log('\nConversion complete!');
console.log('\nNext steps:');
console.log('1. Update your component imports to use .scss files');
console.log('2. Test that all components work correctly');
console.log('3. Remove the old CSS files from the theme directory');
console.log('4. Update the components/_index.scss file with new imports'); 