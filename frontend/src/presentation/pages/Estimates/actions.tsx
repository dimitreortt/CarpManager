import type { ActionItem } from '../../components/List/ActionItem'
import type { Estimate } from '../../../infra/repository/EstimateRepository'
import { CheckCircle } from 'lucide-react'
import { type NavigateFunction } from 'react-router'

export const getActions = (navigate: NavigateFunction): ActionItem<Estimate>[] => {
	const actions: ActionItem<Estimate>[] = [
		{
			label: 'Criar Pedido',
			onClick: estimate => {
				navigate(`/estimates/create-order/${estimate.id}`, { state: { estimate } })
			},
			icon: <CheckCircle color="green" size={16} />,
			className: 'text-success'
		}
	]

	return actions
}
