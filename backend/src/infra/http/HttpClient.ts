import axios, { AxiosInstance } from "axios"

export interface HttpClient {
	post(url: string, data: any): Promise<any>
	get(url: string): Promise<any>
	put(url: string, data: any): Promise<any>
	delete(url: string): Promise<any>
}

export class AxiosHttpClient implements HttpClient {
	private readonly client: AxiosInstance

	constructor() {
		this.client = axios.create()
	}

	async post(url: string, data: any): Promise<any> {
		return this.client.post(url, data)
	}

	async get(url: string): Promise<any> {
		return this.client.get(url)
	}

	async put(url: string, data: any): Promise<any> {
		return this.client.put(url, data)
	}

	async delete(url: string): Promise<any> {
		return this.client.delete(url)
	}
}
