import type { Material } from '../../../infra/repository/MaterialRepository'
import type { ColumnDefinition } from '../../components/List/ColumnDefinition'
import type { FieldDefinition } from '../../components/View/FieldDefinition'
import { getBaseColumns } from '../../components/List/getBaseColumns'

export const getColumns = (): ColumnDefinition<Material>[] => {
	return [
		...getBaseColumns(),
		{
			key: 'name',
			header: 'Nome',
			sortable: false,
			searchable: true
		},
		{
			key: 'code',
			header: 'Código do Fabricante',
			sortable: false,
			searchable: true
		},
		{
			key: 'price',
			header: 'Preço',
			sortable: false,
			searchable: true,
			render: value => (value ? `R$ ${Number(value).toFixed(2)}` : '-'),
			useRenderAsView: true
		},
		{
			key: 'supplier',
			header: 'Fornecedor',
			sortable: false,
			searchable: true,
			type: 'select' as FieldDefinition<Material>['type'],
			render: (value, row) => {
				return row.supplier?.name
			}
		},
		{
			key: 'description',
			header: 'Descrição',
			sortable: false,
			searchable: true
		}
	]
}
