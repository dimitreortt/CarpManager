import { useEntityViewState } from '../../hooks/useEntityViewState'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Supplier } from '../../../infra/repository/SupplierRepository'

export const useSupplierViewState = () => {
	const { supplierRepository } = useAppContext()
	const { entity, setEntity, loading } = useEntityViewState<Supplier>({
		repository: {
			getById: supplierRepository.getById
		},
		stateKey: 'supplier',
		missingIdMessage: 'ID do fornecedor não fornecido',
		navigateOnErrorTo: '/suppliers'
	})

	return { supplier: entity, setSupplier: setEntity, loading }
}
