import type { NavigateFunction } from 'react-router'
import type { HttpClient } from '../infra/http/HttpClient'

export class SignOutUser {
	constructor(private readonly httpClient: HttpClient<any>, readonly resetUser: () => void, readonly navigate: NavigateFunction) {}

	async execute() {
		await this.httpClient.post('/auth/session-logout', {})
		this.navigate('/login')
		this.resetUser()
	}
}
