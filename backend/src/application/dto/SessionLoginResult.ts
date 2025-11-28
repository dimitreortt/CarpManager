import { CookieOptions } from "express"

export type SessionLoginResult = {
	sessionCookie: string
	options: CookieOptions
	userInfo: { name: string; email: string }
}
