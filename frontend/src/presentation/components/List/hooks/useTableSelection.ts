import { useState, useMemo, useCallback } from 'react'

export const useTableSelection = <T extends Record<string, any>>(
	data: T[],
	getRowId: (row: T, index: number) => string,
	onSelectionChange?: (selected: T[]) => void
) => {
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

	const selectedData = useMemo(() => {
		if (selectedRows.size === 0) return []
		return Array.from(selectedRows)
			.map(id => {
				const index = parseInt(id.split('-')[1])
				return data[index]
			})
			.filter(Boolean)
	}, [selectedRows, data])

	const handleRowSelect = useCallback(
		(rowId: string, checked: boolean) => {
			const newSelected = new Set(selectedRows)
			if (checked) {
				newSelected.add(rowId)
			} else {
				newSelected.delete(rowId)
			}
			setSelectedRows(newSelected)

			if (onSelectionChange) {
				onSelectionChange(selectedData)
			}
		},
		[selectedRows, selectedData, onSelectionChange]
	)

	const handleSelectAll = useCallback(
		(checked: boolean) => {
			if (checked) {
				const allRowIds = data.map((row, index) => getRowId(row, index))
				setSelectedRows(new Set(allRowIds))
				if (onSelectionChange) {
					onSelectionChange(data)
				}
			} else {
				setSelectedRows(new Set())
				if (onSelectionChange) {
					onSelectionChange([])
				}
			}
		},
		[data, onSelectionChange, getRowId]
	)

	const clearSelection = () => setSelectedRows(new Set())

	return {
		selectedRows,
		selectedData,
		handleRowSelect,
		handleSelectAll,
		clearSelection
	}
}
