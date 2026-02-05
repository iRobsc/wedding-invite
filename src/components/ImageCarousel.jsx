import React, { useState, useRef, useEffect, useCallback } from 'react';

const ImageCarousel = ({ images, altText }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef(null);
    const dotsTrackRef = useRef(null);
    const dotRefs = useRef([]);
    const rafId = useRef(null);

    // Configuration
    const CELL_WIDTH = 14; // Fixed px width per dot "cell"

    // Initialize refs array
    useEffect(() => {
        dotRefs.current = dotRefs.current.slice(0, images.length);
    }, [images]);

    const updateDots = useCallback(() => {
        if (!scrollContainerRef.current) return;

        const { scrollLeft, clientWidth } = scrollContainerRef.current;
        if (clientWidth === 0) return;

        const scrollProgress = scrollLeft / clientWidth;

        // Update badge (low frequency)
        const newIndex = Math.round(scrollProgress);
        setCurrentIndex(prev => (prev !== newIndex ? newIndex : prev));

        // 1. ANIMATE DOTS (Inner Size/Color)
        images.forEach((_, index) => {
            const dot = dotRefs.current[index];
            if (!dot) return;

            const distance = Math.abs(scrollProgress - index);

            let size = 0;
            const activeColor = { r: 59, g: 130, b: 246 }; // #3B82F6
            const inactiveColor = { r: 203, g: 213, b: 225 }; // #CBD5E1
            let r = inactiveColor.r, g = inactiveColor.g, b = inactiveColor.b;

            if (distance < 1) {
                size = 8 - (distance * 2);
                r = activeColor.r + (distance * (inactiveColor.r - activeColor.r));
                g = activeColor.g + (distance * (inactiveColor.g - activeColor.g));
                b = activeColor.b + (distance * (inactiveColor.b - activeColor.b));
            } else if (distance < 2) {
                const d = distance - 1;
                size = 6 - (d * 2);
            } else if (distance < 3) {
                const d = distance - 2;
                size = 4 - (d * 4);
                if (size < 0) size = 0;
            } else {
                size = 0;
            }

            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.backgroundColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
            dot.style.opacity = size > 0.5 ? 1 : 0;
        });

        // 2. ANIMATE TRACK (Centering)
        if (dotsTrackRef.current) {
            // We want the current 'progress' point to be at the center of the screen (0px relative to left:50%)
            // The center of wrapper i is at: i * CELL_WIDTH + (CELL_WIDTH / 2)
            // So translation = -1 * (progress * CELL_WIDTH + CELL_WIDTH / 2)
            const translateX = -1 * ((scrollProgress * CELL_WIDTH) + (CELL_WIDTH / 2));
            dotsTrackRef.current.style.transform = `translateX(${translateX}px)`;
        }

    }, [images]);

    const handleScroll = () => {
        if (!rafId.current) {
            rafId.current = requestAnimationFrame(() => {
                updateDots();
                rafId.current = null;
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => updateDots(), 0);
        window.addEventListener('resize', updateDots);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateDots);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [updateDots]);

    return (
        <div className="carousel-container">
            {/* Image Scroller */}
            <div
                className="carousel-scroller"
                ref={scrollContainerRef}
                onScroll={handleScroll}
            >
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`${altText} ${index + 1}`}
                        className="carousel-image"
                    />
                ))}
            </div>

            {/* 1/x Badge */}
            {images.length > 1 && (
                <div className="carousel-badge">
                    {Math.min(currentIndex + 1, images.length)}/{images.length}
                </div>
            )}

            {/* Pagination Dots Track */}
            <div
                className="carousel-dots-container"
                style={{ opacity: images.length > 1 ? 1 : 0 }}
            >
                <div className="carousel-dots-track" ref={dotsTrackRef}>
                    {images.map((_, idx) => (
                        <div key={idx} className="carousel-dot-wrapper">
                            <div
                                ref={el => dotRefs.current[idx] = el}
                                className="carousel-dot-inner"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageCarousel;
