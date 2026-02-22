import React from 'react';
import { rbt } from '../i18n/i18n';
import styled from 'styled-components';
import pastelFlower from '../assets/cornerflower.png';
import { ShowOnlyForLang } from '../i18n/i18n';

const InfoWrapper = styled.div`
  min-height: auto;
  width: 100%;
  // No background color - transparent over default body
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 2rem 3rem;
  position: relative;
  overflow-x: hidden;
`;

const GoldenSeparator = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 1px;
  background-color: #D4AF37;
  margin-bottom: 8rem;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    background-color: #ffffc5;
    border: 1px solid #D4AF37;
    width: 12px;
    height: 12px;
  }
  
  &::after {
    width: 6px;
    height: 6px;
    background-color: #D4AF37;
    border: none;
  }
`;

const InfoCard = styled.div`
  background-color: #faf6ea; // Cream
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.4); // Gold border
  box-shadow: 0 20px 50px rgba(0,0,0,0.15); // Slightly lighter shadow since bg is light
  padding: 3rem;
  max-width: 900px;
  width: 90%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: var(--font-body);
  color: #2c3e50; // Navy text
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.4);
    pointer-events: none;
    z-index: 1;
  }
`;

const FlowerDecoration = styled.img`
  position: absolute;
  width: 600px;
  opacity: 1; // Subtle on cream
  pointer-events: none;
  clip-path: inset(0 40% 60% 0);
  z-index: 0;
  
  &.top-left { top: 0px; left: 0px;}
  &.bottom-right { bottom: 0px; right: 0px; transform: rotate(180deg);}
`;

const Section = styled.section`
  max-width: 700px;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
  z-index: 2; // Above flowers
`;

const Title = styled.h2`
  font-family: var(--font-script);
  font-size: clamp(2.2rem, 5vw, 4rem);
  margin-bottom: 0.5rem;
  color: #2c3e50; // Navy to match other script headers
  font-weight: 400;
`;

const SubTitle = styled.h4`
  font-family: var(--font-body);
  font-size: clamp(1rem, 2vw, 1.4rem);
  line-height: 1;
  color: #2c3e50; // Navy
  margin-bottom: 0.5rem;
`;

const Text = styled.p`
  font-family: var(--font-body);
  font-size: clamp(0.9rem, 1.5vw, 1.25rem);
  line-height: 1.8;
  color: #2c3e50; // Navy
  margin-bottom: 1rem;
`;

const Divider = styled.div`
  width: 100px;
  height: 2px;
  background: #e0d0c0;
  margin: 1.5rem auto 3rem;
  opacity: 0.7;
`;

const InfoPage = () => {
  return (
    <InfoWrapper>
      <GoldenSeparator />

      <InfoCard>
        <FlowerDecoration src={pastelFlower} className="top-left" alt="" />
        <FlowerDecoration src={pastelFlower} className="bottom-right" alt="" />

        <Section>
          <Title>{rbt("Wedding Details")}</Title>
          <Text>
            {rbt("Here are all the details you will need to help prepare for our special day.")}
          </Text>
        </Section>

        <Divider />

        <Section>
          <SubTitle>{rbt("RSVP")}</SubTitle>
          <Text>
            {rbt("Please kindly respond by")} <strong>{rbt("March 31st, 2026")}</strong> {rbt("via the")}&nbsp;
            <ShowOnlyForLang lang="sv">
              <a href="https://forms.gle/c7rqd2X8evCmYN5e9" target="_blank" rel="noopener noreferrer" style={{ color: '#3956ffff', textDecoration: 'underline' }}>{rbt("RSVP form")}</a>
            </ShowOnlyForLang>
            <ShowOnlyForLang lang="en">
              <a href="https://forms.gle/fHsXMcT7XdbDXoMb8" target="_blank" rel="noopener noreferrer" style={{ color: '#3956ffff', textDecoration: 'underline' }}>{rbt("RSVP form")}</a>
            </ShowOnlyForLang>
            {rbt(". If you have any questions you can contact us through Messenger.")}
          </Text>
        </Section>

        <Section>
          <SubTitle>{rbt("Children")}</SubTitle>
          <Text>
            {rbt("This is an adult only wedding. We hope you will understand.")}<br />
          </Text>
        </Section>

        <Section>
          <SubTitle>{rbt("Dress Code")}</SubTitle>
          <Text>
            <ShowOnlyForLang lang="en">
              <i>{rbt("Spring Formal")}</i><br />
            </ShowOnlyForLang>
            {rbt("Men: Suits.")}<br />
            {rbt("Women: We encourage pastel colors to match the theme of the wedding.")}<br />
            {rbt("No red and white colors. (because of traditions)")}
          </Text>
        </Section>

        <Section>
          <SubTitle>{rbt("Accommodation")}</SubTitle>
          <Text>
            {rbt("The accommodation is on us, all you have to do is check in")} <b>{rbt("after")}</b> {rbt("you get to the castle from the church ceremony.")}
          </Text>
        </Section>

        <Section>
          <SubTitle>{rbt("Toastmaster and Toastmadame")}</SubTitle>
          <Text>
            {rbt("Willy Liu and Alexandra Dahlqvist will be the hosts. They will help coordinate any questions around the dinner and toasts. Each toast should be at most 5 minutes long. You can contact them personally or through their email if you want to hold a toast or have other questions:")} <br /> <b>{rbt("madbert.toast@gmail.com")}</b>
          </Text>
        </Section>

        <Section>
          <SubTitle>{rbt("Gifts")}</SubTitle>
          <Text>
            {rbt("Your presence is the greatest gift of all. However, should you wish to honor us with a gift, a contribution to our honeymoon fund would be warmly appreciated.")}<br />
            <ShowOnlyForLang lang="sv">
              {rbt("If you prefer physical gifts we have a small set of items we have added to our")} <a href="https://www.cervera.se/onskelista/4usj8nhfb7h7" target="_blank" rel="noopener noreferrer" style={{ color: '#3956ffff', textDecoration: 'underline' }}>{rbt("wishlist")}</a>.<br />
              {rbt("We will add more things to the list.")}
            </ShowOnlyForLang>
          </Text>
        </Section>

        <Section style={{ marginBottom: 0 }}>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', fontStyle: 'italic', marginTop: '1rem', color: '#2c3e50' }}>
            {rbt("We look forward to celebrating with you!")}
          </p>
        </Section>
      </InfoCard>
    </InfoWrapper>
  );
};

export default InfoPage;
