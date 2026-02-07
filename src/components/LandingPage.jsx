import React from 'react';
import heroBg from '../assets/wedding_hero_pastel.png';

const LandingPage = ({ isLoading, onIntroComplete }) => {
    // Animation states - Flap is now static
    const [isCardOut, setIsCardOut] = React.useState(false);
    const [isCardOnTop, setIsCardOnTop] = React.useState(false);

    React.useEffect(() => {
        document.fonts.ready.then(() => {
            // Slide card out of envelope (delayed slightly for effect)
            setTimeout(() => setIsCardOut(true), 2000);
            // Move card on top of envelope after it emerges
            setTimeout(() => setIsCardOnTop(true), 4000);
            // Signal animation complete
            setTimeout(() => onIntroComplete && onIntroComplete(), 2200);
        });
    }, [onIntroComplete]);

    // Keyframe animation style for card emergence
    const cardEmergenceAnimation = `
@keyframes cardEmergence {
        0% { transform: translateY(0px); }
        60% { transform: translateY(-490px); } /* Overshoots higher */
        100% { transform: translateY(-30px); }
    }
`;

    // SVG Definitions for reuse
    const TextureDefs = () => (
        <defs>
            {/* Realistic Kraft Paper Filter with Clipping */}
            {/* Advanced Realistic Kraft Paper Texture */}
            <filter id="paper-texture" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">

                {/* 1. Base Wash (Clouds) - Super soft now */}
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noiseBase" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.05 0" in="noiseBase" result="coloredBase" />

                {/* 2. Fine Grain (Tactile) - Reduced opacity */}
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noiseGrain" />
                {/* Lighting matches paper color to avoid white speckles */}
                <feDiffuseLighting in="noiseGrain" lightingColor="#E6DCCA" surfaceScale="0.3" result="lightGrain">
                    <feDistantLight azimuth="45" elevation="60" />
                </feDiffuseLighting>
                {/* Very transparent grain (0.15) */}
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" in="lightGrain" result="softGrain" />

                {/* 3. Fibers (Specks) - Sparse and faint */}
                <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="2" result="noiseFibers" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0 0.05  0 0 0 0.08 0" in="noiseFibers" result="specks" />

                {/* 4. Dithering (Anti-banding) - Ultra high freq noise */}
                <feTurbulence type="fractalNoise" baseFrequency="2.5" numOctaves="1" result="dither" />
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.03 0" in="dither" result="softDither" />

                {/* Composition */}
                <feBlend mode="multiply" in="coloredBase" in2="SourceGraphic" result="baseLayer" />
                <feBlend mode="multiply" in="softGrain" in2="baseLayer" result="grainLayer" />
                <feBlend mode="multiply" in="specks" in2="grainLayer" result="speckLayer" />

                {/* Apply Dither last to break up any banding in the gradients */}
                <feBlend mode="overlay" in="softDither" in2="speckLayer" result="finalTexture" />

                {/* Clipping */}
                <feComposite operator="in" in="finalTexture" in2="SourceGraphic" />
            </filter>

            <linearGradient id="flap-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D2B48C" /> {/* Tan */}
                <stop offset="100%" stopColor="#C19A6B" /> {/* Darker Tan */}
            </linearGradient>

            <linearGradient id="pocket-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E6BC98" /> {/* Lighter Kraft */}
                <stop offset="100%" stopColor="#D2B48C" /> {/* Tan */}
            </linearGradient>

            <dropShadow id="flap-shadow" dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
        </defs>
    );

    return (
        <div className="landing-page">
            {/* Inject keyframe animation */}
            <style>{cardEmergenceAnimation}</style>

            {/* Inline SVG for defs only */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <TextureDefs />
            </svg>

            {/* Hero Section */}
            <section
                className="hero"
                style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 1.5s ease-in-out',
                    padding: '2rem',
                }}
            >
                {/* Envelope + Card Container */}
                <div
                    style={{
                        position: 'relative',
                        width: '90%',
                        maxWidth: '800px', // Restrained width for better proportion
                        height: '500px',   // Fixed height context
                    }}
                >
                    {/* Envelope BACK (Inside) */}
                    {/* Aligned to match the card width (6%) plus a tiny margin if needed, 
                        or just behind the card. User said "fit the letter better". 
                        If card is left:6%, right:6%, Envelope Back should probably be same or slightly wider.
                        Let's make it match the card exactly so it looks like the inside of the envelope 
                        hugging the card. */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 'calc(6% - 2px)',  // 2px wider than card
                            right: 'calc(6% - 2px)', // 2px wider than card
                            height: '450px', // Slightly shorter than full pocket
                            backgroundColor: '#C8AD8D', // Inside color (darker kraft)
                            borderRadius: '0 0 5px 5px',
                            zIndex: 1,
                        }}
                    />

                    {/* Card Container */}
                    <div
                        style={{
                            position: 'absolute',
                            left: '6%',  // Slightly narrower than envelope
                            right: '6%',
                            bottom: '10px',
                            height: '450px', // Card height
                            zIndex: isCardOnTop ? 5 : 2, // Jumps in front of pocket
                            backgroundImage: `url(${heroBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '8px',
                            border: '1px solid rgba(212, 175, 55, 0.4)',
                            // Shadow appears when card pops in front ("at the peak")
                            boxShadow: isCardOnTop ? '0 20px 50px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.05)',
                            transition: 'box-shadow 0.8s ease', // Smooth entry for the shadow
                            padding: '3rem 2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            animation: isCardOut ? 'cardEmergence 3s cubic-bezier(0.5, 0.1, 0.5, 1) forwards' : 'none',
                            transformOrigin: 'bottom center',
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
                                backgroundColor: 'rgba(255, 253, 245, 0.55)', // Slightly more opaque for legibility
                                borderRadius: '7px',
                            }}
                        ></div>

                        <div
                            className="hero-content"
                            style={{
                                zIndex: 2,
                                position: 'relative',
                            }}
                        >
                            <p
                                className="subtitle text-gold"
                                style={{
                                    fontSize: '1.1rem',
                                    letterSpacing: '3px',
                                    textTransform: 'uppercase',
                                    marginBottom: '1rem',
                                    fontWeight: 700
                                }}
                            >
                                The Wedding Of
                            </p>
                            <h1
                                className="title text-navy"
                                style={{
                                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                                    marginBottom: '1.5rem',
                                    fontWeight: 400,
                                    fontFamily: "'Alex Brush', cursive",
                                    lineHeight: 1.1
                                }}
                            >
                                Madeleine & Robert
                            </h1>

                            <div style={{ marginTop: '1.5rem' }}>
                                <p
                                    className="date text-navy"
                                    style={{
                                        fontSize: '1.3rem',
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
                                        margin: '0.8rem auto'
                                    }}
                                ></div>
                                <p
                                    className="location text-text-light"
                                    style={{
                                        fontSize: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    Rånäs Slott, Uppland
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Envelope FRONT POCKET (SVG) */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 'calc(6% - 2px)', // 2px wider than card
                            right: 'calc(6% - 2px)',
                            height: '450px', // Height of the pocket
                            zIndex: 3,
                            pointerEvents: 'none', // Allow clicks through if needed
                            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))',
                        }}
                    >
                        <svg width="100%" height="100%" viewBox="0 0 800 350" preserveAspectRatio="none">
                            <path
                                d="M0,0 L400,120 L800,0 L800,350 L0,350 Z"
                                fill="url(#pocket-gradient)"
                                filter="url(#paper-texture)"
                            />
                            {/* Subtle Fold Line - Reduced opacity to 0.05 */}
                            <path d="M400,120 L400,350" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                        </svg>
                    </div>

                    {/* Envelope FLAP (SVG) - STATIC OPEN */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '450px', // Aligns with top of pocket
                            left: 'calc(6% - 2px)', // 2px wider than card
                            right: 'calc(6% - 2px)',
                            height: '250px',
                            zIndex: 1, // Always behind card now (since it's open)
                            transformOrigin: 'bottom center',
                            // Static Open Transform: rotated 0deg (pointing up)
                            transform: 'rotateX(0deg)',
                            filter: 'drop-shadow(0 -5px 10px rgba(0,0,0,0.1))',
                        }}
                    >
                        <svg width="100%" height="100%" viewBox="0 0 800 250" preserveAspectRatio="none">
                            <path
                                d="M0,250 L400,90 L800,250 Z"
                                fill="url(#flap-gradient)"
                                filter="url(#paper-texture)"
                            />
                        </svg>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
