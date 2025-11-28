export interface HttpClient<T> {
	get<R>(url: string, params?: Record<string, any>): Promise<R>
	post(url: string, data?: any, options?: Record<string, any>): Promise<T>
	put(url: string, data?: any): Promise<T>
	delete(url: string): Promise<T>
	deleteMany(url: string, data: any): Promise<T>
	getCrfToken(): string
}
