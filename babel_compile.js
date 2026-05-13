const fs = require('fs');
const babel = require('@babel/core');

const src = fs.readFileSync('/tmp/ptc_homepage.jsx', 'utf8');
const result = babel.transformSync(src, {
  presets: [
    ['@babel/preset-react', { runtime: 'classic' }],
    ['@babel/preset-env', { targets: 'defaults', modules: false }]
  ],
  compact: true,
  minified: false
});

fs.writeFileSync('/tmp/ptc_homepage_compiled.js', result.code);
console.log('Compiled! Size:', result.code.length, 'chars');
