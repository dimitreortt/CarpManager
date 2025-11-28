import { NextFunction, Response, Request } from "express"
import { firebaseAdmin } from "../firebase/firebase"
import { AuthenticatedRequest } from "../http/AuthenticatedRequest"
import { config, isProduction } from "../../main/config"
import { InvalidSessionCookieError, InvalidTokenError } from "../../domain/errors/AuthErrors"
import { Encrypter } from "./Encrypter"

export class FirebaseAuthMiddleware {
	static async verifyToken(req: AuthenticatedRequest | Request, res: Response, next: NextFunction) {
		try {
			const sessionCookie = req.cookies?.session
			if (!sessionCookie) throw new InvalidSessionCookieError()

			if (!Encrypter.isValidJwt(sessionCookie)) throw new InvalidSessionCookieError()

			const decoded = await firebaseAdmin.auth().verifySessionCookie(sessionCookie, true)
			if (!decoded) throw new InvalidTokenError()

			const data = JSON.parse(decoded.name ?? "{}")
			config.companyId = data.companyId

			const authReq = req as AuthenticatedRequest
			authReq.user = decoded

			next()
		} catch (error: any) {
			if (error.name === "InvalidSessionCookieError") {
				return res.status(401).json({
					error: "Cookie de sessão inválido ou expirado",
					code: "VERIFICATION_FAILED",
				})
			} else if (error.name === "InvalidTokenError") {
				return res.status(401).json({
					error: "Token inválido ou expirado",
					code: "VERIFICATION_FAILED",
				})
			}

			return res.status(401).json({
				error: "Cookie verification failed",
				code: "VERIFICATION_FAILED",
			})
		}
	}
}
