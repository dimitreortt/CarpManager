import { config } from "../../main/config"
import { Database } from "../database/Database"
import { arraysDiff, arraysEqual } from "../service/arraysEqual"
import { UpsertQuery } from "../database/Database"
import { InvalidTokenError } from "../../domain/errors/AuthErrors"

export type Object = Record<string, any>

export type UpdateNtoNConnection = {
	id: string
	update: Record<string, any>
}

export class BaseRepository<T = any> {
	protected database: Database
	protected entityName: string
	protected query: Record<string, any> = {
		include: {},
	}

	constructor(database: Database, entityName: string = "") {
		this.database = database
		this.entityName = entityName
	}

	async getById(id: string, options: Record<string, any> = {}): Promise<T | null> {
		if (!options.where) {
			options.where = {
				id,
			}
		} else {
			options.where.id = id
		}
		return await this.database.findUnique(this.entityName, options)
	}

	async getAll(options: Record<string, any> = {}): Promise<T[]> {
		if (!config.companyId) {
			throw new InvalidTokenError()
		}
		if (options.where) {
			options.where.companyId = config.companyId
		} else {
			options.where = {
				companyId: config.companyId,
			}
		}
		return await this.database.findMany(this.entityName, options)
	}

	async save(data: any): Promise<T> {
		const { id, ...baseObj } = data
		if (id) {
			return await this.update(id, baseObj)
		}
		return await this.create(baseObj)
	}

	async create(data: T): Promise<T> {
		return await this.database.create(this.entityName, { data: { ...data, companyId: config.companyId } })
	}

	async createMany(data: T[]): Promise<T[]> {
		return await this.database.createMany(this.entityName, { data: data.map((item) => ({ ...item, companyId: config.companyId })) })
	}

	async update(id: string, data: T, options: Record<string, any> = {}): Promise<T> {
		return await this.database.update(this.entityName, { id }, data, { ...this.query, ...options })
	}

	async updateMany(entityName: string, options: Record<string, any> = {}): Promise<T[]> {
		return await this.database.updateMany(entityName, options)
	}

	async upsertMany(entityName: string, data: UpsertQuery[]): Promise<T[]> {
		return await this.database.upsertMany(entityName, data)
	}

	async delete(id: string): Promise<T> {
		return await this.database.delete(this.entityName, { id })
	}

	async deleteMany(ids: string[], entityName: string = this.entityName, customOptions?: Record<string, any>): Promise<T[]> {
		const options = customOptions || { where: { id: { in: ids } } }
		return await this.database.deleteMany(entityName, options)
	}

	includeQuery(key: string, columns: string | string[]) {
		if (!columns) {
			this.query.include[key] = true
		} else if (typeof columns === "string") {
			this.query.include[key] = {
				select: {
					[columns]: true,
				},
			}
		} else {
			const query: Record<string, any> = {
				include: {
					[key]: {
						select: {},
					},
				},
			}
			if (!this.query.include[key].select) {
				this.query.include[key].select = {}
			}
			for (const column of columns) {
				this.query.include[key].select[column] = true
			}
		}
		return this.query
	}

	addConnection(fieldName: string, fieldId: string, baseObj: any) {
		BaseRepository.addConnection(fieldName, fieldId, baseObj)
	}

	addConnections(fieldName: string, fieldIds: string[], baseObj: any) {
		BaseRepository.addConnections(fieldName, fieldIds, baseObj)
	}

	setConnections(fieldName: string, fieldIds: string[], baseObj: any, allowEmpty: boolean = false) {
		BaseRepository.setConnections(fieldName, fieldIds, baseObj, allowEmpty)
	}

	static async addConnection(fieldName: string, fieldId: string, baseObj: any) {
		if (!fieldId || fieldId === "") return
		baseObj[fieldName] = {
			connect: {
				id: fieldId,
			},
		}
	}

	static async addConnections(fieldName: string, fieldIds: string[], baseObj: any) {
		if (fieldIds.length === 0) return
		baseObj[fieldName] = {
			connect: fieldIds.map((fieldId) => ({
				id: fieldId,
			})),
		}
	}

	static async setConnections(fieldName: string, fieldIds: string[], baseObj: any, allowEmpty: boolean = false) {
		if (fieldIds.length === 0 && !allowEmpty) return
		baseObj[fieldName] = {
			set: fieldIds.map((fieldId) => ({
				id: fieldId,
			})),
		}
		return baseObj
	}

	async updateNtoNConnections(relationField: string, thisKey: string, thatKey: string, thisId: string, currentIds: string[], newConnections: UpdateNtoNConnection[], removeDisconnected: boolean) {
		const newIds = newConnections.map((newConnection) => newConnection.id)
		if (arraysEqual(newIds, currentIds)) return

		const baseObj: UpsertQuery[] = []

		for (const newConnection of newConnections) {
			baseObj.push({
				where: {
					[`${thisKey}Id_${thatKey}Id`]: {
						[`${thisKey}Id`]: thisId,
						[`${thatKey}Id`]: newConnection.id,
					},
				},
				update: newConnection.update,
				create: {
					[thisKey]: {
						connect: {
							id: thisId,
						},
					},
					[thatKey]: {
						connect: {
							id: newConnection.id,
						},
					},
					...newConnection.update,
				},
			})
		}

		await this.updateMany(relationField, baseObj)

		if (removeDisconnected) {
			const idsToRemove = arraysDiff(
				newConnections.map((newConnection) => newConnection.id),
				currentIds
			)

			await this.deleteMany([], relationField, {
				where: {
					[`${thatKey}Id`]: {
						in: idsToRemove,
					},
				},
			})
		}
	}
}
