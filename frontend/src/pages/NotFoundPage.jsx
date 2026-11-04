import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main>
      <h1>Page introuvable</h1>
      <p><Link to="/">Retour à l'accueil</Link></p>
    </main>
  )
}
