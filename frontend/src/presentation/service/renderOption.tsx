export const renderOption = (value: string | number | undefined, options: { value: string; label: string }[]) => {
	if (typeof value === 'string' && value) {
		const option = options.find(option => option.value === value)
		return option?.label || '-'
	}
	return '-'
}
