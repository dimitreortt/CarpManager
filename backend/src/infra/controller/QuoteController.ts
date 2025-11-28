import { Router } from "../http/HttpServer"
import { Database } from "../database/Database"
import { BaseController } from "./BaseController"
import { QuoteService } from "../../application/QuoteService"
import { asyncHandler } from "../http/asyncHandler"

export class QuoteController extends BaseController<QuoteService> {
	constructor(router: Router, database: Database, service: QuoteService) {
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
				const result = await this.model.save(req.body)
				res.json(result)
			})
		)

		this.router.put(
			"/:id",
			asyncHandler(async (req, res) => {
				const result = await this.model.save({ ...req.body, id: req.params.id })
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
