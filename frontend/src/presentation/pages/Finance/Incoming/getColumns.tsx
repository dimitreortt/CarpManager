import type { Incoming } from '../../../../infra/repository/IncomingRepository'
import type { Estimate } from '../../../../infra/repository/EstimateRepository'
import type { ColumnDefinition } from '../../../components/List/ColumnDefinition'
import { renderDateField } from '../../../service/renderDateField'
import { getPaymentMethodOptions } from './getOptions'
import { renderOption } from '../../../service/renderOption'
import type { Client } from '../../../../infra/repository/ClientRepository'
import { getBaseColumns } from '../../../components/List/getBaseColumns'

type IncomingColumns = ColumnDefinition<Incoming>[]

export const useIncomingColumns = (): { columns: IncomingColumns } => {
	return { columns: getColumns() }
}

type renderParam = number | string | undefined | Client | Estimate

export const getColumns = (): ColumnDefinition<Incoming>[] => {
	return [
		...getBaseColumns(),
		{
			key: 'name',
			header: 'Título',
			searchable: true
		},
		{
			key: 'clientId',
			header: 'Cliente',
			sortable: false,
			searchable: true,
			render: (value: renderParam, row: Incoming) => {
				return row.client?.name || '-'
			},
			useRenderAsView: true
		},
		{
			key: 'estimate',
			header: 'Orçamento',
			searchable: true,
			type: 'select',
			render: (value: renderParam, row: Incoming) => {
				return row.estimate?.name || '-'
			}
		},
		{
			key: 'amount',
			header: 'Valor',
			sortable: false,
			render: (value: renderParam) => {
				if (typeof value === 'number') {
					return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
				}
				if (typeof value === 'string') {
					return value
				}
				return '-'
			},
			useRenderAsView: true
		},
		{
			key: 'paymentMethod',
			header: 'Método de Pagamento',
			searchable: true,
			type: 'select',
			render: (value: renderParam) => {
				const options = getPaymentMethodOptions()
				return renderOption(value as string, options)
			},
			useRenderAsView: true
		},
		{
			key: 'date',
			header: 'Data do Vencimento',
			sortable: true,
			render: (value: renderParam, row: Incoming) => {
				return renderDateField(row.date)
			}
		}
	]
}
