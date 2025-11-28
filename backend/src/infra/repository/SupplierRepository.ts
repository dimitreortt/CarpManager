import { BaseRepository } from "./BaseRepository"
import { Database } from "../database/Database"

export class SupplierRepository extends BaseRepository<any> {
	constructor(database: Database) {
		super(database, "supplier")
	}
}
