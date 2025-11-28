import { applyMiddlewares } from "./middlewares/applyMiddlewares"
import dotenv from "dotenv"
import { RegisterRoutes } from "./RegisterRoutes"
import { ExpressAdapter } from "../infra/http/HttpServer"
import { PrismaDatabase } from "../infra/database/PrismaDatabase"
import { errorHandler } from "../infra/http/asyncHandler"
dotenv.config()

const httpServer = new ExpressAdapter()
applyMiddlewares(httpServer.app)
new RegisterRoutes(httpServer, new PrismaDatabase())

httpServer.app.use("*", (req, res, next) => {
	res.status(404).json({ error: "Route not found" })
})

httpServer.app.use(errorHandler)

httpServer.listen(Number(process.env.PORT ?? 3000))
