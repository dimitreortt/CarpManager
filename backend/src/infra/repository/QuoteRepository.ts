import { BaseRepository } from "./BaseRepository"
import { Database } from "../database/Database"

export class QuoteRepository extends BaseRepository<any> {
	constructor(database: Database) {
		super(database, "quote")
	}

	async getAll(filters: Record<string, any> = {}): Promise<any[]> {
		const options = {
			where: filters || {},
			include: {
				supplier: true,
				estimate: true,
			},
		}
		return await super.getAll(options)
	}
}
