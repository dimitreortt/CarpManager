import { useState } from 'react'
import { BaseView } from '../../components/View/BaseView'
import { convertColumnsToFields } from '../../components/View/convertColumnToField'
import type { FieldDefinition } from '../../components/View/FieldDefinition'
import { Layout } from '../../components/Layout/Layout'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Supplier } from '../../../infra/repository/SupplierRepository'
import { ConfirmationModal } from '../../components/Modals/ConfirmationModal'
import { useSupplierViewState } from './useSupplierViewState'
import { getColumns } from './getColumns'

export const SupplierView = () => {
	const { supplierRepository, showToast, navigate } = useAppContext()
	const { supplier, loading } = useSupplierViewState()
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const handleEdit = () => {
		if (supplier) {
			navigate('/suppliers/form', { state: { supplier } })
		}
	}

	const handleDelete = () => {
		setShowDeleteModal(true)
	}

	const handleConfirmDelete = async () => {
		if (!supplier || !supplierRepository) return

		try {
			await supplierRepository.delete(supplier)
			showToast('Fornecedor excluído com sucesso', 'success')
			navigate('/suppliers')
		} catch (error) {
			console.error('Error deleting supplier:', error)
			showToast('Erro ao excluir fornecedor', 'error')
		} finally {
			setShowDeleteModal(false)
		}
	}

	const columns = getColumns()
	const baseFields = convertColumnsToFields<Supplier>(columns)
	const additionalFields: FieldDefinition<Supplier>[] = [
		{ key: 'address', label: 'Endereço' },
		{ key: 'state', label: 'Estado' },
		{ key: 'contactPerson', label: 'Contato' },
		{ key: 'notes', label: 'Observações', type: 'notes' }
	]
	const fields = [...baseFields, ...additionalFields]

	return (
		<Layout>
			<BaseView
				record={supplier || ({} as Supplier)}
				fields={fields}
				title="Detalhes do Fornecedor"
				subtitle={supplier ? `Fornecedor ${supplier.name}` : undefined}
				loading={loading}
				onEdit={handleEdit}
				onDelete={handleDelete}
				emptyMessage="Fornecedor não encontrado"
			/>

			<ConfirmationModal
				isOpen={showDeleteModal}
				title="Confirmar Exclusão"
				message="Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita."
				confirmText="Excluir"
				cancelText="Cancelar"
				variant="danger"
				onConfirm={handleConfirmDelete}
				onClose={() => setShowDeleteModal(false)}
			/>
		</Layout>
	)
}
