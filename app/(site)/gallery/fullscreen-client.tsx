"use client";
import { useEffect } from 'react';

export function FullscreenClient() {
  useEffect(() => {
    const overlay = document.querySelector('.fullscreen-overlay') as HTMLElement | null;
    const fullscreenImage = document.querySelector('.fullscreen-image') as HTMLImageElement | null;
    const closeButton = document.querySelector('.close-fullscreen') as HTMLElement | null;
    if (!overlay || !fullscreenImage || !closeButton) return;

    let scale = 1;
    let originX = 0;
    let originY = 0;
    let isPanning = false;
    let startX = 0;
    let startY = 0;

    function applyTransform() {
      if (!fullscreenImage) return;
      fullscreenImage.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
      fullscreenImage.style.transformOrigin = 'center center';
      fullscreenImage.style.willChange = 'transform';
      fullscreenImage.style.cursor = scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in';
    }

    function resetTransform() {
      scale = 1;
      originX = 0;
      originY = 0;
      isPanning = false;
      applyTransform();
    }

    function openFullscreen(imageSrc: string) {
      if (!overlay || !fullscreenImage) return;
      fullscreenImage.src = imageSrc;
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
      resetTransform();
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
      const frontSrc = target.getAttribute('data-front-src');
      const src = frontSrc || target.src.replace(/\/mobile\//, '/desktop/').replace(/\/tablet\//, '/desktop/');
      openFullscreen(src);
    };
    images.forEach((img) => img.addEventListener('click', onImageClick));

    // Zoom with wheel
    const onWheel = (e: WheelEvent) => {
      if (overlay.style.display !== 'block') return;
      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * 0.1;
      const next = Math.min(5, Math.max(1, scale + delta));
      if (next !== scale) {
        scale = next;
        applyTransform();
      }
    };
    overlay.addEventListener('wheel', onWheel, { passive: false });

    // Double click to toggle zoom
    const onDblClick = () => {
      scale = scale > 1 ? 1 : 2;
      originX = 0;
      originY = 0;
      applyTransform();
    };
    fullscreenImage.addEventListener('dblclick', onDblClick);

    // Pan with mouse drag when zoomed
    const onMouseDown = (e: MouseEvent) => {
      if (scale === 1) return;
      isPanning = true;
      startX = e.clientX - originX;
      startY = e.clientY - originY;
      applyTransform();
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      originX = e.clientX - startX;
      originY = e.clientY - startY;
      applyTransform();
    };
    const onMouseUp = () => {
      isPanning = false;
      applyTransform();
    };
    fullscreenImage.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      closeButton.removeEventListener('click', closeFullscreen);
      overlay.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onKeyDown);
      images.forEach((img) => img.removeEventListener('click', onImageClick));
      overlay.removeEventListener('wheel', onWheel as any);
      fullscreenImage.removeEventListener('dblclick', onDblClick);
      fullscreenImage.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return null;
}


