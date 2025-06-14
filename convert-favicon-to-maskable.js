import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertFaviconToMaskable() {
  // Try multiple source files in order of preference
  const possibleSources = [
    { path: path.join(__dirname, 'public', 'favicon-eb.png'), name: 'favicon-eb.png' },
    { path: path.join(__dirname, 'public', 'android-chrome-512x512.png'), name: 'android-chrome-512x512.png' },
    { path: path.join(__dirname, 'public', 'favicon.ico'), name: 'favicon.ico' }
  ];
  
  console.log('🔄 Converting favicon to maskable icons...\n');
  
  let sourcePath = null;
  let sourceName = null;
  
  // Find the first available source file
  for (const source of possibleSources) {
    if (fs.existsSync(source.path)) {
      sourcePath = source.path;
      sourceName = source.name;
      break;
    }
  }
  
  if (!sourcePath) {
    console.error('❌ No suitable source file found. Please ensure you have one of these files:');
    console.error('   - favicon-eb.png (preferred)');
    console.error('   - android-chrome-512x512.png');
    console.error('   - favicon.ico');
    return;
  }
  
  console.log(`📄 Using source file: ${sourceName}`);
  
  try {
    // Read the source file
    const faviconBuffer = fs.readFileSync(sourcePath);
    const publicDir = path.join(__dirname, 'public');
    
    // Generate maskable icons with different sizes
    const sizes = [192, 512];
    
    for (const size of sizes) {
      const outputPath = path.join(publicDir, `maskable-icon-${size}x${size}.png`);
      
      // Calculate safe area (maskable icons need padding to prevent clipping)
      // Using 80% ensures the icon stays within the safe area for all mask shapes
      const iconSize = Math.floor(size * 0.8);
      const padding = Math.floor((size - iconSize) / 2);
      
      // Create a white background canvas
      const canvas = sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      });
      
      // Resize the source icon and place it centered with padding
      const resizedIcon = await sharp(faviconBuffer)
        .resize(iconSize, iconSize, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toBuffer();
      
      // Composite the icon onto the canvas
      await canvas
        .composite([{
          input: resizedIcon,
          top: padding,
          left: padding
        }])
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated maskable-icon-${size}x${size}.png`);
    }
    
    console.log('\n🎉 Conversion complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Test your maskable icons at: https://maskable.app/editor');
    console.log('2. Upload the generated maskable-icon-512x512.png to test');
    console.log('3. The icons use 80% safe area - adjust if needed');
    console.log('4. Your web manifest is configured to use these maskable icons');
    console.log('\n💡 Tips:');
    console.log('   • Maskable icons should work well in circular, rounded, and square shapes');
    console.log('   • White background helps with visibility on different launcher themes');
    console.log('   • Test on Android device or Chrome DevTools for best results');
    
  } catch (error) {
    console.error('❌ Error converting favicon:', error.message);
    console.error('💡 Try using a different source file or check file permissions');
  }
}

convertFaviconToMaskable().catch(console.error); 