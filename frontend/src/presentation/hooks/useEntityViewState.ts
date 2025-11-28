import { useEffect, useState } from 'react'
import { useAppContext } from '../../main/AppContextProvider'

export const useEntityViewState = <T>({
	repository,
	stateKey,
	missingIdMessage = 'ID não encontrado',
	navigateOnErrorTo = '/'
}: {
	repository: {
		getById: (id: string) => Promise<T | null>
	}
	stateKey: string
	missingIdMessage: string
	navigateOnErrorTo: string
}) => {
	const { location, showToast, navigate } = useAppContext()
	const [entity, setEntity] = useState<T | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadEntity = async () => {
			try {
				setLoading(true)

				const entityFromState = location.state?.[stateKey] as T | undefined
				if (entityFromState) {
					setEntity(entityFromState)
					setLoading(false)
					return
				}

				const urlParams = new URLSearchParams(location.search)
				const id = urlParams.get('id')

				if (!id || !repository) {
					return
				}

				const entity = await repository.getById(id)
				if (!entity) {
					showToast('Entidade não encontrada', 'error')
					navigate(navigateOnErrorTo)
					return
				}
				setEntity(entity)
				setLoading(false)
			} catch (error) {
				console.error('Error loading entity:', error)
				setLoading(false)
			} finally {
				setLoading(false)
			}
		}

		loadEntity()
	}, [])

	return { entity, setEntity, loading }
}
