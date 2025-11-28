import type { Employee } from '../../../infra/repository/EmployeeRepository'
import type { ColumnDefinition } from '../../components/List/ColumnDefinition'
import { renderCapitalize } from '../../service/renderCapitalize'
import { renderCurrency } from '../../service/renderCurrency'
import { renderDateField } from '../../service/renderDateField'
import { getBaseColumns } from '../../components/List/getBaseColumns'

export const getColumns = (): ColumnDefinition<Employee>[] => [
	...getBaseColumns(),
	{
		key: 'name',
		header: 'Nome',
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
		key: 'position',
		header: 'Cargo',
		sortable: false,
		searchable: true,
		render: (value: string | number | undefined) => {
			if (typeof value === 'string') {
				return renderCapitalize(value)
			}
			return '-'
		}
	},
	{
		key: 'department',
		header: 'Departamento',
		sortable: false,
		searchable: true,
		render: (value: string | number | undefined) => {
			if (typeof value === 'string') {
				return renderCapitalize(value)
			}
			return '-'
		}
	},
	{
		key: 'hireDate',
		header: 'Data de Contratação',
		sortable: false,
		render: renderDateField
	},
	{
		key: 'salary',
		header: 'Salário',
		sortable: false,
		render: (value: string | number | undefined) => {
			if (typeof value === 'number') {
				return renderCurrency(value)
			}
			return '-'
		}
	},
	{
		key: 'city',
		header: 'Cidade',
		sortable: false,
		searchable: true,
		render: (value: string | number | undefined) => {
			if (typeof value === 'string') {
				return renderCapitalize(value)
			}
			return '-'
		}
	},
	{
		key: 'phone',
		header: 'Telefone',
		searchable: true
	}
]
