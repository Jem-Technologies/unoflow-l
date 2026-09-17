const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

async function build() {
  console.log('📦 Building unoflow-l package distributions...');

  const srcFile = path.join(__dirname, '..', 'src', 'index.js');
  const distDir = path.join(__dirname, '..', 'dist');

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  let content = fs.readFileSync(srcFile, 'utf8');

  // 1. IIFE / Browser Global Bundle (logos.js)
  let iifeBundle = '/* unoflow-l — Client brand & app logo resolver */\n' + content;
  fs.writeFileSync(path.join(distDir, 'logos.js'), iifeBundle);

  // 2. ESM Bundle (logos.esm.js)
  let esmBundle = '/* unoflow-l — ES Module */\n' + content + '\nexport default Logos;\n';
  fs.writeFileSync(path.join(distDir, 'logos.esm.js'), esmBundle);

  // 3. CommonJS Bundle (logos.cjs.js)
  let cjsBundle = '/* unoflow-l — CommonJS */\n' + content + '\nmodule.exports = Logos;\n';
  fs.writeFileSync(path.join(distDir, 'logos.cjs.js'), cjsBundle);

  // 4. Minified Bundle (logos.min.js)
  const minifiedResult = await minify(iifeBundle, {
    compress: true,
    mangle: true
  });

  if (minifiedResult.error) {
    throw minifiedResult.error;
  }

  fs.writeFileSync(path.join(distDir, 'logos.min.js'), minifiedResult.code);

  console.log('✨ unoflow-l build complete!');
  console.log('   - dist/logos.js');
  console.log('   - dist/logos.min.js');
  console.log('   - dist/logos.esm.js');
  console.log('   - dist/logos.cjs.js');
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
