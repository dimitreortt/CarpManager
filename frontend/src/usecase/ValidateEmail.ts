import type { HttpClient } from '../infra/http/HttpClient'

export class ValidateEmail {
	constructor(readonly httpClient: HttpClient<any>) {}

	async execute(user: any) {
		await this.httpClient.post('/auth/validate-email', user)
	}
}
