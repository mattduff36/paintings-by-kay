document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('fullGallery');
    const imageFolder = 'images/gallery/';
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

    // Function to load gallery images
    function loadGalleryImages() {
        // Clear existing gallery items
        galleryGrid.innerHTML = '';

        // Get all images from the server
        fetch(imageFolder)
            .then(response => response.text())
            .then(html => {
                // Create a temporary DOM element to parse the HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Get all links (files) from the directory listing
                const links = Array.from(doc.querySelectorAll('a'))
                    .map(link => link.href)
                    .filter(href => href.match(/gallery\d+\.JPEG$/i))
                    .map(href => href.split('/').pop());

                // Sort images numerically
                links.sort((a, b) => {
                    const numA = parseInt(a.match(/\d+/)[0]);
                    const numB = parseInt(b.match(/\d+/)[0]);
                    return numA - numB;
                });

                // Create gallery items for each image
                links.forEach(image => {
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
            })
            .catch(error => {
                console.error('Error loading gallery images:', error);
                // Fallback to static list if fetch fails
                const fallbackImages = Array.from({length: 40}, (_, i) => `gallery${i + 1}.JPEG`);
                fallbackImages.forEach(image => {
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
            });
    }

    loadGalleryImages();
}); 