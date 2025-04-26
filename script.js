document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Load featured gallery images
    const featuredGallery = document.getElementById('featuredGallery');
    
    // Featured images - these will be loaded from the featured folder
    const featuredImages = [
        {
            src: '/images/featured/featured1.jpg',
            title: 'Featured Painting 1'
        },
        {
            src: '/images/featured/featured2.jpg',
            title: 'Featured Painting 2'
        },
        {
            src: '/images/featured/featured3.jpg',
            title: 'Featured Painting 3'
        }
    ];

    featuredImages.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.title;
        
        galleryItem.appendChild(img);
        featuredGallery.appendChild(galleryItem);
    });

    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Fullscreen overlay functionality
    const overlay = document.querySelector('.fullscreen-overlay');
    const fullscreenImage = document.querySelector('.fullscreen-image');
    const closeButton = document.querySelector('.close-fullscreen');

    // Function to open fullscreen overlay
    window.openFullscreen = function(imageSrc) {
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

    // Add click event to all gallery images
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            // Get the full path of the image
            const imagePath = img.src;
            openFullscreen(imagePath);
        });
    });

    // Add click event to all gallery page images
    document.querySelectorAll('#fullGallery .gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            // Get the full path of the image
            const imagePath = img.src;
            openFullscreen(imagePath);
        });
    });

    // Add click event to all featured images
    document.querySelectorAll('#featuredGallery .gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            // Get the full path of the image
            const imagePath = img.src;
            openFullscreen(imagePath);
        });
    });
}); 