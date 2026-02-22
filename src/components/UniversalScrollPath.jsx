import React, { useRef, useCallback, useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { usePathAnimation } from '../hooks/usePathAnimation';

const UniversalScrollPath = ({
    // Refs & Callbacks
    scrollContainerRef,
    onComplete,
    onScrollStart,
    triggerRef, // Optional ref that will be assigned the triggerManually function

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
    const svgRef = useRef(null);
    const maskPathRef = useRef(null);
    const pathRef = useRef(null);
    const iconRef = useRef(null);
    const stopTransparentRef = useRef(null);
    const stopOpaqueRef = useRef(null);

    // Track SVG element dimensions to compute aspect-ratio compensation
    const [svgDims, setSvgDims] = useState(null);
    const lastSvgDimsRef = useRef({ width: 0, height: 0 });

    // Parse viewBox to get coordinate space dimensions
    const viewBoxDims = useMemo(() => {
        if (!viewBox) return { width: 100, height: 400 };
        const parts = viewBox.split(/\s+/).map(Number);
        return { width: parts[2] || 100, height: parts[3] || 400 };
    }, [viewBox]);

    // Get initial measurement before first paint
    useLayoutEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            lastSvgDimsRef.current = { width: rect.width, height: rect.height };
            setSvgDims({ width: rect.width, height: rect.height });
        }
    }, []);

    // Observe SVG element size changes for ongoing aspect-ratio compensation
    // Only update state when dimensions actually change to prevent flicker
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    const last = lastSvgDimsRef.current;
                    // Only update if dimensions changed by more than 1px (avoid sub-pixel noise)
                    if (Math.abs(width - last.width) > 1 || Math.abs(height - last.height) > 1) {
                        lastSvgDimsRef.current = { width, height };
                        setSvgDims({ width, height });
                    }
                }
            }
        });

        observer.observe(svg);
        return () => observer.disconnect();
    }, []);

    // Compute compensated scales so icon stays square regardless of SVG stretching
    // When preserveAspectRatio="none", 1 viewBox unit maps to different pixel sizes on X vs Y
    // We correct for this distortion while preserving the original scaleX/scaleY magnitudes
    const compensatedScale = useMemo(() => {
        // Before measurement, use raw scales (no compensation)
        if (!svgDims) return { x: scaleX, y: scaleY };

        const pxPerUnitX = svgDims.width / viewBoxDims.width;
        const pxPerUnitY = svgDims.height / viewBoxDims.height;
        // Correction factor: how much wider X is stretched compared to Y
        // We normalize against pxPerUnitY (vertical is more stable)
        const aspectCorrection = pxPerUnitY / pxPerUnitX;
        return {
            x: scaleX * aspectCorrection,
            y: scaleY
        };
    }, [svgDims, viewBoxDims, scaleX, scaleY]);

    // Hook
    const { setRenderCallback, triggerManually } = usePathAnimation({
        scrollContainerRef,
        pathRef,
        triggerThresholdFn: triggerThreshold,
        duration,
        onComplete
    });

    // Expose manual trigger function to parent via ref
    useEffect(() => {
        if (triggerRef) {
            triggerRef.current = triggerManually;
        }
    }, [triggerRef, triggerManually]);

    // Render Logic
    const lastProgressRef = useRef(0);
    const lastLenRef = useRef(0);

    const updateDOM = useCallback((progress, len) => {
        if (!pathRef.current || !iconRef.current || !maskPathRef.current) return;

        // Track latest progress for resize re-application
        lastProgressRef.current = progress;
        lastLenRef.current = len;

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
            if (stopTransparentRef.current && stopOpaqueRef.current) {
                const fadeProgress = (progress);
                const fadeEndPct = fadeProgress;

                stopTransparentRef.current.setAttribute('offset', `${fadeEndPct}%`);
                stopOpaqueRef.current.setAttribute('offset', `${fadeEndPct + 90}%`);
            }

            // 3. COMPUTE VISUAL ANGLE
            let visualAngle = 0;
            if (rotateWithTangent && headPos >= 0 && headPos <= len) {
                const pLookAt = headPos === 0
                    ? pathRef.current.getPointAtLength(Math.min(1, len))
                    : point;
                const pCompare = headPos === 0
                    ? point
                    : pathRef.current.getPointAtLength(Math.max(0, headPos - 1));

                const rawDx = pLookAt.x - pCompare.x;
                const rawDy = pLookAt.y - pCompare.y;
                const pxX = svgDims ? svgDims.width / viewBoxDims.width : 1;
                const pxY = svgDims ? svgDims.height / viewBoxDims.height : 1;
                visualAngle = Math.atan2(rawDy * pxY, rawDx * pxX);
            }

            // 4. APPLY TRANSFORM
            const pxPerUnitX = svgDims ? svgDims.width / viewBoxDims.width : 1;
            const pxPerUnitY = svgDims ? svgDims.height / viewBoxDims.height : 1;
            const s = Math.abs(scaleY);
            const flipX = Math.sign(scaleX) || 1;
            const flipY = Math.sign(scaleY) || 1;
            const cosA = Math.cos(visualAngle);
            const sinA = Math.sin(visualAngle);

            const ma = s * pxPerUnitY * flipX * cosA / pxPerUnitX;
            const mb = s * flipX * sinA;
            const mc = -s * pxPerUnitY * flipY * sinA / pxPerUnitX;
            const md = s * flipY * cosA;

            iconRef.current.setAttribute('transform',
                `matrix(${ma}, ${mb}, ${mc}, ${md}, ${point.x}, ${point.y})`
            );

            // 5. OPACITY & EVENT TRIGGERS
            if (progress > 0 && onScrollStart && !iconRef.current.hasStarted) {
                onScrollStart();
                iconRef.current.hasStarted = true;
            }

            if (initialOpacity === 0 && progress > 0) {
                if (iconRef.current.style.opacity !== '1') iconRef.current.style.opacity = '1';
            }
        }
    }, [rotateWithTangent, initialOpacity, onScrollStart, leadOffset, scaleX, scaleY, svgDims, viewBoxDims]);

    // Keep a ref to the latest updateDOM so it can be called without re-triggering effects
    const updateDOMRef = useRef(updateDOM);
    updateDOMRef.current = updateDOM;

    // Initial State - only run once on mount
    useLayoutEffect(() => {
        if (pathRef.current && iconRef.current) {
            const len = pathRef.current.getTotalLength();
            updateDOMRef.current(0, len);
            if (initialOpacity === 1) iconRef.current.style.opacity = '1';
        }
    }, [initialOpacity]);

    // Re-apply transform when svgDims changes (window resize) without resetting progress
    useEffect(() => {
        if (svgDims && lastLenRef.current > 0) {
            updateDOMRef.current(lastProgressRef.current, lastLenRef.current);
        }
    }, [svgDims]);

    useEffect(() => {
        setRenderCallback(({ easedProgress, pathLength }) => {
            updateDOM(easedProgress, pathLength);
        });
    }, [setRenderCallback, updateDOM]);

    // Unique IDs
    const [maskId] = useState(() => `mask-${Math.random().toString(36).substr(2, 9)}`);
    const [gradientId] = useState(() => `grad-${Math.random().toString(36).substr(2, 9)}`);

    const strokeColor = "#2c3e50";

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
                ref={svgRef}
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
