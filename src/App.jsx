import React, { useRef, useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import VenueSection from './components/VenueSection';
import ScrollArrow from './components/ScrollArrow';
import CarScrollPath from './components/CarScrollPath';
import LoadingScreen from './components/LoadingScreen';
import usePreloader from './hooks/usePreloader';

// Assets to Preload
import heroImg from './assets/wedding_hero_pastel.png';
import churchImg from './assets/fasterna_kyrka.png';
import venueExt from './assets/ranas_exterior.png';
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
  const [animationStep, setAnimationStep] = useState(0);

  // Preload Images
  const isLoading = usePreloader(PRELOAD_ASSETS); // Re-enabled after fixing layout bug

  // Optimize Handlers to prevent Effect Churn in children
  const handleArrowComplete = useCallback(() => setAnimationStep(prev => Math.max(prev, 1)), []);
  const handleTextComplete = useCallback(() => setAnimationStep(prev => Math.max(prev, 2)), []);
  const handleImagesComplete = useCallback(() => setAnimationStep(prev => Math.max(prev, 3)), []);
  const handleCarScrollStart = useCallback(() => setAnimationStep(prev => Math.max(prev, 3)), []);
  const handleCarComplete = useCallback(() => setAnimationStep(prev => Math.max(prev, 4)), []);
  const handleVenueTextComplete = useCallback(() => setAnimationStep(prev => Math.max(prev, 5)), []);

  return (
    <>
      <div
        ref={containerRef}
        className="app-container"
        style={{
          scrollSnapType: 'y mandatory',
          height: '100vh',
          overflowY: isLoading ? 'hidden' : 'scroll', // Lock scroll while loading
          position: 'relative',
        }}
      >
        <LandingPage isLoading={isLoading} />
        <div
          className="desktop-view"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: isLoading ? 0 : 1, // Hide arrow until loaded
            transition: 'opacity 1.5s ease-in-out' // Sync with background fade
          }}
        >
          <ScrollArrow
            scrollContainerRef={containerRef}
            onAnimationComplete={handleArrowComplete}
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
          onVenueTextComplete={handleVenueTextComplete}
        />
      </div>
    </>
  )
}

export default App
