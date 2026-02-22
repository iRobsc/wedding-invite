import { useState, useEffect } from 'react';

/**
 * Returns a scaling factor for vertical path lengths based on viewport width.
 * "Squeezes" the path start/end points closer together on narrower screens.
 * 
 * @param {number} baseScale - Optional base scale multiplier (default 1)
 * @returns {number} The calculated scale factor
 */
export const useVerticalSqueeze = (baseScale = 1) => {
    const [scale, setScale] = useState(baseScale);

    useEffect(() => {
        const calculateScale = () => {
            const width = window.innerWidth;
            let factor = 1;

            if (width < 850) {
                factor = 0.50; // 50% squeeze on mobile
            } else if (width < 1200) {
                factor = 0.80; // 20% squeeze on tablet/laptop
            }

            return baseScale * factor;
        };

        const handleResize = () => {
            setScale(calculateScale());
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [baseScale]);

    return scale;
};
