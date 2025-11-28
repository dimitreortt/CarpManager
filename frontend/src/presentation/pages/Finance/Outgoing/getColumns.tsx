import type { Client } from '../../../../infra/repository/ClientRepository'
import type { Supplier } from '../../../../infra/repository/SupplierRepository'
import type { Outgoing } from '../../../../infra/repository/OutgoingRepository'
import type { ColumnDefinition } from '../../../components/List/ColumnDefinition'
import { getBaseColumns } from '../../../components/List/getBaseColumns'
import { renderOption } from '../../../service/renderOption'
import { getPaymentMethodOptions, type PaymentMethod } from '../Incoming/getOptions'
import { renderDateField } from '../../../service/renderDateField'
import { outgoingStatuses } from './outgoingStatuses'
import { outgoingCategories } from './outgoingCategories'
import type { Employee } from '../../../../infra/repository/EmployeeRepository'

type OutgoingColumns = ColumnDefinition<Outgoing>[]

type renderParam = number | string | undefined | Client | Supplier | Employee | PaymentMethod

export const useOutgoingColumns = (): { columns: OutgoingColumns } => {
	return { columns: getColumns() }
}

export const getColumns = (): ColumnDefinition<Outgoing>[] => {
	return [
		...getBaseColumns(),
		{
			key: 'name',
			header: 'Nome',
			sortable: false,
			searchable: true
		},
		{
			key: 'supplier',
			header: 'Fornecedor',
			sortable: false,
			searchable: true,
			render: (value: renderParam, row: Outgoing) => {
				return row.supplier?.name || '-'
			},
			useRenderAsView: true
		},
		{
			key: 'amount',
			header: 'Valor',
			sortable: false,
			render: (value: renderParam, row: Outgoing) => {
				if (typeof value === 'number') {
					return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
				}
				return '-'
			},
			useRenderAsView: true
		},
		{
			key: 'paymentMethod',
			header: 'Método de Pagamento',
			sortable: false,
			render: (value: renderParam) => {
				return renderOption(value as string, getPaymentMethodOptions())
			},
			useRenderAsView: true
		},
		{
			key: 'category',
			header: 'Categoria',
			sortable: false,
			searchable: true,
			render: (value: renderParam) => {
				const category = renderOption(value as string, outgoingCategories)
				if (category.includes('Fixo')) {
					return 'Gastos Fixos'
				}
				return category
			},
			useRenderAsView: true
		},
		{
			key: 'date',
			header: 'Data',
			render: (value: renderParam) => {
				return renderDateField(value as string)
			},
			useRenderAsView: true
		},
		{
			key: 'accountType',
			header: 'Tipo de Conta',
			sortable: false,
			searchable: true
		},
		{
			key: 'description',
			header: 'Descrição',
			sortable: false,
			searchable: true
		}
	]
}
