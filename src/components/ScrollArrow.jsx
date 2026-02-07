import React from 'react';
import UniversalScrollPath from './UniversalScrollPath';

const ScrollArrow = ({ scrollContainerRef, onAnimationComplete }) => {
    // Config
    const START_X = 0;
    const START_Y = 75;
    const END_X = 25;
    const END_Y = 120;
    // Original Path (75 -> 100 -> 95 -> 120)
    // "Wobbly" but requested by user.
    const pathD = `M ${START_X},${START_Y} C ${START_X},${START_Y + 25} ${END_X},${END_Y - 25} ${END_X},${END_Y}`;

    return (
        <div className="scroll-arrow-wrapper" style={{
            position: 'absolute',
            top: '50px',
            left: '50%',
            width: '50%',
            height: '200vh'
        }}>
            <UniversalScrollPath
                scrollContainerRef={scrollContainerRef}
                onComplete={onAnimationComplete}
                viewBox="0 0 100 200"
                pathD={pathD}
                triggerThreshold={10}
                rotateWithTangent={true}
                initialOpacity={1}
                strokeDasharray={null} // Solid line
                leadOffset={5}         // Arrow ahead of line (Gap fixed by user preference)
                useLegacyStyle={true}  // Restore CSS transform behavior
                duration={4000}        // Slower animation
            >
                {/* ARROW ICON */}
                {/* No transform needed here, handled by parent wrapper */}
                <path d="M -2,-2 L 0,0 L -2,2" fill="none" stroke="#334155" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </UniversalScrollPath>
        </div>
    );
};

export default ScrollArrow;
