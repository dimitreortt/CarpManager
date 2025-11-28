import { Layout } from '../Layout/Layout'

export const BaseListPage = ({
	title,
	subtitle,
	description,
	children
}: {
	title: string
	subtitle?: string
	description: string
	children: React.ReactNode
}) => {
	return (
		<Layout>
			<div className="container-fluid py-4">
				<div className="row mb-3">
					<div className="col">
						<h2 className="mb-0">{title}</h2>
						{subtitle && <h6 className="text-muted mb-0">{subtitle}</h6>}
					</div>
				</div>

				{children}
			</div>
		</Layout>
	)
}
