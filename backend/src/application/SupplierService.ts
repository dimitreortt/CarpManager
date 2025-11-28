import { SupplierRepository } from "../infra/repository/SupplierRepository"
import { Database } from "../infra/database/Database"
import { BaseService } from "./BaseService"

export class SupplierService extends BaseService<SupplierRepository> {
	constructor(database: Database) {
		super(database)
		this.repository = new SupplierRepository(database)
	}
}
