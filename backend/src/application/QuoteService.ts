import { Database } from "../infra/database/Database"
import { QuoteRepository } from "../infra/repository/QuoteRepository"
import { BaseService } from "./BaseService"

export class QuoteService extends BaseService<QuoteRepository> {
	constructor(database: Database) {
		super(database)
		this.repository = new QuoteRepository(database)
	}

	async save(data: any) {
		const { supplierId, supplier, estimateId, estimate, ...baseObj } = data
		this.repository.addConnection("supplier", supplierId, baseObj)
		this.repository.addConnection("estimate", estimateId, baseObj)
		return await this.repository.save(baseObj)
	}
}
