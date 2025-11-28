import { Link } from 'react-router'

export const EmptyList = ({
	icon,
	title,
	description,
	entityFormPath,
	entitySingular
}: {
	icon: string
	title: string
	description: string
	entityFormPath: string
	entitySingular: string
}) => {
	return (
		<div id="empty-list" className="card">
			<div className="card-body">
				<div className="text-center py-5">
					<i className={`${icon} text-neutral-400 mb-3`} style={{ fontSize: '4rem' }}></i>
					<h3 className="heading-4 text-neutral-700 mb-2">{title}</h3>
					<p className="body-large text-neutral-600">{description}</p>
					<Link to={`${entityFormPath}`} className="btn btn-primary">
						Adicionar {entitySingular}
					</Link>
				</div>
			</div>
		</div>
	)
}
