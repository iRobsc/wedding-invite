import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import soleSvg from '../assets/sole.svg';

const FootprintIcon = ({ isLeft, opacity }) => (
    <img
        src={soleSvg}
        alt="footprint"
        style={{
            width: '20px',
            height: '52px',
            opacity: opacity,
            transform: `scaleX(${isLeft ? -1 : 1})`,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
            pointerEvents: 'none'
        }}
    />
);

// Individual footstep with its own fade logic
const Footstep = ({ step, isVisible, isLeft, isLast }) => {
    const [opacity, setOpacity] = useState(0);
    const [hasTransition, setHasTransition] = useState(false);

    useEffect(() => {
        if (isVisible) {
            // Appear immediately at full opacity
            setOpacity(1);

            // Skip fade for last footsteps
            if (isLast) return;

            // After 0.5s, enable transition and fade to 0
            const timer = setTimeout(() => {
                setHasTransition(true);
                setTimeout(() => {
                    setOpacity(0);
                }, 100);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isVisible, isLast]);

    return (
        <div
            style={{
                position: 'absolute',
                left: `${step.x}%`,
                top: `${step.y}%`,
                transform: `rotate(${step.rot}deg)`,
                width: '20px',
                height: '52px',
                opacity: opacity,
                transition: hasTransition ? 'opacity 0.5s ease-out' : 'none',
            }}
        >
            <FootprintIcon
                isLeft={isLeft}
                opacity={1}
            />
        </div>
    );
};

/**
 * Generate footsteps along a curved path
 * @param {Function} curveFunction - (t) => { x, y } where t is 0-1 along path
 * @param {number} numSteps - number of footsteps to generate
 * @returns {Array} steps array with x, y, rot, isLeft
 */
const generateStepsAlongCurve = (curveFunction, numSteps) => {
    const steps = [];
    const leftRightOffset = 1; // Perpendicular offset for zig-zag

    for (let i = 0; i < numSteps; i++) {
        const t = i / (numSteps - 1); // 0 to 1
        const isLeft = i % 2 === 0;

        // Get base position on curve
        const point = curveFunction(t);

        // Calculate direction for rotation - use next actual step position
        // For last step, use previous direction to avoid wonky rotation
        let dx, dy;
        if (i === numSteps - 1) {
            const tPrev = (i - 1) / (numSteps - 1);
            const pointPrev = curveFunction(tPrev);
            dx = point.x - pointPrev.x;
            dy = point.y - pointPrev.y;
        } else {
            const tNext = (i + 1) / (numSteps - 1);
            const pointNext = curveFunction(tNext);
            dx = pointNext.x - point.x;
            dy = pointNext.y - point.y;
        }
        const len = Math.sqrt(dx * dx + dy * dy);

        // Calculate rotation: foot points toward next step
        // Amplify rotation to make it more noticeable
        const baseAngle = Math.atan2(dy, dx) * (180 / Math.PI) - 90;
        const amplifiedAngle = baseAngle * 2;

        // Add small variation for natural look
        const variation = (Math.random() - 0.5) * 2;
        const rot = Math.round(amplifiedAngle + variation);

        // Perpendicular offset (90 degrees from walking direction)
        // This creates the zig-zag pattern
        const perpX = len > 0 ? (-dy / len) * leftRightOffset : 0;
        const perpY = len > 0 ? (dx / len) * leftRightOffset : 0;

        const offsetX = isLeft ? perpX : -perpX;
        const offsetY = isLeft ? perpY : -perpY;

        steps.push({
            x: Math.round((point.x + offsetX) * 10) / 10,
            y: Math.round((point.y + offsetY) * 10) / 10,
            rot: rot,
            isLeft: isLeft
        });
    }

    // Add 2 final steps where feet come together at the end, facing straight down
    const lastPoint = curveFunction(1);
    const finalY = lastPoint.y + 3; // Slightly below last walking step

    // Left foot comes to center
    steps.push({
        x: Math.round((lastPoint.x - 1) * 10) / 10,
        y: Math.round(finalY * 10) / 10,
        rot: 0,
        isLeft: true
    });

    // Right foot comes to center next to left
    steps.push({
        x: Math.round((lastPoint.x + 1) * 10) / 10,
        y: Math.round(finalY * 10) / 10,
        rot: 0,
        isLeft: false
    });

    return steps;
};

/**
 * S-curve function: starts at startX, curves right, then left, ends at endX
 * @returns {Function} (t) => { x, y }
 */
const createSCurve = (startX, startY, endX, endY, amplitude = 8) => {
    return (t) => {
        // S-curve using sine wave (one full period)
        const x = startX + (endX - startX) * t + Math.sin(t * Math.PI * 2) * amplitude;
        const y = startY + (endY - startY) * t;
        return { x, y };
    };
};

const FootstepPath = ({ scrollContainerRef, triggerThreshold }) => {
    const containerRef = useRef(null);
    const [visibleSteps, setVisibleSteps] = useState(-1);

    // Default threshold function if none provided
    const defaultThreshold = useCallback((container) => {
        return container.scrollTop > container.clientHeight * 2.1;
    }, []);

    const thresholdFn = triggerThreshold || defaultThreshold;

    // Generate curved path footsteps
    const steps = useMemo(() => {
        // S-curve from under venue to above reception
        const curve = createSCurve(
            40,  // startX - center-ish
            0,   // startY - top
            57,  // endX - center-ish
            125,  // endY - bottom
            4    // amplitude - how wide the S-curve goes (subtle)
        );

        return generateStepsAlongCurve(curve, 20); // More steps for shorter stride
    }, []);

    useEffect(() => {
        const container = scrollContainerRef?.current;
        if (!container) return;

        let started = false;

        const handleScroll = () => {
            if (started) return;

            if (thresholdFn(container)) {
                started = true;
                const interval = setInterval(() => {
                    setVisibleSteps((prev) => {
                        if (prev >= steps.length) {
                            clearInterval(interval);
                            return prev;
                        }
                        return prev + 1;
                    });
                }, 300);
            }
        };

        container.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial position

        return () => container.removeEventListener('scroll', handleScroll);
    }, [scrollContainerRef, thresholdFn, steps.length]);

    return (
        <div
            ref={containerRef}
            className="footstep-path-overlay"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 5,
                overflow: 'visible'
            }}
        >
            {steps.map((step, index) => (
                <Footstep
                    key={index}
                    step={step}
                    isVisible={index <= visibleSteps}
                    isLeft={step.isLeft}
                    isLast={index >= steps.length - 2}
                />
            ))}
        </div>
    );
};

export default FootstepPath;
