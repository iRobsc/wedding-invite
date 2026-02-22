import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import flowerBg from '../assets/pastel_flower.png';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const scaleIn = keyframes`
    from { transform: scale(1.1); }
    to { transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff0f5; // Lavender blush / pastel pink
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  animation: ${props => props.isExiting ? fadeOut : fadeIn} 1s ease-in-out forwards;
`;

const BackgroundImage = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${flowerBg});
    background-size: cover;
    background-position: center;
    opacity: 0.3;
    animation: ${scaleIn} 4s ease-out forwards;
`;

const Title = styled.h1`
  font-family: 'Great Vibes', cursive;
  font-size: 5rem;
  color: var(--color-navy);
  z-index: 2;
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out 0.5s forwards;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const FlowerTransition = ({ onTransitionHalfway, onTransitionComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Step 1: Fade In Overlay (1s)

    // Step 2: Switch Content underneath (at 1.5s mark)
    const switchTimer = setTimeout(() => {
      if (onTransitionHalfway) onTransitionHalfway();
    }, 1500);

    // Step 3: Start Fading Out Overlay (at 2.5s mark)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    // Step 4: Complete and Unmount (at 3.5s mark - 1s after exit start)
    const completeTimer = setTimeout(() => {
      if (onTransitionComplete) onTransitionComplete();
    }, 3500);

    return () => {
      clearTimeout(switchTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onTransitionHalfway, onTransitionComplete]);

  return (
    <Overlay isExiting={isExiting}>
      <BackgroundImage />
      <Title>The Celebration</Title>
    </Overlay>
  );
};

export default FlowerTransition;
