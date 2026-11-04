import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import loadGlassMolecule from '../home/molecule/loadGlassMolecule.js';
import Header from './Header.jsx';
import './ProLayout.css';

// Mise en page commune à toutes les pages du professionnel : l'en-tête, puis la page en cours (<Outlet />).
export default function ProLayout() {
  // Si on arrive directement sur une autre page (session retrouvée), on précharge quand même l'accueil 3D.
  useEffect(() => {
    loadGlassMolecule();
  }, []);

  return (
    <div className="pro-layout">
      <Header />
      <main className="pro-layout__main">
        <Outlet />
      </main>
    </div>
  );
}
