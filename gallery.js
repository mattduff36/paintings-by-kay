document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('fullGallery');
    const imageFolder = '/images/gallery/';
    const overlay = document.querySelector('.fullscreen-overlay');
    const fullscreenImage = document.querySelector('.fullscreen-image');
    const closeButton = document.querySelector('.close-fullscreen');

    // Function to open fullscreen overlay
    function openFullscreen(imageSrc) {
        fullscreenImage.src = imageSrc;
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when overlay is open
    }

    // Function to close fullscreen overlay
    function closeFullscreen() {
        overlay.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Add click event to close button
    closeButton.addEventListener('click', closeFullscreen);

    // Close overlay when clicking outside the image
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeFullscreen();
        }
    });

    // Static list of gallery images
    const galleryImages = [
        'gallery1.JPEG',
        'gallery2.JPEG',
        'gallery3.JPEG',
        'gallery4.JPEG',
        'gallery5.JPEG',
        'gallery6.JPEG',
        'gallery7.JPEG',
        'gallery8.JPEG',
        'gallery9.JPEG',
        'gallery10.JPEG',
        'gallery11.JPEG',
        'gallery12.JPEG',
        'gallery13.JPEG',
        'gallery14.JPEG',
        'gallery15.JPEG',
        'gallery16.JPEG',
        'gallery17.JPEG',
        'gallery18.JPEG',
        'gallery19.JPEG',
        'gallery20.JPEG',
        'gallery21.JPEG',
        'gallery22.JPEG',
        'gallery23.JPEG',
        'gallery24.JPEG',
        'gallery25.JPEG',
        'gallery26.JPEG',
        'gallery27.JPEG',
        'gallery28.JPEG',
        'gallery29.JPEG',
        'gallery31.JPEG',
        'gallery33.JPEG',
        'gallery34.JPEG',
        'gallery35.JPEG',
        'gallery36.JPEG',
        'gallery37.JPEG',
        'gallery38.JPEG',
        'gallery39.JPEG',
        'gallery40.JPEG'
    ];

    // Function to load gallery images
    function loadGalleryImages() {
        // Clear existing gallery items
        galleryGrid.innerHTML = '';

        // Create gallery items for each image
        galleryImages.forEach(image => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = `${imageFolder}${image}`;
            img.alt = `Gallery Image ${image.match(/\d+/)[0]}`;
            
            // Add click event for fullscreen
            img.addEventListener('click', () => {
                openFullscreen(img.src);
            });
            
            galleryItem.appendChild(img);
            galleryGrid.appendChild(galleryItem);
        });
    }

    loadGalleryImages();
}); 