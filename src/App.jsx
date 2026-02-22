import React, { useRef, useState, useCallback, useEffect } from 'react';
import { LanguageProvider } from './i18n/i18n';
import LandingPage from './components/LandingPage';
import VenueSection from './components/VenueSection';
import ScrollArrow from './components/ScrollArrow';
import LoadingScreen from './components/LoadingScreen';
import usePreloader from './hooks/usePreloader';
import InfoPage from './components/InfoPage';
import ResponsivePathBridge from './components/ResponsivePathBridge';

// Assets to Preload (only landing page images for fast initial load)
import heroBg from './assets/wedding_paper_2.png';
import heroEntrance from './assets/ranasEntrance.jpeg';

const PRELOAD_ASSETS = [
  heroBg,
  heroEntrance
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
      <LoadingScreen isLoading={isLoading} />
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
        <div className="app-main-content">
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
          </div>
          <VenueSection
            animationStep={animationStep}
            onTextComplete={handleTextComplete}
            onImagesComplete={handleImagesComplete}
            onCarScrollStart={handleCarScrollStart}
            onCarComplete={handleCarComplete}
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

