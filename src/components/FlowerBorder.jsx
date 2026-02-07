import React from 'react';
import flowerImg from '../assets/flower3.jpg';

const FlowerBorder = ({ startAnimation }) => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        // Trigger animation when startAnimation prop is true
        if (startAnimation) {
            setTimeout(() => setIsVisible(true), 100);
        }
    }, [startAnimation]);

    // Number of flowers on each side
    const flowerCount = 30;
    const flowers = Array.from({ length: flowerCount }, (_, i) => i);

    return (
        <>
            {/* Left side flowers */}
            <div
                style={{
                    position: 'absolute',
                    left: '20px',
                    top: '0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    pointerEvents: 'none',
                    zIndex: 10,
                }}
            >
                {flowers.map((index) => (
                    <img
                        key={`left-${index}`}
                        src={flowerImg}
                        alt=""
                        style={{
                            width: '150px',
                            height: '150px',
                            opacity: isVisible ? 1 : 0,
                            transition: `opacity 0.8s ease-out ${index * 0.15}s`,
                        }}
                    />
                ))}
            </div>

            {/* Right side flowers */}
            <div
                style={{
                    position: 'absolute',
                    right: '20px',
                    top: '0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    pointerEvents: 'none',
                    zIndex: 10,
                }}
            >
                {flowers.map((index) => (
                    <img
                        key={`right-${index}`}
                        src={flowerImg}
                        alt=""
                        style={{
                            width: '150px',
                            height: '150px',
                            opacity: isVisible ? 1 : 0,
                            transition: `opacity 0.8s ease-out ${index * 0.15}s`,
                        }}
                    />
                ))}
            </div>
        </>
    );
};

export default FlowerBorder;
