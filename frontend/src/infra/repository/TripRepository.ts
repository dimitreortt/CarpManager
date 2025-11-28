import { BaseRepository } from './BaseRepository'
import type { HttpClient } from '../http/HttpClient'

export type Trip = {
	id: string
	name: string
	number: number
	destination: string
	date: string
	numberOfTolls: number
	costOfTolls: number
	numberOfLunches: number
	costOfLunches: number
	costOfFuel: number
	numberOfServices: number
	costPerService?: number
	serviceCosts?: { id: string; cost: number }[]
	totalCost: number
	notes?: string
	estimate?: string
	createdAt: string
}

export class TripRepository extends BaseRepository<Trip> {
	constructor(httpClient: HttpClient<Trip>) {
		super('trips', httpClient)
	}
}
