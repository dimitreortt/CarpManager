export const LoadingList = () => {
	return (
		<div className="container-fluid px-0">
			<div className="d-flex justify-content-center align-items-center p-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Carregando...</span>
				</div>
			</div>
		</div>
	)
}
