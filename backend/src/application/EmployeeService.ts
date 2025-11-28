import { BaseService } from "./BaseService"
import { EmployeeRepository } from "../infra/repository/EmployeeRepository"
import { Database } from "../infra/database/Database"

export class EmployeeService extends BaseService<EmployeeRepository> {
	constructor(database: Database) {
		super(database)
		this.repository = new EmployeeRepository(database)
	}
}
