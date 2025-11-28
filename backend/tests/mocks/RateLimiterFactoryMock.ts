import { RateLimiter, RateLimiterFactory } from "../../src/infra/service/RateLimiterFactory"

class RateLimiterMock implements RateLimiter {
	consume = jest.fn()
	delete = jest.fn()
}

export class RateLimiterFactoryMock implements RateLimiterFactory {
	public rateLimiter: RateLimiterMock = new RateLimiterMock()

	create = jest.fn().mockReturnValue(this.rateLimiter)
}
