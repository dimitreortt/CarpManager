import { createContext, useContext } from 'react'
import type { ColumnDefinition } from './ColumnDefinition'
import type { ActionItem } from './ActionItem'

export type SortDirection = 'asc' | 'desc' | null

export interface BaseListConfig<T = any> {
	columns: ColumnDefinition<T>[]
	entityViewPath?: string
	entityFormPath?: string
	entityKey?: string
	enableCheckboxes: boolean
	enableActions: boolean
	hideEntityIcons: boolean
	actions: ActionItem<T>[]
	onNavigate: (path: string, state?: any) => void
	renderCell: (column: ColumnDefinition<T>, row: T) => React.ReactNode
	renderSortIcon: (column: keyof T) => React.ReactNode
}

export interface BaseListState<T = any> {
	sortColumn: keyof T | null
	sortDirection: SortDirection
	selectedRows: Set<string>
	dropdownPos: { top: number; right: number; width: number; row: T } | null
	handleSort: (column: keyof T) => void
	handleRowSelect: (rowId: string, checked: boolean) => void
	handleSelectAll: (checked: boolean) => void
	handleMoreActionsClick: (row: T, e: React.MouseEvent<HTMLButtonElement>) => void
	closeDropdown: () => void
	dropdownRef: React.RefObject<HTMLDivElement | null>
	getRowId: (row: T, index: number) => string
}

const BaseListConfigContext = createContext<BaseListConfig | null>(null)
const BaseListStateContext = createContext<BaseListState | null>(null)

export const useBaseListConfig = <T = any,>() => {
	const context = useContext(BaseListConfigContext)
	if (!context) {
		throw new Error('useBaseListConfig must be used within BaseListProvider')
	}
	return context as BaseListConfig<T>
}

export const useBaseListState = <T = any,>() => {
	const context = useContext(BaseListStateContext)
	if (!context) {
		throw new Error('useBaseListState must be used within BaseListProvider')
	}
	return context as BaseListState<T>
}

export const BaseListProvider = <T,>({
	children,
	config,
	state
}: {
	children: React.ReactNode
	config: BaseListConfig<T>
	state: BaseListState<T>
}) => {
	return (
		<BaseListConfigContext.Provider value={config}>
			<BaseListStateContext.Provider value={state}>{children}</BaseListStateContext.Provider>
		</BaseListConfigContext.Provider>
	)
}
