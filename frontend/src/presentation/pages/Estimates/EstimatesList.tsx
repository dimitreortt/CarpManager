import { useEffect, useState } from 'react'
import { BaseList } from '../../components/List/BaseList'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Estimate } from '../../../infra/repository/EstimateRepository'
import { EmptyList } from '../../components/List/EmptyList'
import { useFilterParams } from '../../hooks/useFilterParams'
import { useEstimateColumns } from './getColumns'
import { getActions } from './actions'
import { useLoadRecords } from '../../hooks/useLoadRecords'
import { type BaseListControls } from '../../components/List/BaseList'
import { LoadingList } from '../../components/List/LoadingList'

export type EstimatesListProps = BaseListControls & {
	status: 'pending' | 'accepted'
}

export const EstimatesList = ({ status, enableCheckboxes = true, enableSearch = true, showButtonBar = true }: EstimatesListProps) => {
	const { estimateRepository, navigate, searchParams } = useAppContext()
	const clientId = searchParams.get('clientId')
	const [filteredEstimates, setFilteredEstimates] = useState<Estimate[]>([])
	const { columns } = useEstimateColumns(status)
	const {
		records: estimates,
		loading,
		setRecords: setEstimates,
		invalidate
	} = useLoadRecords<Estimate>({
		entityName: status === 'pending' ? 'estimate' : 'order',
		repository: estimateRepository,
		options: { status, clientId: clientId || undefined },
		errorMessage: 'Erro ao carregar orçamentos'
	})
	const { filter, value } = useFilterParams()

	useEffect(() => {
		let filteredEstimates = estimates

		if (filter && value && ['client', 'supplier'].includes(filter)) {
			setFilteredEstimates(filteredEstimates.filter(estimate => estimate[filter as keyof Estimate] === value))
		} else {
			setFilteredEstimates(filteredEstimates)
		}
	}, [filter, value, estimates, status])

	const handleConfirmDelete = async (selectedEstimates: Estimate[]) => {
		await estimateRepository.deleteMany(selectedEstimates)
		setEstimates(estimates.filter(estimate => !selectedEstimates.includes(estimate)))
		await invalidate()
	}

	const doNavigate = () => {
		navigate('/orders')
	}

	const actions = getActions(navigate)

	if (loading) {
		return <LoadingList />
	}

	return (
		<div className="container-fluid px-0">
			{filteredEstimates.length === 0 && !loading && (
				<EmptyList
					icon="bi bi-file-earmark-text"
					title={`Lista de ${status === 'pending' ? 'Orçamentos' : 'Pedidos'}`}
					description={`Crie e gerencie ${
						status === 'pending' ? 'orçamentos' : 'pedidos'
					} para seus clientes com controle de preços e materiais.`}
					entityFormPath={`/estimates/form?status=${status}`}
					entitySingular={status === 'pending' ? 'orçamento' : 'pedido'}
				/>
			)}
			{filteredEstimates.length > 0 && (
				<BaseList
					columns={columns}
					data={filteredEstimates}
					enableCheckboxes={enableCheckboxes}
					enableSearch={enableSearch}
					searchPlaceholder={`Buscar ${status === 'pending' ? 'orçamentos' : 'pedidos'}...`}
					emptyMessage={`Nenhum ${status === 'pending' ? 'orçamento' : 'pedido'} encontrado`}
					loading={loading}
					className="bg-white rounded shadow-sm"
					entityViewPath={`/estimates/view?status=${status}`}
					entityKey="estimate"
					entityFormPath={`/estimates/form?status=${status}`}
					onConfirmDelete={handleConfirmDelete}
					confirmEntitySingular={status === 'pending' ? 'orçamento' : 'pedido'}
					confirmEntityPlural={status === 'pending' ? 'orçamentos' : 'pedidos'}
					actions={actions}
					enableActions={status === 'pending'}
					showButtonBar={showButtonBar}
				/>
			)}
		</div>
	)
}
