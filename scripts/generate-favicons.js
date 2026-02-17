const sharp = require('sharp');
const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'favicon.svg');
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
];

const outDir = path.join(__dirname, '..');

async function generate() {
  const svg = fs.readFileSync(svgPath);
  const pngBuffers = [];
  for (const { name, size } of sizes) {
    const buffer = await sharp(svg)
      .resize(size, size)
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(outDir, name), buffer);
    console.log('Created:', name);
    if (size <= 32) pngBuffers.push(buffer);
  }
  const ico = await toIco(pngBuffers);
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), ico);
  console.log('Created: favicon.ico');
}

generate().catch(console.error);
