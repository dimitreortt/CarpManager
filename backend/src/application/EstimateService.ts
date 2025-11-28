import { Database } from "../infra/database/Database"
import { AcceptEstimateNotFound } from "../domain/errors/AcceptEstimateNotFound"
import { CreateOrderData } from "./dto/CreateOrderData"
import { BaseService } from "./BaseService"
import { EstimateRepository } from "../infra/repository/EstimateRepository"
import { getObjectArrayIds } from "../infra/service/getObjectArrayIds"
import { objectArraysEqual } from "../infra/service/arraysEqual"
import { IncomingRepository } from "../infra/repository/IncomingRepository"

export class EstimateService extends BaseService<EstimateRepository> {
	private incomingRepository: IncomingRepository

	constructor(database: Database) {
		super(database)
		this.repository = new EstimateRepository(database)
		this.incomingRepository = new IncomingRepository(database)
	}

	async create(data: any) {
		const { client, clientId, dueDate, trips, materials, estimateMaterials, tripServiceCosts, ...baseObj } = data
		this.repository.addConnection("client", clientId, baseObj)
		this.repository.addConnections("tripServiceCosts", getObjectArrayIds(tripServiceCosts), baseObj)
		this.repository.addCreateEstimateMaterials(materials, baseObj)
		const result = await this.repository.create(baseObj)
		return result
	}

	async update(id: string, data: any) {
		const { client, clientId, dueDate, materials, estimateMaterials, trips, incomings, tripServiceCosts, ...baseObj } = data
		this.repository.addConnection("client", clientId, baseObj)
		this.repository.setConnections("tripServiceCosts", getObjectArrayIds(tripServiceCosts), baseObj, true)

		this.repository.includeQuery("estimateMaterials", "materialId")
		const result = await this.repository.update(id, baseObj)

		const currentMaterialIds = result.estimateMaterials.map((mat: any) => mat.materialId)
		const newConnections = materials.map((mat: any) => ({
			id: mat.id,
			update: {
				price: mat.value,
			},
		}))
		const removeDisconnected = true

		await this.repository.updateNtoNConnections("estimateMaterial", "estimate", "material", result.id, currentMaterialIds, newConnections, removeDisconnected)

		return result
	}

	async acceptEstimate(id: string) {
		try {
			const result = await this.database.update("estimate", { id }, { status: "accepted" })
			return result
		} catch (error: any) {
			switch (error.code) {
				case "P2025":
					throw new AcceptEstimateNotFound()
				default:
					throw error
			}
		}
	}

	async createOrder(id: string, body: CreateOrderData) {
		try {
			await this.database.update(
				"estimate",
				{ id },
				{
					status: "accepted",
					dueDate: new Date(body.orderDueDate).toISOString(),
				}
			)

			const data: any = [
				{
					name: "Sinal recebido - " + body.estimateName,
					amount: body.signReceived,
					date: new Date().toISOString(),
					paymentMethod: body.paymentMethod,
					status: "received",
					estimateId: id,
					clientId: body.clientId,
				},
			]

			let i = 0
			for (const installment of body.installments) {
				data.push({
					name: "Parcela " + ++i + " - " + body.estimateName,
					amount: installment.amount,
					date: installment.date,
					paymentMethod: installment.paymentMethod,
					status: "pending",
					estimateId: id,
					clientId: body.clientId,
				})
			}

			const result = await this.incomingRepository.createMany(data)
			return result
		} catch (error: any) {
			throw error
		}
	}
}
