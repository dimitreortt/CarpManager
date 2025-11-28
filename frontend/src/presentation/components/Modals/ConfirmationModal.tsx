import { type ReactNode } from 'react'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

export type ConfirmationModalVariant = 'danger' | 'warning' | 'info' | 'success' | 'primary'

interface ConfirmationModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title: string
	message: string | ReactNode
	variant?: ConfirmationModalVariant
	confirmText?: string
	cancelText?: string
	loading?: boolean
	icon?: ReactNode
}

const getVariantConfig = (variant: ConfirmationModalVariant) => {
	switch (variant) {
		case 'danger':
			return {
				icon: <XCircle className="text-danger" size={24} />,
				buttonClass: 'btn-danger',
				headerClass: 'bg-danger text-white'
			}
		case 'warning':
			return {
				icon: <AlertTriangle className="text-warning" size={24} />,
				buttonClass: 'btn-warning',
				headerClass: 'bg-warning text-dark'
			}
		case 'info':
			return {
				icon: <Info className="text-info" size={24} />,
				buttonClass: 'btn-info',
				headerClass: 'bg-info text-white'
			}
		case 'success':
			return {
				icon: <CheckCircle className="text-success" size={24} />,
				buttonClass: 'btn-success',
				headerClass: 'bg-success text-white'
			}
		case 'primary':
			return {
				icon: <Info className="text-light" size={24} />,
				buttonClass: 'btn-outline-success',
				headerClass: 'bg-primary text-white'
			}
		default:
			return {
				icon: <Info className="text-primary" size={24} />,
				buttonClass: 'btn-primary',
				headerClass: 'bg-primary text-white'
			}
	}
}

export const ConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	variant = 'info',
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	loading = false,
	icon
}: ConfirmationModalProps) => {
	if (!isOpen) return null

	const config = getVariantConfig(variant)
	const modalIcon = icon || config.icon

	const handleConfirm = () => {
		if (!loading) {
			onConfirm()
		}
	}

	const handleClose = () => {
		if (!loading) {
			onClose()
		}
	}

	return (
		<div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content border-0 shadow">
					<div className={`modal-header ${config.headerClass} border-0`}>
						<div className="d-flex align-items-center gap-2">
							{modalIcon}
							<h5 className="modal-title mb-0">{title}</h5>
						</div>
						<button type="button" className="btn-close btn-close-white" onClick={handleClose} disabled={loading} aria-label="Fechar" />
					</div>
					<div className="modal-body p-4">
						<p className="mb-0">{message}</p>
					</div>
					<div className="modal-footer border-0 pt-0">
						<button type="button" className="btn btn-outline-secondary" onClick={handleClose} disabled={loading}>
							{cancelText}
						</button>
						<button title={confirmText} type="button" className={`btn ${config.buttonClass}`} onClick={handleConfirm} disabled={loading}>
							{loading ? (
								<>
									<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
									Processando...
								</>
							) : (
								confirmText
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
