import { useState, useEffect } from 'react';

const usePreloader = (imageSources) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const cacheImages = async (srcArray) => {
            const promises = srcArray.map((src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    // Set handlers BEFORE src to avoid race conditions with cached images
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = src;
                });
            });

            // Safety timeout: If images take too long, proceed anyway
            const timeoutPromise = new Promise(resolve => setTimeout(resolve, 5000));

            await Promise.race([Promise.all(promises), timeoutPromise]);
            setIsLoading(false);
        };

        if (imageSources && imageSources.length > 0) {
            cacheImages(imageSources);
        } else {
            setIsLoading(false);
        }
    }, [imageSources]);

    return isLoading;
};

export default usePreloader;
