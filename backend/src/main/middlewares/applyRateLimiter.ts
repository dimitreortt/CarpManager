import { Express, Request, Response, NextFunction } from "express"
import { RateLimiterMemory } from "rate-limiter-flexible"
import { asyncHandler } from "../../infra/http/asyncHandler"
import { TooManyRequestsError } from "../../domain/errors/AuthErrors"

const globalRateLimiter = new RateLimiterMemory({
	points: 100,
	duration: 15 * 60,
})

export const applyRateLimiter = (app: Express) => {
	app.use(
		asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
			try {
				await globalRateLimiter.consume(req.ip as string)
				next()
			} catch (error) {
				throw new TooManyRequestsError()
			}
		})
	)
}
