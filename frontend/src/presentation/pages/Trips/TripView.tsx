import { useState } from 'react'
import { useNavigate } from 'react-router'
import { convertColumnsToFields } from '../../components/View/convertColumnToField'
import { BaseView } from '../../components/View/BaseView'
import type { FieldDefinition } from '../../components/View/FieldDefinition'
import { Layout } from '../../components/Layout/Layout'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Trip } from '../../../infra/repository/TripRepository'
import { ConfirmationModal } from '../../components/Modals/ConfirmationModal'
import { useTripViewState } from './useTripViewState'
import { getColumns } from './getColumns'

export const TripView = () => {
	const { tripRepository, showToast, navigate } = useAppContext()
	const { trip, loading } = useTripViewState()
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const handleEdit = () => {
		if (trip) {
			navigate('/trips/form', { state: { trip } })
		}
	}

	const handleDelete = () => {
		setShowDeleteModal(true)
	}

	const handleConfirmDelete = async () => {
		if (trip) {
			try {
				await tripRepository.delete(trip)
				showToast('Viagem excluída com sucesso', 'success')
				navigate('/trips')
			} catch (error) {
				console.error('Error deleting trip:', error)
				showToast('Erro ao excluir viagem', 'error')
			}
		}
		setShowDeleteModal(false)
	}

	const columns = getColumns()
	const baseFields = convertColumnsToFields(columns)

	const additionalFields: FieldDefinition<Trip>[] = [
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
				record={trip || ({} as Trip)}
				fields={fields}
				title="Detalhes da Viagem"
				subtitle={trip ? `Viagem ${trip.name}` : undefined}
				loading={loading}
				onEdit={handleEdit}
				onDelete={handleDelete}
				emptyMessage="Viagem não encontrada"
			/>

			<ConfirmationModal
				isOpen={showDeleteModal}
				title="Confirmar Exclusão"
				message="Tem certeza que deseja excluir esta viagem? Esta ação não pode ser desfeita."
				confirmText="Excluir"
				cancelText="Cancelar"
				variant="danger"
				onConfirm={handleConfirmDelete}
				onClose={() => setShowDeleteModal(false)}
			/>
		</Layout>
	)
}
