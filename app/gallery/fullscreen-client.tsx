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

    const onOverlayClick = (e: Event) => {
      if (e.target === overlay) closeFullscreen();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && overlay.style.display === 'block') closeFullscreen();
    };

    closeButton.addEventListener('click', closeFullscreen);
    overlay.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onKeyDown);

    const images = Array.from(document.querySelectorAll('#fullGallery .gallery-item picture img')) as HTMLImageElement[];
    const onImageClick = (ev: Event) => {
      const target = ev.currentTarget as HTMLImageElement;
      openFullscreen(target.src);
    };
    images.forEach((img) => img.addEventListener('click', onImageClick));

    return () => {
      closeButton.removeEventListener('click', closeFullscreen);
      overlay.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onKeyDown);
      images.forEach((img) => img.removeEventListener('click', onImageClick));
    };
  }, []);

  return null;
}


