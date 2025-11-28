import { EstimatesList } from './EstimatesList'
import { BaseListPage } from '../../components/List/BaseListPage'

export const Estimates = () => {
	return (
		<BaseListPage title="Orçamentos" description="Crie e gerencie orçamentos para seus clientes">
			<EstimatesList status="pending" />
		</BaseListPage>
	)
}
