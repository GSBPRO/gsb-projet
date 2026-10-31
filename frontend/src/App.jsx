// La barre du haut, le bouton et le champ de saisie réutilisables
import Header from './components/common/Header.jsx';
import Button from './components/ui/Button.jsx';
import Input from './components/ui/Input.jsx';

// Page d'accueil temporaire : elle prouve que le projet démarre.
// Plus tard, App.jsx affichera le routeur (routes/AppRouter.jsx).
function App() {
  return (
    <>
    {/* La barre du haut, sur toute la largeur de la page */}
    <Header />

    <main style={{ padding: 'var(--espace-grand)' }}>
      <h1>GSB - Plateforme e-commerce</h1>
      <p>Le projet démarre correctement.</p>
      <a href="#">Un lien de test</a>

      {/* Test des boutons */}
      <div style={{ display: 'flex', gap: 'var(--espace-moyen)', marginTop: 'var(--espace-moyen)' }}>
        <Button>Ajouter au panier</Button>
        <Button variante="secondaire">Annuler</Button>
        <Button disabled>Indisponible</Button>
      </div>

      {/* Test du champ de saisie */}
      <div style={{ maxWidth: '320px', marginTop: 'var(--espace-grand)' }}>
        <Input label="E-mail" name="email" type="email" placeholder="exemple@gsb.fr" />
      </div>
    </main>
    </>
  );
}

// Rend le composant utilisable par main.jsx
export default App;
