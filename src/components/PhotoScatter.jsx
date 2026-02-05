import React, { useState } from 'react';
import ImageViewer from './ImageViewer';

const PhotoScatter = ({ images, altText }) => {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Determine layout class based on count
    const count = images.length;
    let sizeClass = 'scatter-many'; // default

    if (count === 1) sizeClass = 'scatter-single';
    else if (count <= 3) sizeClass = 'scatter-few';
    else if (count <= 8) sizeClass = 'scatter-medium';

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
                        style={{ cursor: 'pointer' }}
                        title="Click to view full screen"
                    >
                        <img
                            src={img}
                            alt={`${altText} ${index + 1}`}
                            className="photo-frame scatter-photo"
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
