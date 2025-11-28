import { BaseRepository } from './BaseRepository'
import type { HttpClient } from '../http/HttpClient'

export type Employee = {
	id: string
	name: string
	number: number
	code: string
	email: string
	phone: string
	position: string
	department: string
	hireDate: string
	salary: number
	status: 'active' | 'inactive' | 'on_leave'
	address?: string
	city: string
	state: string
	emergencyContact?: string
	emergencyPhone?: string
	bankAccount?: string
	bankBranch?: string
	bankCode?: string
	notes?: string
	createdAt: string
}

export class EmployeeRepository extends BaseRepository<Employee> {
	constructor(httpClient: HttpClient<Employee>) {
		super('employees', httpClient)
	}
}
