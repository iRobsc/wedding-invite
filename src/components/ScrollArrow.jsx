import React, { useState, useEffect, useCallback, useRef } from 'react';
import UniversalScrollPath from './UniversalScrollPath';

/**
 * ScrollArrow — responsive arrow that dynamically spans from within
 * one section into the next, measured from two anchor elements.
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
    const [hasStarted, setHasStarted] = useState(false);
    const triggerRef = useRef(null);
    const lastMeasuredRef = useRef({ top: -1, height: -1, left: -1, width: -1 });
    const scrollCancelledRef = useRef(false);

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

        const contentWidth = Math.min(pageWidth, CONTENT_MAX_WIDTH);
        const contentLeft = (pageWidth - contentWidth) / 2;

        const pxStartX = contentLeft + (startX / 100) * contentWidth;
        const pxEndX = contentLeft + (endX / 100) * contentWidth;

        const wrapperLeftPx = Math.min(pxStartX, pxEndX) - 30;
        const wrapperRightPx = Math.max(pxStartX, pxEndX) + 30;
        const wrapperWidthPx = Math.max(wrapperRightPx - wrapperLeftPx, 60);

        const roundedTop = Math.round(arrowTop);
        const roundedHeight = Math.round(height);
        const roundedLeft = Math.round(wrapperLeftPx);
        const roundedWidth = Math.round(wrapperWidthPx);
        const last = lastMeasuredRef.current;

        if (roundedTop !== last.top || roundedHeight !== last.height ||
            roundedLeft !== last.left || roundedWidth !== last.width) {
            lastMeasuredRef.current = { top: roundedTop, height: roundedHeight, left: roundedLeft, width: roundedWidth };
            setWrapperStyle({
                position: 'absolute',
                top: `${arrowTop}px`,
                left: `${wrapperLeftPx}px`,
                width: `${wrapperWidthPx}px`,
                height: `${height}px`,
                pointerEvents: 'none',
            });
        }
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

    // Click handler: trigger animation and scroll in sync with the arrow
    const handleArrowClick = useCallback(() => {
        setHasStarted(true);

        // Trigger the path animation
        if (triggerRef.current) {
            triggerRef.current();
        }

        const scrollContainer = scrollContainerRef?.current;
        const endAnchor = endAnchorRef?.current;
        if (!scrollContainer || !endAnchor) return;

        // Disable CSS smooth scrolling so our RAF loop has direct control
        const originalBehavior = scrollContainer.style.scrollBehavior;
        scrollContainer.style.scrollBehavior = 'auto';
        scrollCancelledRef.current = false;

        const containerRect = scrollContainer.getBoundingClientRect();
        const targetRect = endAnchor.getBoundingClientRect();
        const startScroll = scrollContainer.scrollTop;
        const targetScroll = startScroll + (targetRect.top - containerRect.top) - 180;
        const distance = targetScroll - startScroll;
        const scrollDuration = 4000;
        const startTime = performance.now();

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        // Cancel on user scroll input (wheel or touch)
        const cancelScroll = () => {
            scrollCancelledRef.current = true;
            scrollContainer.style.scrollBehavior = originalBehavior;
            scrollContainer.removeEventListener('wheel', cancelScroll);
            scrollContainer.removeEventListener('touchmove', cancelScroll);
        };
        scrollContainer.addEventListener('wheel', cancelScroll, { passive: true, once: true });
        scrollContainer.addEventListener('touchmove', cancelScroll, { passive: true, once: true });

        const animateScroll = (currentTime) => {
            if (scrollCancelledRef.current) return;

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / scrollDuration, 1);
            const easedProgress = easeOutCubic(progress);

            scrollContainer.scrollTop = startScroll + distance * easedProgress;

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                scrollContainer.style.scrollBehavior = originalBehavior;
                scrollContainer.removeEventListener('wheel', cancelScroll);
                scrollContainer.removeEventListener('touchmove', cancelScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }, [endAnchorRef, scrollContainerRef]);

    // Hide arrow + click area when animation starts via normal scroll trigger
    const handleAnimationComplete = useCallback(() => {
        setHasStarted(true);
        if (onAnimationComplete) onAnimationComplete();
    }, [onAnimationComplete]);

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

    // Click area: centered on the arrowhead's actual pixel position within the wrapper
    const hitAreaCenterPx = (localStartX / 100) * wWidth;
    const hitAreaSize = 50;

    return (
        <div className="scroll-arrow-wrapper" style={wrapperStyle}>
            {/* Clickable hit area — only shown before animation starts */}
            {!hasStarted && (
                <div
                    onClick={handleArrowClick}
                    style={{
                        position: 'absolute',
                        top: `-${hitAreaSize}px`,
                        left: `${hitAreaCenterPx - hitAreaSize / 2}px`,
                        width: `${hitAreaSize}px`,
                        height: `${hitAreaSize}px`,
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        zIndex: 51,
                    }}
                    aria-label="Scroll down"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleArrowClick(); }}
                />
            )}
            <UniversalScrollPath
                scrollContainerRef={scrollContainerRef}
                onComplete={handleAnimationComplete}
                triggerRef={triggerRef}
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