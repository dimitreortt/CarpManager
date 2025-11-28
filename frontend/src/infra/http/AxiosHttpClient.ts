import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { HttpClient } from './HttpClient'
import { store } from '../store/store'
import { apiContextAtom } from '../../main/apiContextAtom'
import { getBaseServerUrl } from '../service/getBaseServerUrl'
import { TooManyRequestsError } from '../../domain/errors/TooManyRequestsError'

export class AxiosHttpClient implements HttpClient<any> {
	client: AxiosInstance
	handleUnauthorized: () => Promise<void>

	constructor() {
		this.client = axios.create({
			baseURL: getBaseServerUrl(),
			withCredentials: true
		})
		this.handleUnauthorized = store.get(apiContextAtom).handleUnauthorized

		this.client.interceptors.request.use(config => {
			const csrfToken = this.getCrfToken()
			if (csrfToken) {
				config.headers['X-CSRF-Token'] = csrfToken
			}
			return config
		})
	}

	getCrfToken(): string {
		return store.get(apiContextAtom).csrfToken || ''
	}

	async request(method: 'get' | 'post' | 'put' | 'delete', url: string, params?: Record<string, any>, options?: Record<string, any>) {
		try {
			const response = await this.client[method](url, params, options)
			return response.data
		} catch (error: any) {
			const response = error.response
			switch (response.status) {
				case 401:
					return await this.handleUnauthorized()
				case 429:
					throw new TooManyRequestsError()
				case 400:
				case 404:
				case 500:
				default:
					throw new Error(response.data.message)
			}
		}
	}

	get<R>(url: string, params?: Record<string, any>): Promise<R> {
		return this.request('get', url, { params })
	}

	post(url: string, data: any = {}, options?: Record<string, any>): Promise<any> {
		return this.request('post', url, data, options)
	}

	put(url: string, data?: any): Promise<any> {
		return this.request('put', url, data)
	}

	delete(url: string): Promise<any> {
		return this.request('delete', url)
	}

	deleteMany(url: string, data: { ids: string[] }): Promise<any> {
		return this.request('delete', url, { data })
	}
}
