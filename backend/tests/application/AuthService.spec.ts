import { AuthService } from "../../src/application/AuthService"
import { HttpClientMock } from "../mocks/HttpClientMock"
import { mockDatabase } from "../mocks/mockDatabase"
import { RateLimiterFactoryMock } from "../mocks/RateLimiterFactoryMock"
import { AdminAuthMock } from "../mocks/AdminAuthMock"
import { Database } from "../../src/infra/database/Database"
import { EmailNotVerifiedError, InvalidCredentialsError } from "../../src/domain/errors/AuthErrors"

describe("AuthService", () => {
	let authService: AuthService
	let rateLimiterFactory: RateLimiterFactoryMock
	let adminAuth: AdminAuthMock
	let httpClient: HttpClientMock
	let database: Database

	beforeEach(() => {
		rateLimiterFactory = new RateLimiterFactoryMock()
		adminAuth = new AdminAuthMock()
		httpClient = new HttpClientMock()
		database = mockDatabase
		authService = new AuthService(database, httpClient, rateLimiterFactory, adminAuth)
		process.env.FIREBASE_API_KEY = "test-api-key"
	})

	it("should session login", async () => {
		rateLimiterFactory.rateLimiter.consume.mockResolvedValue(undefined)
		adminAuth.getUserByEmail.mockResolvedValue({
			emailVerified: true,
		})
		adminAuth.createSessionCookie.mockResolvedValue("1234567890")
		httpClient.post.mockResolvedValue({
			data: {
				idToken: "1234567890",
				displayName: JSON.stringify({ name: "Test User", email: "test@example.com" }),
			},
		})
		const result = await authService.sessionLogin("test@example.com", "password", "127.0.0.1")
		expect(result).toEqual({
			sessionCookie: "1234567890",
			options: {
				maxAge: 60 * 60 * 24 * 1 * 1000,
				secure: false,
				httpOnly: true,
				sameSite: "lax",
				path: "/",
			},
			userInfo: {
				name: "Test User",
				email: "test@example.com",
			},
		})
	})

	it("should throw invalid credentials error when session login", async () => {
		rateLimiterFactory.rateLimiter.consume.mockResolvedValue(undefined)
		adminAuth.getUserByEmail.mockResolvedValue({
			emailVerified: true,
		})
		adminAuth.createSessionCookie.mockResolvedValue("1234567890")
		httpClient.post.mockRejectedValue(new Error("Invalid"))
		await expect(authService.sessionLogin("test@example.com", "password", "127.0.0.1")).rejects.toThrow(InvalidCredentialsError)
	})

	it("should get session cookie options", async () => {
		adminAuth.createSessionCookie.mockResolvedValue("1234567890")
		const result = await authService.getSessionCookieOptions({
			idToken: "1234567890",
			displayName: JSON.stringify({ name: "Test User", email: "test@example.com" }),
		})
		expect(result).toEqual({
			sessionCookie: "1234567890",
			options: {
				maxAge: 60 * 60 * 24 * 1 * 1000,
				secure: false,
				httpOnly: true,
				sameSite: "lax",
				path: "/",
			},
		})
	})

	it("should check email verified", async () => {
		adminAuth.getUserByEmail.mockResolvedValue({
			emailVerified: true,
		})
		await authService.checkEmailVerified("test@example.com")
		expect(adminAuth.getUserByEmail).toHaveBeenCalledWith("test@example.com")
	})

	it("should throw email not verified error when checking email verified", async () => {
		adminAuth.getUserByEmail.mockResolvedValue({
			emailVerified: false,
		})
		await expect(authService.checkEmailVerified("test@example.com")).rejects.toThrow(EmailNotVerifiedError)
	})

	it("should throw invalid credentials if auth/user-not-found", async () => {
		const error = new Error("User not found") as any
		error.code = "auth/user-not-found"
		adminAuth.getUserByEmail.mockRejectedValue(error)
		await expect(authService.checkEmailVerified("test@example.com")).rejects.toThrow(InvalidCredentialsError)
	})

	it("should throw error if email verification fails", async () => {
		adminAuth.getUserByEmail.mockRejectedValue(new Error("Error verifying email"))
		await expect(authService.checkEmailVerified("test@example.com")).rejects.toThrow(Error("Error verifying email"))
	})

	it("should request sign in", async () => {
		httpClient.post.mockResolvedValue({
			data: {
				idToken: "1234567890",
				email: "test@example.com",
				displayName: "Test User",
			},
		})
		const result = await authService.requestSignIn("test@example.com", "password")
		expect(result).toEqual({ idToken: "1234567890", email: "test@example.com", displayName: "Test User" })
		expect(httpClient.post).toHaveBeenCalledWith("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test-api-key", {
			email: "test@example.com",
			password: "password",
			returnSecureToken: true,
		})
	})

	it("should throw invalid credentials error when requesting sign in", async () => {
		httpClient.post.mockRejectedValue(new Error("Invalid"))
		await expect(authService.requestSignIn("test@example.com", "password")).rejects.toThrow(InvalidCredentialsError)
	})

	it("should consume an ip address", async () => {
		await authService.consumeRequestIp("127.0.0.1")
		expect(rateLimiterFactory.rateLimiter.consume).toHaveBeenCalledWith("127.0.0.1")
	})

	it("should throw my custom error when consuming an ip address", async () => {
		rateLimiterFactory.rateLimiter.consume.mockRejectedValue(new Error(""))
		await expect(authService.consumeRequestIp("127.0.0.1", InvalidCredentialsError)).rejects.toThrow(InvalidCredentialsError)
	})
})
