import { useEntityViewState } from '../../hooks/useEntityViewState'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Estimate } from '../../../infra/repository/EstimateRepository'

export const useEstimatesViewState = () => {
	const { estimateRepository } = useAppContext()
	const { entity, setEntity, loading } = useEntityViewState<Estimate>({
		repository: {
			getById: estimateRepository.getById
		},
		stateKey: 'estimate',
		missingIdMessage: 'ID do orçamento não fornecido',
		navigateOnErrorTo: '/estimates'
	})

	return { estimate: entity, setEstimate: setEntity, loading }
}
