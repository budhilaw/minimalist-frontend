import React from 'react';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Portfolio } from '../components/Portfolio';
import { Services } from '../components/Services';
import { Blog } from '../components/Blog';
import { Contact } from '../components/Contact';

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <Blog />
      <Contact />
    </>
  );
}; 