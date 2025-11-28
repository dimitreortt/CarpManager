import type { HttpClient } from '../infra/http/HttpClient'
import { setCsrfToken } from '../main/apiContextAtom'

export class AuthenticateUser {
	constructor(readonly httpClient: HttpClient<any>) {}

	async execute(email: string, password: string): Promise<any> {
		try {
			const userData = await this.httpClient.post('/auth/session-login', { email, password })
			const { csrfToken }: any = await this.httpClient.get('/auth/csrf-token')
			setCsrfToken(csrfToken || '')
			return userData
		} catch (error: any) {
			switch (error.message) {
				case 'Muitas tentativas de login. Tente novamente mais tarde.':
				case 'Email ou senha inválidos':
				case 'Email não verificado. Por favor, verifique seu email antes de fazer login.':
					throw error
				default:
					throw new Error('Não foi possível realizar o login')
			}
		}
	}
}
