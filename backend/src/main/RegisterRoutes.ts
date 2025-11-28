import HttpServer, { makeRouter } from "../infra/http/HttpServer"
import { MaterialController } from "../infra/controller/MaterialController"
import { FirebaseAuthMiddleware } from "../infra/service/FirebaseAuthMiddleware"
import { Database } from "../infra/database/Database"
import { SupplierController } from "../infra/controller/SupplierController"
import { TripController } from "../infra/controller/TripController"
import { EstimateController } from "../infra/controller/EstimateController"
import { ClientController } from "../infra/controller/ClientController"
import { QuoteController } from "../infra/controller/QuoteController"
import { EmployeeController } from "../infra/controller/EmployeeController"
import { IncomingController } from "../infra/controller/IncomingController"
import { OutgoingController } from "../infra/controller/OutgoingController"
import { EstimateService } from "../application/EstimateService"
import { AuthController } from "../infra/controller/AuthController"
import { Middleware } from "../infra/http/HttpServer"
import { CypressController } from "../infra/controller/CypressController"
import { ClientService } from "../application/ClientService"
import { MaterialService } from "../application/MaterialService"
import { EmployeeService } from "../application/EmployeeService"
import { IncomingService } from "../application/IncomingService"
import { OutgoingService } from "../application/OutgoingService"
import { QuoteService } from "../application/QuoteService"
import { TripService } from "../application/TripService"
import { SupplierService } from "../application/SupplierService"
import { csrfProtection } from "./middlewares/csrfProtection"
import { AxiosHttpClient } from "../infra/http/HttpClient"
import { RateLimiterFactoryImpl } from "../infra/service/RateLimiterFactory"
import { firebaseAdmin } from "../infra/firebase/firebase"

export class RegisterRoutes {
	constructor(private readonly httpServer: HttpServer, private readonly database: Database) {
		const verifyToken: Middleware = FirebaseAuthMiddleware.verifyToken as unknown as Middleware

		const authRouter = makeRouter()
		new AuthController(authRouter, this.database, new AxiosHttpClient(), new RateLimiterFactoryImpl(), firebaseAdmin.auth())
		this.httpServer.registerRouter("/api/auth", authRouter, [])

		const materialRouter = makeRouter()
		materialRouter.use(csrfProtection, verifyToken)
		new MaterialController(materialRouter, this.database, new MaterialService(this.database))
		this.httpServer.registerRouter("/api/materials", materialRouter, [])

		const supplierRouter = makeRouter()
		supplierRouter.use(csrfProtection, verifyToken)
		new SupplierController(supplierRouter, this.database, new SupplierService(this.database))
		this.httpServer.registerRouter("/api/suppliers", supplierRouter, [])

		const tripRouter = makeRouter()
		tripRouter.use(csrfProtection, verifyToken)
		new TripController(tripRouter, this.database, new TripService(this.database))
		this.httpServer.registerRouter("/api/trips", tripRouter, [])

		const estimateRouter = makeRouter()
		estimateRouter.use(csrfProtection, verifyToken)
		new EstimateController(estimateRouter, this.database, new EstimateService(this.database))
		this.httpServer.registerRouter("/api/estimates", estimateRouter, [])

		const quoteRouter = makeRouter()
		quoteRouter.use(csrfProtection, verifyToken)
		new QuoteController(quoteRouter, this.database, new QuoteService(this.database))
		this.httpServer.registerRouter("/api/quotes", quoteRouter, [])

		const clientRouter = makeRouter()
		clientRouter.use(verifyToken, csrfProtection)
		new ClientController(clientRouter, this.database, new ClientService(this.database))
		this.httpServer.registerRouter("/api/clients", clientRouter, [])

		const employeeRouter = makeRouter()
		employeeRouter.use(csrfProtection, verifyToken)
		new EmployeeController(employeeRouter, this.database, new EmployeeService(this.database))
		this.httpServer.registerRouter("/api/employees", employeeRouter, [])

		const incomingRouter = makeRouter()
		incomingRouter.use(csrfProtection, verifyToken)
		new IncomingController(incomingRouter, this.database, new IncomingService(this.database))
		this.httpServer.registerRouter("/api/incomings", incomingRouter, [])

		const outgoingRouter = makeRouter()
		outgoingRouter.use(csrfProtection, verifyToken)
		new OutgoingController(outgoingRouter, this.database, new OutgoingService(this.database))
		this.httpServer.registerRouter("/api/outgoings", outgoingRouter, [])

		const cypressRouter = makeRouter()
		new CypressController(cypressRouter, this.database)
		this.httpServer.registerRouter("/api/cypress", cypressRouter, [])
	}
}
