import React from 'react';
import ranasExterior from '../assets/ranas_exterior.png';
import ranasInterior from '../assets/ranas_interior.png';
import fasternaKyrka from '../assets/fasterna_kyrka.png';
import flowerCeremony from '../assets/flower_ceremony.svg';
import flowerVenue from '../assets/flower_venue.svg';
import flowerReception from '../assets/flower_reception.svg';
import weddingCar from '../assets/wedding_car.svg';
import ImageCarousel from './ImageCarousel';
import PhotoScatter from './PhotoScatter';
import FootstepPath from './FootstepPath';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const VenueSection = ({ animationStep = 0, onTextComplete, onImagesComplete, onVenueTextComplete, scrollContainerRef }) => {
    // Image Constants - Single Source of Truth
    const ceremonyImages = [
        fasternaKyrka, fasternaKyrka, fasternaKyrka
    ]; // 3 images

    const venueImages = [
        ranasExterior
    ]; // 1 image

    const receptionImages = [
        ranasInterior, ranasInterior
    ]; // 2 images

    // Intersection Observer hooks for scroll-based visibility
    const [ceremonyTextRef, isCeremonyTextVisible] = useIntersectionObserver({ threshold: 0.3 });
    const [ceremonyImageRef, isCeremonyImageVisible] = useIntersectionObserver({ threshold: 0.2 });
    const [venueTextRef, isVenueTextVisible] = useIntersectionObserver({ threshold: 0.3 });
    const [venueImageRef, isVenueImageVisible] = useIntersectionObserver({ threshold: 0.2 });
    const [receptionTextRef, isReceptionTextVisible] = useIntersectionObserver({ threshold: 0.3 });
    const [receptionImageRef, isReceptionImageVisible] = useIntersectionObserver({ threshold: 0.2 });

    return (
        <div className="venue-section">
            {/* Church Section */}
            <div className="content-section">
                <div className="content-container">
                    <div
                        ref={ceremonyImageRef}
                        className={`photo-wrapper rotate-left desktop-view chained-reveal ${isCeremonyImageVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0.4s' }} // Image appears 400ms after text
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
                        ref={ceremonyTextRef}
                        className={`text-content chained-reveal ${isCeremonyTextVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0s' }} // Text appears first
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
                    <div
                        ref={venueImageRef}
                        className={`photo-wrapper rotate-right desktop-view chained-reveal ${isVenueImageVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0.4s' }} // Image appears 400ms after text
                    >
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

                    <div
                        ref={venueTextRef}
                        className={`text-content chained-reveal ${isVenueTextVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0s' }} // Text appears first
                    >
                        <h2 className="text-navy">The Venue</h2>
                        <p className="subtitle text-gold">Rånäs Slott, Uppland</p>
                        <p>
                            Join us at the majestic Rånäs Slott, a late empire-style manor nestled by the shores of Lake Skedviken.
                            The honey-colored facade and lush parkland provide a fairytale backdrop for our special day.
                        </p>
                    </div>
                </div>
            </div>


            {/* Path connecting Venue to Reception - Absolute overlay */}
            <div style={{ position: 'relative', height: '0px', width: '100%' }}>
                <div style={{ position: 'absolute', top: '-300px', left: 0, width: '100%', height: '600px' }}>
                    <FootstepPath scrollContainerRef={scrollContainerRef} />
                </div>
            </div>

            {/* Interior Section */}
            <div className="content-section">
                <div className="content-container">
                    <div
                        ref={receptionImageRef}
                        className={`photo-wrapper rotate-left desktop-view chained-reveal ${isReceptionImageVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0.4s' }} // Image appears 400ms after text
                    >
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

                    <div
                        ref={receptionTextRef}
                        className={`text-content chained-reveal ${isReceptionTextVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0s' }} // Text appears first
                    >
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
