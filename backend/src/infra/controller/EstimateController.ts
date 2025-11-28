import { Router } from "../http/HttpServer"
import { Database } from "../database/Database"
import { EstimateService } from "../../application/EstimateService"
import { AcceptEstimateNotFound } from "../../domain/errors/AcceptEstimateNotFound"
import { BaseRepository } from "../repository/BaseRepository"
import { EstimateRepository } from "../repository/EstimateRepository"
import { getObjectArrayIds } from "../service/getObjectArrayIds"
import { BaseController } from "./BaseController"
import { asyncHandler } from "../http/asyncHandler"
import { objectArraysEqual } from "../service/arraysEqual"
import { config } from "../../main/config"

export class EstimateController extends BaseController<EstimateService> {
	constructor(router: Router, database: Database, service: EstimateService) {
		super(router, database)
		this.model = service
	}

	registerRoutes() {
		this.router.post(
			"/get",
			asyncHandler(async (req, res) => {
				const { status, clientId } = req.body
				const result = await this.model.getAll({ status: status as string, clientId: clientId as string })
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

		this.router.post(
			"/:id/create-order",
			asyncHandler(async (req, res) => {
				const result = await this.model.createOrder(req.params.id, req.body)
				res.json(result)
			})
		)

		this.router.put(
			"/:id/accept",
			asyncHandler(async (req, res) => {
				try {
					const result = await this.model.acceptEstimate(req.params.id)
					res.json(result)
				} catch (error: any) {
					if (error instanceof AcceptEstimateNotFound) {
						return res.status(404).json({ message: error.message })
					}
					throw new Error("Erro ao aceitar o orçamento")
				}
			})
		)

		this.router.put(
			"/:id",
			asyncHandler(async (req, res) => {
				const result = await this.model.update(req.params.id, req.body)
				res.json(result)
			})
		)

		this.router.delete(
			"/delete-many",
			asyncHandler(async (req, res) => {
				const ids = req.body.ids
				const result = await this.model.deleteMany(ids)
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
