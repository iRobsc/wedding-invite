import React, { useEffect, useRef } from 'react';
import ranasExterior from '../assets/ranas_exterior.png';
import ranasInterior from '../assets/ranas_interior.png';
import fasternaKyrka from '../assets/fasterna_kyrka.png';
import flowerCeremony from '../assets/flower_ceremony.svg';
import flowerVenue from '../assets/flower_venue.svg';
import flowerReception from '../assets/flower_reception.svg';
import weddingCar from '../assets/wedding_car.svg';
import ImageCarousel from './ImageCarousel';
import PhotoScatter from './PhotoScatter';

const VenueSection = ({ animationStep = 0, onTextComplete, onImagesComplete, onVenueTextComplete }) => {
    const observerRef = useRef(null);
    const textRef = useRef(null);

    // Image Constants - Single Source of Truth
    // Note: Fade-in classes applied to desktop-view wrappers only to preserve mobile behavior
    const ceremonyImages = [
        fasternaKyrka, fasternaKyrka, fasternaKyrka
    ]; // 3 images

    const venueImages = [
        ranasExterior
    ]; // 1 image

    const receptionImages = [
        ranasInterior, ranasInterior
    ]; // 2 images

    // 1. Trigger Text Completion (Overlap)
    useEffect(() => {
        if (animationStep === 1 && onTextComplete) {
            const timer = setTimeout(() => {
                onTextComplete();
            }, 200); // 200ms overlap delay
            return () => clearTimeout(timer);
        }
    }, [animationStep, onTextComplete]);

    // 2. Trigger Image Completion (Chain Car)
    useEffect(() => {
        if (animationStep === 2 && onImagesComplete) {
            const timer = setTimeout(() => {
                onImagesComplete();
            }, 200); // Wait 200ms (small delay) for images to fade in before showing Car
            return () => clearTimeout(timer);
        }
    }, [animationStep, onImagesComplete]);

    // 3. Trigger Venue Text Completion (Chain Venue Images)
    useEffect(() => {
        if (animationStep === 4 && onVenueTextComplete) {
            const timer = setTimeout(() => {
                onVenueTextComplete();
            }, 400); // Reading time for text before images
            return () => clearTimeout(timer);
        }
    }, [animationStep, onVenueTextComplete]);

    // ... (Observer) ...

    // Helper for Ceremony Visibility
    // Step 1: Text Visible
    // Step 2: Image Visible
    const isTextVisible = animationStep >= 1;
    const isImageVisible = animationStep >= 2;
    // Step 3: Car Start (Handled in App)
    // Step 4: Car Complete -> Reveal Venue Text
    // Step 5: Venue Text Complete -> Reveal Venue Images
    const isVenueTextVisible = animationStep >= 4;
    const isVenueImageVisible = animationStep >= 5;

    return (
        <div className="venue-section">
            {/* Church Section */}
            <div className="content-section">
                <div className="content-container">
                    <div
                        className={`photo-wrapper rotate-left desktop-view chained-reveal ${isImageVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0s' }} // Remove standard Delay
                    >
                        <PhotoScatter
                            images={ceremonyImages}
                            altText="Fasterna Kyrka"
                        />
                    </div>

                    <div className="mobile-view">
                        <ImageCarousel
                            images={ceremonyImages}
                            altText="Fasterna Kyrka"
                        />
                    </div>

                    <div
                        ref={textRef}
                        className={`text-content chained-reveal ${isTextVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0s' }}
                    >
                        <h2 className="text-navy">Ceremony</h2>
                        <p className="subtitle text-gold">Fasterna Kyrka</p>
                        <p>
                            We begin our journey at the historic Fasterna Kyrka, a beautiful neoclassical church with a unique cross-shaped design.
                            Built in the early 19th century, its yellow and white facade stands as a beacon of tradition.
                        </p>
                    </div>
                </div>
            </div>

            {/* Exterior Section */}
            <div className="content-section">
                <div className="content-container reverse">
                    <div className={`photo-wrapper rotate-right desktop-view chained-reveal ${isVenueImageVisible ? 'is-visible' : ''}`}>
                        <PhotoScatter
                            images={venueImages}
                            altText="Rånas Exterior"
                        />
                    </div>

                    <div className="mobile-view">
                        <ImageCarousel
                            images={venueImages}
                            altText="Rånas Exterior"
                        />
                    </div>

                    <div className={`text-content chained-reveal ${isVenueTextVisible ? 'is-visible' : ''}`}>
                        <h2 className="text-navy">The Venue</h2>
                        <p className="subtitle text-gold">Rånäs Slott, Uppland</p>
                        <p>
                            Join us at the majestic Rånäs Slott, a late empire-style manor nestled by the shores of Lake Skedviken.
                            The honey-colored facade and lush parkland provide a fairytale backdrop for our special day.
                        </p>
                    </div>
                </div>
            </div>

            {/* Interior Section */}
            {/* Interior Section */}
            <div className="content-section">
                <div className="content-container">
                    <div className="photo-wrapper rotate-left desktop-view">
                        <PhotoScatter
                            images={receptionImages}
                            altText="Rånas Interior"
                        />
                    </div>

                    <div className="mobile-view">
                        <ImageCarousel
                            images={receptionImages}
                            altText="Rånas Interior"
                        />
                    </div>

                    <div className="text-content">
                        <h2 className="text-navy">Reception</h2>
                        <p className="subtitle text-gold">Dining in Elegance</p>
                        <p>
                            Celebrate with us in the grand salon, featuring crystal chandeliers and magnificent 19th-century architecture.
                            An unforgettable evening of fine dining and dancing awaits.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueSection;
