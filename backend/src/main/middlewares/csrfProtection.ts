import csrf from "csurf"
import { isProduction } from "../config"

export const csrfProtection = csrf({
	cookie: {
		secure: isProduction,
		httpOnly: true,
		sameSite: isProduction ? "none" : "lax",
	},
	value: function (req) {
		return req.headers["x-csrf-token"] as string
	},
})
