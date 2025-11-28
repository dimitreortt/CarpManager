import type { ReactNode } from 'react'
import type { BaseRepository } from '../../../infra/repository/BaseRepository'

export interface ColumnDefinition<T> {
	key: keyof T
	header: string
	render?: (value: T[keyof T], row: T) => ReactNode
	renderView?: (value: T[keyof T], row: T) => ReactNode
	useRenderAsView?: boolean
	sortable?: boolean
	hide?: boolean
	width?: string
	minWidth?: string
	searchable?: boolean
	type?: 'text' | 'number' | 'currency' | 'date' | 'status' | 'boolean' | 'array' | 'description' | 'notes' | 'objectMultiSelect' | 'select'
	selectConfig?: {
		repository: string
		itemName: string
		viewPath: string
		editPath: string
	}
	objectMultiSelectConfig?: {
		labelFeminine?: boolean
		repository: BaseRepository<any>
		itemName: string
		viewPath: string
		editPath: string
		extraDisplayFields?: {
			key: string
			render: (value: T[keyof T], row: T) => ReactNode
		}[]
	}
	statusConfig?: {
		[key: string]: {
			label: string
			class: string
		}
	}
}
