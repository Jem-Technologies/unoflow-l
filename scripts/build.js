const fs = require('fs');
const path = require('path');

console.log('📦 Building unobits-logos package distributions...');

const srcFile = path.join(__dirname, '..', 'src', 'index.js');
const distDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

let content = fs.readFileSync(srcFile, 'utf8');

// 1. IIFE / Browser Global Bundle (logos.js)
let iifeBundle = '/* unobits-logos — Client logo getter & runtime browser cache */\n' + content;
fs.writeFileSync(path.join(distDir, 'logos.js'), iifeBundle);

// 2. ESM Bundle (logos.esm.js)
let esmBundle = '/* unobits-logos — ES Module */\n' + content + '\nexport default Logos;\n';
fs.writeFileSync(path.join(distDir, 'logos.esm.js'), esmBundle);

// 3. CommonJS Bundle (logos.cjs.js)
let cjsBundle = '/* unobits-logos — CommonJS */\n' + content + '\nmodule.exports = Logos;\n';
fs.writeFileSync(path.join(distDir, 'logos.cjs.js'), cjsBundle);

// 4. Minified Bundle (logos.min.js)
let minified = iifeBundle
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/.*/g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}();:=,+\-\/*])\s*/g, '$1');

fs.writeFileSync(path.join(distDir, 'logos.min.js'), minified);

console.log('✨ unobits-logos build complete!');
console.log('   - dist/logos.js');
console.log('   - dist/logos.min.js');
console.log('   - dist/logos.esm.js');
console.log('   - dist/logos.cjs.js');
