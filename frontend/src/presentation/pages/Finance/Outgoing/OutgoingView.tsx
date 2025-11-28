import { useState } from 'react'
import { convertColumnsToFields } from '../../../components/View/convertColumnToField'
import { BaseView } from '../../../components/View/BaseView'
import type { FieldDefinition } from '../../../components/View/FieldDefinition'
import { Layout } from '../../../components/Layout/Layout'
import { useAppContext } from '../../../../main/AppContextProvider'
import type { Outgoing } from '../../../../infra/repository/OutgoingRepository'
import { ConfirmationModal } from '../../../components/Modals/ConfirmationModal'
import { useOutgoingViewState } from './useOutgoingViewState'
import { getColumns } from './getColumns'

export const OutgoingView = () => {
	const { outgoingRepository, showToast, navigate } = useAppContext()
	const { outgoing, loading } = useOutgoingViewState()
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const handleEdit = () => {
		if (outgoing) {
			navigate(`/finance/outgoing/form?status=${outgoing.status}`, { state: { outgoing } })
		}
	}

	const handleDelete = () => {
		setShowDeleteModal(true)
	}

	const handleConfirmDelete = async () => {
		if (outgoing) {
			try {
				await outgoingRepository.delete(outgoing)
				showToast('Saída excluída com sucesso', 'success')
				navigate(`/finance/outgoing?status=${outgoing.status}`)
			} catch (error) {
				console.error('Error deleting outgoing:', error)
				showToast('Erro ao excluir saída', 'error')
			}
		}
		setShowDeleteModal(false)
	}

	const columns = getColumns()
	const baseFields = convertColumnsToFields<Outgoing>(columns)

	const additionalFields: FieldDefinition<Outgoing>[] = []

	const fields = [...baseFields, ...additionalFields]

	return (
		<Layout>
			<BaseView
				record={outgoing || ({} as Outgoing)}
				fields={fields}
				title="Detalhes da Saída"
				subtitle={outgoing ? `Saída ${outgoing.number}` : undefined}
				loading={loading}
				onEdit={handleEdit}
				onDelete={handleDelete}
				emptyMessage="Saída não encontrada"
			/>

			<ConfirmationModal
				isOpen={showDeleteModal}
				title="Confirmar Exclusão"
				message="Tem certeza que deseja excluir esta saída? Esta ação não pode ser desfeita."
				confirmText="Excluir"
				cancelText="Cancelar"
				variant="danger"
				onConfirm={handleConfirmDelete}
				onClose={() => setShowDeleteModal(false)}
			/>
		</Layout>
	)
}
