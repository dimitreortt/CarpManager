import { Link } from 'react-router'

export const BackButton = ({ navigateBackTo, className }: { navigateBackTo: string; className?: string }) => {
	return (
		<Link to={navigateBackTo || '/'} className={`btn btn-outline-secondary me-3 ${className}`}>
			<i className="bi bi-arrow-left me-2"></i>
			Voltar
		</Link>
	)
}
