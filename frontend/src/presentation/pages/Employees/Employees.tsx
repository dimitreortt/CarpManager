import { EmployeeList } from './EmployeeList'
import { BaseListPage } from '../../components/List/BaseListPage'

export const Employees = () => {
	return (
		<BaseListPage title="Funcionários" description="Gerencie seus funcionários, cargos, departamentos e informações de contratação.">
			<EmployeeList />
		</BaseListPage>
	)
}
