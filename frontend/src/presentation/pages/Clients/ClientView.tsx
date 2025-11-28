import { useNavigate } from 'react-router'
import { Layout } from '../../components/Layout/Layout'
import { BaseView } from '../../components/View/BaseView'
import { convertColumnsToFields } from '../../components/View/convertColumnToField'
import type { FieldDefinition } from '../../components/View/FieldDefinition'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Client } from '../../../infra/repository/ClientRepository'
import { ConfirmationModal } from '../../components/Modals/ConfirmationModal'
import { useClientViewState } from './useClientViewState'
import { useMemo, useState } from 'react'
import { getColumns } from './getColumns'
import type { ActionItem } from '../../components/List/ActionItem'
import { Eye } from 'lucide-react'

export const ClientView = () => {
	const { clientRepository, showToast } = useAppContext()
	const navigate = useNavigate()
	const { client, loading } = useClientViewState()
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const handleEdit = (client: Client) => {
		navigate('/clients/form', { state: { client } })
	}

	const handleDelete = (client: Client) => {
		setShowDeleteModal(true)
	}

	const handleConfirmDelete = async () => {
		if (!client || !clientRepository) return

		try {
			await clientRepository.delete(client)
			showToast('Cliente excluído com sucesso', 'success')
			navigate('/clients')
		} catch (error) {
			console.error('Error deleting client:', error)
			showToast('Erro ao excluir cliente', 'error')
		} finally {
			setShowDeleteModal(false)
		}
	}

	const columns = useMemo(() => getColumns(), [])

	const baseFields = convertColumnsToFields(columns)

	const additionalFields: FieldDefinition<Client>[] = [
		{
			key: 'notes',
			label: 'Observações',
			type: 'notes'
		}
	]

	const fields = [...baseFields, ...additionalFields]

	const actions: ActionItem<Client>[] = [
		{
			label: 'Orçamentos/Pedidos',
			onClick: () => navigate(`/clients/estimates?clientId=${client?.id}`, { state: { client } }),
			icon: <Eye color="gray" size={16} />,
			className: 'text-success',
			variant: 'outline-secondary'
		}
	]

	return (
		<Layout>
			<BaseView
				record={client || ({} as Client)}
				fields={fields}
				title="Detalhes do Cliente"
				subtitle={client ? `${client.name}` : undefined}
				loading={loading}
				onEdit={handleEdit}
				onDelete={handleDelete}
				emptyMessage="Cliente não encontrado"
				actions={actions}
			/>

			<ConfirmationModal
				isOpen={showDeleteModal}
				title="Confirmar Exclusão"
				message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
				confirmText="Excluir"
				cancelText="Cancelar"
				variant="danger"
				onConfirm={handleConfirmDelete}
				onClose={() => setShowDeleteModal(false)}
			/>
		</Layout>
	)
}
