import { useAppContext } from '../../../main/AppContextProvider'
import type { Trip } from '../../../infra/repository/TripRepository'
import { useEntityViewState } from '../../hooks/useEntityViewState'

export const useTripViewState = () => {
	const { tripRepository } = useAppContext()
	const { entity, setEntity, loading } = useEntityViewState<Trip>({
		repository: {
			getById: tripRepository.getById
		},
		stateKey: 'trip',
		missingIdMessage: 'ID da viagem não fornecido',
		navigateOnErrorTo: '/trips'
	})

	return { trip: entity, setTrip: setEntity, loading }
}
