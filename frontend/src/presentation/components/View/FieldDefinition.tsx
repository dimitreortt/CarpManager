import type { ReactNode } from 'react'

export interface FieldDefinition<T> {
	key: keyof T
	label: string
	render?: (value: T[keyof T], record: T) => ReactNode
	renderView?: (value: T[keyof T], record: T) => ReactNode
	width?: string
	className?: string
	type?: 'text' | 'number' | 'currency' | 'date' | 'status' | 'boolean' | 'array' | 'description' | 'notes' | 'objectMultiSelect' | 'select'
	statusConfig?: Record<string, { label: string; class: string }>
	objectMultiSelectConfig?: {
		repository: { getAll: () => Promise<any[]> }
		itemName: string
		viewPath: string
		editPath: string
		extraDisplayFields?: string[]
	}
	useRenderAsView?: boolean
	hide?: boolean
}
