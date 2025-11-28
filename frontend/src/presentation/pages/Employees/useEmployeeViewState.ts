import { useEntityViewState } from '../../hooks/useEntityViewState'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Employee } from '../../../infra/repository/EmployeeRepository'

export const useEmployeeViewState = () => {
	const { employeeRepository } = useAppContext()
	const { entity, setEntity, loading } = useEntityViewState<Employee>({
		repository: {
			getById: employeeRepository.getById
		},
		stateKey: 'employee',
		missingIdMessage: 'ID do funcionário não fornecido',
		navigateOnErrorTo: '/employees'
	})

	return { employee: entity, setEmployee: setEntity, loading }
}
