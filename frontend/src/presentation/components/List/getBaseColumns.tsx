import type { ColumnDefinition } from './ColumnDefinition'

export const getBaseColumns = (): ColumnDefinition<any>[] => {
	return baseColumns
}

export const baseColumns = [
	{
		key: 'number',
		header: 'N°',
		searchable: true,
		sortable: true,
		render: (value: any) => {
			if (typeof value === 'number') {
				return value.toString().padStart(3, '0')
			}
			return '-'
		},
		useRenderAsView: true
	}
]
