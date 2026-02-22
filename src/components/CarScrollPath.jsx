import React, { useCallback } from 'react';
import UniversalScrollPath from './UniversalScrollPath';
import { useVerticalSqueeze } from '../hooks/useVerticalSqueeze';

const CarScrollPath = ({ scrollContainerRef, isVisible = false, onScrollStart, onComplete }) => {
    // --- CONFIG ---
    const squeeze = useVerticalSqueeze();

    const START_X = 60; // Aligns with Arrow End (50% + 12.5%)
    const START_Y = 0;
    const END_X = 30;
    const END_Y = 90;

    // Curvature also scales with squeeze
    const curvature = 25 * squeeze;
    const pathD = `M ${START_X},${START_Y} C ${START_X + 2},${START_Y + curvature} ${END_X - 10},${END_Y - curvature} ${END_X},${END_Y}`;

    // Threshold Function (Memoized)
    const thresholdFn = useCallback((container) => {
        return container.scrollTop > container.clientHeight * 1.2; // Trigger even earlier
    }, []);

    return (
        <div className="car-scroll-wrapper" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1.2s ease-out', // Match CSS fade-in
            pointerEvents: 'none'
        }}>
            <UniversalScrollPath
                scrollContainerRef={scrollContainerRef}
                onScrollStart={onScrollStart}
                onComplete={onComplete}
                viewBox="0 0 100 100"
                pathD={pathD}
                triggerThreshold={thresholdFn}
                rotateWithTangent={false} // Locked Horizontal
                scaleX={-0.025}           // Flipped horizontally
                scaleY={0.025}            // Same magnitude = square icon
                initialOpacity={1}        // Reverted to 1 as requested
                strokeDasharray="5, 5"    // Dotted
                leadOffset={5}            // Car leads line slightly
                duration={6000}           // Slower animation
            >
                {/* CAR ICON */}
                {/* Centered Geometry: translate(-128, -128) */}
                <g transform="translate(-128, -128)" fill="#2c3e50" stroke="none">
                    <g transform="scale(2.81) translate(1.4, 1.4)">
                        <circle cx="70.7" cy="56.8" r="2" fill="#2c3e50" />
                        <circle cx="19.8" cy="56.8" r="2" fill="#2c3e50" />
                        <path d="M75.5 36l-8-1.2l-2.4-2.6c-5.6-6.1-13.6-9.6-21.9-9.6h-6.2c-1.4 0-2.7 0.1-4 0.3c0 0 0 0-0.1 0c-7.8 1.1-14.8 5.5-19.3 12.1C5.7 37.9 0 45.4 0 53c0 3.3 2.6 5.9 5.9 5.9h3.5c1 4.9 5.3 8.5 10.4 8.5s9.4-3.7 10.4-8.5h30.1c1 4.9 5.3 8.5 10.4 8.5s9.4-3.7 10.4-8.5h3.5c3.3 0 5.9-2.6 5.9-5.9C90 44.4 83.9 37.3 75.5 36z M43.3 26.6c7.1 0 13.8 2.9 18.7 8.1H39.5l-3.3-8.1c0.3 0 0.6 0 0.8 0H43.3z M32.1 27.1l3.1 7.6H19C22.4 30.8 27 28.2 32.1 27.1z M19.8 63.4c-3.7 0-6.6-3-6.6-6.6c0-3.7 3-6.6 6.6-6.6s6.6 3 6.6 6.6C26.4 60.4 23.4 63.4 19.8 63.4z M70.7 63.4c-3.7 0-6.6-3-6.6-6.6c0-3.7 3-6.6 6.6-6.6c3.7 0 6.6 3 6.6 6.6C77.4 60.4 74.4 63.4 70.7 63.4z" fill="#2c3e50" />
                    </g>
                </g>
            </UniversalScrollPath>
        </div>
    );
};

export default CarScrollPath;
