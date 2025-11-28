import { Eye, Edit, Trash2, Building } from 'lucide-react'
import type { Supplier } from '../../../infra/repository/SupplierRepository'
import type { NavigateFunction } from 'react-router'
import type { ActionItem } from '../../components/List/ActionItem'

export const getActions = (
	navigate: NavigateFunction,
	setSuppliersToDelete: (suppliers: Supplier[]) => void,
	setShowDeleteModal: (show: boolean) => void
): ActionItem<Supplier>[] => {
	return [
		{
			label: 'Visualizar',
			onClick: supplier => {
				navigate('/suppliers/view', { state: { supplier } })
			},
			icon: <Eye size={16} />,
			variant: 'info'
		},
		{
			label: 'Editar',
			onClick: supplier => {
				navigate('/suppliers/form', { state: { supplier } })
			},
			icon: <Edit size={16} />,
			variant: 'primary'
		},
		{
			label: 'Produtos',
			onClick: supplier => {},
			icon: <Building size={16} />,
			variant: 'secondary'
		},
		{
			label: 'Excluir',
			onClick: supplier => {
				setSuppliersToDelete([supplier])
				setShowDeleteModal(true)
			},
			icon: <Trash2 size={16} />,
			variant: 'danger'
		}
	]
}
