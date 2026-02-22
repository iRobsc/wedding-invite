import { useState, useEffect, useRef, useCallback } from 'react';

// --- SHARED CONFIG ---
const DEFAULT_BEZIER = [.2, 0.7, .01, 1]; // Aggressive Ease Out

const cubicBezier = (t, p1x, p1y, p2x, p2y) => {
    // Limits
    const cx = 3 * p1x;
    const bx = 3 * (p2x - p1x) - cx;
    const ax = 1 - cx - bx;

    const cy = 3 * p1y;
    const by = 3 * (p2y - p1y) - cy;
    const ay = 1 - cy - by;

    const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
    const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;
    const sampleCurveDerivativeX = (t) => (3 * ax * t + 2 * bx) * t + cx;

    let t0, t1, t2, x2, d2, i;
    for (t2 = t, i = 0; i < 8; i++) {
        x2 = sampleCurveX(t2) - t;
        if (Math.abs(x2) < 1e-6) return sampleCurveY(t2);
        d2 = sampleCurveDerivativeX(t2);
        if (Math.abs(d2) < 1e-6) break;
        t2 = t2 - x2 / d2;
    }
    return sampleCurveY(t2);
};

export const usePathAnimation = ({
    scrollContainerRef,
    pathRef,
    triggerThresholdFn, // Function returning boolean or Number (pixel value)
    duration = 2500,
    bezier = DEFAULT_BEZIER,
    onComplete
}) => {
    const [hasTriggered, setHasTriggered] = useState(false);
    const pathLengthRef = useRef(0);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const completeCalled = useRef(false);

    // State to return to consumer for rendering
    // We used to do direct DOM manipulation in the loop for perf.
    // To allow consumer to do direct DOM manipulation, we can expose a REF to the callback?
    // Or we just return the "engine" which calls a callback every frame.

    // Let's implement the "Engine" pattern.
    // The consumer passes a "render" callback?
    // Or we stick to the current pattern where we have the loop inside the hook?

    // Actually, React hooks running rAF loops that update state is bad for perf (re-renders).
    // Better: Hook sets up the rAF and calls a provided `onFrame` callback with calculated data.

    const onFrameRef = useRef(null);

    // Helper to check trigger
    const checkTrigger = (container) => {
        let shouldTrigger = false;
        if (typeof triggerThresholdFn === 'function') {
            shouldTrigger = triggerThresholdFn(container);
        } else if (typeof triggerThresholdFn === 'number') {
            shouldTrigger = container.scrollTop > triggerThresholdFn;
        }
        return shouldTrigger;
    };

    // Cache Length (Lazy)
    const getPathLength = () => {
        if (pathLengthRef.current > 0) return pathLengthRef.current;
        if (pathRef.current) {
            pathLengthRef.current = pathRef.current.getTotalLength();
        }
        return pathLengthRef.current || 0;
    }

    // Scroll Listener & Initial Check
    useEffect(() => {
        if (hasTriggered) return;

        let ticking = false;

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        const handleScroll = () => {
            if (!scrollContainerRef.current) return;
            if (checkTrigger(scrollContainerRef.current)) {
                setHasTriggered(true);
            }
        };

        const container = scrollContainerRef.current;
        if (container) {
            handleScroll();
            container.addEventListener('scroll', onScroll, { passive: true });
        } else {
            const id = setTimeout(handleScroll, 100);
            return () => clearTimeout(id);
        }

        return () => { if (container) container.removeEventListener('scroll', onScroll); };
    }, [scrollContainerRef, hasTriggered, triggerThresholdFn]);

    // Expose current progress to prevent resets on re-render
    const currentProgressRef = useRef(0);

    // Animation Loop
    useEffect(() => {
        if (!hasTriggered) return;

        const animate = (time) => {
            if (!startTimeRef.current) startTimeRef.current = time;
            const elapsed = time - startTimeRef.current;
            const rawProgress = Math.min(elapsed / duration, 1); // Clamp 0-1
            const easedProgress = cubizBezierHelper(rawProgress, bezier);

            // Store for restoration
            currentProgressRef.current = easedProgress;

            const len = getPathLength();

            if (onFrameRef.current) {
                onFrameRef.current({
                    rawProgress,
                    easedProgress,
                    pathLength: len,
                    pathRef: pathRef.current
                });
            }

            if (rawProgress >= 0.25 && !completeCalled.current && onComplete) {
                completeCalled.current = true;
                onComplete();
            }

            if (rawProgress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [hasTriggered, duration, bezier, onComplete]);

    // Helper to register the callback
    const setRenderCallback = useCallback((cb) => {
        onFrameRef.current = cb;
    }, []);

    // Allow manual triggering (e.g., on click)
    const triggerManually = useCallback(() => {
        if (!hasTriggered) {
            setHasTriggered(true);
        }
    }, [hasTriggered]);

    // We expose cubicBezier in case consumer wants it
    return { hasTriggered, setRenderCallback, currentProgressRef, triggerManually };
};

const cubizBezierHelper = (t, [p1x, p1y, p2x, p2y]) => {
    return cubicBezier(t, p1x, p1y, p2x, p2y);
}
