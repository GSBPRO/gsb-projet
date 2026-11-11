import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import loadGlassMolecule from '../home/molecule/loadGlassMolecule.js';
import Header from './Header.jsx';
import './ProLayout.css';

// Mise en page commune à toutes les pages du professionnel : l'en-tête, puis la page en cours (<Outlet />).
// Pages dont le bandeau (vidéo) passe derrière l'en-tête, comme sur la boutique Pouch.
const HERO_PAGES = ['/catalogue', '/accueil'];

export default function ProLayout() {
  const hasHero = HERO_PAGES.includes(useLocation().pathname);
  // Si on arrive directement sur une autre page (session retrouvée), on précharge quand même l'accueil 3D.
  useEffect(() => {
    loadGlassMolecule();
  }, []);

  return (
    <div className={`pro-layout${hasHero ? ' pro-layout--hero' : ''}`}>
      <Header overHero={hasHero} />
      <main className="pro-layout__main">
        <Outlet />
      </main>
    </div>
  );
}
