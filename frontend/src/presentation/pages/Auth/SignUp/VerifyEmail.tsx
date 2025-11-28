import { LoadingForm } from '../../../components/Form/LoadingForm'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../../../main/AppContextProvider'
import Logo from '../../../components/Logo'
import { LoadingList } from '../../../components/List/LoadingList'
import { LoadingSpinner } from '../../../components/List/LoadingSpinner'

export const VerifyEmail = () => {
	const { searchParams, userRepository, AuthenticateUser, setUser } = useAppContext()
	const emailToken = searchParams.get('emailToken')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				const response = await userRepository.verifyToken(emailToken as string)

				if (!response) {
					throw new Error('E-mail já cadastrado')
				}

				const user = await AuthenticateUser.execute(response.email, response.password)
				setLoading(false)

				setTimeout(async () => {
					setUser(user)
				}, 5000)
			} catch (error: any) {
				setError(error.message || 'Erro ao verificar e-mail')
				setLoading(false)
			}
		}

		verifyEmail()
	}, [])

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

						{error && (
							<div className="alert alert-danger d-flex align-items-center" role="alert">
								<i className="bi bi-exclamation-triangle me-2"></i>
								<span className="body-small">{error}</span>
							</div>
						)}

						{!error && loading && (
							<div className="">
								<LoadingSpinner />
								<p className="body-medium text-neutral-700 mt-3">Verificando e-mail...</p>
							</div>
						)}

						{!error && !loading && (
							<>
								<h1 className="heading-4 text-neutral-900 mb-3">E-mail verificado com sucesso!</h1>
								<p className="body-medium text-neutral-700 mb-4">Você será redirecionado para a página inicial em breve.</p>
								<LoadingSpinner />
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
