"use client";
import { useEffect } from 'react';

export function FullscreenClient() {
  useEffect(() => {
    const overlay = document.querySelector('.fullscreen-overlay') as HTMLElement | null;
    const fullscreenImage = document.querySelector('.fullscreen-image') as HTMLImageElement | null;
    const closeButton = document.querySelector('.close-fullscreen') as HTMLElement | null;
    if (!overlay || !fullscreenImage || !closeButton) return;

    function openFullscreen(imageSrc: string) {
      if (!overlay || !fullscreenImage) return;
      const desktopSrc = imageSrc.replace(/\/mobile\//, '/desktop/').replace(/\/tablet\//, '/desktop/');
      fullscreenImage.src = desktopSrc;
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function closeFullscreen() {
      if (!overlay || !fullscreenImage) return;
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      fullscreenImage.src = '';
    }

    closeButton.addEventListener('click', closeFullscreen);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeFullscreen();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.style.display === 'block') closeFullscreen();
    });

    const images = document.querySelectorAll('#fullGallery .gallery-item picture img');
    images.forEach((img) => {
      img.addEventListener('click', () => openFullscreen((img as HTMLImageElement).src));
    });

    return () => {
      closeButton.removeEventListener('click', closeFullscreen);
      overlay.removeEventListener('click', () => {});
      document.removeEventListener('keydown', () => {} as any);
      images.forEach((img) => img.removeEventListener('click', () => {}));
    };
  }, []);

  return null;
}


