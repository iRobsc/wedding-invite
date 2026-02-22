import React, { useRef, useEffect } from 'react';
import { rbt } from '../i18n/i18n';
import ranasExterior from '../assets/Ranas.Slott.jpg';
import fasternaKyrka from '../assets/Fasterna_kyrka.jpg';
import fasternaKyrka2 from '../assets/Fasterna_Kyrka_2.jpg';
import fasternaToVenue from '../assets/fasterna_to_venue.png';
import ranasMingle from '../assets/RanasMingel.jpg';
import ranasDinner from '../assets/Ranas.middag.jpg';
import weddingCake from '../assets/weddingCake.jpeg';
import afterparty from '../assets/afterparty.jpg';
import breakfast from '../assets/RanasFrukost.jpg';
import { ShowOnlyForLang } from '../i18n/i18n';

import PhotoScatter from './PhotoScatter';
import FootstepPath from './FootstepPath';
import CarScrollPath from './CarScrollPath';
import ResponsivePathBridge from './ResponsivePathBridge';
import useIntersectionObserver from '../hooks/useIntersectionObserver';


// Image Constants - Single Source of Truth
const ceremonyImages = [
    fasternaKyrka, fasternaKyrka2
];

const venueImages = [
    fasternaToVenue, ranasExterior, ranasMingle
];

const receptionImages = [
    ranasDinner
];

const cakeImages = [
    weddingCake
];

const afterPartyImages = [
    afterparty
];

const breakfastImages = [
    breakfast
];

const VenueSection = ({
    animationStep = 0,
    onTextComplete,
    onImagesComplete,
    onCarScrollStart,
    onCarComplete,
    onVenueTextComplete,
    scrollContainerRef,
    firstSectionRef
}) => {

    // Intersection Observer hooks for scroll-based visibility
    const [ceremonyTextRef, isCeremonyTextVisible] = useIntersectionObserver({ threshold: 0.3 });
    const [ceremonyImageRef, isCeremonyImageVisible] = useIntersectionObserver({ threshold: 0.2 });
    const [venueTextRef, isVenueTextVisible] = useIntersectionObserver({ threshold: 0.3 });
    const [venueImageRef, isVenueImageVisible] = useIntersectionObserver({ threshold: 0.2 });
    const [receptionTextRef, isReceptionTextVisible] = useIntersectionObserver({ threshold: 0.3 });
    const [receptionImageRef, isReceptionImageVisible] = useIntersectionObserver({ threshold: 0.2 });
    const [cakeTextRef, isCakeTextVisible] = useIntersectionObserver({ threshold: 0.3 });
    const [cakeImageRef, isCakeImageVisible] = useIntersectionObserver({ threshold: 0.2 });
    const [afterPartyTextRef, isAfterPartyTextVisible] = useIntersectionObserver({ threshold: 0.3 });
    const [afterPartyImageRef, isAfterPartyImageVisible] = useIntersectionObserver({ threshold: 0.2 });
    const [breakfastTextRef, isBreakfastTextVisible] = useIntersectionObserver({ threshold: 0.3 });
    const [breakfastImageRef, isBreakfastImageVisible] = useIntersectionObserver({ threshold: 0.2 });

    // Section refs for ResponsivePathBridge measurements
    const ceremonySectionRef = useRef(null);
    const venueSectionRef = useRef(null);
    const receptionSectionRef = useRef(null);
    const cakeSectionRef = useRef(null);
    const afterPartySectionRef = useRef(null);
    const breakfastSectionRef = useRef(null);

    // Title refs for precise path end-point positioning
    const venueTitleRef = useRef(null);
    const receptionTitleRef = useRef(null);
    const cakeTitleRef = useRef(null);
    const afterPartyTitleRef = useRef(null);
    const breakfastTitleRef = useRef(null);

    // Trigger animation steps when sections become visible
    useEffect(() => {
        if (isCeremonyTextVisible && onTextComplete) onTextComplete();
    }, [isCeremonyTextVisible, onTextComplete]);

    useEffect(() => {
        if (isCeremonyImageVisible && onImagesComplete) onImagesComplete();
    }, [isCeremonyImageVisible, onImagesComplete]);

    useEffect(() => {
        if (isVenueTextVisible && onVenueTextComplete) onVenueTextComplete();
    }, [isVenueTextVisible, onVenueTextComplete]);

    return (
        <div className="venue-section">
            {/* Church Section */}
            <div ref={(el) => { ceremonySectionRef.current = el; if (firstSectionRef) firstSectionRef.current = el; }} className="content-section">
                <div className="content-container">
                    <div
                        ref={ceremonyImageRef}
                        className={`photo-wrapper chained-reveal ${isCeremonyImageVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0.4s' }} // Image appears 400ms after text
                    >
                        <PhotoScatter
                            images={ceremonyImages}
                            altText="Fasterna Kyrka"
                            enableRandomRotation={true}
                            rotationRange={1.75}
                        />
                    </div>



                    <div
                        ref={ceremonyTextRef}
                        className={`text-content chained-reveal ${isCeremonyTextVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0s' }} // Text appears first
                    >
                        <h2 className="text-navy">{rbt("Ceremony")}</h2>
                        <p className="subtitle text-gold">{rbt("Fasterna Church 15:00")}</p>
                        <p>
                            {rbt("The day begins at Fasterna Church for the ceremony to take place at")} <b>{rbt("15:00")}</b>{rbt(". Please arrive at least 15 minutes early.")}
                        </p>
                        <p style={{ marginTop: '0.8rem', fontSize: '1rem' }}>
                            📍 <a href="https://maps.app.goo.gl/aLauVBNFRC55szE46" target="_blank" rel="noopener noreferrer" style={{ color: '#3956ffff', textDecoration: 'underline' }}>{rbt("Church Location")}</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Path connecting Ceremony to Venue (The Car) */}
            <ResponsivePathBridge
                sectionAboveRef={ceremonySectionRef}
                titleBelowRef={venueTitleRef}
                scrollContainerRef={scrollContainerRef}
            >
                <CarScrollPath
                    scrollContainerRef={scrollContainerRef}
                    isVisible={animationStep >= 1}
                    onScrollStart={onCarScrollStart}
                    onComplete={onCarComplete}
                />
            </ResponsivePathBridge>

            {/* Exterior Section */}
            <div ref={venueSectionRef} className="content-section">
                <div className="content-container reverse">
                    <div
                        ref={venueImageRef}
                        className={`photo-wrapper chained-reveal ${isVenueImageVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0.4s' }} // Image appears 400ms after text
                    >
                        <PhotoScatter
                            images={venueImages}
                            altText="Rånas Exterior"
                            enableRandomRotation={true}
                            rotationRange={1.75}
                        />
                    </div>



                    <div
                        ref={venueTextRef}
                        className={`text-content chained-reveal ${isVenueTextVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0s' }} // Text appears first
                    >
                        <h2 ref={venueTitleRef} className="text-navy">{rbt("The Venue")}</h2>
                        <p className="subtitle text-gold">{rbt("Rånäs Castle")}</p>
                        <p>
                            {rbt("After the ceremony there is a short drive to Rånäs Castle, where the reception will take place. We will help any guests without a car with the transport from the church to the castle.")}
                        </p>
                        <p style={{ marginTop: '0.8rem' }}>
                            {rbt("At the castle you will first check in and get your included accommodation. Then at")} <b>{rbt("16:45")}</b> {rbt("there will be a mingle and our arrival from the church.")}
                        </p>
                        <p style={{ marginTop: '0.8rem', fontSize: '1rem' }}>
                            📍 <a href="https://maps.app.goo.gl/FD1MBdGeZBYNNWdz7" target="_blank" rel="noopener noreferrer" style={{ color: '#3956ffff', textDecoration: 'underline' }}>{rbt("Rånäs Castle Parking")}</a>
                        </p>
                    </div>
                </div>
            </div>


            {/* Path connecting Venue to Dinner */}
            <ResponsivePathBridge
                sectionAboveRef={venueSectionRef}
                titleBelowRef={receptionTitleRef}
                scrollContainerRef={scrollContainerRef}
            >
                <FootstepPath
                    scrollContainerRef={scrollContainerRef}
                    triggerAt={0.8}
                    startX={30} endX={60}
                    startY={-15} endY={85}
                    amplitude={-4} stepCount={15}
                    itemScale={0.8}
                />
            </ResponsivePathBridge>

            {/* Interior Section */}
            <div ref={receptionSectionRef} className="content-section">
                <div className="content-container">
                    <div
                        ref={receptionImageRef}
                        className={`photo-wrapper chained-reveal ${isReceptionImageVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0.4s' }} // Image appears 400ms after text
                    >
                        <PhotoScatter
                            images={receptionImages}
                            altText="Rånas Interior"
                            enableRandomRotation={true}
                            rotationRange={1.75}
                            startDirection={-1}
                        />
                    </div>



                    <div
                        ref={receptionTextRef}
                        className={`text-content chained-reveal ${isReceptionTextVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0s' }} // Text appears first
                    >
                        <h2 ref={receptionTitleRef} className="text-navy">{rbt("Dinner")}</h2>
                        <p className="subtitle text-gold">{rbt("Galleriet 18:00")}</p>
                        <p>
                            {rbt("The dinner will start after the mingle at")} <b>{rbt("18:00")}</b> {rbt("where a three course meal will be served. You will be able to indicate any dietary preferences or allergies in the RSVP form included with this invitation.")}
                        </p>
                        <p style={{ marginTop: '0.8rem' }}>
                            {rbt("During dinner, there will be toasts and entertainment led by our toastmaster and toastmadame. If you would like to give a toast, you can find the contact information further down.")}
                        </p>
                    </div>
                </div>
            </div>


            {/* Path connecting Dinner to Wedding Cake */}
            <ResponsivePathBridge
                sectionAboveRef={receptionSectionRef}
                titleBelowRef={cakeTitleRef}
                scrollContainerRef={scrollContainerRef}
            >
                <FootstepPath
                    scrollContainerRef={scrollContainerRef}
                    triggerAt={0.8}
                    startX={60} endX={30}
                    startY={-10} endY={85}
                    amplitude={-4} stepCount={15}
                    itemScale={0.8}
                />
            </ResponsivePathBridge>

            {/* Wedding Cake Section */}
            <div ref={cakeSectionRef} className="content-section cake-section">
                <div className="content-container">
                    <div
                        ref={cakeTextRef}
                        className={`text-content chained-reveal ${isCakeTextVisible ? 'is-visible' : ''}`}
                    >
                        <h2 ref={cakeTitleRef} className="text-navy">{rbt("Wedding Cake")}</h2>
                        <p className="subtitle text-gold">{rbt("Upstairs")}</p>
                        <p>
                            {rbt("After dinner, we will head upstairs for the wedding cake along with coffee and tea.")} <ShowOnlyForLang lang="en"><a href="https://www.youtube.com/watch?v=oRIeytEXGhQ&t=32s" target="_blank" rel="noopener noreferrer" style={{ color: '#3956ffff', textDecoration: 'underline' }}>{rbt("Fika")}</a> {rbt("as we call it in swedish.")}</ShowOnlyForLang>
                        </p>
                    </div>

                    <div
                        ref={cakeImageRef}
                        className={`photo-wrapper chained-reveal ${isCakeImageVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0.4s' }}
                    >
                        <PhotoScatter
                            images={cakeImages}
                            altText="Wedding Cake"
                            enableRandomRotation={true}
                            rotationRange={1.75}
                        />
                    </div>


                </div>
            </div>

            {/* Path connecting Wedding Cake to Party */}
            <ResponsivePathBridge
                sectionAboveRef={cakeSectionRef}
                titleBelowRef={afterPartyTitleRef}
                scrollContainerRef={scrollContainerRef}
            >
                <FootstepPath
                    scrollContainerRef={scrollContainerRef}
                    triggerAt={0.8}
                    startX={30} endX={58}
                    startY={-10} endY={85}
                    amplitude={8} stepCount={15}
                    type="music"
                />
            </ResponsivePathBridge>

            {/* New Party Section */}
            <div ref={afterPartySectionRef} className="content-section after-party-section">
                <div className="content-container">
                    <div
                        ref={afterPartyImageRef}
                        className={`photo-wrapper chained-reveal ${isAfterPartyImageVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0.4s' }}
                    >
                        <PhotoScatter
                            images={afterPartyImages}
                            altText="Party"
                            enableRandomRotation={true}
                            rotationRange={1.75}
                            startDirection={-1}
                        />
                    </div>



                    <div
                        ref={afterPartyTextRef}
                        className={`text-content chained-reveal ${isAfterPartyTextVisible ? 'is-visible' : ''}`}
                    >
                        <h2 ref={afterPartyTitleRef} className="text-navy">{rbt("Party")}</h2>
                        <p className="subtitle text-gold">{rbt("Upstairs")}</p>
                        <p>
                            {rbt("The celebration continues after the fika with drinks, music, and dancing.")}
                        </p>
                        <p style={{ marginTop: '0.8rem' }}>
                            {rbt("Around")} <b>{rbt("01:00")}</b> {rbt("there will be toasts (the food) served to everyone who are still up partying.")}
                        </p>
                        <p style={{ marginTop: '0.8rem' }}>
                            {rbt("At")} <b>{rbt("02:00")}</b> {rbt("the bar closes and the djs go home but feel free to stay up, you will not be forced to go to your rooms. 😉")}
                        </p>

                    </div>
                </div>
            </div>

            {/* Zzz Path connecting Party to Breakfast */}
            <ResponsivePathBridge
                sectionAboveRef={afterPartySectionRef}
                titleBelowRef={breakfastTitleRef}
                scrollContainerRef={scrollContainerRef}
            >
                <FootstepPath
                    scrollContainerRef={scrollContainerRef}
                    triggerAt={0.8}
                    startX={65} endX={30}
                    startY={-10} endY={85}
                    amplitude={5} stepCount={12}
                    type="sleep"
                />
            </ResponsivePathBridge>

            {/* Breakfast Section */}
            <div ref={breakfastSectionRef} className="content-section breakfast-section">
                <div className="content-container reverse">
                    <div
                        ref={breakfastImageRef}
                        className={`photo-wrapper chained-reveal ${isBreakfastImageVisible ? 'is-visible' : ''}`}
                        style={{ transitionDelay: '0.4s' }}
                    >
                        <PhotoScatter
                            images={breakfastImages} // Placeholder until breakfast image is generated
                            altText="Breakfast"
                            enableRandomRotation={true}
                            rotationRange={1.75}
                        />
                    </div>



                    <div
                        ref={breakfastTextRef}
                        className={`text-content chained-reveal ${isBreakfastTextVisible ? 'is-visible' : ''}`}
                    >
                        <h2 ref={breakfastTitleRef} className="text-navy">{rbt("Breakfast")}</h2>
                        <p className="subtitle text-gold">{rbt("Galleriet 09:00")}</p>
                        <p>
                            {rbt("A buffet style breakfast will be served from")} <b>{rbt("09:00")}</b> {rbt("and the checkout is at")} <b>{rbt("11:00")}</b>{rbt(". Then we will say our goodbyes and wish you a safe journey.")}
                        </p>
                        <p style={{ marginTop: '0.8rem' }}>
                            {rbt("We hope you will have a wonderful time at our wedding. ❤️")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueSection;
