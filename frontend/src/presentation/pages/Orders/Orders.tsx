import { BaseListPage } from '../../components/List/BaseListPage'
import { EstimatesList } from '../Estimates/EstimatesList'

export const Orders = () => {
	return (
		<BaseListPage title="Pedidos" description="Crie e gerencie pedidos para seus clientes">
			<EstimatesList status="accepted" />
		</BaseListPage>
	)
}
