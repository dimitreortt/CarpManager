import type { RenderValue } from './renderDateField'

export const renderCurrency = (value: RenderValue) => {
	if (typeof value === 'number') {
		return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
	}
	return '-'
}
