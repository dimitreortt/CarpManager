type Installment = {
	amount: number
	date: string
	paymentMethod: string
}

export type CreateOrderData = {
	estimateName: string
	paymentMethod: string
	signReceived: number
	orderDueDate: Date
	installments: Installment[]
	clientId?: string
}
