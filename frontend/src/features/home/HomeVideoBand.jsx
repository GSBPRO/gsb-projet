import './HomeVideoBand.css';

// Bandeau vidéo tout en haut de l'accueil, comme sur le catalogue : il passe derrière l'en-tête.
// muted + playsInline : obligatoires pour que la lecture automatique soit acceptée par les navigateurs.
export default function HomeVideoBand() {
  return (
    <div className="home-video" aria-hidden="true">
      <video className="home-video__video" src="/videos/catalogue.mp4" autoPlay muted loop playsInline />
    </div>
  );
}
