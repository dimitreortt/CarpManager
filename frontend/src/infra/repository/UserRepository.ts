import type { HttpClient } from '../http/HttpClient'

export class UserRepository {
	constructor(private readonly httpClient: HttpClient<any>) {}

	verifyToken = async (token: string): Promise<any> => {
		const data = await this.httpClient.get(`/auth/verify-token/${token}`)
		return data
	}
}
