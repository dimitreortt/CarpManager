import { Database } from "./Database"
import { Prisma, PrismaClient } from "@prisma/client"
import { CamelCase } from "type-fest"
import { UpsertQuery } from "./Database"

type ModelNameCamelcased = CamelCase<Prisma.ModelName>

export class PrismaDatabase implements Database<{ include?: any; where?: any }> {
	private readonly prisma: PrismaClient

	constructor() {
		this.prisma = new PrismaClient()
	}

	async findMany(model: ModelNameCamelcased, options?: any): Promise<any[]> {
		const result = await (this.prisma as any)[model].findMany(options)
		return result
	}

	findUnique(model: ModelNameCamelcased, options: any): Promise<any> {
		return (this.prisma as any)[model].findUnique(options)
	}

	create(model: ModelNameCamelcased, options: any): Promise<any> {
		return (this.prisma as any)[model].create(options)
	}

	createMany(model: ModelNameCamelcased, options: any): Promise<any> {
		return (this.prisma as any)[model].createMany(options)
	}

	update(model: ModelNameCamelcased, where: any, data: any, options?: any): Promise<any> {
		let { id, number, supplierId, ...rest } = data
		return (this.prisma as any)[model].update({ where, data: rest, ...options })
	}

	updateMany(model: ModelNameCamelcased, data: UpsertQuery[]): Promise<any[]> {
		return this.prisma.$transaction(data.map((query: any) => (this.prisma as any)[model].upsert(query)))
	}

	upsertMany(model: ModelNameCamelcased, data: UpsertQuery[]): Promise<any> {
		return this.prisma.$transaction(
			data.map((query: UpsertQuery) => {
				if (query.where.id) {
					return (this.prisma as any)[model].update({ where: query.where, data: query.update })
				}
				return (this.prisma as any)[model].create({ data: query.create })
			})
		)
	}

	delete(model: ModelNameCamelcased, options?: any): Promise<any> {
		return (this.prisma as any)[model].delete(options)
	}

	deleteMany(model: ModelNameCamelcased, options?: any): Promise<any> {
		return (this.prisma as any)[model].deleteMany(options)
	}
}
