import { useState, useMemo } from 'react'
import { sortData } from '../sortData'
import type { SortDirection } from '../BaseListContext'

export const useTableSort = <T extends Record<string, any>>(data: T[]) => {
	const [sortColumn, setSortColumn] = useState<keyof T | null>(null)
	const [sortDirection, setSortDirection] = useState<SortDirection>(null)

	const sortedData = useMemo(() => sortData(data, sortColumn, sortDirection), [data, sortColumn, sortDirection])

	const handleSort = (column: keyof T) => {
		if (sortColumn === column) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
		} else {
			setSortColumn(column)
			setSortDirection('asc')
		}
	}

	return {
		sortColumn,
		sortDirection,
		sortedData,
		handleSort
	}
}
