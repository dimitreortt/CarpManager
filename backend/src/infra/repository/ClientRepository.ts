import { BaseRepository } from "./BaseRepository"
import { Database } from "../database/Database"

export class ClientRepository extends BaseRepository<any> {
	constructor(database: Database) {
		super(database, "client")
	}
}
