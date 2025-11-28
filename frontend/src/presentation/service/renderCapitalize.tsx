export const renderCapitalize = (value: string | number | undefined) => {
	if (typeof value === 'string') {
		return value.charAt(0).toUpperCase() + value.slice(1)
	}
	return value
}
