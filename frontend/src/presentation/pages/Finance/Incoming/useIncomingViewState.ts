import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAppContext } from '../../../../main/AppContextProvider'
import type { Incoming } from '../../../../infra/repository/IncomingRepository'

export const useIncomingViewState = () => {
	const { incomingRepository, showToast, navigate } = useAppContext()
	const location = useLocation()
	const [incoming, setIncoming] = useState<Incoming | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadIncoming = async () => {
			try {
				setLoading(true)

				const incomingFromState = location.state?.incoming as Incoming | undefined
				if (incomingFromState) {
					setIncoming(incomingFromState)
					setLoading(false)
					return
				}

				const urlParams = new URLSearchParams(location.search)
				const incomingId = urlParams.get('id')

				if (incomingId && incomingRepository) {
					const incomings = await incomingRepository.getAll()
					const foundIncoming = incomings.find(i => i.id === incomingId)

					if (foundIncoming) {
						setIncoming(foundIncoming)
					} else {
						showToast('Entrada não encontrada', 'error')
						navigate('/finance/incoming')
					}
				} else {
					showToast('ID da entrada não fornecido', 'error')
					navigate('/finance/incoming')
				}
			} catch (error) {
				console.error('Error loading incoming:', error)
				showToast('Erro ao carregar entrada', 'error')
				navigate('/finance/incoming')
			} finally {
				setLoading(false)
			}
		}

		loadIncoming()
	}, [location.state, location.search, incomingRepository, showToast, navigate])

	return { incoming, setIncoming, loading }
}
