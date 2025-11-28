import jwt from "jsonwebtoken"

export class Encrypter {
	static encrypt(object: any) {
		return jwt.sign(object, process.env.ENCRYPTION_KEY as string)
	}

	static decrypt(token: string) {
		return jwt.verify(token, process.env.ENCRYPTION_KEY as string)
	}

	static isValidJwt(token: string) {
		const jwtPattern = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/
		if (token.length < 50 || token.length > 2000) {
			return false
		}
		return jwtPattern.test(token)
	}
}
