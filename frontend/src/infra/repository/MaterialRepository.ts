import { BaseRepository } from './BaseRepository'
import type { HttpClient } from '../http/HttpClient'
import type { Supplier } from './SupplierRepository'

export type Material = {
	id: string
	name: string
	number: number
	description?: string
	price?: number
	stock?: number
	minStock?: number
	supplier?: Supplier
	supplierId?: string
	code?: string
	location?: string
	category?: string
	unit?: string
}

export class MaterialRepository extends BaseRepository<Material> {
	constructor(httpClient: HttpClient<Material>) {
		super('materials', httpClient)
	}
}
