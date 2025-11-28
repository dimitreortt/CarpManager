import type { Estimate } from '../../../infra/repository/EstimateRepository'
import { useAppContext } from '../../../main/AppContextProvider'
import { useLoadRecords } from '../../hooks/useLoadRecords'
import { EstimatesList } from '../Estimates/EstimatesList'
import { TabPage } from '../Finance/TabPage'
import { BackButton } from '../../components/Buttons/BackButton'
import { useEffect, useState } from 'react'
import type { Client } from '../../../infra/repository/ClientRepository'

export const ClientEstimatesList = () => {
	const { clientRepository, searchParams, location, estimateRepository } = useAppContext()
	const clientId = searchParams.get('clientId')
	const [client, setClient] = useState<Client | null>(null)

	useEffect(() => {
		const loadClient = async () => {
			const client = await clientRepository.getById(clientId || '')
			setClient(client)
		}

		if (location.state) {
			setClient(location.state.client as Client)
		} else {
			loadClient()
		}
	}, [clientId, clientRepository])

	const { records: estimates, setRecords: setEstimates } = useLoadRecords<Estimate>({
		repository: estimateRepository,
		options: { clientId },
		errorMessage: 'Erro ao carregar orçamentos'
	})

	const tabs = [
		{
			label: 'Orçamentos',
			icon: 'bi bi-calculator-fill',
			code: 'estimates'
		},
		{
			label: 'Pedidos',
			icon: 'bi bi-cart-fill',
			code: 'orders'
		}
	]

	const tabContent = [
		<EstimatesList status="pending" enableCheckboxes={false} enableSearch={false} showButtonBar={false} />,
		<EstimatesList status="accepted" enableCheckboxes={false} enableSearch={false} showButtonBar={false} />
	]

	return (
		<TabPage
			tabs={tabs}
			tabContent={tabContent}
			defaultTab="estimates"
			title="Orçamentos/Pedidos"
			subtitle={client?.name || ''}
			backButton={<BackButton navigateBackTo={`/clients`} className="ms-2 py-1" />}
		/>
	)
}
