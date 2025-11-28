import { Edit, Trash2, Eye, MapPin } from 'lucide-react'
import type { Trip } from '../../../infra/repository/TripRepository'
import type { ActionItem } from '../../components/List/ActionItem'

export const getActions = (
	setTripsToDelete: (trips: Trip[]) => void,
	setShowDeleteModal: (show: boolean) => void,
	navigate: (path: string, options?: any) => void
): ActionItem<Trip>[] => [
	{
		label: 'Visualizar',
		onClick: trip => {
			navigate('/trips/view', { state: { trip } })
		},
		icon: <Eye size={16} />,
		variant: 'info'
	},
	{
		label: 'Editar',
		onClick: trip => {
			navigate('/trips/form', { state: { trip } })
		},
		icon: <Edit size={16} />,
		variant: 'primary'
	},
	{
		label: 'Rota',
		onClick: trip => {},
		icon: <MapPin size={16} />,
		variant: 'secondary'
	},
	{
		label: 'Excluir',
		onClick: trip => {
			setTripsToDelete([trip])
			setShowDeleteModal(true)
		},
		icon: <Trash2 size={16} />,
		variant: 'danger'
	}
]
