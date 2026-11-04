import FallingPills from './FallingPills.jsx';
import HeroBackground from './HeroBackground.jsx';
import HeroContent from './HeroContent.jsx';
import LightParticles from './LightParticles.jsx';
import './HomeHero.css';

// Bandeau d'accueil : assemble les couches, de l'arrière vers l'avant.
// 1. le paysage animé  2. les particules de lumière  3. les gélules  4. le texte
// isRevealed : passe à true quand l'écran de chargement disparaît ; la classe « is-revealed »
// déclenche alors l'animation d'apparition (voir Reveal.css et HomeHero.css).
export default function HomeHero({ userName, onMoleculeReady, isRevealed }) {
  return (
    <section className={`hero ${isRevealed ? 'is-revealed' : ''}`} aria-labelledby="hero-title">
      <HeroBackground />
      <LightParticles />
      <FallingPills />
      <HeroContent userName={userName} onMoleculeReady={onMoleculeReady} />
    </section>
  );
}
