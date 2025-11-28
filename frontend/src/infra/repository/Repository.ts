export interface Repository<T> {
	getAll(options?: { params?: Record<string, any> }): Promise<T[]>
	getById(id: string): Promise<T | null>
	create(item: T): Promise<string | void>
	update(item: Partial<T>): Promise<string | void>
	delete(item: T): Promise<void>
	deleteMany(items: T[]): Promise<void>
}
