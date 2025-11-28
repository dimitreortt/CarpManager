import { HttpClient } from "../../src/infra/http/HttpClient"

export class HttpClientMock implements HttpClient {
	post = jest.fn()
	get = jest.fn()
	put = jest.fn()
	delete = jest.fn()
}
