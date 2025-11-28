import { useAppContext } from '../../../main/AppContextProvider'
import { useEffect, useState } from 'react'
import type { Client } from '../../../infra/repository/ClientRepository'
import { IncomingList } from '../Finance/Incoming/IncomingList'
import { OutgoingList } from '../Finance/Outgoing/OutgoingList'
import { TabPage } from '../Finance/TabPage'
import { BackButton } from '../../components/Buttons/BackButton'
import type { Incoming } from '../../../infra/repository/IncomingRepository'
import { useLoadRecords } from '../../hooks/useLoadRecords'
import type { Outgoing } from '../../../infra/repository/OutgoingRepository'

export const ClientTransactionsList = () => {
	const { clientRepository, searchParams, location, incomingRepository, outgoingRepository } = useAppContext()
	const [client, setClient] = useState<Client | null>(null)
	const clientId = searchParams.get('clientId')

	const {
		records: incomings,
		setRecords: setIncomings,
		loading: loadingIncomings
	} = useLoadRecords<Incoming>({
		repository: incomingRepository,
		options: { clientId },
		errorMessage: 'Erro ao carregar entradas'
	})

	const {
		records: outgoings,
		setRecords: setOutgoings,
		loading: loadingOutgoings
	} = useLoadRecords<Outgoing>({
		repository: outgoingRepository,
		options: { clientId },
		errorMessage: 'Erro ao carregar saídas'
	})

	useEffect(() => {
		if (!clientRepository) return
		const loadClient = async () => {
			const client = await clientRepository.getById(clientId || '')
			setClient(client)
		}

		if (location.state) {
			setClient(location.state.client as Client)
		} else {
			loadClient()
		}
	}, [clientId, clientRepository, location.state])

	const tabs = [
		{
			label: 'Entradas',
			icon: 'bi bi-arrow-down-circle',
			code: 'incoming'
		},
		{
			label: 'Saídas',
			icon: 'bi bi-arrow-up-circle',
			code: 'outgoing'
		}
	]

	const tabContent = [
		<IncomingTransactions incomings={incomings} setIncomings={setIncomings} loading={loadingIncomings} />,
		<OutgoingTransactions outgoings={outgoings} setOutgoings={setOutgoings} loading={loadingOutgoings} />
	]

	return (
		<TabPage
			tabs={tabs}
			tabContent={tabContent}
			defaultTab="incoming"
			title="Transações"
			subtitle={client?.name || ''}
			backButton={<BackButton navigateBackTo={`/clients`} className="ms-2 py-1" />}
		/>
	)
}

interface IncomingTransactionsProps {
	incomings: Incoming[]
	setIncomings: (incomings: Incoming[]) => void
	loading: boolean
}

const IncomingTransactions = ({ incomings, setIncomings, loading }: IncomingTransactionsProps) => {
	return (
		<div>
			<h5>Entradas a receber</h5>
			<div className="mb-4">
				<IncomingList
					periodFilter={''}
					status={'pending'}
					incomings={incomings}
					setIncomings={setIncomings}
					showButtonBar={false}
					hideEntityIcons={true}
					enableCheckboxes={false}
					enableSearch={false}
					hideEmptyList={true}
					loading={loading}
				/>
			</div>
			<h5>Entradas Recebidas</h5>
			<div className="mb-4">
				<IncomingList
					periodFilter={''}
					status={'received'}
					incomings={incomings}
					setIncomings={setIncomings}
					showButtonBar={false}
					hideEntityIcons={true}
					enableCheckboxes={false}
					enableSearch={false}
					hideEmptyList={true}
					loading={loading}
				/>
			</div>
		</div>
	)
}

interface OutgoingTransactionsProps {
	outgoings: Outgoing[]
	setOutgoings: (outgoings: Outgoing[]) => void
	loading: boolean
}

const OutgoingTransactions = ({ outgoings, setOutgoings, loading }: OutgoingTransactionsProps) => {
	return (
		<div>
			<h5>Saídas a pagar</h5>
			<div className="mb-4">
				<OutgoingList
					periodFilter={''}
					status={'pending'}
					outgoings={outgoings}
					setOutgoings={setOutgoings}
					showButtonBar={false}
					hideEntityIcons={true}
					enableSearch={false}
					enableCheckboxes={false}
					hideEmptyList={true}
					loading={loading}
				/>
			</div>
			<h5>Saídas Pagas</h5>
			<div>
				<OutgoingList
					periodFilter={''}
					status={'paid'}
					outgoings={outgoings}
					setOutgoings={setOutgoings}
					showButtonBar={false}
					hideEntityIcons={true}
					enableSearch={false}
					enableCheckboxes={false}
					hideEmptyList={true}
					loading={loading}
				/>
			</div>
		</div>
	)
}
