const sharp = require('sharp');
const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..');
const pngSource = path.join(outDir, 'favicon-source.png');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generate() {
  if (!fs.existsSync(pngSource)) {
    throw new Error('Need favicon-source.png in project root');
  }
  const input = sharp(fs.readFileSync(pngSource));
  const pngBuffers = [];
  for (const { name, size } of sizes) {
    const buffer = await input.clone().resize(size, size).png().toBuffer();
    fs.writeFileSync(path.join(outDir, name), buffer);
    console.log('Created:', name);
    if (name === 'favicon-16x16.png' || name === 'favicon-32x32.png') pngBuffers.push(buffer);
  }
  const ico = await toIco(pngBuffers);
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), ico);
  console.log('Created: favicon.ico');
}

generate().catch(console.error);
