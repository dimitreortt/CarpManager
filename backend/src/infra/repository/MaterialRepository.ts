import { BaseRepository } from "./BaseRepository"
import { Database } from "../database/Database"

export class MaterialRepository extends BaseRepository<any> {
	constructor(database: Database) {
		super(database, "material")
	}

	async getAll(filters: Record<string, any> = {}): Promise<any[]> {
		const options = {
			where: filters || {},
			include: {
				supplier: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		}
		return await super.getAll(options)
	}

	async update(id: string, data: any) {
		const { id: otherId, number, supplierId, supplier, ...baseObj } = data
		this.addConnection("supplier", supplierId, baseObj)
		return await super.update(id, baseObj)
	}
}
