import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAppContext } from '../../../../main/AppContextProvider'
import { BaseForm } from '../../../components/Form/BaseForm'
import { TextFormField } from '../../../components/Form/FormField/TextFormField'
import { SubmitButton } from '../../../components/Form/SubmitButton'
import { z } from 'zod'
import { PasswordValidator } from '../../../../infra/service/PasswordValidator'
import { BaseAuthPage } from '../BaseAuthPage'

const resetPasswordSchema = z.object({
	password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
	confirmPassword: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export const ResetPassword = () => {
	const { ResetPasswordService, showToast, searchParams } = useAppContext()
	const [error, setError] = useState('')
	const [status, setStatus] = useState<'validating_token' | 'invalid_token' | 'show_form' | 'form_submitted' | 'form_error' | 'success'>(
		'validating_token'
	)

	useEffect(() => {
		async function validateToken() {
			const token = searchParams.get('token')
			if (!token) {
				showToast('Token de recuperação de senha não encontrado', 'error')
			}
			try {
				setStatus('validating_token')
				await ResetPasswordService.validateToken(token!)
				setStatus('show_form')
			} catch (error) {
				setStatus('invalid_token')
			}
		}
		validateToken()
	}, [])

	const handleSubmit = async (data: ResetPasswordFormData) => {
		setError('')
		setStatus('form_submitted')
		try {
			PasswordValidator.checkSamePassword(data.password, data.confirmPassword)
			PasswordValidator.validateOrThrow(data.password)
			await ResetPasswordService.execute(searchParams.get('token')!, data.password)
			showToast('Senha redefinida com sucesso', 'success')
			setStatus('success')
		} catch (error: any) {
			setError(error.message || 'Erro ao redefinir senha')
			setStatus('show_form')
		}
	}

	const getTitle = () => {
		switch (status) {
			case 'validating_token':
			case 'invalid_token':
				return ''
			case 'show_form':
			case 'form_submitted':
				return 'Redefinir senha'
			default:
				return ''
		}
	}
	const getSubtitle = () => {
		switch (status) {
			case 'validating_token':
			case 'invalid_token':
				return ''
			case 'show_form':
			case 'form_submitted':
				return 'Redefinir senha'
			default:
				return ''
		}
	}
	return (
		<BaseAuthPage error={error} title={getTitle()} subtitle={getSubtitle()}>
			{status === 'validating_token' && (
				<div className="text-center">
					<h1 className="heading-3 text-neutral-900 mb-5">Validando token...</h1>
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			)}
			{status === 'invalid_token' && (
				<div className="text-center">
					<h1 className="heading-3 text-neutral-900 mb-5">Token inválido</h1>
					<div className="text-center">
						<Link to="/login" className="btn btn-primary text-decoration-none mt-2 mb-0">
							Voltar para o Login
						</Link>
					</div>
				</div>
			)}
			{(status === 'show_form' || status === 'form_submitted') && (
				<BaseForm schema={resetPasswordSchema} onSubmit={handleSubmit} showSaveButton={false}>
					{form => (
						<>
							<TextFormField form={form} name="password" label="Senha" type="password" placeholder="Digite sua senha" required />

							<TextFormField
								form={form}
								name="confirmPassword"
								label="Confirmar senha"
								type="password"
								placeholder="Confirme sua senha"
								required
							/>

							<SubmitButton form={form} className="w-100 mb-3" disabled={status === 'form_submitted'}>
								{status === 'form_submitted' ? 'Redefinindo senha...' : 'Redefinir senha'}
							</SubmitButton>
						</>
					)}
				</BaseForm>
			)}
			{status === 'success' && (
				<div className="text-center">
					<h1 className="heading-3 text-neutral-900 mb-5">Senha redefinida com sucesso</h1>
					<div className="text-center">
						<Link to="/login" className="btn btn-primary text-decoration-none mt-2 mb-0">
							Voltar para o Login
						</Link>
					</div>
				</div>
			)}
		</BaseAuthPage>
	)
}
