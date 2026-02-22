import React from 'react';

const LoadingScreen = ({ isLoading }) => {
    return (
        <div
            className={`loading-screen ${!isLoading ? 'fade-out' : ''}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#faf8f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                transition: 'opacity 0.8s ease-out, visibility 0.8s ease-out',
                opacity: isLoading ? 1 : 0,
                visibility: isLoading ? 'visible' : 'hidden',
                pointerEvents: isLoading ? 'all' : 'none'
            }}
        >
            <h1
                className="alex-brush shimmer-text"
                style={{
                    fontSize: 'clamp(4rem, 12vw, 8rem)',
                    margin: 0,
                    userSelect: 'none',
                }}
            >
                M & R
            </h1>
            <style>{`
                @keyframes shimmer {
                    0% {
                        background-position: -200% center;
                    }
                    100% {
                        background-position: 200% center;
                    }
                }
                .shimmer-text {
                    background: linear-gradient(
                        90deg,
                        #c0c0c0 0%,
                        #e8e8e8 25%,
                        #f5f5f5 50%,
                        #e8e8e8 75%,
                        #c0c0c0 100%
                    );
                    background-size: 200% 100%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
