import { AdminAuth, firebaseAdmin } from "../infra/firebase/firebase"
import { EmailAlreadyExistsError, EmailNotVerifiedError, InvalidCredentialsError, InvalidTokenError, TooManyLoginAttemptsError, TooManyRequestsError } from "../domain/errors/AuthErrors"
import { Database } from "../infra/database/Database"
import { Encrypter } from "../infra/service/Encrypter"
import { DateHandler } from "../infra/service/DateHandler"
import { MailService } from "./MailService"
import { isProduction } from "../main/config"
import { CookieOptions } from "express"
import { asyncHandler } from "../infra/http/asyncHandler"
import { SessionLoginResult } from "./dto/SessionLoginResult"
import { HttpClient } from "../infra/http/HttpClient"
import { RateLimiter, RateLimiterFactory } from "../infra/service/RateLimiterFactory"

interface CreateUserData {
	email: string
	password: string
	name: string
	role: string
	companyId: string
	env?: string
}

type LoggedUser = {
	idToken: string
	displayName: string
}

export class AuthService {
	private readonly rateLimiter: RateLimiter
	private readonly loginRateLimiter: RateLimiter

	constructor(readonly database: Database, readonly httpClient: HttpClient, readonly rateLimiterFactory: RateLimiterFactory, readonly admin: AdminAuth) {
		this.rateLimiter = this.createRateLimiter(isProduction ? 20 : 100)
		this.loginRateLimiter = this.createRateLimiter(5)
	}

	createRateLimiter(points: number) {
		return this.rateLimiterFactory.create({
			points: points,
			duration: 60 + 15,
			blockDuration: 60 + 30,
		})
	}

	async validateEmail(email: string, data: CreateUserData): Promise<object> {
		const allowedEmails = await this.database.findMany("allowedEmailInSignUp")
		const isAllowed = allowedEmails.some((allowedEmail) => allowedEmail.email === email)

		if (!isAllowed) {
			return {
				status: "error",
				message: "Email não autorizado para cadastro",
			}
		}

		const env = data.env
		delete data.env
		const token = await this.generateToken(data)
		await this.sendVerificationEmail(email, token, env)

		return {
			status: "success",
			message: "Email enviado com sucesso",
		}
	}

	async generateToken(data: Partial<CreateUserData>): Promise<string> {
		const encryptedData = Encrypter.encrypt(data)

		const result = await this.database.create("token", {
			data: {
				expiresAt: DateHandler.addMinutes(new Date(), 30),
				token: encryptedData,
			},
		})

		const token = `${result.id}:::${encryptedData}`
		return token
	}

	async sendVerificationEmail(email: string, token: string, env?: string) {
		const url = this.getSystemUrl(env ?? "production")

		const mailOptions = {
			from: '"CarpManager" <' + process.env.MAIL_USER + ">",
			to: `${email}`,
			subject: "Por favor, verifique seu email...",
			html: `<p>Olá, verifique seu email clicando no link abaixo</p>
        <br>
        <a href="${url}/verify-email?emailToken=${token}">Clique aqui para verificar seu email</a>
        `,
		}

		await MailService.sendMail(mailOptions)
	}

	async sendPasswordResetEmail(email: string): Promise<void> {
		await this.checkEmailVerified(email)
		const url = this.getSystemUrl(isProduction ? "production" : "development")

		const token = await this.generateToken({ email })

		const mailOptions = {
			from: '"CarpManager" <' + process.env.MAIL_USER + ">",
			to: `${email}`,
			subject: "Recuperação de senha...",
			html: `<p>Olá, clique no link abaixo para recuperar a sua senha</p>
        <br>
        <a href="${url}/reset-password?token=${token}">Recuperar senha</a>
        `,
		}

		await MailService.sendMail(mailOptions)
	}

	async verifyPasswordResetToken(token: string): Promise<object> {
		await this.findTokenAndDecrypt(token)
		return {
			status: "success",
			message: "Token de recuperação de senha validado com sucesso",
		}
	}

	async resetPassword(token: string, password: string): Promise<object> {
		const data = await this.findTokenAndDecrypt(token)
		const user = await this.admin.getUserByEmail(data.email)

		await this.admin.updateUser(user.uid, {
			password: password,
		})
		return {
			status: "success",
			message: "Senha alterada com sucesso",
		}
	}

	getSystemUrl(env: string) {
		switch (env) {
			case "development":
				return "http://localhost:5173"
			default:
				return "https://fabic-gestao.web.app"
		}
	}

	async verifyToken(token: string): Promise<object> {
		const data = await this.findTokenAndDecrypt(token)
		await this.createUser(data)
		return data
	}

	async findTokenAndDecrypt(token: string): Promise<CreateUserData> {
		const [uuid, encryptedData] = token.split(":::")

		const tokenData = await this.database.findUnique("token", {
			where: {
				id: uuid,
			},
		})

		if (!tokenData) {
			throw new InvalidTokenError()
		}

		const decryptedData = Encrypter.decrypt(encryptedData) as CreateUserData
		return decryptedData
	}

	async createUser(data: CreateUserData): Promise<any> {
		try {
			const user = await this.admin.createUser({
				email: data.email,
				password: data.password,
			})

			if (data.email === process.env.INTEGRATION_TEST_EMAIL) {
				data.companyId = "integration_test_company"
			}

			const userExtraInfo = {
				name: data.name,
				companyId: data.companyId,
			}
			const infoString = JSON.stringify(userExtraInfo)

			await this.admin.updateUser(user.uid, {
				displayName: infoString,
				emailVerified: true,
			})
		} catch (error: any) {
			if (error.code === "auth/email-already-exists") {
				throw new EmailAlreadyExistsError()
			}
			throw error
		}
	}

	async sessionLogin(email: string, password: string, ip: string): Promise<SessionLoginResult> {
		await this.consumeLoginRequestIp(ip)

		await this.checkEmailVerified(email)

		const user = await this.requestSignIn(email, password)

		const { sessionCookie, options } = await this.getSessionCookieOptions(user)

		await this.resetRequestIp(ip, this.loginRateLimiter)
		const info = JSON.parse(user.displayName ?? "{}")

		return { sessionCookie, options, userInfo: { name: info.name, email: info.email } }
	}

	async consumeLoginRequestIp(ip: string): Promise<void> {
		await this.consumeRequestIp(ip, TooManyLoginAttemptsError, this.loginRateLimiter)
	}

	async checkEmailVerified(email: string): Promise<void> {
		const user = await this.admin.getUserByEmail(email).catch((error) => {
			if (error.code === "auth/user-not-found") {
				throw new InvalidCredentialsError()
			}
			throw error
		})
		if (!user.emailVerified) throw new EmailNotVerifiedError()
	}

	async requestSignIn(email: string, password: string): Promise<LoggedUser> {
		const apiKey = process.env.FIREBASE_API_KEY
		const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
		const { data: user } = await this.httpClient
			.post(url, {
				email,
				password,
				returnSecureToken: true,
			})
			.catch((error) => {
				throw new InvalidCredentialsError()
			})

		return user
	}

	async getSessionCookieOptions(user: LoggedUser): Promise<{ sessionCookie: string; options: CookieOptions }> {
		const expiresIn = 60 * 60 * 24 * 1 * 1000

		const sessionCookie = await this.admin.createSessionCookie(user.idToken, {
			expiresIn: expiresIn,
		})

		const options: CookieOptions = {
			maxAge: expiresIn,
			secure: isProduction,
			httpOnly: true,
			sameSite: isProduction ? "none" : "lax",
			path: "/",
		}

		return { sessionCookie, options }
	}

	rateLimiterMiddleware = () =>
		asyncHandler(async (req: any, res: any, next: any) => {
			await this.consumeRequestIp(req.ip as string)
			next()
		})

	async consumeRequestIp(ip: string, errorType?: any, rateLimiter?: RateLimiter): Promise<void> {
		try {
			await (rateLimiter ?? this.rateLimiter).consume(ip)
		} catch (error) {
			if (errorType) {
				throw new errorType()
			}
			throw new TooManyRequestsError()
		}
	}

	async resetRequestIp(ip: string, rateLimiter?: RateLimiter): Promise<void> {
		await (rateLimiter ?? this.rateLimiter).delete(ip)
	}
}
