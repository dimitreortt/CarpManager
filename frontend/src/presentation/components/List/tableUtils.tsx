import { ChevronUp, ChevronDown } from 'lucide-react'
import type { ColumnDefinition } from './ColumnDefinition'
import type { SortDirection } from './BaseListContext'

export const getRowId = <T extends Record<string, any>>(row: T, index: number): string => {
	const key = row.id || row.key || row.name || index
	return `row-${index}-${key}`
}

export const renderSortIcon = <T,>(column: keyof T, sortColumn: keyof T | null, sortDirection: SortDirection) => {
	if (sortColumn !== column) {
		return <ChevronUp className="text-muted opacity-50" size={16} />
	}
	return sortDirection === 'asc' ? <ChevronUp className="text-primary" size={16} /> : <ChevronDown className="text-primary" size={16} />
}

export const renderCell = <T,>(column: ColumnDefinition<T>, row: T) => {
	const value = row[column.key]
	if (column.render) {
		return column.render(value, row)
	}
	if (value === null || value === undefined || value === '') {
		return <span className="text-muted">-</span>
	}
	return String(value)
}

