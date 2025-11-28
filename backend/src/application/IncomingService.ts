import { BaseService } from "./BaseService"
import { IncomingRepository } from "../infra/repository/IncomingRepository"
import { Database } from "../infra/database/Database"

export class IncomingService extends BaseService<IncomingRepository> {
	constructor(database: Database) {
		super(database)
		this.repository = new IncomingRepository(database)
	}

	async create(data: any) {
		const { shouldCreateInstallments, clientId, estimateId, ...baseObj } = data
		this.repository.addConnection("client", clientId, baseObj)
		this.repository.addConnection("estimate", estimateId, baseObj)
		return await this.repository.create(baseObj)
	}

	async update(id: string, data: any) {
		const { shouldCreateInstallments, client, clientId, estimateId, estimate, ...baseObj } = data
		this.repository.addConnection("client", clientId, baseObj)
		this.repository.addConnection("estimate", estimateId, baseObj)
		return await this.repository.update(id, baseObj)
	}
}
