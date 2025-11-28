import type { Repository } from './Repository'
import type { HttpClient } from '../http/HttpClient'

export abstract class BaseRepository<T extends { id: string; name: string; number: number }> implements Repository<T> {
	protected readonly basePath: string
	protected readonly entityName: string
	protected items: T[] | undefined = undefined
	protected itemIdNameMap: Map<string, string> = new Map()
	protected itemIdObjectMap: Map<string, T> = new Map()

	constructor(entityName: string, protected readonly httpClient: HttpClient<T>) {
		this.entityName = entityName
		this.basePath = `/${entityName}`
	}

	async getAll(params?: Record<string, any>): Promise<T[]> {
		const response = await this.httpClient.post(`${this.basePath}/get`, params)
		return response as any
	}

	async getById(id: string): Promise<T | null> {
		const response = await this.httpClient.post(`${this.basePath}/get/${id}`, {})
		return response
	}

	async create(item: T): Promise<string | void> {
		const response = await this.httpClient.post(`${this.basePath}`, item)
		return response.id
	}

	async update(item: Partial<T> & { id: string }): Promise<string | void> {
		await this.httpClient.put(`${this.basePath}/${item.id}`, item)
		return item.id
	}

	async delete(item: T): Promise<void> {
		return undefined
	}

	async deleteMany(items: T[]): Promise<void> {
		await this.httpClient.deleteMany(`${this.basePath}/delete-many`, { ids: items.map(item => item.id) })
	}
}
