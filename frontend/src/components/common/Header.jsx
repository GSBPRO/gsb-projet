import './Header.css';
import Logo from './Logo.jsx';


function Header() {
    return (
        <header className="header">
        <div className="conteneur header-contenu">
                 <Logo />

        {/* Le menu : l'onglet actif a un trait turquoise en dessous */}
        <nav className="header-menu">
          <a className="header-lien header-lien-actif" href="/catalogue">Catalogue</a>
          <a className="header-lien" href="/commandes">Mes commandes</a>
        </nav>

        {/* La partie de droite : panier et utilisateur */}
        <div className="header-droite">

          {/* Le panier avec la pastille du nombre d'articles */}
          <a className="header-panier" href="/panier">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M2 3h3l2.7 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 7H6" />
            </svg>
            <span className="header-pastille">0</span>
          </a>

          {/* L'utilisateur : rond avec ses initiales, puis son nom et son rôle */}
          <div className="header-utilisateur">
            <span className="header-initiales">LM</span>
            <div>
              <p className="header-nom">Dr Lina Martin</p>
              <p className="header-role">Professionnelle de santé</p>
            </div>
          </div>

        </div>
        </div>
      </header>
    );
  }


export default Header;

        