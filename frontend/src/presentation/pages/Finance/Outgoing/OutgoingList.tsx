import { useEffect, useMemo, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { BaseList } from '../../../components/List/BaseList'
import { useAppContext } from '../../../../main/AppContextProvider'
import type { Outgoing } from '../../../../infra/repository/OutgoingRepository'
import { EmptyList } from '../../../components/List/EmptyList'
import { getColumns } from './getColumns'
import { isSameOrEarlier, isSameOrLater } from '../../../components/Form/MonthPicker/utils'
import { useLoadRecords } from '../../../hooks/useLoadRecords'
import type { ActionItem } from '../../../components/List/ActionItem'
import { getActions } from './actions'
import { LoadingList } from '../../../components/List/LoadingList'

interface OutgoingListProps {
	periodFilter?: string
	status?: string
	showButtonBar?: boolean
	hideEntityIcons?: boolean
	enableCheckboxes?: boolean
	enableSearch?: boolean
	hideEmptyList?: boolean
	outgoings?: Outgoing[] | null
	setOutgoings?: ((outgoings: Outgoing[]) => void) | null
	loading?: boolean
}

export const OutgoingList = ({
	periodFilter,
	status,
	showButtonBar = true,
	hideEntityIcons = false,
	enableCheckboxes = true,
	enableSearch = true,
	hideEmptyList = false,
	outgoings: outgoingsProps = null,
	setOutgoings: setOutgoingsProps = null,
	loading: loadingProps = false
}: OutgoingListProps) => {
	const { outgoingRepository, showToast, invalidate: invalidateGlobal } = useAppContext()
	const [filteredOutgoings, setFilteredOutgoings] = useState<Outgoing[]>([])
	const columns = useMemo(() => getColumns(), [])
	const {
		records: outgoings,
		loading,
		setRecords: setOutgoings,
		invalidate
	} = useLoadRecords<Outgoing>({
		entityName: status + 'Outgoing',
		repository: outgoingRepository,
		options: { status },
		paramRecords: outgoingsProps,
		paramSetRecords: setOutgoingsProps,
		errorMessage: 'Erro ao carregar saídas'
	})

	useEffect(() => {
		let filteredOutgoings = outgoings.filter(outgoing => outgoing.status === status)

		if (!periodFilter) {
			setFilteredOutgoings(filteredOutgoings)
			return
		}
		const isPeriod = periodFilter.includes('::')

		if (isPeriod) {
			const [from, to] = periodFilter.split('::')
			const outgoingsList = filteredOutgoings.filter(
				outgoing => isSameOrLater(outgoing.date.substring(0, 7), from) && isSameOrEarlier(outgoing.date.substring(0, 7), to)
			)
			setFilteredOutgoings(outgoingsList || [])
		} else {
			const outgoingsList = filteredOutgoings.filter(outgoing => outgoing.date.startsWith(periodFilter))
			setFilteredOutgoings(outgoingsList || [])
		}
	}, [periodFilter, outgoings])

	const handleConfirmDelete = async (selected: Outgoing[]) => {
		await outgoingRepository.deleteMany(selected)
		setOutgoings(outgoings.filter(outgoing => !selected.includes(outgoing)))
		await invalidate()
	}

	const updateOutgoing = async (outgoing: Outgoing, status: 'pending' | 'paid') => {
		await outgoingRepository.update({ id: outgoing.id, status: status })
		const updated = outgoings.map(i => (i.id === outgoing.id ? { ...i, status: status } : i))
		setOutgoings(updated)
	}

	const handleMarkAs = async (outgoing: Outgoing, status: 'pending' | 'paid') => {
		const statusLabel = status === 'paid' ? 'paga' : 'pendente'
		try {
			await updateOutgoing(outgoing, status)
			showToast(`Saída marcada como ${statusLabel} com sucesso`, 'success')
			await invalidate()
			await invalidateGlobal(`${status}OutgoingLoadRecords`)
		} catch (error) {
			showToast(`Erro ao marcar como ${statusLabel}`, 'error')
		}
	}

	const handleMarkAsPaid = async (outgoing: Outgoing) => {
		await handleMarkAs(outgoing, 'paid')
	}

	const handleUndoPaid = async (outgoing: Outgoing) => {
		await handleMarkAs(outgoing, 'pending')
	}

	const actions: ActionItem<Outgoing>[] = getActions(status as 'pending' | 'paid', handleMarkAsPaid, handleUndoPaid)

	if (loading || loadingProps) {
		return <LoadingList />
	}

	return (
		<div className="container-fluid px-0">
			{outgoings.length === 0 && !loading && !hideEmptyList && (
				<EmptyList
					icon="bi bi-arrow-up-circle"
					title="Lista de Saídas"
					description="Controle suas despesas e saídas financeiras com categorização e status de pagamento."
					entityFormPath={`/finance/outgoing/form?status=${status}`}
					entitySingular="saída"
				/>
			)}
			{(outgoings.length > 0 || hideEmptyList) && (
				<BaseList
					columns={columns}
					data={filteredOutgoings}
					searchPlaceholder="Buscar saídas..."
					emptyMessage="Nenhuma saída encontrada"
					loading={loading}
					className="bg-white rounded shadow-sm"
					entityFormPath={`/finance/outgoing/form?status=${status}`}
					entityViewPath={`/finance/outgoing/view?status=${status}`}
					entityKey="outgoing"
					confirmEntitySingular="saída"
					confirmEntityPlural="saídas"
					onConfirmDelete={handleConfirmDelete}
					actions={actions}
					enableActions={true}
					showButtonBar={showButtonBar}
					hideEntityIcons={hideEntityIcons}
					enableCheckboxes={enableCheckboxes}
					enableSearch={enableSearch}
				/>
			)}
		</div>
	)
}
