import { CheckCircle, CircleX } from 'lucide-react'
import type { Incoming } from '../../../../infra/repository/IncomingRepository'

export const getActions = (
	status: 'pending' | 'received',
	handleReceive: (incoming: Incoming) => void,
	handleUndoReceive: (incoming: Incoming) => void
): any[] => {
	if (status === 'pending') {
		return [
			{
				label: 'Marcar como recebido',
				icon: <CheckCircle color="green" size={20} />,
				onClick: handleReceive,
				className: 'text-success'
			}
		]
	}

	if (status === 'received') {
		return [
			{
				label: 'Estornar',
				icon: <CircleX color="red" size={20} />,
				onClick: handleUndoReceive,
				className: 'text-red'
			}
		]
	}

	return []
}
