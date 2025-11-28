import { useState } from 'react'
import Logo from '../../../components/Logo'
import { useAppContext } from '../../../../main/AppContextProvider'
import type { User } from '../../../../main/useUser'
import { LoadingSpinner } from '../../../components/List/LoadingSpinner'

export const EmailVerification = ({ user }: { user?: User }) => {
	const { location, ValidateEmail, showToast } = useAppContext()
	const [showResendInstructions, setShowResendInstructions] = useState(false)
	const toggleShowResendInstructions = () => setShowResendInstructions(!showResendInstructions)
	const [loading, setLoading] = useState(false)

	const handleResendEmail = async () => {
		try {
			const userFromState = location?.state?.user
			const userToSend = userFromState || user

			if (!userToSend) {
				throw new Error('Usuário não encontrado')
			}

			setLoading(true)
			await ValidateEmail.execute(userToSend)
			setLoading(false)
			showToast('E-mail reenviado com sucesso', 'success')
		} catch (error: any) {
			setLoading(false)
			showToast(error.message || 'Erro ao reenviar e-mail', 'error')
		}
	}

	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center bg-primary-gradient p-3">
			<div className="card shadow-xl border-0" style={{ maxWidth: '500px', width: '100%' }}>
				<div className="card-body p-5">
					<div className="text-center mb-4">
						<div className="d-flex align-items-center justify-content-center mb-4">
							<div
								className="bg-primary-gradient rounded-circle d-flex align-items-center justify-content-center"
								style={{ width: '80px', height: '80px' }}
							>
								<Logo width={40} height={40} color="white" fillColor="transparent" />
							</div>
						</div>

						<h1 className="heading-4 text-neutral-900 mb-2">Bem-vindo ao CarpManager Gestão!</h1>
						<p className="body-medium text-neutral-700 mb-4">Só mais um passo para concluir seu cadastro.</p>
					</div>

					<div className="alert alert-info d-flex align-items-start mb-4" role="alert">
						<i className="bi bi-envelope-check me-3" style={{ fontSize: '1.5rem' }}></i>
						<div>
							<h6 className="mb-2 fw-bold">Verifique seu e-mail</h6>
							<p className="body-small mb-0">
								Enviamos um link de verificação para o seu e-mail. Por favor, clique no link para ativar sua conta e concluir o seu
								cadastro.
							</p>
						</div>
					</div>

					{!showResendInstructions && (
						<div className="text-center">
							<button className="btn btn-link mt-5" onClick={toggleShowResendInstructions}>
								Não recebeu o e-mail?
							</button>
						</div>
					)}
					{showResendInstructions && (
						<div>
							<ul className="body-small border rounded text-neutral-600 mb-0 p-3">
								<div className="ms-3">
									<li>Verifique sua caixa de spam</li>
									<li>Aguarde alguns minutos e recarregue sua caixa de entrada</li>
								</div>
							</ul>

							<div className="text-center">
								<button className="btn btn-link" onClick={handleResendEmail} disabled={loading}>
									Reenviar e-mail
								</button>
								{loading && <LoadingSpinner />}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
