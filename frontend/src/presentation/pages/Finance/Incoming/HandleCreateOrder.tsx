import type { Estimate } from '../../../../infra/repository/EstimateRepository'
import type { Incoming } from '../../../../infra/repository/IncomingRepository'
import { useAppContext } from '../../../../main/AppContextProvider'
import { ConfirmationModal } from '../../../components/Modals/ConfirmationModal'
import { useEffect, useState } from 'react'

export const HandleCreateOrder = ({
	incomingForOrder,
	setIncomingForOrder,
	callback
}: {
	incomingForOrder: Incoming | null
	setIncomingForOrder: (incoming: Incoming | null) => void
	callback?: () => void
}) => {
	const { showToast, estimateRepository } = useAppContext()
	const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)

	useEffect(() => {
		if (incomingForOrder) {
			setShowOrderConfirmation(true)
		}
	}, [incomingForOrder])

	const handleClose = () => {
		setShowOrderConfirmation(false)
		setIncomingForOrder(null)
	}

	const confirmCreateOrder = async () => {
		try {
			const updatedEstimate = await estimateRepository.acceptEstimate(incomingForOrder!.estimateId!)
			showToast(`Pedido ${updatedEstimate.name} criado com sucesso`, 'success')
		} catch (error: any) {
			showToast(error.message, 'error', 10000)
		} finally {
			handleClose()
			callback?.()
		}
	}

	return (
		<ConfirmationModal
			isOpen={showOrderConfirmation}
			onClose={() => {
				setShowOrderConfirmation(false)
				setIncomingForOrder(null)
				callback?.()
			}}
			onConfirm={confirmCreateOrder}
			title={`Transformar orçamento ${incomingForOrder?.estimate?.name} em pedido?`}
			message={`Um pedido será criado à partir do orçamento ${incomingForOrder?.estimate?.name} selecionado nesta entrada.`}
			variant="primary"
			confirmText="Criar Pedido"
			cancelText="Cancelar"
		/>
	)
}
