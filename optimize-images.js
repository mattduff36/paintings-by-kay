const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
    desktop: { width: 1200 },
    tablet: { width: 800 },
    mobile: { width: 400 },
    quality: 80
};

// Source directories
const sourceDirs = {
    logo: 'images/Logo_transbg_big.png',
    profile: 'images/Kay.JPEG',
    gallery: 'images/gallery/original/'
};

// Target directories
const targetDirs = {
    logos: 'images/logos',
    profile: 'images/profile',
    gallery: {
        desktop: 'images/gallery/desktop',
        tablet: 'images/gallery/tablet',
        mobile: 'images/gallery/mobile'
    }
};

// Gallery image naming scheme
const galleryImageNames = {
    'gallery1': 'original-canvas-painting-mansfield-1',
    'gallery2': 'nature-painting-nottinghamshire-1',
    'gallery3': 'local-artist-painting-mansfield-1',
    'gallery4': 'original-canvas-painting-mansfield-2',
    'gallery5': 'nature-painting-nottinghamshire-2',
    'gallery6': 'local-artist-painting-mansfield-2',
    'gallery7': 'original-canvas-painting-mansfield-3',
    'gallery8': 'nature-painting-nottinghamshire-3',
    'gallery9': 'local-artist-painting-mansfield-3',
    'gallery10': 'original-canvas-painting-mansfield-4',
    'gallery11': 'nature-painting-nottinghamshire-4',
    'gallery12': 'local-artist-painting-mansfield-4',
    'gallery13': 'original-canvas-painting-mansfield-5',
    'gallery14': 'nature-painting-nottinghamshire-5',
    'gallery15': 'local-artist-painting-mansfield-5',
    'gallery16': 'original-canvas-painting-mansfield-6',
    'gallery17': 'nature-painting-nottinghamshire-6',
    'gallery18': 'local-artist-painting-mansfield-6',
    'gallery19': 'original-canvas-painting-mansfield-7',
    'gallery20': 'nature-painting-nottinghamshire-7',
    'gallery21': 'local-artist-painting-mansfield-7',
    'gallery22': 'original-canvas-painting-mansfield-8',

    'gallery24': 'local-artist-painting-mansfield-8',
    'gallery25': 'original-canvas-painting-mansfield-9',
    'gallery26': 'nature-painting-nottinghamshire-9',
    'gallery27': 'local-artist-painting-mansfield-9',
    'gallery28': 'original-canvas-painting-mansfield-10',
    'gallery29': 'nature-painting-nottinghamshire-10',

    'gallery33': 'original-canvas-painting-mansfield-11',
    'gallery34': 'nature-painting-nottinghamshire-11',
    'gallery35': 'local-artist-painting-mansfield-11',
    'gallery36': 'original-canvas-painting-mansfield-12',
    'gallery37': 'nature-painting-nottinghamshire-12',
    'gallery38': 'local-artist-painting-mansfield-12',
    'gallery39': 'local-artist-painting-mansfield-13',
    'gallery40': 'nature-painting-nottinghamshire-13'
};

async function ensureDirectoryExists(dir) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

async function optimizeImage(inputPath, outputPath, options) {
    try {
        await sharp(inputPath)
            .resize(options.width)
            .webp({ quality: config.quality })
            .toFile(outputPath);
        console.log(`Optimized: ${outputPath}`);
    } catch (error) {
        console.error(`Error optimizing ${inputPath}:`, error);
    }
}

async function createPlaceholderImage() {
    const placeholderPath = path.join('images', 'placeholder.jpg');
    try {
        // Create a simple gray placeholder image
        await sharp({
            create: {
                width: 800,
                height: 600,
                channels: 3,
                background: { r: 200, g: 200, b: 200 }
            }
        })
        .jpeg({ quality: 80 })
        .toFile(placeholderPath);
        console.log('Created placeholder image');
    } catch (error) {
        console.error('Error creating placeholder image:', error);
    }
}

async function processLogo() {
    const inputPath = sourceDirs.logo;
    const outputPath = path.join(targetDirs.logos, 'logo-transparent.webp');
    await ensureDirectoryExists(targetDirs.logos);
    await optimizeImage(inputPath, outputPath, { width: 200 });
}

async function processProfile() {
    const inputPath = sourceDirs.profile;
    const outputPath = path.join(targetDirs.profile, 'kay-profile.webp');
    const mobileOutputPath = path.join(targetDirs.profile, 'kay-profile-mobile.webp');
    
    await ensureDirectoryExists(targetDirs.profile);
    await optimizeImage(inputPath, outputPath, { width: config.desktop.width });
    await optimizeImage(inputPath, mobileOutputPath, { width: config.mobile.width });
}

async function processGallery() {
    const files = await fs.readdir(sourceDirs.gallery);
    const imageFiles = files.filter(file => 
        file.toLowerCase().endsWith('.jpeg') || 
        file.toLowerCase().endsWith('.jpg')
    );

    for (const file of imageFiles) {
        const inputPath = path.join(sourceDirs.gallery, file);
        const baseName = path.parse(file).name;

        // Skip if not in our naming scheme
        if (!galleryImageNames[baseName]) {
            console.warn(`Skipping ${baseName} - not in naming scheme`);
            continue;
        }

        // Process for each size
        for (const [size, options] of Object.entries(config)) {
            if (size !== 'quality') {
                const outputPath = path.join(
                    targetDirs.gallery[size],
                    `${baseName}.webp`
                );
                await ensureDirectoryExists(targetDirs.gallery[size]);
                await optimizeImage(inputPath, outputPath, options);
            }
        }
    }
}

async function main() {
    try {
        console.log('Starting image optimization...');
        await ensureDirectoryExists('images');
        await createPlaceholderImage();
        await processLogo();
        await processProfile();
        await processGallery();
        console.log('Image optimization complete!');
    } catch (error) {
        console.error('Error during optimization:', error);
    }
}

main(); 