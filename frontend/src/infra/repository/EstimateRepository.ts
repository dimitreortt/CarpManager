import { BaseRepository } from './BaseRepository'
import type { HttpClient } from '../http/HttpClient'
import type { Client } from './ClientRepository'
import type { CreateOrderData } from '../../presentation/pages/Estimates/CreateOrder'

export type Estimate = {
	id: string
	client?: Client
	clientId?: string
	number: number
	name: string
	description?: string
	totalValue: number
	laborCost: number
	status: 'pending' | 'accepted'
	createdAt: string
	dueDate: string
	notes?: string
	materials?: { id: string; value: number }[]
	estimateMaterials?: { name: string; price: number; materialId: string; estimateMaterialId: string }[]
	tripServiceCosts?: { id: string; cost: number; name: string }[]
	incomings?: { id: string; amount: number; status: 'received' | 'pending'; name: string; date: string }[]
}

export class EstimateRepository extends BaseRepository<Estimate> {
	constructor(httpClient: HttpClient<Estimate>) {
		super('estimates', httpClient)
	}

	acceptEstimate = async (estimateId: string) => {
		return await this.httpClient.put(`${this.basePath}/${estimateId}/accept`)
	}

	createOrder = async (estimate: Estimate, data: CreateOrderData) => {
		return await this.httpClient.post(`${this.basePath}/${estimate.id}/create-order`, data)
	}
}
