import { useEntityViewState } from '../../../hooks/useEntityViewState'
import { useAppContext } from '../../../../main/AppContextProvider'
import type { Outgoing } from '../../../../infra/repository/OutgoingRepository'

export const useOutgoingViewState = () => {
	const { outgoingRepository } = useAppContext()
	const { entity, setEntity, loading } = useEntityViewState<Outgoing>({
		repository: {
			getById: outgoingRepository.getById
		},
		stateKey: 'outgoing',
		missingIdMessage: 'ID da saída não fornecido',
		navigateOnErrorTo: '/outgoing'
	})

	return { outgoing: entity, setOutgoing: setEntity, loading }
}
