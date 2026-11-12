import { Link } from 'react-router-dom'
import { ActionButton } from '@/components/action-button'

export default function NotFoundPage() {
  return (
    <div className="grid justify-items-start gap-4">
      <h1 className="text-4xl font-semibold tracking-tight">404</h1>
      <p className="text-muted-foreground">Cette page n’existe pas.</p>
      <ActionButton render={<Link to="/" />} fullWidth="mobile">
        Retour à l’accueil
      </ActionButton>
    </div>
  )
}
