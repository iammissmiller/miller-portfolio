import About from '@/components/About';
import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import HeroCursor from '@/components/HeroCursor';
import IntroEngine from '@/components/IntroEngine';
import Journey from '@/components/Journey';
import Nav from '@/components/Nav';
import Skills from '@/components/Skills';
import Work from '@/components/Work';

export default function Page() {
  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Nav />
      <main id="top">
        <Hero />
        <div className="torn-divider" id="torn-divider" aria-hidden="true" />
        <About />
        <Work />
        <Skills />
        <Journey />
        <Contact />
      </main>
      <IntroEngine />
      <HeroCursor />
    </>
  );
}