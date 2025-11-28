import { useState, useMemo } from 'react'
import { searchData } from '../searchData'
import type { ColumnDefinition } from '../ColumnDefinition'

export const useTableSearch = <T extends Record<string, any>>(data: T[], columns: ColumnDefinition<T>[]) => {
	const [searchTerm, setSearchTerm] = useState('')

	const filteredData = useMemo(() => searchData(data, searchTerm, columns), [data, searchTerm, columns])

	const clearSearch = () => setSearchTerm('')

	return {
		searchTerm,
		setSearchTerm,
		filteredData,
		clearSearch
	}
}
