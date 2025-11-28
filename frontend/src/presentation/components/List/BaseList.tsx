import { useMemo } from 'react'
import { useAppContext } from '../../../main/AppContextProvider'
import type { ColumnDefinition } from './ColumnDefinition'
import type { ActionItem } from './ActionItem'
import { LoadingList } from './LoadingList'
import { BaseListProvider } from './BaseListContext'
import { useTableSearch } from './hooks/useTableSearch'
import { useTableSort } from './hooks/useTableSort'
import { useTableSelection } from './hooks/useTableSelection'
import { useDropdownMenu } from './hooks/useDropdownMenu'
import { useDeleteModal } from './hooks/useDeleteModal'
import { getRowId, renderSortIcon, renderCell } from './tableUtils.tsx'
import { TableSearchBar } from './TableSearchBar'
import { TableButtonBar } from './TableButtonBar'
import { TableHeader } from './TableHeader'
import { TableRow } from './TableRow'
import { EmptyTableRow } from './EmptyTableRow'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'

export type BaseListControls = {
	enableCheckboxes?: boolean
	enableSearch?: boolean
	showButtonBar?: boolean
}

export interface BaseListProps<T> {
	columns: ColumnDefinition<T>[]
	data: T[]
	enableCheckboxes?: boolean
	enableActions?: boolean
	enableSearch?: boolean
	searchPlaceholder?: string
	actions?: ActionItem<T>[]
	onSelectionChange?: (selectedRows: T[]) => void
	className?: string
	emptyMessage?: string
	loading?: boolean
	entityFormPath?: string
	entityViewPath?: string
	entityKey?: string
	confirmDeleteTitle?: string
	confirmDeleteConfirmText?: string
	confirmDeleteVariant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
	confirmEntitySingular?: string
	confirmEntityPlural?: string
	onConfirmDelete?: (selected: T[]) => void
	showButtonBar?: boolean
	hideEntityIcons?: boolean
	confirmDeleteMessage?: string
}

export const BaseList = <T extends Record<string, any>>({
	columns,
	data,
	enableCheckboxes = false,
	enableActions = false,
	enableSearch = false,
	searchPlaceholder = 'Buscar...',
	actions = [],
	onSelectionChange,
	className = '',
	emptyMessage = 'Nenhum item encontrado',
	loading = false,
	entityFormPath,
	entityViewPath,
	entityKey,
	confirmDeleteTitle = 'Confirmar Exclusão',
	confirmDeleteConfirmText = 'Excluir',
	confirmDeleteVariant = 'danger',
	confirmEntitySingular = 'item',
	confirmEntityPlural = 'itens',
	onConfirmDelete,
	showButtonBar = true,
	hideEntityIcons = false,
	confirmDeleteMessage
}: BaseListProps<T>) => {
	const { navigate, showToast } = useAppContext()

	const { searchTerm, setSearchTerm, filteredData, clearSearch } = useTableSearch(data, columns)
	const { sortColumn, sortDirection, sortedData, handleSort } = useTableSort(filteredData)
	const { selectedRows, handleRowSelect, handleSelectAll, clearSelection } = useTableSelection(sortedData, getRowId, onSelectionChange)
	const { dropdownPos, dropdownRef, closeDropdown, handleMoreActionsClick } = useDropdownMenu<T>()
	const { showDeleteModal, rowsToDelete, deleteLoading, setDeleteLoading, openDeleteModal, closeDeleteModal } = useDeleteModal<T>()

	const handleDuplicate = (row: T) => {
		const appendSymbol = entityFormPath?.includes('?') ? '&' : '?'
		navigate(`${entityFormPath}${appendSymbol}id=${row.id}&duplicate=true`, { state: { [entityKey || 'entity']: row } })
	}

	const handleDelete = async (rows: T[]) => {
		try {
			setDeleteLoading(true)
			await onConfirmDelete?.(rows)
			showToast('Itens deletados com sucesso', 'success')
			clearSelection()
		} catch (error) {
			console.error('Error deleting items:', error)
			showToast('Erro ao deletar itens', 'error')
		} finally {
			setDeleteLoading(false)
			closeDeleteModal()
		}
	}

	const config = useMemo(
		() => ({
			columns,
			entityViewPath,
			entityFormPath,
			entityKey,
			enableCheckboxes,
			enableActions,
			hideEntityIcons,
			actions,
			onNavigate: navigate,
			renderCell,
			renderSortIcon: (column: keyof T) => renderSortIcon(column, sortColumn as keyof T | null, sortDirection)
		}),
		[
			columns,
			entityViewPath,
			entityFormPath,
			entityKey,
			enableCheckboxes,
			enableActions,
			hideEntityIcons,
			actions,
			navigate,
			sortColumn,
			sortDirection
		]
	)

	const state = useMemo(
		() => ({
			sortColumn: sortColumn as keyof T | null,
			sortDirection,
			selectedRows,
			dropdownPos,
			handleSort,
			handleRowSelect,
			handleSelectAll,
			handleMoreActionsClick,
			closeDropdown,
			dropdownRef,
			getRowId
		}),
		[
			sortColumn,
			sortDirection,
			selectedRows,
			dropdownPos,
			handleSort,
			handleRowSelect,
			handleSelectAll,
			handleMoreActionsClick,
			closeDropdown,
			dropdownRef
		]
	)

	if (loading) {
		return <LoadingList />
	}

	const showEntityIcons = Boolean(entityViewPath || entityFormPath)

	return (
		<BaseListProvider config={config} state={state}>
			<div className={className}>
				{enableSearch && (
					<TableSearchBar
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						searchPlaceholder={searchPlaceholder}
						filteredCount={filteredData.length}
						totalCount={data.length}
						onClear={clearSearch}
					/>
				)}

				{(entityFormPath || onConfirmDelete) && showButtonBar && (
					<TableButtonBar
						entityFormPath={entityFormPath}
						sortedData={sortedData}
						onNavigate={navigate}
						onDuplicate={entityFormPath ? handleDuplicate : undefined}
						onDelete={openDeleteModal}
					/>
				)}

				<div className="table-responsive">
					<table className="table table-hover mb-0">
						<TableHeader showEntityIcons={showEntityIcons} dataLength={sortedData.length} />
						<tbody>
							{sortedData.length === 0 ? (
								<EmptyTableRow
									message={searchTerm ? 'Nenhum resultado encontrado para a busca.' : emptyMessage}
									showEntityIcons={showEntityIcons}
								/>
							) : (
								sortedData.map((row, index) => {
									const rowId = getRowId(row, index)
									const isSelected = selectedRows.has(rowId)

									return (
										<TableRow
											key={rowId}
											row={row}
											index={index}
											rowId={rowId}
											isSelected={isSelected}
											showEntityIcons={showEntityIcons}
										/>
									)
								})
							)}
						</tbody>
					</table>
				</div>

				{onConfirmDelete && (
					<DeleteConfirmationModal
						isOpen={showDeleteModal}
						rows={rowsToDelete}
						loading={deleteLoading}
						confirmDeleteTitle={confirmDeleteTitle}
						confirmDeleteMessage={confirmDeleteMessage}
						confirmEntitySingular={confirmEntitySingular}
						confirmEntityPlural={confirmEntityPlural}
						confirmDeleteVariant={confirmDeleteVariant}
						confirmDeleteConfirmText={confirmDeleteConfirmText}
						onClose={closeDeleteModal}
						onConfirm={handleDelete}
					/>
				)}
			</div>
		</BaseListProvider>
	)
}
