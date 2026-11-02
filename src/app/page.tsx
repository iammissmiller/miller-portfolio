import About from '@/components/About';
import CardTilt from '@/components/CardTilt';
import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import HeroCursor from '@/components/HeroCursor';
import IntroEngine from '@/components/IntroEngine';
import Journey from '@/components/Journey';
import Nav from '@/components/Nav';
import ScrollCan from '@/components/ScrollCan';
import Skills from '@/components/Skills';
import Strip from '@/components/Strip';
import Work from '@/components/Work';
import { site } from '@/data/site';

const personLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  ...(site.nameHindi ? { alternateName: site.nameHindi } : {}),
  url: site.url,
  description: site.description,
  sameAs: [site.github, ...(site.linkedin ? [site.linkedin] : [])],
}).replace(/</g, '\\u003c');

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personLd }} />
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Nav />
      <main id="top">
        <Hero />
        <div className="torn-divider" id="torn-divider" aria-hidden="true" />
        <About />
        <Strip tone="red" words={[{ t: 'Selected work' }, { t: 'काम', hi: true }, { t: 'Rakta' }, { t: 'HackBIOS' }]} />
        <Work />
        <Strip tone="sun" reverse words={[{ t: 'Skills' }, { t: 'हुनर', hi: true }, { t: 'Code' }, { t: 'Design' }]} />
        <Skills />
        <Strip tone="ink" words={[{ t: 'Journey' }, { t: 'सफ़र', hi: true }, { t: 'Hackathons' }, { t: 'Open source' }]} />
        <Journey />
        <Strip tone="red" reverse words={[{ t: 'Say hello' }, { t: 'संपर्क', hi: true }, { t: 'Say hello' }, { t: 'नमस्ते', hi: true }]} />
        <Contact />
      </main>
      <IntroEngine />
      <HeroCursor />
      <CardTilt />
      <ScrollCan />
    </>
  );
}
