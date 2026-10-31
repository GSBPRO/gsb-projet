import './Logo.css';

 function Logo() {
    return (
        <a className='logo'  href="/">
            <span className='logo-carre'>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"
  strokeLinecap="round">
                        <line x1="12" y1="4" x2="12" y2="20" />
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>
        </span>
                        <span>
          <span className="logo-nom">GSB</span>
          <span className="logo-sous-titre">ESPACE PROFESSIONNEL</span>
        </span>
      </a>
    );
  }


export default Logo;