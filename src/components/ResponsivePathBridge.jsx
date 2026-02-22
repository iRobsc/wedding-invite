import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ResponsivePathBridge
 * 
 * Dynamically sizes a path overlay container to span the exact gap between
 * the bottom of one section and the top of the next section's title (h2).
 * Uses ResizeObserver + window resize to stay perfectly positioned.
 * 
 * Props:
 *   sectionAboveRef  - ref to the DOM element of the section above (measures bottom edge)
 *   titleBelowRef    - ref to the h2 title element in the section below (measures top edge)
 *   scrollContainerRef - ref to the scroll container for offset calculations
 *   paddingTop       - extra px padding above the start (default 0)
 *   paddingBottom    - extra px padding below the end (default 0)
 *   children         - FootstepPath or similar path component
 */
const ResponsivePathBridge = ({
    sectionAboveRef,
    titleBelowRef,
    scrollContainerRef,
    paddingTop = 0,
    paddingBottom = 0,
    children
}) => {
    const [bridgeStyle, setBridgeStyle] = useState(null);

    const measure = useCallback(() => {
        const above = sectionAboveRef?.current;
        const titleBelow = titleBelowRef?.current;
        const scrollContainer = scrollContainerRef?.current;

        if (!above || !titleBelow || !scrollContainer) return;

        // Get positions relative to the scroll container
        const containerRect = scrollContainer.getBoundingClientRect();
        const aboveRect = above.getBoundingClientRect();
        const titleRect = titleBelow.getBoundingClientRect();

        // Calculate absolute positions within the scroll container
        const scrollTop = scrollContainer.scrollTop;

        // Bottom of the section above (relative to scroll container's content)
        const aboveBottom = aboveRect.bottom - containerRect.top + scrollTop - paddingTop;

        // Top of the title below (relative to scroll container's content)
        const titleTop = titleRect.top - containerRect.top + scrollTop + paddingBottom;

        // Height is the gap between them
        const height = Math.max(titleTop - aboveBottom, 0);

        setBridgeStyle({
            position: 'absolute',
            top: `${aboveBottom}px`,
            left: 0,
            width: '100%',
            height: `${height}px`,
            pointerEvents: 'none',
            zIndex: 5
        });
    }, [sectionAboveRef, titleBelowRef, scrollContainerRef, paddingTop, paddingBottom]);

    useEffect(() => {
        const above = sectionAboveRef?.current;
        const titleBelow = titleBelowRef?.current;
        if (!above || !titleBelow) return;

        // Initial measurement (with a small delay for layout to settle)
        const initialTimeout = setTimeout(measure, 100);

        // ResizeObserver for both elements
        const observer = new ResizeObserver(() => {
            measure();
        });
        observer.observe(above);
        observer.observe(titleBelow);

        // Window resize handler
        window.addEventListener('resize', measure);

        return () => {
            clearTimeout(initialTimeout);
            observer.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, [sectionAboveRef, titleBelowRef, measure]);

    // Don't render until we have measurements
    if (!bridgeStyle || bridgeStyle.height === '0px') return null;

    return (
        <div style={bridgeStyle}>
            {children}
        </div>
    );
};

export default ResponsivePathBridge;
