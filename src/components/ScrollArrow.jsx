import React, { useState, useEffect, useCallback } from 'react';
import UniversalScrollPath from './UniversalScrollPath';

/**
 * ScrollArrow — responsive arrow that dynamically spans from within
 * one section into the next, measured from two anchor elements.
 *
 * Props:
 *   anchorRef          - ref to the element above (e.g. hero section)
 *   endAnchorRef       - ref to the element below (e.g. ceremony section)
 *   scrollContainerRef - ref to the scroll container
 *   onAnimationComplete
 *   startX / endX      - horizontal path positions as % of the CONTENT area
 *                         (capped to max-width 1200px, centered on page)
 *   startYInset        - how far above the anchor's bottom to start (% of anchor height)
 *   endYInset          - how far below the end anchor's top to end (% of end anchor height)
 */
const ScrollArrow = ({
    scrollContainerRef,
    onAnimationComplete,
    anchorRef,
    endAnchorRef,
    startX = 49.5,
    endX = 65,
    startYInset = 20,
    endYInset = 0,
}) => {
    const [wrapperStyle, setWrapperStyle] = useState(null);

    // Content area max-width matching the CSS .content-container max-width
    const CONTENT_MAX_WIDTH = 1200;

    const measure = useCallback(() => {
        const anchor = anchorRef?.current;
        const endAnchor = endAnchorRef?.current;
        const scrollContainer = scrollContainerRef?.current;
        if (!anchor || !scrollContainer) return;

        const containerRect = scrollContainer.getBoundingClientRect();
        const anchorRect = anchor.getBoundingClientRect();
        const scrollTop = scrollContainer.scrollTop;
        const pageWidth = containerRect.width;

        // --- Y positioning (inset-based) ---
        const anchorHeight = anchorRect.height;
        const arrowTop = (anchorRect.bottom - containerRect.top + scrollTop)
            - (anchorHeight * startYInset / 100);

        let arrowBottom;
        if (endAnchor) {
            const endRect = endAnchor.getBoundingClientRect();
            const endAnchorHeight = endRect.height;
            arrowBottom = (endRect.top - containerRect.top + scrollTop)
                + (endAnchorHeight * endYInset / 100);
        } else {
            arrowBottom = arrowTop + anchorHeight * 0.3;
        }

        const height = Math.max(arrowBottom - arrowTop, 50);

        // --- X positioning (content-capped) ---
        const contentWidth = Math.min(pageWidth, CONTENT_MAX_WIDTH);
        const contentLeft = (pageWidth - contentWidth) / 2;

        const pxStartX = contentLeft + (startX / 100) * contentWidth;
        const pxEndX = contentLeft + (endX / 100) * contentWidth;

        const wrapperLeftPx = Math.min(pxStartX, pxEndX) - 30; // 30px padding
        const wrapperRightPx = Math.max(pxStartX, pxEndX) + 30;
        const wrapperWidthPx = Math.max(wrapperRightPx - wrapperLeftPx, 60);

        setWrapperStyle({
            position: 'absolute',
            top: `${arrowTop}px`,
            left: `${wrapperLeftPx}px`,
            width: `${wrapperWidthPx}px`,
            height: `${height}px`,
            pointerEvents: 'none',
        });
    }, [anchorRef, endAnchorRef, scrollContainerRef, startX, endX, startYInset, endYInset]);

    useEffect(() => {
        const anchor = anchorRef?.current;
        const endAnchor = endAnchorRef?.current;
        if (!anchor) return;

        const initialTimeout = setTimeout(measure, 100);

        const observer = new ResizeObserver(measure);
        observer.observe(anchor);
        if (endAnchor) observer.observe(endAnchor);

        window.addEventListener('resize', measure);

        return () => {
            clearTimeout(initialTimeout);
            observer.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, [anchorRef, endAnchorRef, measure]);

    // Map actual px positions into local viewBox coordinates (0–100)
    if (!wrapperStyle) return null;

    const wLeft = parseFloat(wrapperStyle.left);
    const wWidth = parseFloat(wrapperStyle.width);
    const pageWidth = scrollContainerRef?.current?.getBoundingClientRect().width || 1;
    const contentWidth = Math.min(pageWidth, CONTENT_MAX_WIDTH);
    const contentLeft = (pageWidth - contentWidth) / 2;

    const pxStartX = contentLeft + (startX / 100) * contentWidth;
    const pxEndX = contentLeft + (endX / 100) * contentWidth;

    const localStartX = ((pxStartX - wLeft) / wWidth) * 100;
    const localEndX = ((pxEndX - wLeft) / wWidth) * 100;

    const pathD = `M ${localStartX},0 C ${localStartX},30 ${localEndX},70 ${localEndX},100`;

    return (
        <div className="scroll-arrow-wrapper" style={wrapperStyle}>
            <UniversalScrollPath
                scrollContainerRef={scrollContainerRef}
                onComplete={onAnimationComplete}
                viewBox="0 0 100 100"
                pathD={pathD}
                triggerThreshold={10}
                rotateWithTangent={true}
                initialOpacity={1}
                strokeDasharray={null}
                leadOffset={5}
                useLegacyStyle={true}
                duration={4000}
                scaleX={2}
                scaleY={2}
            >
                {/* ARROW ICON */}
                <path d="M -2,-2 L 0,0 L -2,2" fill="none" stroke="#2c3e50" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </UniversalScrollPath>
        </div>
    );
};

export default ScrollArrow;