import { useEntityViewState } from '../../hooks/useEntityViewState'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Client } from '../../../infra/repository/ClientRepository'

export const useClientViewState = () => {
	const { clientRepository } = useAppContext()
	const { entity, setEntity, loading } = useEntityViewState<Client>({
		repository: {
			getById: clientRepository.getById
		},
		stateKey: 'client',
		missingIdMessage: 'ID do cliente não fornecido',
		navigateOnErrorTo: '/clients'
	})

	return { client: entity, setClient: setEntity, loading }
}
