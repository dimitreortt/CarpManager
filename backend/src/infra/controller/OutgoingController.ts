import { Router } from "../http/HttpServer"
import { Database } from "../database/Database"
import { asyncHandler } from "../http/asyncHandler"
import { OutgoingService } from "../../application/OutgoingService"
import { BaseController } from "./BaseController"

export class OutgoingController extends BaseController<OutgoingService> {
	constructor(router: Router, database: Database, service: OutgoingService) {
		super(router, database)
		this.model = service
	}

	registerRoutes() {
		this.router.post(
			"/get",
			asyncHandler(async (req, res) => {
				const { status } = req.body
				const result = await this.model.getAll({ status })
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

		this.router.post(
			"/get-account-types",
			asyncHandler(async (req, res) => {
				const searchTerm = req.body.searchTerm as string
				const result = await this.model.getAccountTypes(searchTerm)
				res.json(result)
			})
		)
	}
}
