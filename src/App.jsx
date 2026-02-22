import React, { useRef, useState, useCallback, useEffect } from 'react';
import { LanguageProvider } from './i18n/i18n';
import LandingPage from './components/LandingPage';
import VenueSection from './components/VenueSection';
import ScrollArrow from './components/ScrollArrow';
import CarScrollPath from './components/CarScrollPath';
import LoadingScreen from './components/LoadingScreen';
import usePreloader from './hooks/usePreloader';
import InfoPage from './components/InfoPage';

// Assets to Preload
import heroImg from './assets/wedding_hero_pastel.png';
import churchImg from './assets/Fasterna_kyrka.jpg';
import venueExt from './assets/Ranas.Slott.jpg';
import venueInt from './assets/ranas_interior.png';
import carSvg from './assets/wedding_car.svg';
import flowerCeremony from './assets/flower_ceremony.svg';
import flowerVenue from './assets/flower_venue.svg';
import flowerReception from './assets/flower_reception.svg';

const PRELOAD_ASSETS = [
  heroImg,
  churchImg,
  venueExt,
  venueInt,
  carSvg,
  flowerCeremony,
  flowerVenue,
  flowerReception
];

function App() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const ceremonySectionRef = useRef(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [introFinished, setIntroFinished] = useState(false);

  // Preload Images
  const isLoading = usePreloader(PRELOAD_ASSETS); // Re-enabled after fixing layout bug

  // Optimize Handlers to prevent Effect Churn in children
  const handleArrowComplete = useCallback(() => setAnimationStep(prev => Math.max(prev, 1)), []);
  const handleTextComplete = useCallback(() => setAnimationStep(prev => Math.max(prev, 2)), []);
  const handleImagesComplete = useCallback(() => setAnimationStep(prev => Math.max(prev, 3)), []);
  const handleCarScrollStart = useCallback(() => setAnimationStep(prev => Math.max(prev, 3)), []);
  const handleCarComplete = useCallback(() => setAnimationStep(prev => Math.max(prev, 4)), []);
  const handleVenueTextComplete = useCallback(() => setAnimationStep(prev => Math.max(prev, 5)), []);

  const handleIntroComplete = useCallback(() => setIntroFinished(true), []);

  // Allow user to bypass intro wait by scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop > 10 && !introFinished) {
        setIntroFinished(true);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [introFinished]);

  return (
    <LanguageProvider>
      <div
        ref={containerRef}
        className="app-container"
        style={{
          scrollBehavior: 'smooth',
          height: '100vh',
          overflowY: isLoading ? 'hidden' : 'scroll', // Lock scroll while loading
          position: 'relative',
        }}
      >
        <div style={{ position: 'relative', minHeight: '100%' }}>
          <LandingPage
            isLoading={isLoading}
            onIntroComplete={handleIntroComplete}
            heroRef={heroRef}
          />
          <div
            className="desktop-view"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              opacity: !isLoading && introFinished ? 1 : 0, // Wait for intro to finish
              transition: 'opacity 1.5s ease-in-out' // Sync with background fade
            }}
          >
            <ScrollArrow
              scrollContainerRef={containerRef}
              onAnimationComplete={handleArrowComplete}
              anchorRef={heroRef}
              endAnchorRef={ceremonySectionRef}
            />
            <CarScrollPath
              scrollContainerRef={containerRef}
              isVisible={animationStep >= 3}
              onScrollStart={handleCarScrollStart}
              onComplete={handleCarComplete}
            />
          </div>
          <VenueSection
            animationStep={animationStep}
            onTextComplete={handleTextComplete}
            onImagesComplete={handleImagesComplete}
            scrollContainerRef={containerRef}
            onVenueTextComplete={handleVenueTextComplete}
            firstSectionRef={ceremonySectionRef}
          />
          <InfoPage />
        </div>
      </div>
    </LanguageProvider>
  )
}

export default App

