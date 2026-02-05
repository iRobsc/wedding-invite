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
                // No background color - transparent overlay
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                transition: 'opacity 0.8s ease-out, visibility 0.8s ease-out',
                opacity: isLoading ? 1 : 0,
                visibility: isLoading ? 'visible' : 'hidden',
                pointerEvents: isLoading ? 'all' : 'none'
            }}
        >
            <div className="loader-content" style={{ textAlign: 'center' }}>
                <h1 className="alex-brush" style={{
                    fontSize: '4rem',
                    color: '#334155', // Slate-700
                    marginBottom: '1rem'
                }}>
                    M & R
                </h1>
                <div className="spinner" style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #e2e8f0', // Slate-200
                    borderTop: '3px solid #d4af37', // Gold
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto'
                }} />
            </div>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
