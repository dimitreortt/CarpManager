import { BaseService } from "./BaseService"
import { ClientRepository } from "../infra/repository/ClientRepository"
import { Database } from "../infra/database/Database"

export class ClientService extends BaseService<ClientRepository> {
	constructor(database: Database) {
		super(database)
		this.repository = new ClientRepository(database)
	}
}
