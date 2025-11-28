import type { HttpClient } from '../infra/http/HttpClient'
import { PasswordValidator } from '../infra/service/PasswordValidator'
import { type NavigateFunction } from 'react-router'
import { getEnv } from '../infra/service/getEnv'

export type SignUpData = {
	name: string
	email: string
	password: string
	confirmPassword: string
}

export class SignUpUser {
	constructor(readonly httpClient: HttpClient<any>, readonly navigate: NavigateFunction) {}

	async execute(data: SignUpData): Promise<any> {
		if (data.password !== data.confirmPassword) {
			throw new Error('As senhas devem ser iguais')
		}

		PasswordValidator.validateOrThrow(data.password)

		const env = getEnv()

		const requestData = { ...data, env, companyId: env === 'production' ? 'fabic_marcenaria' : 'fabic_marcenaria_dev' }
		const response = await this.httpClient.post('/auth/validate-email', requestData)
		if (response.status === 'success') {
			this.navigate('/email-verification', { state: { user: requestData } })
		} else {
			throw new Error(response.message)
		}
	}
}
