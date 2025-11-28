import { useState } from 'react'
import { z } from 'zod'
import { Link } from 'react-router'
import { useAppContext } from '../../../../main/AppContextProvider'
import { BaseForm } from '../../../components/Form/BaseForm'
import { TextFormField } from '../../../components/Form/FormField/TextFormField'
import { SubmitButton } from '../../../components/Form/SubmitButton'
import { BaseAuthPage } from '../BaseAuthPage'

const forgotPasswordSchema = z.object({
	email: z.email('E-mail inválido').min(1, 'E-mail é obrigatório')
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const ForgotPassword = () => {
	const [error, setError] = useState('')
	const [success, setSuccess] = useState(false)
	const [loading, setLoading] = useState(false)
	const { ResetPasswordService } = useAppContext()

	const handleSubmit = async (data: ForgotPasswordFormData) => {
		setError('')
		setLoading(true)

		try {
			await ResetPasswordService.sendPasswordResetEmail(data.email)
			setSuccess(true)
		} catch (error: any) {
			setError(error.message || 'Ocorreu um erro ao enviar o e-mail de recuperação')
		} finally {
			setLoading(false)
		}
	}

	const title = success ? 'E-mail enviado!' : 'Recuperar senha'
	const subtitle = success
		? 'Enviamos um link de recuperação para o seu e-mail. Clique no link para redefinir sua senha.'
		: 'Digite seu e-mail para receber um link de recuperação de senha'

	return (
		<BaseAuthPage error={error} title={title} subtitle={subtitle}>
			{success ? (
				<div className="alert alert-info d-flex align-items-center  mb-4" role="alert">
					<i className="bi bi-info-circle me-3" style={{ fontSize: '1.5rem' }}></i>
					<div>
						<p className="body-small mb-0">Não recebeu o e-mail? Verifique sua caixa de spam ou aguarde alguns minutos.</p>
					</div>
				</div>
			) : (
				<BaseForm schema={forgotPasswordSchema} onSubmit={handleSubmit} showSaveButton={false}>
					{form => (
						<>
							<TextFormField form={form} name="email" label="E-mail" type="email" placeholder="Digite seu e-mail" required />

							<SubmitButton form={form} className="w-100 mb-3" disabled={loading}>
								{loading ? 'Enviando...' : 'Enviar link de recuperação'}
							</SubmitButton>

							<div className="text-center">
								<Link to="/login" className="btn btn-link text-decoration-none">
									Voltar para o Login
								</Link>
							</div>
						</>
					)}
				</BaseForm>
			)}
		</BaseAuthPage>
	)
}
