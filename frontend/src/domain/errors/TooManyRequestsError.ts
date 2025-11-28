export class TooManyRequestsError extends Error {
	constructor() {
		super('Muitas requisições. Tente novamente mais tarde.')
	}
}
