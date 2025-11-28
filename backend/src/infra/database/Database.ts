export type UpsertQuery = {
	where: Record<string, any>
	update: Record<string, any>
	create: Record<string, any>
}

export interface Database<O = any> {
	findMany(model: string, options?: O): Promise<any[]>
	findUnique(model: string, where: any): Promise<any>
	create(model: string, options: O): Promise<any>
	createMany(model: string, options: O): Promise<any>
	update(model: string, where: any, data: any, options?: O): Promise<any>
	updateMany(model: string, data: any): Promise<any>
	upsertMany(model: string, data: UpsertQuery[]): Promise<any>
	delete(model: string, options?: O): Promise<any>
	deleteMany(model: string, options?: O): Promise<any>
}
