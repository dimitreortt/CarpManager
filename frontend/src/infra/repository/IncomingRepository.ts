import { BaseRepository } from './BaseRepository'
import type { HttpClient } from '../http/HttpClient'
import type { Client } from './ClientRepository'
import type { Estimate } from './EstimateRepository'

export type Incoming = {
	id: string
	name: string
	number: number
	amount: number
	date: string
	paymentMethod: string
	installmentNumber: number
	numberOfInstallments: number
	status: 'pending' | 'received' | 'cancelled'
	notes?: string
	createdAt: string
	client?: Client
	clientId?: string
	estimate?: Estimate
	estimateId?: string
}

export class IncomingRepository extends BaseRepository<Incoming> {
	constructor(httpClient: HttpClient<Incoming>) {
		super('incomings', httpClient)
	}
}
