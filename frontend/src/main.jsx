// StrictMode aide à repérer les erreurs pendant le développement
import { StrictMode } from 'react';
// createRoot branche React sur la balise <div id="root"> de index.html
import { createRoot } from 'react-dom/client';

// Le style de base du site (il charge aussi variable.css)
import './styles/global.css';
// Les règles pour adapter le site aux tablettes et aux téléphones
// (importé APRÈS global.css pour que ces règles l'emportent sur les mobiles)
import './styles/responsive.css';

// Le composant principal du site
import App from './App.jsx';

// Démarre le site : React dessine <App /> dans la page
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
