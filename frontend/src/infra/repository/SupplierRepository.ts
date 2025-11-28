import { BaseRepository } from './BaseRepository'
import type { HttpClient } from '../http/HttpClient'

export type Supplier = {
	id: string
	name: string
	number: number
	code: string
	email: string
	phone: string
	address?: string
	city: string
	state: string
	cnpj?: string
	contactPerson?: string
	notes?: string
	status: 'active' | 'inactive'
	createdAt: string
}

export class SupplierRepository extends BaseRepository<Supplier> {
	constructor(httpClient: HttpClient<Supplier>) {
		super('suppliers', httpClient)
	}
}
