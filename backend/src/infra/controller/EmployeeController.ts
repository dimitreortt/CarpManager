import { Router } from "../http/HttpServer"
import { Database } from "../database/Database"
import { EmployeeService } from "../../application/EmployeeService"
import { BaseController } from "./BaseController"
import { asyncHandler } from "../http/asyncHandler"

export class EmployeeController extends BaseController<EmployeeService> {
	constructor(router: Router, database: Database, service: EmployeeService) {
		super(router, database)
		this.model = service
	}

	registerRoutes() {
		this.router.post(
			"/get",
			asyncHandler(async (req, res) => {
				const result = await this.model.getAll()
				res.json(result)
			})
		)

		this.router.post(
			"/get/:id",
			asyncHandler(async (req, res) => {
				const result = await this.model.getById(req.params.id)
				res.json(result)
			})
		)

		this.router.post(
			"/",
			asyncHandler(async (req, res) => {
				const result = await this.model.create(req.body)
				res.json(result)
			})
		)

		this.router.put(
			"/:id",
			asyncHandler(async (req, res) => {
				const { ...rest } = req.body
				const result = await this.model.update(req.params.id, req.body)
				res.json(result)
			})
		)

		this.router.delete(
			"/delete-many",
			asyncHandler(async (req, res) => {
				const result = await this.model.deleteMany(req.body.ids)
				res.json(result)
			})
		)

		this.router.delete(
			"/:id",
			asyncHandler(async (req, res) => {
				const result = await this.model.delete(req.params.id)
				res.json(result)
			})
		)
	}
}
