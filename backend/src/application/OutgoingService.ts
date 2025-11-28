import { Database } from "../infra/database/Database"
import { OutgoingRepository } from "../infra/repository/OutgoingRepository"
import { BaseService } from "./BaseService"

export class OutgoingService extends BaseService<OutgoingRepository> {
	constructor(database: Database) {
		super(database)
		this.repository = new OutgoingRepository(database)
	}

	async save(data: any) {
		const { id, supplier, supplierId, employee, employeeId, date, ...baseObj } = data
		this.repository.addConnection("supplier", supplierId, baseObj)
		this.repository.addConnection("employee", employeeId, baseObj)
		baseObj.date = date ? new Date(date).toISOString() : undefined

		if (id) {
			return await this.update(id, baseObj)
		}
		return await this.create(baseObj)
	}

	async getAccountTypes(searchTerm: string) {
		return await this.repository.getAccountTypes(searchTerm)
	}
}
