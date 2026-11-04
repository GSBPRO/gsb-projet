import Reveal from '../../components/ui/Reveal.jsx';
import './CatalogueBanner.css';

// Bandeau pleine largeur en haut du catalogue : une vidéo en fond, le texte par-dessus.
// videoSrc : chemin de la vidéo (ex. '/videos/catalogue.mp4'). Tant qu'il n'y en a pas,
// on affiche un cadre de la même taille, aux couleurs du site : la mise en page ne bouge pas quand la vidéo arrive.
export default function CatalogueBanner({ videoSrc = null }) {
  return (
    // « is-revealed » tout de suite : les éléments <Reveal> apparaissent dès l'arrivée sur la page.
    <section className="catalogue-banner is-revealed" aria-labelledby="catalogue-title">
      <div className="catalogue-banner__media" aria-hidden="true">
        {videoSrc && (
          // muted + playsInline : obligatoires pour que la lecture automatique soit acceptée par les navigateurs.
          <video className="catalogue-banner__video" src={videoSrc} autoPlay muted loop playsInline />
        )}
      </div>

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
