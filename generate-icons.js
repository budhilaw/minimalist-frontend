import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcons() {
  const sourcePath = path.join(__dirname, 'public', 'favicon-eb.png');
  const publicDir = path.join(__dirname, 'public');
  
  // Read the source image
  const sourceBuffer = fs.readFileSync(sourcePath);
  
  // Generate regular icons
  const regularSizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 }
  ];
  
  // Generate maskable icons (with safe area padding)
  const maskableSizes = [
    { name: 'maskable-icon-192x192.png', size: 192 },
    { name: 'maskable-icon-512x512.png', size: 512 }
  ];
  
  console.log('Generating regular icons...');
  for (const { name, size } of regularSizes) {
    const outputPath = path.join(publicDir, name);
    
    try {
      await sharp(sourceBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`✗ Failed to generate ${name}:`, error.message);
    }
  }
  
  console.log('\nGenerating maskable icons...');
  for (const { name, size } of maskableSizes) {
    const outputPath = path.join(publicDir, name);
    
    try {
      // For maskable icons, we need to add padding to ensure the icon
      // stays within the safe area (minimum 40% of the icon size)
      const iconSize = Math.floor(size * 0.75); // Use 75% of canvas for the icon
      const padding = Math.floor((size - iconSize) / 2);
      
      // Create a canvas with the icon centered and padded
      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
        }
      })
      .composite([
        {
          input: await sharp(sourceBuffer)
            .resize(iconSize, iconSize, {
              fit: 'contain',
              background: { r: 255, g: 255, b: 255, alpha: 0 }
            })
            .png()
            .toBuffer(),
          top: padding,
          left: padding
        }
      ])
      .png()
      .toFile(outputPath);
      
      console.log(`✓ Generated ${name} (${size}x${size}) with safe area padding`);
    } catch (error) {
      console.error(`✗ Failed to generate ${name}:`, error.message);
    }
  }
  
  console.log('\n📱 Icon generation complete!');
  console.log('\n💡 Tips for maskable icons:');
  console.log('   - Ensure your logo/icon is centered');
  console.log('   - Keep important content within 75% of the canvas');
  console.log('   - Test your icons at https://maskable.app/editor');
}

generateIcons().catch(console.error); 