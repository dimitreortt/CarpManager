export const getCategoryOptions = () => {
	return [
		{ value: 'servicos', label: 'Serviços' },
		{ value: 'produtos', label: 'Produtos' },
		{ value: 'consultoria', label: 'Consultoria' },
		{ value: 'manutencao', label: 'Manutenção' },
		{ value: 'outros', label: 'Outros' }
	]
}

export type PaymentMethod = 'pix' | 'cartao' | 'boleto' | 'dinheiro' | 'transferencia' | 'bonificacao'
export const getPaymentMethodOptions = () => {
	return [
		{ value: 'pix', label: 'Pix' },
		{ value: 'cartao', label: 'Cartão de Crédito' },
		{ value: 'boleto', label: 'Boleto' },
		{ value: 'dinheiro', label: 'Dinheiro' },
		{ value: 'transferencia', label: 'Transferência' },
		{ value: 'bonificacao', label: 'Bonificação' }
	]
}

export const getStatusOptions = () => {
	return [
		{ value: 'pending', label: 'Pendente' },
		{ value: 'received', label: 'Recebido' },
		{ value: 'cancelled', label: 'Cancelado' }
	]
}

export const getNumberOfInstallmentsOptions = (count: number = 12) => {
	return Array.from({ length: count }, (_, index) => ({ value: (index + 1).toString(), label: (index + 1).toString() }))
}
