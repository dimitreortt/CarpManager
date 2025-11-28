import { useState } from 'react'
import { z } from 'zod'
import { Link } from 'react-router'
import Logo from '../../../components/Logo'
import { useAppContext } from '../../../../main/AppContextProvider'
import { BaseForm } from '../../../components/Form/BaseForm'
import { TextFormField } from '../../../components/Form/FormField/TextFormField'
import { SubmitButton } from '../../../components/Form/SubmitButton'
import type { UseFormReturn } from 'react-hook-form'
import { PasswordValidator } from '../../../../infra/service/PasswordValidator'

const signUpSchema = z
	.object({
		email: z.email('E-mail inválido').min(1, 'E-mail é obrigatório'),
		password: z
			.string()
			.min(1, 'Senha é obrigatória')
			.refine(val => PasswordValidator.validate(val).isValid, {
				message:
					'A senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número, 1 caractere especial e 8 caracteres no total'
			}),
		confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
		name: z.string().min(1, 'Nome é obrigatório')
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'As senhas não coincidem',
		path: ['confirmPassword']
	})

type SignUpFormData = z.infer<typeof signUpSchema>

export const SignUp = () => {
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const { SignUpUser } = useAppContext()

	const handleSubmit = async (data: SignUpFormData) => {
		setError('')
		setLoading(true)

		try {
			await SignUpUser.execute(data)
		} catch (error: any) {
			setError(error.message || 'Ocorreu um erro durante o cadastro')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center bg-primary-gradient p-3">
			<div className="card shadow-xl border-0" style={{ maxWidth: '420px', width: '100%' }}>
				<div className="card-body p-5">
					<div className="text-center mb-5">
						<div className="mb-4">
							<h1 className="heading-3 text-neutral-900 mb-2">Criar conta</h1>
							<p className="body-medium text-neutral-600">Preencha os dados para se cadastrar</p>
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
							<i className="bi bi-exclamation-triangle me-2"></i>
							<span className="body-small">{error}</span>
						</div>
					)}

					<BaseForm schema={signUpSchema} onSubmit={handleSubmit} showSaveButton={false}>
						{form => (
							<>
								<TextFormField form={form} name="name" label="Nome" type="text" placeholder="Digite seu nome" required />

								<TextFormField form={form} name="email" label="E-mail" type="email" placeholder="Digite seu e-mail" required />

								<TextFormField form={form} name="password" label="Senha" type="password" placeholder="Digite sua senha" required />

								<TextFormField
									form={form}
									name="confirmPassword"
									label="Confirmar Senha"
									type="password"
									placeholder="Confirme sua senha"
									required
								/>

								<SubmitButton form={form} className="w-100" disabled={loading}>
									{loading ? 'Criando conta...' : 'Criar conta'}
								</SubmitButton>

								<div className="text-center mt-4">
									<p className="body-small text-neutral-600 mb-0">
										Já tem uma conta?{' '}
										<Link to="/login" className="text-primary text-decoration-none">
											Entrar
										</Link>
									</p>
								</div>
							</>
						)}
					</BaseForm>
				</div>
			</div>
		</div>
	)
}
