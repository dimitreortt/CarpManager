import express, { Express, Request, Response, NextFunction, RequestHandler, ErrorRequestHandler, Router as ExpressRouter } from "express"
import cors from "cors"

type HttpMethod = "get" | "post" | "put" | "patch" | "delete" | "head" | "options"
export type RouteCallback<P = any, B = any, H = any> = (params: P, body: B, headers: H) => Promise<any> | any
export type Middleware = RequestHandler | ErrorRequestHandler
export type Router = ExpressRouter

export const makeRouter = () => {
	return express.Router()
}

export default interface HttpServer {
	addMiddleware(middleware: Middleware): void
	register<P = any, B = any, H = any>(method: HttpMethod, url: string, callback: RouteCallback<P, B, H>): void
	listen(port: number): void
	registerRouter(prefix: string, router: Router, middlewares?: Middleware[]): void
}

export class ExpressAdapter implements HttpServer {
	public readonly app: Express
	private static port?: number

	constructor() {
		this.app = express()
	}

	addMiddleware(middleware: Middleware): void {
		this.app.use(middleware)
	}

	addMiddlewares(middlewares: Middleware[]): void {
		for (const middleware of middlewares) {
			this.addMiddleware(middleware)
		}
	}

	registerRouter(prefix: string, router: Router, middlewares: Middleware[] = []): void {
		for (const middleware of middlewares) {
			router.use(middleware)
		}

		this.app.use(prefix, router)
	}

	register(method: HttpMethod, url: string, callback: RouteCallback): void {
		this.app[method](`/api${url}`, async (req: Request, res: Response, next: NextFunction) => {
			try {
				const output = await callback(req.params, req.body, req.headers)
				res.json(output)
			} catch (error: unknown) {
				const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
				next(error)
			}
		})
	}

	listen(port: number) {
		return this.app.listen(port, () => {
			if (process.env.NODE_ENV !== "test") {
				console.log("listening on port", port)
			}
		})
	}
}
