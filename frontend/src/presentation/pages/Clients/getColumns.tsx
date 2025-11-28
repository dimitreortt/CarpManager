import type { Client } from '../../../infra/repository/ClientRepository'
import type { ColumnDefinition } from '../../components/List/ColumnDefinition'
import { getBaseColumns } from '../../components/List/getBaseColumns'

const renderStatus = (value: string | undefined) => {
	return <span className={`badge ${value === 'active' ? 'bg-success' : 'bg-secondary'}`}>{value === 'active' ? 'Ativo' : 'Inativo'}</span>
}

export const getColumns = (): ColumnDefinition<Client>[] => {
	return [
		...getBaseColumns(),
		{
			key: 'name',
			header: 'Nome',
			sortable: false,
			searchable: true
		},
		{
			key: 'contactPerson',
			header: 'Representante',
			sortable: false,
			searchable: true
		},
		{
			key: 'email',
			header: 'Email',
			sortable: false,
			searchable: true
		},
		{
			key: 'phone',
			header: 'Telefone',
			searchable: true
		},
		{
			key: 'city',
			header: 'Cidade',
			sortable: false,
			searchable: true
		},
		{
			key: 'address',
			header: 'Endereço',
			searchable: true
		},
		{
			key: 'deliveryAddress',
			header: 'Endereço de Entrega',
			searchable: true
		}
	]
}
