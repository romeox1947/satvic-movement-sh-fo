'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Menu } from 'lucide-react';

const links = [
  ['The concept', '#concept'],
  ['Carbon card', '#carbon-card'],
  ['How it works', '#how-it-works'],
  ['Our impact', '#impact'],
  ['Partnerships', '#partners'],
];

function Brand() {
  return <a className="brand wordmark" href="#top" aria-label="Satvic Movement home">satvic movement</a>;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header className={`nav${scrolled ? ' nav-scrolled' : ''}`}>
      <div className="nav-inner">
        <Brand />
        <nav className="nav-links" aria-label="Main navigation">
          {links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </nav>
        <div className="nav-actions">
          <a className="nav-cta" href="#join">Join the movement</a>
          <a className="nav-secondary" href="mailto:hello@sattvicmovement.example">Contact us</a>
        </div>
        <details className="mobile-nav">
          <summary aria-label="Open navigation"><Menu /></summary>
          <nav className="mobile-nav-panel" aria-label="Mobile navigation">
            {links.map(([label, href]) => <a key={label} href={href}>{label}<ArrowRight size={14} /></a>)}
            <a href="#join">Join the movement<ArrowUpRight size={14} /></a>
            <a href="mailto:hello@sattvicmovement.example">Contact us<ArrowUpRight size={14} /></a>
          </nav>
        </details>
      </div>
    </header>
  );
}
