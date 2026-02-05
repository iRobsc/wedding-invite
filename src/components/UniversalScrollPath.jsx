import React, { useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { usePathAnimation } from '../hooks/usePathAnimation';

const UniversalScrollPath = ({
    // Refs & Callbacks
    scrollContainerRef,
    onComplete,
    onScrollStart,

    // SVG Config
    viewBox,
    pathD,
    strokeDasharray = null, // "5, 5" for dotted

    // Animation Config
    triggerThreshold, // number or function
    duration = 2500,

    // Icon Behavior
    rotateWithTangent = true,
    scaleX = 1,
    scaleY = 1,
    initialOpacity = 0,
    leadOffset = 0, // Distance icon leads the line
    useLegacyStyle = false, // Force use of style.transform (CSS) instead of attribute

    // Icon Content (Children)
    children
}) => {
    const maskPathRef = useRef(null);
    const pathRef = useRef(null);
    const iconRef = useRef(null);

    // Hook
    const { setRenderCallback } = usePathAnimation({
        scrollContainerRef,
        pathRef,
        triggerThresholdFn: triggerThreshold,
        duration,
        onComplete
    });

    // Render Logic
    const updateDOM = useCallback((progress, len) => {
        if (!pathRef.current || !iconRef.current || !maskPathRef.current) return;

        // 2. POSITION LOGIC (Revised)
        // Primary anchor is the Icon (Head). It strictly follows progress from 0 to Len.
        // The Mask (Line) follows relative to the Head.
        // leadOffset > 0: Icon leads the line (Gap/Lag). Line is shorter.
        // leadOffset < 0: Line leads the icon (Overlap). Line is longer.

        const currentPos = progress * len;
        const headPos = currentPos;

        // Mask Pos is Head Pos minus the lead
        // e.g. Head=10, Lead=5 -> Mask=5 (Line ends 5px behind head)
        const maskPos = Math.max(0, Math.min(len, headPos - leadOffset));

        // Apply Mask
        maskPathRef.current.style.strokeDasharray = len;
        maskPathRef.current.style.strokeDashoffset = len - maskPos;

        if (pathRef.current.getPointAtLength) {
            const point = pathRef.current.getPointAtLength(headPos);

            // 3. ROTATION (Legacy Look-Backward Logic)
            let angle = 0;
            if (rotateWithTangent && headPos >= 0 && headPos <= len) {
                // Original logic: Look backward 1 unit (or forward at start)
                const pLookAt = headPos === 0
                    ? pathRef.current.getPointAtLength(Math.min(1, len))
                    : point;
                const pCompare = headPos === 0
                    ? point
                    : pathRef.current.getPointAtLength(Math.max(0, headPos - 1));

                angle = Math.atan2(pLookAt.y - pCompare.y, pLookAt.x - pCompare.x) * (180 / Math.PI);
            }

            // 4. APPLY TRANSFORM
            // translate -> rotate -> scale
            if (useLegacyStyle) {
                // Legacy Mode (ScrollArrow original behavior)
                const transformStr = `translate(${point.x}px, ${point.y}px) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
                iconRef.current.style.transform = transformStr;
                // Clean up attribute to prevent conflicts
                if (iconRef.current.hasAttribute('transform')) {
                    iconRef.current.removeAttribute('transform');
                }
            } else {
                // Standard SVG Attribute Mode (CarScrollPath)
                const transformStr = `translate(${point.x}, ${point.y}) rotate(${angle}) scale(${scaleX}, ${scaleY})`;
                iconRef.current.setAttribute('transform', transformStr);
            }

            // 5. OPACITY & EVENT TRIGGERS
            // If we are moving (progress > 0), trigger start event once.
            if (progress > 0 && onScrollStart && !iconRef.current.hasStarted) {
                onScrollStart();
                iconRef.current.hasStarted = true; // Simple flag on DOM node or use a ref
            }

            // Internal Fade Logic (Car)
            if (initialOpacity === 0 && progress > 0) {
                if (iconRef.current.style.opacity !== '1') {
                    iconRef.current.style.opacity = '1';
                }
            }
        }
    }, [rotateWithTangent, scaleX, scaleY, initialOpacity, onScrollStart]);

    // Initial State (Layout Effect to prevent flash)
    useLayoutEffect(() => {
        if (pathRef.current && iconRef.current) {
            const len = pathRef.current.getTotalLength();
            updateDOM(0, len);

            // Force initial opacity if static
            if (initialOpacity === 1) {
                iconRef.current.style.opacity = '1';
            }
        }
    }, [updateDOM, initialOpacity]);

    // Loop Registration
    useEffect(() => {
        setRenderCallback(({ easedProgress, pathLength }) => {
            updateDOM(easedProgress, pathLength);
        });
    }, [setRenderCallback, updateDOM]);

    // Unique ID for mask to prevent conflicts if multiple instances
    const maskId = `mask-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%', // Parent determines height via positioning
            pointerEvents: 'none',
            zIndex: 50,
            overflow: 'visible'
        }}>
            <svg
                width="100%"
                height="100%"
                viewBox={viewBox}
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <mask id={maskId} maskUnits="userSpaceOnUse">
                        <path
                            ref={maskPathRef}
                            d={pathD}
                            fill="none"
                            stroke="white"
                            strokeWidth="10"
                            strokeLinecap="round"
                        />
                    </mask>
                </defs>

                {/* The Path Line */}
                <path
                    ref={pathRef}
                    d={pathD}
                    fill="none"
                    stroke={strokeDasharray ? "black" : "#334155"} // Car black, Arrow slate-700
                    strokeWidth="1.5"
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                    mask={`url(#${maskId})`}
                    vectorEffect="non-scaling-stroke"
                />

                {/* The Icon Wrapper */}
                <g
                    ref={iconRef}
                    style={{
                        opacity: initialOpacity,
                        transition: 'opacity 0.2s',
                        willChange: 'transform'
                    }}
                >
                    {children}
                </g>
            </svg>
        </div>
    );
};

export default UniversalScrollPath;
