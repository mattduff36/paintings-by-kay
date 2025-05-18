const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512
};

const sourceImage = path.join(__dirname, 'images', 'logos', 'logo-transparent.webp');
const outputDir = path.join(__dirname, 'images', 'logos');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generateFavicons() {
    try {
        // Read the source image
        const image = sharp(sourceImage);
        
        // Generate each favicon size
        for (const [filename, size] of Object.entries(sizes)) {
            await image
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .png()
                .toFile(path.join(outputDir, filename));
            
            console.log(`Generated ${filename}`);
        }
        
        console.log('All favicons generated successfully!');
    } catch (error) {
        console.error('Error generating favicons:', error);
    }
}

generateFavicons(); 