"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

export function ProjectGallery({ images, title }: { images: string[], title: string }) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // We duplicate the images 5 times to create a massive track for seamless scrolling.
  // [ chunk 0 ] [ chunk 1 ] [ chunk 2 (start) ] [ chunk 3 ] [ chunk 4 ]
  const extendedImages = [...images, ...images, ...images, ...images, ...images];
  const middleChunkIndex = 2; // Start in the middle chunk

  useEffect(() => {
    if (!images || images.length === 0 || !scrollRef.current) return;
    
    const container = scrollRef.current;
    const item = container.firstElementChild as HTMLElement;
    if (!item) return;
    
    const isMobile = window.innerWidth < 640;
    const gap = isMobile ? 16 : 24;
    const itemWidth = item.clientWidth;
    const chunkWidth = images.length * (itemWidth + gap);
    
    // Instantly jump to the middle chunk on mount
    container.scrollLeft = chunkWidth * middleChunkIndex;
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsReady(true);
  }, [images.length]);

  useEffect(() => {
    if (!isReady || !scrollRef.current) return;
    
    const handleScroll = () => {
      const container = scrollRef.current;
      if (!container) return;
      const item = container.firstElementChild as HTMLElement;
      if (!item) return;
      
      const isMobile = window.innerWidth < 640;
      const gap = isMobile ? 16 : 24;
      const itemWidth = item.clientWidth;
      const chunkWidth = images.length * (itemWidth + gap);
      
      // Calculate current active index relative to the original array
      const rawScrollIndex = Math.round(container.scrollLeft / (itemWidth + gap));
      setActiveIndex(Math.abs(rawScrollIndex) % images.length);

      // Infinite Loop Logic:
      if (container.scrollLeft <= chunkWidth * 1.5) {
        container.style.scrollBehavior = 'auto'; // Disable smooth snap temporarily
        container.scrollLeft += chunkWidth;
        container.style.scrollBehavior = ''; // Re-enable
      } else if (container.scrollLeft >= chunkWidth * 3.5) {
        container.style.scrollBehavior = 'auto';
        container.scrollLeft -= chunkWidth;
        container.style.scrollBehavior = '';
      }
    };

    const container = scrollRef.current;
    container.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isReady, images.length]);

  // Keyboard navigation & body scroll lock for modal
  useEffect(() => {
    if (modalIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalIndex(null);
      if (e.key === 'ArrowLeft') setModalIndex((i) => (i! - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setModalIndex((i) => (i! + 1) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [modalIndex, images.length]);

  if (!images || images.length === 0) return null;

  const scrollByAmount = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    const item = container.firstElementChild as HTMLElement;
    if (!item) return;
    
    const isMobile = window.innerWidth < 640;
    const gap = isMobile ? 16 : 24;
    const itemWidth = item.clientWidth;
    
    const scrollAmount = direction === 'left' ? -(itemWidth + gap) : (itemWidth + gap);
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const scrollToThumbnail = (targetOriginalIndex: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const item = container.firstElementChild as HTMLElement;
    if (!item) return;
    
    const isMobile = window.innerWidth < 640;
    const gap = isMobile ? 16 : 24;
    const itemWidth = item.clientWidth;
    
    const currentRawIndex = Math.round(container.scrollLeft / (itemWidth + gap));
    const currentChunkStartIndex = Math.floor(currentRawIndex / images.length) * images.length;
    
    let targetRawIndex = currentChunkStartIndex + targetOriginalIndex;
    
    if (targetRawIndex - currentRawIndex > images.length / 2) {
      targetRawIndex -= images.length;
    } else if (currentRawIndex - targetRawIndex > images.length / 2) {
      targetRawIndex += images.length;
    }
    
    container.scrollTo({ left: targetRawIndex * (itemWidth + gap), behavior: 'smooth' });
  };

  const nextModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setModalIndex((i) => (i! + 1) % images.length);
  };
  const prevModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setModalIndex((i) => (i! - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className={`mb-8 flex flex-col items-center gap-8 w-full transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
          {/* Left Arrow */}
          {images.length > 2 && (
            <button 
              onClick={() => scrollByAmount('left')}
              className="p-3 rounded-full bg-(--color-surface) border border-(--color-border-subtle) hover:bg-(--color-surface-hover) hover:border-(--color-accent) transition-all text-(--color-text-secondary) hover:text-(--color-accent) shrink-0 hidden sm:block shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            className="flex-1 flex overflow-x-auto gap-4 sm:gap-6 snap-x snap-mandatory scrollbar-hide w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {extendedImages.map((imgUrl, rawIndex) => {
              const originalIndex = rawIndex % images.length;
              return (
                <div 
                  key={`${rawIndex}-${originalIndex}`}
                  className={`shrink-0 aspect-16/10 sm:aspect-video relative overflow-hidden cursor-zoom-in snap-center sm:snap-start
                    ${images.length === 1 ? 'w-full max-w-7xl mx-auto' : 'w-full sm:w-[calc(50%-0.75rem)]'}
                  `}
                  onClick={() => setModalIndex(originalIndex)}
                >
                  <Image 
                    src={imgUrl}
                    alt={`${title} gallery image ${originalIndex + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors pointer-events-none" />
                  <div className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 rounded-full bg-(--color-surface)/80 backdrop-blur text-(--color-text-secondary) opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          {images.length > 2 && (
            <button 
              onClick={() => scrollByAmount('right')}
              className="p-3 rounded-full bg-(--color-surface) border border-(--color-border-subtle) hover:bg-(--color-surface-hover) hover:border-(--color-accent) transition-all text-(--color-text-secondary) hover:text-(--color-accent) shrink-0 hidden sm:block shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}
        </div>

        {/* Thumbnail Navigator (Tiny) */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 flex-wrap px-4">
            {images.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => scrollToThumbnail(index)}
                className={`relative aspect-video w-16 sm:w-20 rounded-md overflow-hidden border-2 transition-all ${
                  index === activeIndex 
                    ? 'border-(--color-accent) shadow-md' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                aria-label={`Jump to image ${index + 1}`}
              >
                <Image 
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {modalIndex !== null && (
        <div 
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setModalIndex(null)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-10"
            onClick={() => setModalIndex(null)}
            aria-label="Close modal"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <div 
            className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4 sm:mx-12 flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <Image 
              src={images[modalIndex]}
              alt={`${title} gallery image ${modalIndex + 1} full view`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {images.length > 1 && (
            <>
              <button 
                onClick={prevModal}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-5 rounded-full bg-black/20 hover:bg-black/60 text-white/70 hover:text-white transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8 sm:w-12 sm:h-12" />
              </button>
              
              <button 
                onClick={nextModal}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-5 rounded-full bg-black/20 hover:bg-black/60 text-white/70 hover:text-white transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8 sm:w-12 sm:h-12" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
