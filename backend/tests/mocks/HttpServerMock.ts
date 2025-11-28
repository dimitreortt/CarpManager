import express from "express"
import cors from "cors"

export class HttpServerMock {
	public readonly app: express.Application

	constructor() {
		this.app = express()
		this.app.use(express.json())
		this.app.use(cors())
	}
}
