import type { ReactNode } from 'react'
import type { FieldDefinition } from './FieldDefinition'

export const convertColumnsToFields = <T extends Record<string, any>>(
	columns: Array<{
		key: keyof T
		header: string
		render?: (value: any, row: T) => ReactNode
		renderView?: (value: any, row: T) => ReactNode
		sortable?: boolean
		searchable?: boolean
		width?: string
		className?: string
		type?: FieldDefinition<T>['type']
		statusConfig?: Record<string, { label: string; class: string }>
		objectMultiSelectConfig?: {
			repository: { getAll: () => Promise<any[]> }
			itemName: string
			viewPath: string
			editPath: string
		}
		useRenderAsView?: boolean
		hide?: boolean
	}>
): FieldDefinition<T>[] => {
	return columns.map(column => ({
		key: column.key,
		label: column.header,
		render: column.render,
		renderView: column.renderView,
		width: column.width,
		className: column.className,
		type: column.type || 'text',
		statusConfig: column.statusConfig,
		objectMultiSelectConfig: column.objectMultiSelectConfig,
		useRenderAsView: column.useRenderAsView,
		hide: column.hide
	}))
}
