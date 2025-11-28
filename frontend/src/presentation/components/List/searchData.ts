export const searchData = (data: any[], searchTerm: string, columns: any[]) => {
	if (!searchTerm.trim()) return data

	const searchLower = searchTerm.toLowerCase()

	return data.filter(row => {
		return columns.some(column => {
			if (column.searchable === false) return false

			const value = row[column.key]
			if (value === null || value === undefined) return false

			const stringValue = String(value).toLowerCase()
			return stringValue.includes(searchLower)
		})
	})
}
