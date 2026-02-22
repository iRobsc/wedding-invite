import React, { useState, useMemo } from 'react';
import ImageViewer from './ImageViewer';

const PhotoScatter = ({ images, altText, enableRandomRotation = false, rotationRange = 3, startDirection = 1 }) => {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Determine layout class based on count
    const count = images.length;
    let sizeClass = 'scatter-many'; // default

    if (count === 1) sizeClass = 'scatter-single';
    else if (count <= 3) sizeClass = 'scatter-few';
    else if (count <= 8) sizeClass = 'scatter-medium';

    // Generate stable random rotations if enabled
    const rotations = useMemo(() => {
        if (!enableRandomRotation) return [];
        return images.map((_, i) => {
            // Strict alternating rotation based on rotationRange
            // Even index = positive * startDirection, Odd index = negative * startDirection
            const sign = (i % 2 === 0 ? 1 : -1) * startDirection;
            return rotationRange * sign;
        });
    }, [images, enableRandomRotation, rotationRange, startDirection]);

    const handleImageClick = (index) => {
        setSelectedIndex(index);
        setViewerOpen(true);
    };

    const handleCloseViewer = () => {
        setViewerOpen(false);
    };

    return (
        <>
            <div className={`scatter-container ${sizeClass}`}>
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="scatter-item-wrapper"
                        onClick={() => handleImageClick(index)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            cursor: 'pointer',
                            // For single items, rotate the wrapper to override CSS (which has -2deg)
                            // For multi items, let CSS handle wrapper placement and rotate image only
                            transform: (enableRandomRotation && count === 1)
                                ? (hoveredIndex === index ? 'rotate(0deg) scale(1.05)' : `rotate(${rotations[index]}deg)`)
                                : undefined
                        }}
                        title="Click to view full screen"
                    >
                        <img
                            src={img}
                            alt={`${altText} ${index + 1}`}
                            className="photo-frame scatter-photo"
                            // If count > 1, rotate the image (keeps CSS wrapper placement)
                            // If count === 1, rotation is already on wrapper
                            style={(enableRandomRotation && count > 1) ? { transform: `rotate(${rotations[index]}deg)` } : {}}
                        />
                    </div>
                ))}
            </div>

            {viewerOpen && (
                <ImageViewer
                    images={images}
                    initialIndex={selectedIndex}
                    onClose={handleCloseViewer}
                />
            )}
        </>
    );
};

export default PhotoScatter;
