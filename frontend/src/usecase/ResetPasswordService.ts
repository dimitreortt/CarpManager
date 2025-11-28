import type { HttpClient } from '../infra/http/HttpClient'

export class ResetPasswordService {
	constructor(readonly httpClient: HttpClient<any>) {}

	async sendPasswordResetEmail(email: string): Promise<void> {
		try {
			await this.httpClient.post('/auth/send-password-reset-email', { email })
		} catch (error: any) {
			switch (error.message) {
				case 'Email ou senha inválidos':
					throw new Error('E-mail não encontrado')
				default:
					throw new Error('Erro ao enviar e-mail de recuperação')
			}
		}
	}

	async validateToken(token: string): Promise<void> {
		try {
			await this.httpClient.get(`/auth/verify-password-reset-token/${token}`)
		} catch (error: any) {
			throw new Error('Erro ao validar token de recuperação')
		}
	}

	async execute(token: string, password: string): Promise<void> {
		try {
			await this.httpClient.post('/auth/reset-password', { token, password })
		} catch (error: any) {
			throw new Error('Erro ao redefinir senha')
		}
	}
}
