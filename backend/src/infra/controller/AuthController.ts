import { AuthService } from "../../application/AuthService"
import { Database } from "../database/Database"
import { Router } from "../http/HttpServer"
import { asyncHandler } from "../http/asyncHandler"
import { FirebaseAuthMiddleware } from "../service/FirebaseAuthMiddleware"
import { AuthenticatedRequest } from "../http/AuthenticatedRequest"
import { csrfProtection } from "../../main/middlewares/csrfProtection"
import { HttpClient } from "../http/HttpClient"
import { RateLimiterFactory } from "../service/RateLimiterFactory"
import { AdminAuth } from "../firebase/firebase"

export class AuthController {
	private authService: AuthService
	private router: Router

	constructor(router: Router, database: Database, httpClient: HttpClient, rateLimiterFactory: RateLimiterFactory, admin: AdminAuth) {
		this.authService = new AuthService(database, httpClient, rateLimiterFactory, admin)
		this.router = router
		this.registerRoutes()
	}

	private registerRoutes() {
		this.router.post(
			"/validate-email",
			this.authService.rateLimiterMiddleware(),
			asyncHandler(async (req, res) => {
				const result = await this.authService.validateEmail(req.body.email, req.body)
				res.json(result)
			})
		)

		this.router.get(
			"/verify-token/:token",
			this.authService.rateLimiterMiddleware(),
			asyncHandler(async (req, res) => {
				const result = await this.authService.verifyToken(req.params.token)
				res.json(result)
			})
		)

		this.router.post(
			"/get-logged-user",
			FirebaseAuthMiddleware.verifyToken,
			asyncHandler(async (req, res) => {
				const authReq = req as AuthenticatedRequest
				const data = JSON.parse(authReq.user.name ?? "{}")
				res.json({
					email: authReq.user.email,
					name: data.name,
				})
			})
		)

		this.router.get(
			"/csrf-token",
			this.authService.rateLimiterMiddleware(),
			csrfProtection,
			asyncHandler(async (req, res) => {
				res.json({ csrfToken: req.csrfToken() })
			})
		)

		this.router.post(
			"/session-login",
			asyncHandler(async (req, res) => {
				const {
					ip,
					body: { email, password },
				} = req

				const { sessionCookie, options, userInfo } = await this.authService.sessionLogin(email, password, ip as string)

				res.cookie("session", sessionCookie, options)
				res.json({ name: userInfo.name, email: userInfo.email })
			})
		)

		this.router.post(
			"/session-logout",
			this.authService.rateLimiterMiddleware(),
			FirebaseAuthMiddleware.verifyToken,
			asyncHandler(async (req, res) => {
				res.clearCookie("session")
				res.json({ message: "Logged out successfully" })
			})
		)

		this.router.post(
			"/send-password-reset-email",
			this.authService.rateLimiterMiddleware(),
			asyncHandler(async (req, res) => {
				const { email } = req.body
				await this.authService.sendPasswordResetEmail(email)
				res.json({ message: "Password reset email sent" })
			})
		)

		this.router.get(
			"/verify-password-reset-token/:token",
			this.authService.rateLimiterMiddleware(),
			asyncHandler(async (req, res) => {
				const result = await this.authService.verifyPasswordResetToken(req.params.token)
				res.json(result)
			})
		)

		this.router.post(
			"/reset-password",
			this.authService.rateLimiterMiddleware(),
			asyncHandler(async (req, res) => {
				const { token, password } = req.body
				const result = await this.authService.resetPassword(token, password)
				res.json(result)
			})
		)
	}
}
