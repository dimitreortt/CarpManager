import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Layout } from '../../components/Layout/Layout'
import { BaseView } from '../../components/View/BaseView'
import { convertColumnsToFields } from '../../components/View/convertColumnToField'
import type { FieldDefinition } from '../../components/View/FieldDefinition'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Estimate } from '../../../infra/repository/EstimateRepository'
import { ConfirmationModal } from '../../components/Modals/ConfirmationModal'
import { useEstimateColumns } from './getColumns'
import { useEstimatesViewState } from './useEstimatesViewState'
import { CheckCircle } from 'lucide-react'
import type { ActionItem } from '../../components/List/ActionItem'

export const EstimatesView = () => {
	const { estimateRepository, showToast, searchParams } = useAppContext()
	const status = (searchParams.get('status') as 'pending' | 'accepted') || 'pending'
	const { columns } = useEstimateColumns(status)
	const navigate = useNavigate()
	const { estimate, loading } = useEstimatesViewState()
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const handleEdit = (estimate: Estimate) => {
		navigate(`/estimates/form?status=${status}`, { state: { estimate } })
	}

	const handleDelete = (estimate: Estimate) => {
		setShowDeleteModal(true)
	}

	const handleConfirmDelete = async () => {
		if (!estimate || !estimateRepository) return

		try {
			await estimateRepository.delete(estimate)
			showToast(`${status === 'pending' ? 'Orçamento' : 'Pedido'}(s) excluído(s) com sucesso`, 'success')
			navigate(`${status === 'pending' ? '/estimates' : '/orders'}`)
		} catch (error) {
			console.error('Error deleting estimate:', error)
			showToast(`Erro ao excluir ${status === 'pending' ? 'orçamento' : 'pedido'}`, 'error')
		} finally {
			setShowDeleteModal(false)
		}
	}

	const baseFields = convertColumnsToFields(columns)

	const additionalFields: FieldDefinition<Estimate>[] = [
		{
			key: 'notes',
			label: 'Observações',
			type: 'notes'
		}
	]

	const fields = [...baseFields, ...additionalFields]

	const actions: ActionItem<Estimate>[] = []

	if (status === 'pending') {
		actions.push({
			label: 'Criar Pedido',
			onClick: () => navigate(`/estimates/create-order/${estimate?.id}`, { state: { estimate } }),
			icon: <CheckCircle color="green" size={16} />,
			className: 'text-success',
			variant: 'outline-success'
		})
	}

	return (
		<Layout>
			<BaseView
				record={estimate || ({} as Estimate)}
				fields={fields}
				title={`Detalhes do ${status === 'pending' ? 'Orçamento' : 'Pedido'}`}
				subtitle={estimate ? `${status === 'pending' ? 'Orçamento' : 'Pedido'} ${estimate.name}` : undefined}
				loading={loading}
				onEdit={handleEdit}
				onDelete={handleDelete}
				emptyMessage={`${status === 'pending' ? 'Orçamento' : 'Pedido'} não encontrado`}
				actions={actions}
			/>

			<ConfirmationModal
				isOpen={showDeleteModal}
				title="Confirmar Exclusão"
				message={`Tem certeza que deseja excluir este(s) ${
					status === 'pending' ? 'orçamento' : 'pedido'
				}(s)? Esta ação não pode ser desfeita.`}
				confirmText="Excluir"
				cancelText="Cancelar"
				variant="danger"
				onConfirm={handleConfirmDelete}
				onClose={() => setShowDeleteModal(false)}
			/>
		</Layout>
	)
}
