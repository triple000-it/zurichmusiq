#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple image compression using Node.js built-in capabilities
// This is a basic implementation - for production, use proper image optimization tools

const publicDir = path.join(__dirname, '..', 'public');
const largeImages = ['STUDIO-S.png', 'STUDIO-XL.png'];

console.log('🚨 CRITICAL: Large images detected!');
console.log('📁 Public directory contents:');

// List all files in public directory with sizes
fs.readdirSync(publicDir).forEach(file => {
  const filePath = path.join(publicDir, file);
  const stats = fs.statSync(filePath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  if (stats.isFile()) {
    const status = largeImages.includes(file) ? '🚨 HUGE' : '✅ OK';
    console.log(`  ${status} ${file}: ${sizeInMB}MB`);
  }
});

console.log('\n📋 RECOMMENDATIONS:');
console.log('1. Compress STUDIO-S.png (11MB) and STUDIO-XL.png (12MB)');
console.log('2. Use WebP format for better compression');
console.log('3. Consider using multiple sizes for responsive images');
console.log('4. Implement lazy loading for these images');

console.log('\n🛠️  To compress images manually:');
console.log('1. Use online tools like TinyPNG, Squoosh, or ImageOptim');
console.log('2. Or install image optimization tools:');
console.log('   npm install -g imagemin-cli');
console.log('   imagemin public/*.png --out-dir=public/optimized --plugin=pngquant');

// Create a backup directory
const backupDir = path.join(publicDir, 'backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
  console.log('\n📁 Created backup directory: public/backup');
}

// Copy large images to backup
largeImages.forEach(image => {
  const sourcePath = path.join(publicDir, image);
  const backupPath = path.join(backupDir, image);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, backupPath);
    console.log(`📋 Backed up ${image} to backup directory`);
  }
});

console.log('\n✅ Backup completed. You can now safely compress the original images.');
