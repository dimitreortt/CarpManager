import { BaseRepository } from "./BaseRepository"
import { Database } from "../database/Database"

export class IncomingRepository extends BaseRepository<any> {
	constructor(database: Database) {
		super(database, "incoming")
	}

	async getAll(filters: Record<string, any> = {}): Promise<any[]> {
		const options = {
			where: filters || {},
			include: {
				client: true,
				estimate: {
					select: {
						name: true,
						status: true,
					},
				},
			},
		}
		const result = await super.getAll(options)
		return result
	}
}
