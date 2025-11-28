import { Layout } from '../../components/Layout/Layout'
import { BaseView } from '../../components/View/BaseView'
import { convertColumnsToFields } from '../../components/View/convertColumnToField'
import type { FieldDefinition } from '../../components/View/FieldDefinition'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Employee } from '../../../infra/repository/EmployeeRepository'
import { getColumns } from './getColumns'
import { useEmployeeViewState } from './useEmployeeViewState'

export const EmployeeView = () => {
	const { navigate } = useAppContext()
	const { employee, loading } = useEmployeeViewState()

	const handleEdit = () => {
		navigate('/employees/form', { state: { employee } })
	}

	const baseFields = convertColumnsToFields(getColumns())
	const additionalFields: FieldDefinition<Employee>[] = [
		{
			key: 'notes',
			label: 'Observações',
			type: 'notes'
		}
	]

	const fields = [...baseFields, ...additionalFields]

	return (
		<Layout>
			<BaseView
				record={employee || ({} as Employee)}
				fields={fields as FieldDefinition<Employee>[]}
				loading={loading}
				title={`Detalhes do Funcionário`}
				subtitle={employee ? `Funcionário ${employee.name}` : undefined}
				onEdit={handleEdit}
				emptyMessage={`Funcionário não encontrado`}
			/>
		</Layout>
	)
}
