import { useEffect, useState } from 'react'
import { BaseList, type BaseListControls } from '../../../components/List/BaseList'
import { useAppContext } from '../../../../main/AppContextProvider'
import type { Incoming } from '../../../../infra/repository/IncomingRepository'
import { EmptyList } from '../../../components/List/EmptyList'
import { getColumns } from './getColumns'
import { isSameOrEarlier, isSameOrLater } from '../../../components/Form/MonthPicker/utils'
import { HandleCreateOrder } from './HandleCreateOrder'
import { getActions } from './actions'
import { useLoadRecords } from '../../../hooks/useLoadRecords'
import { LoadingList } from '../../../components/List/LoadingList'

type IncomingListProps = BaseListControls & {
	periodFilter?: string
	status?: string
	clientId?: string
	showButtonBar?: boolean
	hideEntityIcons?: boolean
	incomings?: Incoming[] | null
	setIncomings?: ((incomings: Incoming[]) => void) | null
	hideEmptyList?: boolean
	loading?: boolean
}

export const IncomingList = ({
	periodFilter,
	status,
	clientId,
	showButtonBar = true,
	hideEntityIcons = false,
	enableCheckboxes = true,
	enableSearch = true,
	hideEmptyList = false,
	incomings: incomingsProps = null,
	setIncomings: setIncomingsProps = null,
	loading: loadingProps = false
}: IncomingListProps) => {
	const { incomingRepository, showToast } = useAppContext()
	const [filteredIncomings, setFilteredIncomings] = useState<Incoming[]>([])
	const [incomingForOrder, setIncomingForOrder] = useState<Incoming | null>(null)
	const columns = getColumns()

	const {
		records: incomings,
		loading,
		setRecords: setIncomings,
		invalidate
	} = useLoadRecords<Incoming>({
		entityName: status + 'Incoming',
		repository: incomingRepository,
		options: { status, clientId },
		paramRecords: incomingsProps,
		paramSetRecords: setIncomingsProps,
		errorMessage: 'Erro ao carregar entradas'
	})

	useEffect(() => {
		let filteredIncomings = incomings.filter(incoming => incoming.status === status)

		if (!periodFilter) {
			setFilteredIncomings(filteredIncomings)
			return
		}
		const isPeriod = periodFilter.includes('::')

		if (isPeriod) {
			const [from, to] = periodFilter.split('::')
			const incomingsList = filteredIncomings.filter(
				incoming => isSameOrLater(incoming.date.substring(0, 7), from) && isSameOrEarlier(incoming.date.substring(0, 7), to)
			)
			setFilteredIncomings(incomingsList || [])
		} else {
			const incomingsList = filteredIncomings.filter(incoming => incoming.date.startsWith(periodFilter))
			setFilteredIncomings(incomingsList || [])
		}
	}, [periodFilter, incomings])

	const handleConfirmDelete = async (selected: Incoming[]) => {
		await incomingRepository.deleteMany(selected)
		setIncomings(incomings.filter(incoming => !selected.includes(incoming)))
		await invalidate()
	}

	const handleCreateOrder = async (incoming: Incoming) => {
		if (incoming.estimate?.status === 'accepted') {
			return
		}
		setIncomingForOrder(incoming)
	}

	const updateIncoming = async (incoming: Incoming, status: 'pending' | 'received') => {
		await incomingRepository.update({ id: incoming.id, status: status })
		const updated = incomings.map(i => (i.id === incoming.id ? { ...i, status: status } : i))
		setIncomings(updated)
	}

	const handleReceive = async (incoming: Incoming) => {
		try {
			await updateIncoming(incoming, 'received')
			showToast('Entrada marcada como recebida com sucesso', 'success')

			if (incoming.estimate) {
				await handleCreateOrder(incoming)
			}
		} catch (error) {
			showToast('Erro ao marcar como recebido', 'error')
		}
	}

	const handleUndoReceive = async (incoming: Incoming) => {
		try {
			await updateIncoming(incoming, 'pending')
			showToast('Entrada estornada com sucesso', 'success')
		} catch (error) {
			showToast('Erro ao estornar entrada', 'error')
		}
	}

	const actions = getActions(status as 'pending' | 'received', handleReceive, handleUndoReceive)

	if (loading || loadingProps) {
		return <LoadingList />
	}

	return (
		<div className="container-fluid px-0">
			{filteredIncomings.length === 0 && !loading && !hideEmptyList && (
				<EmptyList
					icon="bi bi-arrow-down-circle"
					title="Lista de Entradas"
					description="Controle suas receitas e entradas financeiras com categorização e status de pagamento."
					entityFormPath={`/finance/incoming/form?status=${status}`}
					entitySingular="entrada"
				/>
			)}
			{(filteredIncomings.length > 0 || hideEmptyList) && (
				<BaseList
					columns={columns}
					data={filteredIncomings}
					enableCheckboxes={enableCheckboxes}
					enableSearch={enableSearch}
					searchPlaceholder="Buscar entradas..."
					emptyMessage="Nenhuma entrada encontrada"
					loading={loading}
					className="bg-white rounded shadow-sm"
					entityFormPath={`/finance/incoming/form?status=${status}`}
					entityViewPath={`/finance/incoming/view?status=${status}`}
					entityKey="incoming"
					confirmEntitySingular="entrada"
					confirmEntityPlural="entradas"
					onConfirmDelete={handleConfirmDelete}
					actions={actions}
					enableActions={true}
					showButtonBar={showButtonBar}
					hideEntityIcons={hideEntityIcons}
					confirmDeleteTitle="Excluir entradas e pedidos relacionados?"
					confirmDeleteMessage="Tem certeza que deseja excluir as entradas?"
				/>
			)}

			<HandleCreateOrder incomingForOrder={incomingForOrder} setIncomingForOrder={setIncomingForOrder} />
		</div>
	)
}
