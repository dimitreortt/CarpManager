import type { Quote } from '../../../infra/repository/QuoteRepository'
import type { ColumnDefinition } from '../../components/List/ColumnDefinition'
import type { Estimate } from '../../../infra/repository/EstimateRepository'
import { renderDateField } from '../../service/renderDateField'
import { getBaseColumns } from '../../components/List/getBaseColumns'
import type { Supplier } from '../../../infra/repository/SupplierRepository'
import { formatPrice } from '../../service/formatPrice'

type renderParam = number | string | undefined | Supplier | Estimate

export const getColumns = (): ColumnDefinition<Quote>[] => {
	return [
		...getBaseColumns(),
		{
			key: 'name',
			header: 'Nome',
			sortable: false,
			searchable: true
		},
		{
			key: 'description',
			header: 'Descrição',
			searchable: true
		},
		{
			key: 'amount',
			header: 'Valor',
			sortable: false,
			searchable: true,
			render: (value: renderParam, row: Quote) => {
				if (typeof value === 'number') {
					return formatPrice(value)
				}
				return '-'
			},
			useRenderAsView: true
		},
		{
			key: 'supplier',
			header: 'Fornecedor',
			sortable: false,
			searchable: true,
			render: (value: renderParam, row: Quote) => {
				return row.supplier?.name || '-'
			},
			useRenderAsView: true
		},
		{
			key: 'estimate',
			header: 'Orçamento',
			sortable: false,
			searchable: true,
			render: (value: renderParam, row: Quote) => {
				return row.estimate?.name || '-'
			},
			useRenderAsView: true
		},
		{
			key: 'date',
			header: 'Data',
			sortable: false,
			render: (value: renderParam, row: Quote) => {
				return renderDateField(row.date)
			}
		}
	]
}
