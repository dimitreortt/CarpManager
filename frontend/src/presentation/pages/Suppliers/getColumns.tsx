import type { ColumnDefinition } from '../../components/List/ColumnDefinition'
import type { Supplier } from '../../../infra/repository/SupplierRepository'
import { getBaseColumns } from '../../components/List/getBaseColumns'

export const getColumns = (): ColumnDefinition<Supplier>[] => {
	return [
		...getBaseColumns(),
		{
			key: 'name' as keyof Supplier,
			header: 'Nome',
			sortable: false,
			searchable: true
		},
		{
			key: 'email' as keyof Supplier,
			header: 'Email',
			sortable: false,
			searchable: true
		},
		{
			key: 'phone' as keyof Supplier,
			header: 'Telefone',
			sortable: false,
			searchable: true
		},
		{
			key: 'city' as keyof Supplier,
			header: 'Cidade',
			sortable: false,
			searchable: true
		},
		{
			key: 'state' as keyof Supplier,
			header: 'Estado',
			sortable: false,
			searchable: true
		},
		{
			key: 'cnpj' as keyof Supplier,
			header: 'CNPJ',
			sortable: false,
			searchable: true
		}
	]
}
