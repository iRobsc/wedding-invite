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
            pointerEvents: 'none'
        }}
    />
);

// Single quarter/eighth note
const MusicNoteIcon = ({ opacity }) => (
    <svg
        viewBox="0 0 24 24"
        style={{
            width: '24px',
            height: '24px',
            opacity: opacity,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
            pointerEvents: 'none',
            overflow: 'visible'
        }}
    >
        <path fill="#2c3e50" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
);

// Beam note (two connected eighth notes)
const BeamNoteIcon = ({ opacity }) => (
    <svg
        viewBox="0 0 40 32"
        style={{
            width: '32px',
            height: '28px',
            opacity: opacity,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
            pointerEvents: 'none',
            overflow: 'visible'
        }}
    >
        {/* Left note head */}
        <ellipse cx="10" cy="26" rx="5" ry="3.5" fill="#2c3e50" transform="rotate(-15 8 26)" />
        {/* Left stem */}
        <rect x="12.5" y="4" width="2" height="22" fill="#2c3e50" />
        {/* Right note head */}
        <ellipse cx="30" cy="24" rx="5" ry="3.5" fill="#2c3e50" transform="rotate(-15 28 24)" />
        {/* Right stem */}
        <rect x="32.5" y="2" width="2" height="22" fill="#2c3e50" />
        {/* Top beam */}
        <rect x="12.5" y="2" width="22" height="3" fill="#2c3e50" rx="0.5" />
        {/* Bottom beam */}
        <rect x="12.5" y="7" width="22" height="3" fill="#2c3e50" rx="0.5" />
    </svg>
);

// Sleep Z icon - stylized "Z" letter
const SleepZIcon = ({ opacity, size = 'medium' }) => {
    const sizes = { small: 16, medium: 22, large: 28 };
    const s = sizes[size] || sizes.medium;
    return (
        <svg
            viewBox="0 0 24 28"
            style={{
                width: `${s}px`,
                height: `${s}px`,
                opacity: opacity,
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
                pointerEvents: 'none',
                overflow: 'visible'
            }}
        >
            <text
                x="12"
                y="22"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontWeight="bold"
                fontSize="24"
                fill="#2c3e50"
                fontStyle="italic"
            >
                Z
            </text>
        </svg>
    );
};

// Animated sunrise SVG - sun rising with rays, clipped behind horizon
const SunriseIcon = ({ opacity }) => (
    <svg
        viewBox="0 0 48 48"
        style={{
            width: '40px',
            height: '40px',
            opacity: opacity,
            pointerEvents: 'none',
            overflow: 'visible'
        }}
    >
        {/* Clip path to hide everything below the horizon */}
        <defs>
            <clipPath id="sunriseClip">
                <rect x="0" y="0" width="48" height="34" />
            </clipPath>
        </defs>

        {/* Sun + rays grouped together, animated as one unit rising up */}
        <g clipPath="url(#sunriseClip)">
            <g>
                {/* Animate the whole group vertically: starts below horizon, rises up */}
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0 14; 0 2; 0 0; 0 2"
                    dur="3s"
                    repeatCount="indefinite"
                />

                {/* Sun circle */}
                <circle cx="24" cy="24" r="8" fill="#f6c94e" stroke="#e2a04a" strokeWidth="1.5" />

                {/* Sun rays */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const innerR = 11;
                    const outerR = 16;
                    return (
                        <line
                            key={i}
                            x1={24 + Math.cos(rad) * innerR}
                            y1={24 + Math.sin(rad) * innerR}
                            x2={24 + Math.cos(rad) * outerR}
                            y2={24 + Math.sin(rad) * outerR}
                            stroke="#f6c94e"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            <animate
                                attributeName="opacity"
                                values="0.3;1;0.3"
                                dur="1.5s"
                                begin={`${i * 0.15}s`}
                                repeatCount="indefinite"
                            />
                        </line>
                    );
                })}

                {/* Glow effect */}
                <circle cx="24" cy="24" r="12" fill="none" stroke="#f6c94e" strokeWidth="0.5" opacity="0.4">
                    <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
            </g>
        </g>

        {/* Horizon line - drawn on top, black */}
        <line x1="4" y1="34" x2="44" y2="34" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// CSS keyframes for the dancing note and floating Z animations
const animationStyles = `
@keyframes noteDance {
    0%   { transform: rotate(0deg); }
    15%  { transform: rotate(15deg); }
    30%  { transform: rotate(-12deg); }
    45%  { transform: rotate(10deg); }
    60%  { transform: rotate(-8deg); }
    75%  { transform: rotate(5deg); }
    90%  { transform: rotate(-3deg); }
    100% { transform: rotate(0deg); }
}
@keyframes sunrisePulse {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.1); }
    100% { transform: scale(1); }
}
`;

// Inject the keyframes stylesheet once
if (typeof document !== 'undefined') {
    const existingStyle = document.getElementById('path-animation-styles');
    if (!existingStyle) {
        const styleTag = document.createElement('style');
        styleTag.id = 'path-animation-styles';
        styleTag.textContent = animationStyles;
        document.head.appendChild(styleTag);
    }
}

// Individual item (footstep, note, or sleep Z) with its own fade logic
const PathElement = ({ step, isVisible, isLeft, isLast, type, itemScale = 1 }) => {
    const isMusic = type === 'music';
    const isSleep = type === 'sleep';
    const isAnimatedType = isMusic || isSleep;
    const [opacity, setOpacity] = useState(0);
    const [scale, setScale] = useState(isAnimatedType ? 1.5 : 1);
    const [hasTransition, setHasTransition] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setOpacity(1);
            if (isAnimatedType) setScale(isSleep ? 1.3 : 1.4);

            // Skip fade for last item only
            if (isLast) return;

            // After 0.5s, enable transition and fade/shrink
            const timer = setTimeout(() => {
                setHasTransition(true);
                setTimeout(() => {
                    setOpacity(0.1);
                    if (isAnimatedType) setScale(1.0);
                }, 100);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isVisible, isLast, isAnimatedType, isSleep]);

    // Choose the right icon
    const renderIcon = () => {
        if (type === 'music') {
            if (step.noteType === 'beam') {
                return <BeamNoteIcon opacity={1} />;
            }
            return <MusicNoteIcon opacity={1} />;
        }
        if (type === 'sleep') {
            // Last item is the sunrise
            if (isLast) {
                return <SunriseIcon opacity={1} />;
            }
            // Random Z sizes for variety
            return <SleepZIcon opacity={1} size={step.zSize} />;
        }
        return (
            <FootprintIcon
                isLeft={isLeft}
                opacity={1}
            />
        );
    };

    // Determine element dimensions
    const getWidth = () => {
        if (type === 'music') return step.noteType === 'beam' ? '32px' : '24px';
        if (type === 'sleep') return isLast ? '40px' : '24px';
        return '20px';
    };
    const getHeight = () => {
        if (type === 'music') return step.noteType === 'beam' ? '28px' : '24px';
        if (type === 'sleep') return isLast ? '40px' : '24px';
        return '52px';
    };

    // Fixed pixel offset for left/right footstep separation
    const PERP_OFFSET_PX = 15;
    const perpTranslateX = (step.perpDx || 0) * PERP_OFFSET_PX;
    const perpTranslateY = (step.perpDy || 0) * PERP_OFFSET_PX;

    return (
        <div
            style={{
                position: 'absolute',
                left: `${step.x}%`,
                top: `${step.y}%`,
                left: `${step.x}%`,
                top: `${step.y}%`,
                transform: `translate(${perpTranslateX}px, ${perpTranslateY}px) rotate(${step.rot}deg) scale(${(isAnimatedType ? scale : 1) * itemScale})`,
                width: getWidth(),
                height: getHeight(),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: opacity,
                transition: hasTransition ? 'opacity 0.5s ease-out, transform 0.5s ease-out' : 'none',
                // Dancing animation for the last music note
                ...(isMusic && isLast && isVisible && opacity === 1 ? {
                    animation: 'noteDance 1.2s ease-in-out infinite',
                } : {}),
                // Sunrise pulse for the last sleep item
                ...(isSleep && isLast && isVisible && opacity === 1 ? {
                    animation: 'sunrisePulse 2s ease-in-out infinite',
                } : {}),
            }}
        >
            {renderIcon()}
        </div>
    );
};

/**
 * Generate footsteps along a curved path
 */
const generateStepsAlongCurve = (curveFunction, numSteps, type = 'footsteps', rotationMultiplier = 2) => {
    const steps = [];
    const isMusic = type === 'music';
    const isSleep = type === 'sleep';
    const isAnimatedType = isMusic || isSleep;
    const leftRightOffset = isAnimatedType ? 0 : 1;

    const zSizes = ['small', 'medium', 'large'];

    for (let i = 0; i < numSteps; i++) {
        const t = i / (numSteps - 1); // 0 to 1
        const isLeft = i % 2 === 0;

        // Get base position on curve
        const point = curveFunction(t);

        // Calculate direction for rotation
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

        // Calculate rotation
        const baseAngle = Math.atan2(dy, dx) * (180 / Math.PI) - 90;
        let rot = baseAngle;

        // Add standard wobble for footsteps
        if (!isAnimatedType) {
            const amplifiedAngle = baseAngle * rotationMultiplier;
            const variation = (Math.random() - 0.5) * 5;
            rot = Math.round(amplifiedAngle + variation);
        } else {
            rot += (Math.random() - 0.5) * 10;
        }

        // Perpendicular unit vector for fixed-pixel offset in render
        let perpDx = 0;
        let perpDy = 0;

        if (!isAnimatedType && len > 0) {
            // Unit perpendicular vector
            const ux = -dy / len;
            const uy = dx / len / 2; // Reduced y component for less vertical offset
            perpDx = isLeft ? ux : -ux;
            perpDy = isLeft ? uy : -uy;
        }

        // Randomly assign note type for music paths
        let noteType = 'single';
        if (isMusic) {
            if (i === numSteps - 1) {
                noteType = 'beam';
            } else {
                noteType = Math.random() > 0.5 ? 'beam' : 'single';
            }
        }

        // Random Z size for sleep paths
        let zSize = 'medium';
        if (isSleep && i !== numSteps - 1) {
            zSize = zSizes[Math.floor(Math.random() * zSizes.length)];
        }

        steps.push({
            x: Math.round(point.x * 10) / 10,
            y: Math.round(point.y * 10) / 10,
            perpDx,
            perpDy,
            rot: Math.round(rot),
            isLeft: isLeft,
            noteType: noteType,
            zSize: zSize
        });
    }

    // Add final standing steps (only for footsteps)
    if (!isAnimatedType) {
        const lastPoint = curveFunction(1);
        const finalY = lastPoint.y + 3;

        // Determine the last step's side to ensure alternation
        // If numSteps is even (0..n-1), last index is odd -> Right (since 0 is Left)
        // If numSteps is odd, last index is even -> Left
        // But let's check the actual last step pushed
        const lastWalkingStep = steps[steps.length - 1];
        const lastWasLeft = lastWalkingStep ? lastWalkingStep.isLeft : false; // Default to Right if no steps

        // Final sequence should be: ... -> LastWalking -> NextFoot -> FinalFoot
        // If lastWasLeft, next should be Right, then Left
        // If lastWasRight, next should be Left, then Right
        // Visual:
        //    L
        //       R
        //    L  R (Standing)

        const firstFootLeft = !lastWasLeft;

        // Push First Standing Foot (Opposite of last walking)
        steps.push({
            x: Math.round(lastPoint.x * 10) / 10,
            y: Math.round(finalY * 10) / 10,
            perpDx: firstFootLeft ? -1 : 1, // Offset based on side
            perpDy: 0,
            rot: 0,
            isLeft: firstFootLeft,
            noteType: 'single',
            zSize: 'medium'
        });

        // Push Second Standing Foot (Same as last walking, to match the pair)
        steps.push({
            x: Math.round(lastPoint.x * 10) / 10,
            y: Math.round(finalY * 10) / 10,
            perpDx: firstFootLeft ? 1 : -1, // Opposite of first standing
            perpDy: 0,
            rot: 0,
            isLeft: !firstFootLeft,
            noteType: 'single',
            zSize: 'medium'
        });
    }

    return steps;
};

/**
 * S-curve function: starts at startX, curves right, then left, ends at endX
 */
const createSCurve = (startX, startY, endX, endY, amplitude = 8) => {
    return (t) => {
        const x = startX + (endX - startX) * t + Math.sin(t * Math.PI * 2) * amplitude;
        const y = startY + (endY - startY) * t;
        return { x, y };
    };
};

const FootstepPath = ({
    scrollContainerRef,
    triggerAt = 0.5,
    startX = 40,
    startY = 5,
    endX = 57,
    endY = 95,
    amplitude = 4,
    stepCount = 28,
    type = 'footsteps',
    itemScale = 1
}) => {
    const containerRef = useRef(null);
    const [visibleSteps, setVisibleSteps] = useState(-1);
    const [screenCategory, setScreenCategory] = useState('desktop');

    // Track screen size category for responsive adjustments
    useEffect(() => {
        const updateCategory = () => {
            const width = window.innerWidth;
            if (width < 850) setScreenCategory('mobile');
            else if (width < 1200) setScreenCategory('tablet');
            else setScreenCategory('desktop');
        };
        updateCategory();
        window.addEventListener('resize', updateCategory);
        return () => window.removeEventListener('resize', updateCategory);
    }, []);

    // Responsive step count and rotation
    let effectiveStepCount = stepCount;
    let rotationMultiplier = 2;

    if (screenCategory === 'mobile') {
        effectiveStepCount = Math.max(8, Math.round(stepCount * 0.6));
        rotationMultiplier = 1.2;
    } else if (screenCategory === 'tablet') {
        effectiveStepCount = Math.max(12, Math.round(stepCount * 0.85));
        rotationMultiplier = 1.6;
    }

    // Generate curved path footsteps — startY/endY used directly (no squeeze)
    const steps = useMemo(() => {
        const curve = createSCurve(startX, startY, endX, endY, amplitude);
        return generateStepsAlongCurve(curve, effectiveStepCount, type, rotationMultiplier);
    }, [startX, startY, endX, endY, amplitude, effectiveStepCount, type, rotationMultiplier]);

    // Determine animation speed based on type
    const animInterval = type === 'music' ? 180 : type === 'sleep' ? 220 : 300;

    useEffect(() => {
        const scrollContainer = scrollContainerRef?.current;
        const el = containerRef.current;
        if (!scrollContainer || !el) return;

        let started = false;

        // Use IntersectionObserver for reliable, consistent triggering
        // rootMargin bottom = -(1 - triggerAt) * 100% shrinks the observation zone
        // so the element is only "intersecting" when it's in the top triggerAt% of the viewport
        const bottomMargin = -Math.round((1 - triggerAt) * 100);

        const observer = new IntersectionObserver(
            (entries) => {
                if (started) return;
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        started = true;
                        observer.disconnect();
                        const interval = setInterval(() => {
                            setVisibleSteps((prev) => {
                                if (prev >= steps.length) {
                                    clearInterval(interval);
                                    return prev;
                                }
                                return prev + 1;
                            });
                        }, animInterval);
                    }
                });
            },
            {
                root: scrollContainer,
                rootMargin: `0px 0px ${bottomMargin}% 0px`,
                threshold: 0
            }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [scrollContainerRef, triggerAt, steps.length, animInterval]);

    // Determine isLast based on type
    const getIsLast = (index) => {
        if (type === 'music' || type === 'sleep') return index === steps.length - 1;
        return index >= steps.length - 2;
    };

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
                <PathElement
                    key={index}
                    step={step}
                    isVisible={index <= visibleSteps}
                    isLeft={step.isLeft}
                    isLast={getIsLast(index)}
                    type={type}
                    itemScale={itemScale}
                />
            ))}
        </div>
    );
};

export default FootstepPath;
