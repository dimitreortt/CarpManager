import { BaseRepository } from './BaseRepository'
import type { HttpClient } from '../http/HttpClient'
import type { Supplier } from './SupplierRepository'
import type { PaymentMethod } from '../../presentation/pages/Finance/Incoming/getOptions'
import type { Employee } from './EmployeeRepository'

export type Outgoing = {
	id: string
	number: number
	name: string
	date: string
	paymentMethod: PaymentMethod
	description: string
	category: 'light' | 'fixed' | 'other'
	amount: number
	accountType: string
	status: 'pending' | 'paid' | 'overdue' | 'posted'
	supplier: Supplier
	supplierId?: string
	employee: Employee
	employeeId?: string
	createdAt: string
}

export class OutgoingRepository extends BaseRepository<Outgoing> {
	constructor(httpClient: HttpClient<Outgoing>) {
		super('outgoings', httpClient)
	}

	lookupAccountType = async (searchTerm: string) => {
		const types: any = await this.httpClient.post('/outgoings/get-account-types', { searchTerm })
		return types
	}
}
