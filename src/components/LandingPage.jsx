import React from 'react';
import heroBg from '../assets/wedding_hero_pastel.png';

const LandingPage = ({ isLoading }) => {
    // Stage 1: Reveal Title when Fonts are Ready
    const [isTitleVisible, setIsTitleVisible] = React.useState(false);

    React.useEffect(() => {
        document.fonts.ready.then(() => {
            setIsTitleVisible(true);
        });
    }, []);

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section
                className="hero"
                style={{
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 1.5s ease-in-out', // Slow, elegant fade
                }}
            >
                <div
                    className="hero-overlay"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 253, 245, 0.4)'
                    }}
                ></div>

                <div
                    className="hero-content"
                    style={{
                        zIndex: 2,
                        padding: '2rem',
                        opacity: isTitleVisible ? 1 : 0,
                        transform: isTitleVisible ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
                    }}
                >
                    <p
                        className="subtitle text-gold"
                        style={{
                            fontSize: '1.2rem',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem',
                            fontWeight: 700
                        }}
                    >
                        The Wedding Of
                    </p>
                    <h1
                        className="title text-navy"
                        style={{
                            fontSize: 'clamp(3rem, 8vw, 6rem)',
                            marginBottom: '1.5rem',
                            fontWeight: 400,
                            fontFamily: "'Alex Brush', cursive"
                        }}
                    >
                        Madeleine & Robert
                    </h1>

                    <div style={{ marginTop: '2rem' }}>
                        <p
                            className="date text-navy"
                            style={{
                                fontSize: '1.5rem',
                                fontStyle: 'italic',
                                fontFamily: 'var(--font-heading)'
                            }}
                        >
                            May 14, 2026
                        </p>
                        <div
                            style={{
                                width: '60px',
                                height: '1px',
                                backgroundColor: 'var(--color-gold)',
                                margin: '1rem auto'
                            }}
                        ></div>
                        <p
                            className="location text-text-light"
                            style={{
                                fontSize: '1.1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}
                        >
                            Rånäs Slott, Uppland
                        </p>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default LandingPage;
