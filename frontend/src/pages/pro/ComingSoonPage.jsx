import ButtonLink from '../../components/ui/ButtonLink.jsx';

// Page provisoire pour les liens dont l'écran n'est pas encore codé.
export default function ComingSoonPage({ title }) {
  return (
    <section>
      <h1>{title}</h1>
      <p className="muted">Cet écran arrive bientôt.</p>
      <ButtonLink to="/accueil" variant="secondary">
        Retour à l’accueil
      </ButtonLink>
    </section>
  );
}
