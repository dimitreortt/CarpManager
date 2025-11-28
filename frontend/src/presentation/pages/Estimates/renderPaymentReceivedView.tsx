import type { Incoming } from '../../../infra/repository/IncomingRepository'
import { renderDateField } from '../../service/renderDateField'
import { formatPrice } from '../../service/formatPrice'
import { ViewEditButtons } from '../../components/View/ViewEditButtons'
import type { NavigateFunction } from 'react-router'

export const renderPaymentReceivedView = (incomings: Incoming[], navigate: NavigateFunction) => {
	return (
		<div>
			{incomings.map((incoming, index) => {
				return (
					<div key={incoming.id} className={`d-flex justify-content-between ${index !== incomings.length - 1 ? 'mb-2' : ''}`}>
						<div>
							{incoming.name} - {formatPrice(incoming.amount)} - {renderDateField(incoming.date)}
						</div>
						<ViewEditButtons
							item={incoming}
							itemName="Pagamento"
							handleView={() => {
								navigate(`/finance/incoming/view?id=${incoming.id}`)
							}}
							handleEdit={() => {
								navigate(`/finance/incoming/form?id=${incoming.id}`)
							}}
						/>
					</div>
				)
			})}
		</div>
	)
}
