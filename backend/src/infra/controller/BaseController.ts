import { BaseService } from "../../application/BaseService"
import { Database } from "../database/Database"
import { Router } from "../http/HttpServer"

export class BaseController<S extends BaseService = BaseService> {
	protected model: S
	protected database: Database
	protected router: Router

	constructor(router: Router, database: Database) {
		this.model = new BaseService(database) as S
		this.database = database
		this.router = router
		this.registerRoutes()
	}

	registerRoutes() {
		// implement in child classes
	}
}
