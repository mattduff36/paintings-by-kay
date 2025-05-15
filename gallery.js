document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('fullGallery');
    const overlay = document.querySelector('.fullscreen-overlay');
    const fullscreenImage = document.querySelector('.fullscreen-image');
    const closeButton = document.querySelector('.close-fullscreen');

    // Function to open fullscreen overlay
    function openFullscreen(imageSrc) {
        // Convert the source to use the desktop version for fullscreen
        const desktopSrc = imageSrc.replace(/\/mobile\/|\/tablet\//, '/desktop/');
        fullscreenImage.src = desktopSrc;
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Function to close fullscreen overlay
    function closeFullscreen() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        // Clear the image source to free up memory
        fullscreenImage.src = '';
    }

    // Add click event to close button
    closeButton.addEventListener('click', closeFullscreen);

    // Close overlay when clicking outside the image
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeFullscreen();
        }
    });

    // Add keyboard support for closing
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.style.display === 'block') {
            closeFullscreen();
        }
    });

    // Gallery images with descriptive names
    const galleryImages = [
        { id: 'gallery1', name: 'original-canvas-painting-mansfield-1' },
        { id: 'gallery2', name: 'nature-painting-nottinghamshire-1' },
        { id: 'gallery3', name: 'local-artist-painting-mansfield-1' },
        { id: 'gallery4', name: 'original-canvas-painting-mansfield-2' },
        { id: 'gallery5', name: 'nature-painting-nottinghamshire-2' },
        { id: 'gallery6', name: 'local-artist-painting-mansfield-2' },
        { id: 'gallery7', name: 'original-canvas-painting-mansfield-3' },
        { id: 'gallery8', name: 'nature-painting-nottinghamshire-3' },
        { id: 'gallery9', name: 'local-artist-painting-mansfield-3' },
        { id: 'gallery10', name: 'original-canvas-painting-mansfield-4' },
        { id: 'gallery11', name: 'nature-painting-nottinghamshire-4' },
        { id: 'gallery12', name: 'local-artist-painting-mansfield-4' },
        { id: 'gallery13', name: 'original-canvas-painting-mansfield-5' },
        { id: 'gallery14', name: 'nature-painting-nottinghamshire-5' },
        { id: 'gallery15', name: 'local-artist-painting-mansfield-5' },
        { id: 'gallery16', name: 'original-canvas-painting-mansfield-6' },
        { id: 'gallery17', name: 'nature-painting-nottinghamshire-6' },
        { id: 'gallery18', name: 'local-artist-painting-mansfield-6' },
        { id: 'gallery19', name: 'original-canvas-painting-mansfield-7' },
        { id: 'gallery20', name: 'nature-painting-nottinghamshire-7' },
        { id: 'gallery21', name: 'local-artist-painting-mansfield-7' },
        { id: 'gallery22', name: 'original-canvas-painting-mansfield-8' },
        { id: 'gallery23', name: 'nature-painting-nottinghamshire-8' },
        { id: 'gallery24', name: 'local-artist-painting-mansfield-8' },
        { id: 'gallery25', name: 'original-canvas-painting-mansfield-9' },
        { id: 'gallery26', name: 'nature-painting-nottinghamshire-9' },
        { id: 'gallery27', name: 'local-artist-painting-mansfield-9' },
        { id: 'gallery28', name: 'original-canvas-painting-mansfield-10' },
        { id: 'gallery29', name: 'nature-painting-nottinghamshire-10' },
        { id: 'gallery31', name: 'local-artist-painting-mansfield-10' },
        { id: 'gallery33', name: 'original-canvas-painting-mansfield-11' },
        { id: 'gallery34', name: 'nature-painting-nottinghamshire-11' },
        { id: 'gallery35', name: 'local-artist-painting-mansfield-11' },
        { id: 'gallery36', name: 'original-canvas-painting-mansfield-12' },
        { id: 'gallery37', name: 'nature-painting-nottinghamshire-12' },
        { id: 'gallery38', name: 'local-artist-painting-mansfield-12' },
        { id: 'gallery39', name: 'original-canvas-painting-mansfield-13' },
        { id: 'gallery40', name: 'nature-painting-nottinghamshire-13' }
    ];

    // Function to create optimized image element
    function createOptimizedImage(image) {
        const picture = document.createElement('picture');
        
        // Create source elements for different screen sizes and formats
        const sources = [
            {
                media: '(max-width: 768px)',
                srcset: `/images/gallery/mobile/${image.id}.webp`,
                type: 'image/webp'
            },
            {
                media: '(max-width: 1024px)',
                srcset: `/images/gallery/tablet/${image.id}.webp`,
                type: 'image/webp'
            },
            {
                srcset: `/images/gallery/desktop/${image.id}.webp`,
                type: 'image/webp'
            }
        ];

        // Add source elements
        sources.forEach(source => {
            const sourceElement = document.createElement('source');
            if (source.media) sourceElement.media = source.media;
            sourceElement.srcset = source.srcset;
            sourceElement.type = source.type;
            picture.appendChild(sourceElement);
        });

        // Create and add img element
        const img = document.createElement('img');
        img.src = `/images/gallery/desktop/${image.id}.webp`;
        img.alt = `Original canvas painting by Kay - ${image.name.replace(/-/g, ' ')}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.width = 1200;
        img.height = 'auto';
        
        // Add click event for fullscreen
        img.addEventListener('click', () => {
            openFullscreen(img.src);
        });

        picture.appendChild(img);
        return picture;
    }

    // Function to load gallery images
    function loadGalleryImages() {
        // Clear existing gallery items
        galleryGrid.innerHTML = '';

        // Create gallery items for each image
        galleryImages.forEach(image => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const picture = createOptimizedImage(image);
            galleryItem.appendChild(picture);
            galleryGrid.appendChild(galleryItem);
        });
    }

    // Initialize gallery
    loadGalleryImages();

    // Add error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.warn(`Failed to load image: ${this.src}`);
            this.src = '/images/placeholder.jpg';
            this.alt = 'Image failed to load';
        });
    });

    // Add error handling for fullscreen image
    fullscreenImage.addEventListener('error', function() {
        console.warn(`Failed to load fullscreen image: ${this.src}`);
        this.src = '/images/placeholder.jpg';
        this.alt = 'Image failed to load';
    });
}); 