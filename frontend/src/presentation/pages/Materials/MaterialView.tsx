import { useState } from 'react'
import { convertColumnsToFields } from '../../components/View/convertColumnToField'
import { BaseView } from '../../components/View/BaseView'
import { Layout } from '../../components/Layout/Layout'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Material } from '../../../infra/repository/MaterialRepository'
import { ConfirmationModal } from '../../components/Modals/ConfirmationModal'
import { useMaterialViewState } from './useMaterialViewState'
import { getColumns } from './getColumns'

export const MaterialView = () => {
	const { materialRepository, showToast, navigate } = useAppContext()
	const { material, loading } = useMaterialViewState()
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const handleEdit = () => {
		if (material) {
			navigate('/materials/form', { state: { material } })
		}
	}

	const handleDelete = () => {
		setShowDeleteModal(true)
	}

	const handleConfirmDelete = async () => {
		if (material) {
			try {
				await materialRepository.delete(material)
				showToast('Material excluído com sucesso', 'success')
				navigate('/materials')
			} catch (error) {
				console.error('Error deleting material:', error)
				showToast('Erro ao excluir material', 'error')
			}
		}
		setShowDeleteModal(false)
	}

	const columns = getColumns()
	const fields = convertColumnsToFields(columns)

	return (
		<Layout>
			<BaseView
				record={material || ({} as Material)}
				fields={fields}
				title="Detalhes do Material"
				subtitle={material ? `${material.name}` : undefined}
				loading={loading}
				onEdit={handleEdit}
				onDelete={handleDelete}
				emptyMessage="Material não encontrado"
			/>

			<ConfirmationModal
				isOpen={showDeleteModal}
				title="Confirmar Exclusão"
				message="Tem certeza que deseja excluir este material? Esta ação não pode ser desfeita."
				confirmText="Excluir"
				cancelText="Cancelar"
				variant="danger"
				onConfirm={handleConfirmDelete}
				onClose={() => setShowDeleteModal(false)}
			/>
		</Layout>
	)
}
