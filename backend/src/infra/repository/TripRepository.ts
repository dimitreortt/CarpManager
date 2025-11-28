import { UpsertQuery } from "../database/Database"
import { Database } from "../database/Database"
import { BaseRepository } from "./BaseRepository"

type ServiceCost = { id: string }

export class TripRepository extends BaseRepository<any> {
	constructor(database: Database) {
		super(database, "trip")
	}

	async getAll(data: Record<string, any> = {}): Promise<any[]> {
		const { available, estimateId } = data

		const query: Record<string, any> = {
			include: {
				serviceCosts: {
					select: {
						id: true,
						cost: true,
						estimate: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		}

		if (available === "true") {
			query.include.serviceCosts.where = {
				OR: [{ estimateId: estimateId }, { estimateId: null }],
			}
		}

		return await super.getAll(query)
	}

	static addCreateServiceCosts(serviceCosts: { cost: number }[] = [], baseObj: Record<string, any>) {
		baseObj.serviceCosts = {
			create: serviceCosts.map((serviceCost) => ({
				cost: serviceCost.cost,
			})),
		}
	}

	static addServiceCostsConnections(tripId: string, serviceCosts: { id: string; cost: number }[] = [], baseObj: UpsertQuery[] = []) {
		for (const serviceCost of serviceCosts) {
			baseObj.push({
				where: { id: serviceCost.id || undefined },
				update: { cost: serviceCost.cost },
				create: {
					trip: { connect: { id: tripId } },
					cost: serviceCost.cost,
				},
			})
		}
		return baseObj
	}

	static async deleteOldServiceCosts(currentServiceCosts: ServiceCost[], tripId: string, database: Database) {
		const currentIds = currentServiceCosts.map((result: any) => result.id)
		if (currentIds.length === 0) return []
		return await database.deleteMany("tripServiceCost", { where: { id: { notIn: currentIds }, tripId: tripId } })
	}
}
