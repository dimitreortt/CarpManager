import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import express, { Express } from "express"
import { isProduction } from "../config"
import { applyRateLimiter } from "./applyRateLimiter"

export const applyMiddlewares = (app: Express) => {
	if (isProduction) {
		applyRateLimiter(app)
	}
	app.use(cookieParser())
	app.use(
		cors({
			origin: (origin, callback) => {
				const allowedOrigins = isProduction ? ["https://fabic-gestao.web.app", "https://fabic-gestao2.web.app", "https://carpmanager-cypress-integration.web.app", "https://main.d2yv5imrl4g6dx.amplifyapp.com"] : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5273"]

				if (!origin) {
					return callback(null, true)
				}

				if (allowedOrigins.includes(origin ?? "")) {
					return callback(null, true)
				}
				return callback(new Error("Not allowed by CORS"))
			},
			credentials: true,
		})
	)

	app.use(helmet())
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
}
