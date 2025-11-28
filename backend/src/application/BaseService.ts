import { Database } from "../infra/database/Database"
import { BaseRepository } from "../infra/repository/BaseRepository"

export class BaseService<R extends BaseRepository = BaseRepository> {
	protected repository: R

	constructor(protected readonly database: Database) {
		this.repository = new BaseRepository(database) as R
	}

	async getAll(filters: any = {}): Promise<any[]> {
		return await this.repository.getAll(filters)
	}

	async getById(id: string): Promise<any | null> {
		return await this.repository.getById(id)
	}

	async create(data: any): Promise<any> {
		return await this.repository.create(data)
	}

	async update(id: string, data: any): Promise<any> {
		return await this.repository.update(id, data)
	}

	async delete(id: string): Promise<any> {
		return await this.repository.delete(id)
	}

	async deleteMany(ids: string[]): Promise<any> {
		return await this.repository.deleteMany(ids)
	}
}
