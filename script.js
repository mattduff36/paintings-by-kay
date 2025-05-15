document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    emailjs.init("-EYjcIt9a7RneUgK9");

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
    const submitButton = document.getElementById('submit-button');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            try {
                // Get form data
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Send email
                await emailjs.send(
                    "paintingsbykay",
                    "template_gif0qpg",
                    {
                        from_name: data.name,
                        from_email: data.email,
                        message: data.message
                    }
                );
                
                // Show success message
                formStatus.textContent = 'Thank you for your message! I will get back to you soon.';
                formStatus.className = 'form-status success';
                contactForm.reset();
            } catch (error) {
                // Show error message
                formStatus.textContent = 'Sorry, there was an error sending your message. Please try again later.';
                formStatus.className = 'form-status error';
                console.error('Error sending email:', error);
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
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