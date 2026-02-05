import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

const ImageViewer = ({ images, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isClosing, setIsClosing] = useState(false);
    const [dimensions, setDimensions] = useState(() => ({
        width: Math.floor((window.innerWidth * 0.9) / 2) * 2,
        height: Math.floor((window.innerHeight * 0.9) / 2) * 2
    }));
    const [transitionsEnabled, setTransitionsEnabled] = useState(false);

    // Enable transitions after mount to prevent initial slide
    useEffect(() => {
        const timer = setTimeout(() => setTransitionsEnabled(true), 50);
        return () => clearTimeout(timer);
    }, []);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    // Layout Calculation Logic
    useEffect(() => {
        const calculateLayout = () => {
            const currentSrc = images[currentIndex];
            if (!currentSrc) return;

            const img = new Image();
            img.src = currentSrc;

            // If cached, this is fast. If not, wait for load.
            const updateSize = () => {
                const natW = img.naturalWidth || 800;
                const natH = img.naturalHeight || 600;

                // Constraints (90% of viewport), floored to EVEN integers
                const maxW = Math.floor((window.innerWidth * 0.9) / 2) * 2;
                const maxH = Math.floor((window.innerHeight * 0.9) / 2) * 2;

                // Calculate scale to fit
                const scale = Math.min(maxW / natW, maxH / natH);

                // Round to ensure EVEN integers
                const finalW = Math.floor((natW * scale) / 2) * 2;
                const finalH = Math.floor((natH * scale) / 2) * 2;

                setDimensions({ width: finalW, height: finalH });
            };

            if (img.complete) {
                updateSize();
            } else {
                img.onload = updateSize;
            }
        };

        calculateLayout();
        window.addEventListener('resize', calculateLayout);
        return () => window.removeEventListener('resize', calculateLayout);
    }, [currentIndex, images]);


    const handleNext = useCallback((e) => {
        e?.stopPropagation();
        if (currentIndex < images.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, images.length]);

    const handlePrev = useCallback((e) => {
        e?.stopPropagation();
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    }, [currentIndex]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Wait for animation
    }, [onClose]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleClose, handleNext, handlePrev]);

    return ReactDOM.createPortal(
        <div
            className={`image-viewer-overlay ${isClosing ? 'closing' : ''}`}
            onClick={handleClose}
        >
            <div
                className="viewer-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: dimensions.width,
                    height: dimensions.height
                }}
            >

                {/* Viewport & Track for Sliding */}
                <div className="viewer-viewport">
                    <div
                        className="viewer-track"
                        style={{
                            transform: `translateX(-${currentIndex * dimensions.width}px)`,
                            transition: transitionsEnabled ? 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
                        }}
                    >
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="viewer-slide"
                                style={{ width: dimensions.width }} // Explicit integer width match
                            >
                                <img
                                    src={img}
                                    alt={`View ${index + 1}`}
                                    className="viewer-image"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controls Overlay */}
                <button className="viewer-btn viewer-close" onClick={handleClose} aria-label="Close">
                    ×
                </button>

                {currentIndex > 0 && (
                    <button className="viewer-btn viewer-prev" onClick={handlePrev} aria-label="Previous">
                        ‹
                    </button>
                )}

                {currentIndex < images.length - 1 && (
                    <button className="viewer-btn viewer-next" onClick={handleNext} aria-label="Next">
                        ›
                    </button>
                )}

                {images.length > 1 && (
                    <div className="viewer-counter">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default ImageViewer;
