export const sortData = (filteredData: any[], sortColumn: any, sortDirection: any) => {
	if (!sortColumn || !sortDirection) return filteredData

	return [...filteredData].sort((a, b) => {
		const aValue = a[sortColumn]
		const bValue = b[sortColumn]

		if (aValue === null || aValue === undefined) return 1
		if (bValue === null || bValue === undefined) return -1

		let comparison = 0
		if (typeof aValue === 'string' && typeof bValue === 'string') {
			comparison = aValue.localeCompare(bValue, 'pt-BR')
		} else if (typeof aValue === 'number' && typeof bValue === 'number') {
			comparison = aValue - bValue
		} else {
			comparison = String(aValue).localeCompare(String(bValue), 'pt-BR')
		}

		return sortDirection === 'asc' ? comparison : -comparison
	})
}
