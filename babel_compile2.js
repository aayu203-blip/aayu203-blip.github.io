const fs = require('fs');
const babel = require('@babel/core');

const src = fs.readFileSync('/tmp/ptc_homepage.jsx', 'utf8');

// Only convert JSX → React.createElement, leave all modern JS untouched
const result = babel.transformSync(src, {
  presets: [
    ['@babel/preset-react', { runtime: 'classic' }]
  ],
  compact: false,
  minified: false
});

fs.writeFileSync('/tmp/ptc_homepage_compiled2.js', result.code);
console.log('Compiled! Size:', result.code.length, 'chars');

// Check for obvious issues
const code = result.code;
if (code.includes('_interopRequireDefault')) console.log('WARNING: interop helpers present');
if (code.includes('require(')) console.log('WARNING: require() calls present');
console.log('First 200 chars:', code.slice(0, 200));
