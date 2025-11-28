import { useAppContext } from '../../../main/AppContextProvider'
import type { Material } from '../../../infra/repository/MaterialRepository'
import { useEntityViewState } from '../../hooks/useEntityViewState'

export const useMaterialViewState = () => {
	const { materialRepository } = useAppContext()
	const { entity, setEntity, loading } = useEntityViewState<Material>({
		repository: {
			getById: materialRepository.getById
		},
		stateKey: 'material',
		missingIdMessage: 'ID do material não fornecido',
		navigateOnErrorTo: '/materials'
	})

	return { material: entity, setMaterial: setEntity, loading }
}
