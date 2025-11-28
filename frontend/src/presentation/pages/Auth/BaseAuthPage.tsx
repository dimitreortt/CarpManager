import React from 'react'
import Logo from '../../components/Logo'

interface BaseAuthPageProps {
	children: React.ReactNode
	error: string
	title: string
	subtitle: string
}

export const BaseAuthPage: React.FC<BaseAuthPageProps> = ({ children, error, title, subtitle }) => {
	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center bg-primary-gradient p-3">
			<div className="card shadow-xl border-0" style={{ maxWidth: '420px', width: '100%' }}>
				<div className="card-body p-5">
					<div className="text-center mb-5">
						<div className="mb-4">
							<h1 className="heading-3 text-neutral-900 mb-2" data-testid="page-title">
								{title}
							</h1>
							<p className="body-medium text-neutral-600" data-testid="page-subtitle">
								{subtitle}
							</p>
						</div>

						<div className="d-flex align-items-center justify-content-center mb-4">
							<div
								className="bg-primary-gradient rounded-circle d-flex align-items-center justify-content-center"
								style={{ width: '60px', height: '60px' }}
							>
								<Logo width={32} height={32} color="white" fillColor="transparent" />
							</div>
						</div>
					</div>

					{error && (
						<div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
							<i className="bi bi-info-circle text-danger me-2" style={{ fontSize: '1rem' }}></i>
							<span className="body-small">{error}</span>
						</div>
					)}

					{children}
				</div>
			</div>
		</div>
	)
}
