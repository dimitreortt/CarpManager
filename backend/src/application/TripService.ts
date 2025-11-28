import { Database } from "../infra/database/Database"
import { BaseRepository } from "../infra/repository/BaseRepository"
import { TripRepository } from "../infra/repository/TripRepository"
import { BaseService } from "./BaseService"

export class TripService extends BaseService<TripRepository> {
	constructor(database: Database) {
		super(database)
		this.repository = new TripRepository(database)
	}

	async create(data: any) {
		const { estimateId, serviceCosts, date, ...baseObj } = data
		BaseRepository.addConnection("estimate", estimateId, baseObj)
		baseObj.date = new Date(date)
		baseObj.serviceCosts = {
			createMany: {
				data: serviceCosts.map((sc: any) => ({ cost: sc.cost })),
			},
		}

		return await this.repository.create(baseObj)
	}

	async update(id: string, data: any) {
		const { estimateId, serviceCosts, date, ...baseObj } = data
		baseObj.date = new Date(date)
		BaseRepository.addConnection("estimate", estimateId, baseObj)

		baseObj.serviceCosts = {
			set: serviceCosts.map((sc: any) => ({ id: sc.id })).filter((sc: any) => sc.id),
		}

		const result = await this.repository.update(id, baseObj)
		const query = TripRepository.addServiceCostsConnections(id, serviceCosts, [])
		await this.repository.upsertMany("tripServiceCost", query)

		return result
	}
}
