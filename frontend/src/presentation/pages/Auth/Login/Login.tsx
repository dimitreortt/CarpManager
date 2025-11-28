import { BaseAuthPage } from '../BaseAuthPage'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useHandleBrowserAutofill } from './useHandleBrowserAutofill'
import { useAppContext } from '../../../../main/AppContextProvider'
import { useState } from 'react'
import { TextFormField } from '../../../components/Form/FormField/TextFormField'
import { SubmitButton } from '../../../components/Form/SubmitButton'

export type LoginFormData = z.infer<typeof loginSchema>

const loginSchema = z.object({
	email: z.string().optional(),
	password: z.string().optional()
})

export const Login = () => {
	const [error, setError] = useState('')
	const { AuthenticateUser, navigate, setUser } = useAppContext()

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	useHandleBrowserAutofill(form)

	const handleForgotPassword = () => {
		navigate('/forgot-password')
	}

	const handleSubmit = async (data: LoginFormData) => {
		setError('')

		try {
			const user = await AuthenticateUser.execute(data.email || '', data.password || '')
			setUser(user)
		} catch (error: any) {
			setError(error.message || 'Erro ao realizar o login')
		}
	}

	return (
		<BaseAuthPage error={error} title="Bem-vindo de volta" subtitle="Entre na sua conta para continuar">
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<TextFormField form={form} name="email" label="E-mail" type="email" placeholder="Digite seu e-mail" required />

				<TextFormField form={form} name="password" label="Senha" type="password" placeholder="Digite sua senha" required />

				<SubmitButton form={form} className="w-100">
					Entrar
				</SubmitButton>
			</form>
			<div className="text-center">
				<button className="btn btn-link" onClick={handleForgotPassword}>
					Esqueceu sua senha?
				</button>
			</div>
		</BaseAuthPage>
	)
}
