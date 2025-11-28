import { useMemo } from 'react'
import { ShoppingBagIcon } from 'lucide-react'
import { BaseList } from '../../components/List/BaseList'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Client } from '../../../infra/repository/ClientRepository'
import { EmptyList } from '../../components/List/EmptyList'
import { getColumns } from './getColumns'
import { CashStackIcon } from '../../components/Icons/CashStackIcon'
import { CalculatorIcon } from '../../components/Icons/CalculatorIcon'
import { useLoadRecords } from '../../hooks/useLoadRecords'
import type { ActionItem } from '../../components/List/ActionItem'
import { LoadingList } from '../../components/List/LoadingList'

export const ClientList = () => {
	const { clientRepository, navigate } = useAppContext()
	const columns = useMemo(() => getColumns(), [])
	const {
		records: clients,
		loading,
		setRecords: setClients,
		invalidate
	} = useLoadRecords<Client>({ entityName: 'client', repository: clientRepository, errorMessage: 'Erro ao carregar clientes' })

	const actions: ActionItem<Client>[] = [
		{
			label: 'Ver Orçamentos',
			onClick: client => {
				navigate(`/clients/estimates?tab=estimates&clientId=${client.id}`, { state: { client } })
			},
			icon: <CalculatorIcon size={16} />
		},
		{
			label: 'Ver Pedidos',
			onClick: client => {
				navigate(`/clients/estimates?tab=orders&clientId=${client.id}`, { state: { client } })
			},
			icon: <ShoppingBagIcon size={16} />
		},
		{
			label: 'Ver Saldo',
			onClick: client => {
				navigate(`/clients/transactions?clientId=${client.id}`, { state: { client } })
			},
			icon: <CashStackIcon size={16} />
		}
	]

	const handleConfirmDelete = async (selectedClients: Client[]) => {
		await clientRepository.deleteMany(selectedClients)
		setClients(clients.filter(client => !selectedClients.includes(client)))
		await invalidate()
	}

	return (
		<div className="container-fluid px-0">
			{loading && <LoadingList />}
			{clients.length === 0 && !loading && (
				<EmptyList
					icon="bi bi-people-fill"
					title="Lista de Clientes"
					description="Gerencie seus clientes, informações de contato e histórico de projetos."
					entityFormPath="/clients/form"
					entitySingular="cliente"
				/>
			)}
			{clients.length > 0 && (
				<BaseList
					columns={columns}
					data={clients}
					enableCheckboxes={true}
					enableSearch={true}
					searchPlaceholder="Buscar clientes..."
					onConfirmDelete={handleConfirmDelete}
					emptyMessage="Nenhum cliente encontrado"
					className="bg-white rounded shadow-sm"
					entityViewPath="/clients/view"
					entityKey="client"
					entityFormPath="/clients/form"
					confirmEntitySingular="cliente"
					confirmEntityPlural="clientes"
					enableActions={true}
					actions={actions}
				/>
			)}
		</div>
	)
}
