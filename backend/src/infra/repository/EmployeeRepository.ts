import { BaseRepository } from "./BaseRepository"
import { Database } from "../database/Database"

export class EmployeeRepository extends BaseRepository<any> {
	constructor(database: Database) {
		super(database, "employee")
	}
}
