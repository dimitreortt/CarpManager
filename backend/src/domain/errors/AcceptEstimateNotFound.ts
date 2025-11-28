export class AcceptEstimateNotFound extends Error {
	readonly name = "AcceptEstimateNotFound"

	constructor() {
		super("Não foi possível aceitar o orçamento: orçamento não encontrado")
	}
}
