import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { FocusAreasSection } from '../components/FocusAreasSection';
import { ContactsSection } from '../components/ContactsSection';
import { HomeValues } from '../components/HomeValues';
import { StatsBanner } from '../components/StatsBanner';
import { MissionSection } from '../components/MissionSection';

export const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <StatsBanner />
      <MissionSection />
      <HomeValues />
      <FocusAreasSection />
      <ContactsSection />
    </>
  );
};