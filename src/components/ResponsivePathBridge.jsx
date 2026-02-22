import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ResponsivePathBridge
 * 
 * Dynamically sizes a path overlay container to span the exact gap between
 * the bottom of one section and the top of the next section's title (h2).
 * 
 * Handles first-load layout shifts caused by images loading progressively
 * by watching for image load events and polling for position changes.
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
    const lastValuesRef = useRef({ top: -1, height: -1 });

    const measure = useCallback(() => {
        const above = sectionAboveRef?.current;
        const titleBelow = titleBelowRef?.current;
        const scrollContainer = scrollContainerRef?.current;

        if (!above || !titleBelow || !scrollContainer) return;

        const containerRect = scrollContainer.getBoundingClientRect();
        const aboveRect = above.getBoundingClientRect();
        const titleRect = titleBelow.getBoundingClientRect();
        const scrollTop = scrollContainer.scrollTop;

        const aboveBottom = aboveRect.bottom - containerRect.top + scrollTop - paddingTop;
        const titleTop = titleRect.top - containerRect.top + scrollTop + paddingBottom;
        const height = Math.max(titleTop - aboveBottom, 0);

        // Only update state if values actually changed (avoids unnecessary re-renders)
        const roundedTop = Math.round(aboveBottom);
        const roundedHeight = Math.round(height);

        if (roundedTop !== lastValuesRef.current.top || roundedHeight !== lastValuesRef.current.height) {
            lastValuesRef.current = { top: roundedTop, height: roundedHeight };
            setBridgeStyle({
                position: 'absolute',
                top: `${aboveBottom}px`,
                left: 0,
                width: '100%',
                height: `${height}px`,
                pointerEvents: 'none',
                zIndex: 5
            });
        }
    }, [sectionAboveRef, titleBelowRef, scrollContainerRef, paddingTop, paddingBottom]);

    useEffect(() => {
        const above = sectionAboveRef?.current;
        const titleBelow = titleBelowRef?.current;
        const scrollContainer = scrollContainerRef?.current;
        if (!above || !titleBelow) return;

        const cleanupFns = [];

        // --- 1. ResizeObserver on sections + scroll container ---
        const observer = new ResizeObserver(() => measure());
        observer.observe(above);
        observer.observe(titleBelow);
        if (scrollContainer) observer.observe(scrollContainer);
        cleanupFns.push(() => observer.disconnect());

        // --- 2. Image load listeners ---
        // When images inside sections finish loading, they change the section's height.
        // This is the direct cause of the first-load positioning bug.
        const handleImageLoad = () => measure();

        const watchImages = (root) => {
            const images = root.querySelectorAll('img');
            images.forEach(img => {
                if (!img.complete) {
                    img.addEventListener('load', handleImageLoad);
                    img.addEventListener('error', handleImageLoad);
                }
            });
        };

        // Watch all current images
        watchImages(above);

        // Watch for dynamically added images via MutationObserver
        const mutObserver = new MutationObserver((mutations) => {
            measure();
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) watchImages(node);
                });
            });
        });
        mutObserver.observe(above, { childList: true, subtree: true });
        cleanupFns.push(() => mutObserver.disconnect());

        // --- 3. RAF polling with change detection for first 5 seconds ---
        // Catches any layout shift that observers might miss.
        // Only triggers state updates when values actually change (via lastValuesRef).
        let pollActive = true;
        let pollStart = performance.now();
        const POLL_DURATION = 5000; // 5 seconds

        const poll = () => {
            if (!pollActive) return;
            measure();
            if (performance.now() - pollStart < POLL_DURATION) {
                requestAnimationFrame(poll);
            }
        };
        requestAnimationFrame(poll);
        cleanupFns.push(() => { pollActive = false; });

        // --- 4. Window resize + load ---
        window.addEventListener('resize', measure);
        const handleLoad = () => setTimeout(measure, 50);
        window.addEventListener('load', handleLoad);
        cleanupFns.push(() => {
            window.removeEventListener('resize', measure);
            window.removeEventListener('load', handleLoad);
        });

        return () => cleanupFns.forEach(fn => fn());
    }, [sectionAboveRef, titleBelowRef, scrollContainerRef, measure]);

    if (!bridgeStyle || bridgeStyle.height === '0px') return null;

    return (
        <div style={bridgeStyle}>
            {children}
        </div>
    );
};

export default ResponsivePathBridge;
