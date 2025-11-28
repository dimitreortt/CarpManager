import { CircleX, CheckCircle } from 'lucide-react'
import type { ActionItem } from '../../../components/List/ActionItem'
import type { Outgoing } from '../../../../infra/repository/OutgoingRepository'

export const getActions = (
	status: 'pending' | 'paid',
	handleMarkAsPaid: (outgoing: Outgoing) => void,
	handleUndoPaid: (outgoing: Outgoing) => void
): ActionItem<Outgoing>[] => {
	const actions = []

	if (status === 'pending') {
		actions.push({
			label: 'Marcar como pago',
			icon: <CheckCircle color="green" size={20} />,
			onClick: handleMarkAsPaid,
			className: 'text-success'
		})
	}

	if (status === 'paid') {
		actions.push({
			label: 'Marcar como pendente',
			icon: <CircleX color="red" size={20} />,
			onClick: handleUndoPaid,
			className: 'text-red'
		})
	}

	return actions
}
