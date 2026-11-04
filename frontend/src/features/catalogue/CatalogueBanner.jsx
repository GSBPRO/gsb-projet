import Reveal from '../../components/ui/Reveal.jsx';
import './CatalogueBanner.css';

// Bandeau en haut du catalogue, dans le style glacé de l'accueil.
export default function CatalogueBanner() {
  return (
    // « is-revealed » tout de suite : les éléments <Reveal> apparaissent dès l'arrivée sur la page.
    <section className="catalogue-banner is-revealed" aria-labelledby="catalogue-title">
      <span className="catalogue-banner__capsule" aria-hidden="true" />
      <div className="catalogue-banner__content">
        <Reveal delay={0.05}>
          <p className="catalogue-banner__eyebrow">Le catalogue des laboratoires partenaires</p>
        </Reveal>
        <h1 id="catalogue-title" className="catalogue-banner__title">
          <Reveal as="span" variant="line" delay={0.12}>
            Les essentiels du soin.
          </Reveal>
          <Reveal as="span" variant="line" delay={0.22}>
            Un seul espace professionnel.
          </Reveal>
        </h1>
        <Reveal delay={0.35}>
          <p className="catalogue-banner__lead">
            Produits validés par GSB · Prix HT et TTC détaillés · Accès réservé aux professionnels
          </p>
        </Reveal>
      </div>
    </section>
  );
}
