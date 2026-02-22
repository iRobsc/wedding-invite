import React from 'react';
import { rbt } from '../i18n/i18n';
import heroBg from '../assets/wedding_paper_2.png';
import ranasExterior from '../assets/ranasEntrance.jpeg';



const LandingPage = ({ isLoading, onIntroComplete, heroRef }) => {
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
        0% { transform: translateY(0); }
        60% { transform: translateY(-108%); } /* Relative overshoot */
        100% { transform: translateY(-7%); }
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

            {/* ERROR-CORRECTION: New Extreme Noise Texture for Gradient Banding */}
            <filter id="heavy-paper-texture" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">

                {/* 1. Base Wash (Clouds) - Enhanced for background */}
                <feTurbulence type="fractalNoise" baseFrequency="5" numOctaves="10" result="noiseBase" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.15 0" in="noiseBase" result="coloredBase" />

                {/* 2. Fine Grain (Tactile) - Stronger opacity */}
                <feTurbulence type="fractalNoise" baseFrequency="5" numOctaves="3" result="noiseGrain" />
                <feDiffuseLighting in="noiseGrain" lightingColor="#E6DCCA" surfaceScale="0.6" result="lightGrain">
                    <feDistantLight azimuth="45" elevation="60" />
                </feDiffuseLighting>
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.35 0" in="lightGrain" result="softGrain" />

                {/* 3. Fibers (Specks) - More visible */}
                <feTurbulence type="fractalNoise" baseFrequency="5" numOctaves="2" result="noiseFibers" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0 0.05  0 0 0 0.15 0" in="noiseFibers" result="specks" />

                {/* 4. Dithering (Anti-banding) - Extreme high freq noise */}
                <feTurbulence type="fractalNoise" baseFrequency="5" numOctaves="4" result="dither" />
                <feColorMatrix type="matrix" values="1 0 0 0 1  0 1 0 0 1  0 0 1 0 0  0 0 0 0.10 0" in="dither" result="softDither" />

                {/* Composition */}
                <feBlend mode="multiply" in="coloredBase" in2="SourceGraphic" result="baseLayer" />
                <feBlend mode="multiply" in="softGrain" in2="baseLayer" result="grainLayer" />
                <feBlend mode="multiply" in="specks" in2="grainLayer" result="speckLayer" />

                {/* Apply Dither last */}
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

            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <TextureDefs />
            </svg>

            {/* Hero Section */}
            <section
                ref={heroRef}
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
                    overflow: 'hidden', // Ensure no scrollbars/spill from background
                }}
            >
                {/* Background Image */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${ranasExterior})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center 100%',
                        filter: 'blur(7px) contrast(1)',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}
                />

                {/* Gradient Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100.5%', // Minor safety bleed
                        background: `linear-gradient(
                            to bottom,
                            rgba(249, 249, 245, 0) 0%,
                            rgba(249, 249, 245, 0.067) 8.9%,
                            rgba(249, 249, 245, 0.133) 16.1%,
                            rgba(249, 249, 245, 0.200) 22%,
                            rgba(249, 249, 245, 0.267) 26.9%,
                            rgba(249, 249, 245, 0.333) 31%,
                            rgba(249, 249, 245, 0.400) 34.8%,
                            rgba(249, 249, 245, 0.467) 38.4%,
                            rgba(249, 249, 245, 0.533) 42.2%,
                            rgba(249, 249, 245, 0.600) 46.5%,
                            rgba(249, 249, 245, 0.667) 51.6%,
                            rgba(249, 249, 245, 0.733) 57.9%,
                            rgba(249, 249, 245, 0.800) 65.5%,
                            rgba(249, 249, 245, 0.867) 74.9%,
                            rgba(249, 249, 245, 0.933) 86.3%,
                            #F9F9F5 95%,
                            #F9F9F5 100%
                        )`,
                        zIndex: 0, // Same level as background
                        pointerEvents: 'none'
                    }}
                />

                {/* Envelope + Card Container */}
                <div
                    style={{
                        position: 'relative',
                        width: '90%',
                        maxWidth: '800px', // Restrained width for better proportion
                        aspectRatio: '8 / 5', // Maintain 8:5 proportions
                    }}
                >
                    {/* Envelope BACK (Inside) */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 'calc(6% - 2px)',  // 2px wider than card
                            right: 'calc(6% - 2px)', // 2px wider than card
                            height: '90%', // Relative to 8:5 parent (450/500)
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
                            bottom: '2%', // Relative position (10/500)
                            height: '90%', // Relative height (450/500)
                            zIndex: isCardOnTop ? 5 : 2, // Jumps in front of pocket
                            borderRadius: '8px',
                            border: '1px solid rgba(212, 175, 55, 0.4)',
                            // Shadow appears when card pops in front ("at the peak")
                            boxShadow: isCardOnTop ? '0 20px 50px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.05)',
                            transition: 'box-shadow 0.8s ease', // Smooth entry for the shadow
                            padding: '6cqw 4cqw', // Responsive padding
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            animation: isCardOut ? 'cardEmergence 3s cubic-bezier(0.5, 0.1, 0.5, 1) forwards' : 'none',
                            transformOrigin: 'bottom center',
                            overflow: 'hidden', // Contain the background layer
                            containerType: 'inline-size',
                            containerName: 'card',
                        }}
                    >
                        {/* Background Image Layer */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage: `url(${heroBg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center calc(50% + 15cqw)', // Scaling offset
                                opacity: 1, // Full opacity for the image
                                zIndex: 0,
                            }}
                        />

                        {/* Lightening Overlay */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // White overlay as requested
                                zIndex: 1,
                                borderRadius: '7px',
                            }}
                        />
                        <div
                            className="hero-content"
                            style={{
                                zIndex: 2,
                                position: 'relative',
                                transform: 'translateY(6cqw)', // Shifted 1px lower (0.125cqw at 800px)
                            }}
                        >
                            <p
                                className="subtitle text-gold"
                                style={{
                                    fontSize: '3cqw',
                                    letterSpacing: '0.5cqw',
                                    textTransform: 'uppercase',
                                    marginBottom: '2.5cqw',
                                    fontWeight: 700
                                }}
                            >
                                {rbt("Celebrate with us")}
                            </p>
                            <h1
                                className="title text-navy"
                                style={{
                                    fontSize: '13cqw', // Increased from 11cqw
                                    marginBottom: '3cqw',
                                    fontWeight: 400,
                                    fontFamily: "'Alex Brush', cursive",
                                    lineHeight: 1.1,
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {rbt("Madeleine & Robert")}
                            </h1>

                            <div style={{ marginTop: '4cqw' }}>
                                <p
                                    className="location text-navy"
                                    style={{
                                        fontSize: '2.5cqw', // Increased from 2.1cqw
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2cqw'
                                    }}
                                >
                                    {rbt("May 14 2026")}
                                </p>
                                <div
                                    style={{
                                        width: '15cqw',
                                        height: '1px',
                                        backgroundColor: 'var(--color-gold)',
                                        margin: '2cqw auto'
                                    }}
                                ></div>
                                <p
                                    className="location text-navy"
                                    style={{
                                        fontSize: '2.5cqw', // Increased from 2.1cqw
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2cqw'
                                    }}
                                >
                                    {rbt("Rånäs Slott")}
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
                            height: '90%', // Height of the pocket (450/500)
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
                            bottom: '90%', // Aligns with top of back (450/500)
                            left: 'calc(6% - 2px)', // 2px wider than card
                            right: 'calc(6% - 2px)',
                            height: '50%', // (250/500)
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
        </div >
    );
};

export default LandingPage;
