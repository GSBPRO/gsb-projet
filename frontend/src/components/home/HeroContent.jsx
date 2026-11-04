import { lazy, Suspense } from 'react';
import ArrowIcon from '../icons/ArrowIcon.jsx';
import ButtonLink from '../ui/ButtonLink.jsx';
import Reveal from '../ui/Reveal.jsx';
import loadGlassMolecule from './loadGlassMolecule.js';
import './HeroContent.css';

// Chargement à part : Three.js (lourd) est dans un fichier séparé, préchargé dès la page de connexion.
const GlassMolecule = lazy(loadGlassMolecule);

// Les trois lignes du titre, révélées l'une après l'autre.
const TITLE_LINES = ['Le soin commence', 'par une relation', 'de confiance.'];

// Texte de l'accueil : salutation, titre, bouton vers le catalogue, molécule 3D et phrase de présentation.
// Chaque élément est dans un <Reveal> : il apparaît (avec son retard) quand le bandeau reçoit « is-revealed ».
export default function HeroContent({ userName, onMoleculeReady }) {
  return (
    <div className="hero-content">
      <div>
        <Reveal delay={0.1}>
          <p className="hero-content__greeting">Bonjour {userName}</p>
        </Reveal>

        {/* id utilisé par la section (aria-labelledby) : le titre donne son nom à tout le bandeau */}
        <h1 id="hero-title" className="hero-content__title">
          {TITLE_LINES.map((line, index) => (
            <Reveal key={line} as="span" variant="line" delay={0.2 + index * 0.12}>
              {line}
            </Reveal>
          ))}
        </h1>

        <Reveal delay={0.65}>
          <ButtonLink to="/catalogue" className="hero-content__cta">
            Explorer le catalogue
            <ArrowIcon />
          </ButtonLink>
        </Reveal>
      </div>

      <div className="hero-content__aside">
        <Reveal variant="zoom" delay={0.5}>
          {/* Pendant le chargement de Three.js, un espace vide de la même taille garde la place. */}
          <Suspense fallback={<div className="hero-content__molecule-space" />}>
            <GlassMolecule onReady={onMoleculeReady} />
          </Suspense>
        </Reveal>
        <Reveal delay={0.8}>
          <p className="hero-content__lead">
            Les produits des laboratoires partenaires, des prix HT et TTC toujours détaillés et le suivi de chaque
            commande, au même endroit.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
