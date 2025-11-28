import { BaseRepository } from './BaseRepository'
import type { HttpClient } from '../http/HttpClient'

export type Client = {
	id: string
	name: string
	number: number
	contactPerson: string
	code: string
	email: string
	phone: string
	city: string
	status: 'active' | 'inactive'
	createdAt: string
	address?: string
	deliveryAddress?: string
	notes?: string
}

export class ClientRepository extends BaseRepository<Client> {
	constructor(httpClient: HttpClient<Client>) {
		super('clients', httpClient)
	}

	async createTrol(trol: Client): Promise<any> {
		return await this.httpClient.post('/clients/trol', trol)
	}

	async updateTrol(trol: Client): Promise<any> {
		return await this.httpClient.put('/clients/trol', trol)
	}

	async deleteTrol(trol: Client): Promise<any> {
		return await this.httpClient.delete('/clients/trol')
	}
}
