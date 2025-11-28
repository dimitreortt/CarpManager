import { BaseRepository } from "./BaseRepository"
import { Database } from "../database/Database"
import { arraysDiff, arraysEqual } from "../service/arraysEqual"

export class EstimateRepository extends BaseRepository<any> {
	constructor(database: Database) {
		super(database, "estimate")
	}

	async getAll(filters: Record<string, any> = {}): Promise<any[]> {
		const options = {
			where: filters || {},
			include: {
				client: {
					select: {
						name: true,
					},
				},
				incomings: {
					select: {
						id: true,
						amount: true,
						date: true,
						name: true,
						status: true,
					},
				},
				estimateMaterials: {
					include: {
						material: true,
					},
				},
				tripServiceCosts: {
					select: {
						id: true,
						cost: true,
						trip: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		}
		const result = await super.getAll(options)
		this.transformEstimates(result)
		return result
	}

	transformEstimates(estimates: any[]) {
		for (let i = estimates.length - 1; i >= 0; i--) {
			const estimate = { ...estimates[i] }
			const { estimateMaterials } = estimate
			const materials = estimateMaterials.map((estimateMaterial: any) => ({
				name: estimateMaterial.material.name,
				price: estimateMaterial.price,
				materialId: estimateMaterial.material.id,
			}))
			estimates[i].estimateMaterials = materials
		}

		for (let i = estimates.length - 1; i >= 0; i--) {
			const estimate = estimates[i]
			const { tripServiceCosts } = estimate
			const serviceCosts = tripServiceCosts.map((tsc: any) => ({
				name: tsc.trip.name,
				cost: tsc.cost,
				id: tsc.id,
			}))
			estimates[i].tripServiceCosts = serviceCosts
		}
	}

	addCreateEstimateMaterials(mats: { id: string; value: number }[] = [], baseObj: Record<string, any>) {
		EstimateRepository.addCreateEstimateMaterials(mats, baseObj)
	}

	static addCreateEstimateMaterials(mats: { id: string; value: number }[] = [], baseObj: Record<string, any>) {
		baseObj.estimateMaterials = {
			create: mats.map((mat) => ({
				materialId: mat.id,
				price: mat.value,
			})),
		}
	}
}
