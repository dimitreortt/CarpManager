import { BaseService } from "./BaseService"
import { MaterialRepository } from "../infra/repository/MaterialRepository"
import { Database } from "../infra/database/Database"

export class MaterialService extends BaseService<MaterialRepository> {
	constructor(database: Database) {
		super(database)
		this.repository = new MaterialRepository(database)
	}

	async getById(id: string) {
		return this.repository.getById(id, { include: { supplier: true } })
	}
}
