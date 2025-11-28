export type RenderValue = string | number | undefined | { cost: number }[] | { id: string; value: number }[]

export const renderDateField = (value: RenderValue) => {
	if (typeof value === 'string' && value !== '') {
		const date = new Date(value)
		date.setHours(date.getHours() + 3)
		return date.toLocaleDateString('pt-BR')
	}
	return '-'
}
