export class NotAllowedByCorsError extends Error {
	constructor() {
		super("Not allowed by CORS")
		this.name = "NotAllowedByCorsError"
	}
}
