import { BaseRepository } from "./BaseRepository"
import { Database } from "../database/Database"

export class OutgoingRepository extends BaseRepository<any> {
	constructor(database: Database) {
		super(database, "outgoing")
	}

	async getAll(filters: Object = {}): Promise<any[]> {
		const options = {
			where: filters || {},
			include: {
				supplier: {
					select: {
						name: true,
					},
				},
				employee: {
					select: {
						name: true,
					},
				},
			},
		}
		return await super.getAll(options)
	}

	async getAccountTypes(searchTerm: string) {
		const results = await super.getAll({
			where: {
				accountType: {
					contains: searchTerm,
				},
			},
			select: {
				accountType: true,
			},
			distinct: ["accountType"],
		})
		return results.map((result: any) => result.accountType)
	}
}
