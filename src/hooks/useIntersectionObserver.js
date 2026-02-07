import { useEffect, useRef, useState } from 'react';

/**
 * Hook to observe when an element enters the viewport
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Percentage of element visibility (0-1)
 * @param {string} options.rootMargin - Margin around root
 * @returns {[React.Ref, boolean]} - [ref to attach to element, isVisible state]
 */
const useIntersectionObserver = (options = {}) => {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Only trigger once when element becomes visible
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            {
                threshold: options.threshold || 0.1, // Trigger when 10% visible
                rootMargin: options.rootMargin || '-100px 0px', // Trigger 100px after entering viewport
                ...options
            }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [isVisible, options.threshold, options.rootMargin]);

    return [elementRef, isVisible];
};

export default useIntersectionObserver;
