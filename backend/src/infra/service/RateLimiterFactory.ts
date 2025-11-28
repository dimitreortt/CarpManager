import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible"

export interface RateLimiter {
	consume(key: string): Promise<RateLimiterRes>
	delete(key: string): Promise<boolean>
}

export interface RateLimiterFactory {
	create(options: any): RateLimiter
}

export class RateLimiterFactoryImpl implements RateLimiterFactory {
	create(options: any): RateLimiter {
		return new RateLimiterMemory(options)
	}
}
