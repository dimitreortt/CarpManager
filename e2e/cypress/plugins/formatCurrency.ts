export const formatCurrency = (price: number | undefined | string) => {
	if (!price) price = 0
	return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price as number)
}
