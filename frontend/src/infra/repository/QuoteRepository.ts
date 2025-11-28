import { BaseRepository } from './BaseRepository'
import type { HttpClient } from '../http/HttpClient'
import type { Supplier } from './SupplierRepository'
import type { Estimate } from './EstimateRepository'

export interface Quote {
	id: string
	name: string
	number: number
	amount: number
	description?: string
	date: string
	supplierId: string
	supplier?: Supplier
	estimateId: string
	estimate?: Estimate
	createdAt: string
	updatedAt?: string
}

export class QuoteRepository extends BaseRepository<Quote> {
	constructor(httpClient: HttpClient<Quote>) {
		super('quotes', httpClient)
	}
}
