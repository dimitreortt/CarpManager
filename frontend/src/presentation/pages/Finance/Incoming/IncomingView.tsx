import { useState } from 'react'
import { convertColumnsToFields } from '../../../components/View/convertColumnToField'
import { BaseView } from '../../../components/View/BaseView'
import type { FieldDefinition } from '../../../components/View/FieldDefinition'
import { Layout } from '../../../components/Layout/Layout'
import { useAppContext } from '../../../../main/AppContextProvider'
import type { Incoming } from '../../../../infra/repository/IncomingRepository'
import { ConfirmationModal } from '../../../components/Modals/ConfirmationModal'
import { useIncomingViewState } from './useIncomingViewState'
import { getColumns } from './getColumns'

export const IncomingView = () => {
	const { incomingRepository, showToast, navigate } = useAppContext()
	const { incoming, setIncoming, loading } = useIncomingViewState()
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const handleEdit = () => {
		if (incoming) {
			navigate(`/finance/incoming/form?status=${incoming.status}`, { state: { incoming } })
		}
	}

	const handleDelete = () => {
		setShowDeleteModal(true)
	}

	const handleConfirmDelete = async () => {
		if (incoming) {
			try {
				await incomingRepository.delete(incoming)
				showToast('Entrada excluída com sucesso', 'success')
				navigate(`/finance/incoming?status=${incoming.status}`)
			} catch (error) {
				console.error('Error deleting incoming:', error)
				showToast('Erro ao excluir entrada', 'error')
			}
		}
		setShowDeleteModal(false)
	}

	const columns = getColumns()
	const baseFields = convertColumnsToFields(columns)
	const additionalFields: FieldDefinition<Incoming>[] = [
		{
			key: 'notes',
			label: 'Observações',
			type: 'notes'
		}
	]
	const fields = [...baseFields, ...additionalFields]

	return (
		<Layout>
			<BaseView
				record={incoming || ({} as Incoming)}
				fields={fields}
				title="Detalhes da Entrada"
				subtitle={incoming ? `${incoming.name}` : undefined}
				loading={loading}
				onEdit={handleEdit}
				onDelete={handleDelete}
				emptyMessage="Entrada não encontrada"
			/>

			<ConfirmationModal
				isOpen={showDeleteModal}
				title="Confirmar Exclusão"
				message="Tem certeza que deseja excluir esta entrada? Esta ação não pode ser desfeita."
				confirmText="Excluir"
				cancelText="Cancelar"
				variant="danger"
				onConfirm={handleConfirmDelete}
				onClose={() => setShowDeleteModal(false)}
			/>
		</Layout>
	)
}
