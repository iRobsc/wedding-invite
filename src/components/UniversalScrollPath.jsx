import React, { useRef, useCallback, useEffect, useLayoutEffect, useState } from 'react';
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
    const stopTransparentRef = useRef(null);
    const stopOpaqueRef = useRef(null);

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

        // 2. POSITION LOGIC
        const currentPos = progress * len;
        const headPos = currentPos;
        const maskPos = Math.max(0, Math.min(len, headPos - leadOffset));

        // Apply Mask (Usage reveal)
        maskPathRef.current.style.strokeDasharray = len;
        maskPathRef.current.style.strokeDashoffset = len - maskPos;

        if (pathRef.current.getPointAtLength) {
            const point = pathRef.current.getPointAtLength(headPos);

            // DYNAMIC GRADIENT (Delayed Fade)
            // Progress < 0.5: Line is fully opaque.
            // Progress > 0.5: Gradient stops move down, fading the tail.
            if (stopTransparentRef.current && stopOpaqueRef.current) {
                // Start fading out the top
                // Map progress 0.5 -> 1.0 to 0% -> 50% fade offset (e.g.)
                const fadeProgress = (progress); // 0 to 1

                // The "transparent" part expands from 0% down to say 60%
                const fadeEndPct = fadeProgress;

                stopTransparentRef.current.setAttribute('offset', `${fadeEndPct}%`);
                // The opaque part starts LATER and softer (+40% instead of +15%)
                stopOpaqueRef.current.setAttribute('offset', `${fadeEndPct + 90}%`);

            }

            // 3. ROTATION
            let angle = 0;
            if (rotateWithTangent && headPos >= 0 && headPos <= len) {
                const pLookAt = headPos === 0
                    ? pathRef.current.getPointAtLength(Math.min(1, len))
                    : point;
                const pCompare = headPos === 0
                    ? point
                    : pathRef.current.getPointAtLength(Math.max(0, headPos - 1));

                angle = Math.atan2(pLookAt.y - pCompare.y, pLookAt.x - pCompare.x) * (180 / Math.PI);
            }

            // 4. APPLY TRANSFORM
            if (useLegacyStyle) {
                const transformStr = `translate(${point.x}px, ${point.y}px) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
                iconRef.current.style.transform = transformStr;
                if (iconRef.current.hasAttribute('transform')) iconRef.current.removeAttribute('transform');
            } else {
                const transformStr = `translate(${point.x}, ${point.y}) rotate(${angle}) scale(${scaleX}, ${scaleY})`;
                iconRef.current.setAttribute('transform', transformStr);
            }

            // 5. OPACITY & EVENT TRIGGERS
            if (progress > 0 && onScrollStart && !iconRef.current.hasStarted) {
                onScrollStart();
                iconRef.current.hasStarted = true;
            }

            if (initialOpacity === 0 && progress > 0) {
                if (iconRef.current.style.opacity !== '1') iconRef.current.style.opacity = '1';
            }
        }
    }, [rotateWithTangent, scaleX, scaleY, initialOpacity, onScrollStart, leadOffset, useLegacyStyle]);

    // Initial State
    useLayoutEffect(() => {
        if (pathRef.current && iconRef.current) {
            const len = pathRef.current.getTotalLength();
            updateDOM(0, len);
            if (initialOpacity === 1) iconRef.current.style.opacity = '1';
        }
    }, [updateDOM, initialOpacity]);

    useEffect(() => {
        setRenderCallback(({ easedProgress, pathLength }) => {
            updateDOM(easedProgress, pathLength);
        });
    }, [setRenderCallback, updateDOM]);

    // Unique IDs
    const [maskId] = useState(() => `mask-${Math.random().toString(36).substr(2, 9)}`);
    const [gradientId] = useState(() => `grad-${Math.random().toString(36).substr(2, 9)}`);

    const strokeColor = strokeDasharray ? "black" : "#334155";

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
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
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop ref={stopTransparentRef} offset="0%" stopColor={strokeColor} stopOpacity="0" />
                        <stop ref={stopOpaqueRef} offset="0%" stopColor={strokeColor} stopOpacity="1" />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity="1" />
                    </linearGradient>
                </defs>

                {/* The Path Line */}
                <path
                    ref={pathRef}
                    d={pathD}
                    fill="none"
                    stroke={`url(#${gradientId})`}
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
