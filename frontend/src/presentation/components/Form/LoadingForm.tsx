import { Layout } from '../Layout/Layout'

export const LoadingForm = () => {
	return (
		<Layout>
			<div className="container-fluid py-4">
				<div className="row justify-content-center">
					<div className="col-12">
						<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
							<div className="spinner-border text-primary" role="status">
								<span className="visually-hidden">Carregando...</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
