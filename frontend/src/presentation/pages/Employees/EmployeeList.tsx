import { useEffect, useState } from 'react'
import { BaseList } from '../../components/List/BaseList'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Employee } from '../../../infra/repository/EmployeeRepository'
import { EmptyList } from '../../components/List/EmptyList'
import { getColumns } from './getColumns'
import { useLoadRecords } from '../../hooks/useLoadRecords'
import { LoadingList } from '../../components/List/LoadingList'

interface EmployeeListProps {
	status?: string
	department?: string
	showButtonBar?: boolean
	hideEntityIcons?: boolean
	enableCheckboxes?: boolean
	enableSearch?: boolean
}

export const EmployeeList = ({
	status,
	department,
	showButtonBar = true,
	hideEntityIcons = false,
	enableCheckboxes = true,
	enableSearch = true
}: EmployeeListProps) => {
	const { employeeRepository } = useAppContext()
	const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
	const columns = getColumns()

	const {
		records: employees,
		loading,
		setRecords: setEmployees,
		invalidate
	} = useLoadRecords<Employee>({ entityName: 'employee', repository: employeeRepository, errorMessage: 'Erro ao carregar funcionários' })

	useEffect(() => {
		let filteredEmployees = employees

		if (status) {
			filteredEmployees = filteredEmployees.filter(employee => employee.status === status)
		}

		if (department) {
			filteredEmployees = filteredEmployees.filter(employee => employee.department === department)
		}

		setFilteredEmployees(filteredEmployees)
	}, [status, department, employees])

	const handleConfirmDelete = async (selected: Employee[]) => {
		await employeeRepository.deleteMany(selected)
		setEmployees(employees.filter(employee => !selected.includes(employee)))
		await invalidate()
	}

	if (loading) {
		return <LoadingList />
	}

	return (
		<div className="container-fluid px-0">
			{employees.length === 0 && !loading && (
				<EmptyList
					icon="bi bi-people-fill"
					title="Lista de Funcionários"
					description="Gerencie seus funcionários, cargos, departamentos e informações de contratação."
					entityFormPath="/employees/form"
					entitySingular="funcionário"
				/>
			)}
			{employees.length > 0 && (
				<BaseList
					columns={columns}
					data={filteredEmployees}
					enableCheckboxes={enableCheckboxes}
					enableSearch={enableSearch}
					searchPlaceholder="Buscar funcionários..."
					emptyMessage="Nenhum funcionário encontrado"
					loading={loading}
					className="bg-white rounded shadow-sm"
					entityFormPath="/employees/form"
					entityViewPath="/employees/view"
					entityKey="employee"
					confirmEntitySingular="funcionário"
					confirmEntityPlural="funcionários"
					onConfirmDelete={handleConfirmDelete}
					showButtonBar={showButtonBar}
					hideEntityIcons={hideEntityIcons}
				/>
			)}
		</div>
	)
}
