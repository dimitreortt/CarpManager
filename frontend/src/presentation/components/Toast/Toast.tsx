import { useEffect } from 'react'
import { useAppContext } from '../../../main/AppContextProvider'
import type { ToastType } from './useToastState'

interface ToastProps {
	position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
	autoHideDuration?: number
}

export const Toast = ({ position = 'bottom-center', autoHideDuration = 6000 }: ToastProps) => {
	const { toastOpen, setToastOpen, toastMessage, toastType } = useAppContext()

	useEffect(() => {
		if (toastOpen && autoHideDuration > 0) {
			const timer = setTimeout(() => {
				setToastOpen(false)
			}, autoHideDuration)

			return () => clearTimeout(timer)
		}
	}, [toastOpen, autoHideDuration, setToastOpen])

	if (!toastOpen) return null

	const getToastClasses = (type: ToastType) => {
		const baseClasses = 'align-items-center border-0'
		const typeClasses = {
			success: 'bg-success text-white',
			error: 'bg-danger text-white',
			warning: 'bg-warning text-dark',
			info: 'bg-info text-white'
		}
		return `${baseClasses} ${typeClasses[type]}`
	}

	const getIcon = (type: ToastType) => {
		switch (type) {
			case 'success':
				return (
					<div className="me-2">
						<i className="bi bi-check-circle-fill"></i>
					</div>
				)
			case 'error':
				return (
					<div className="me-2">
						<i className="bi bi-exclamation-triangle-fill"></i>
					</div>
				)
			case 'warning':
				return (
					<div className="me-2">
						<i className="bi bi-exclamation-circle-fill"></i>
					</div>
				)
			case 'info':
				return (
					<div className="me-2">
						<i className="bi bi-info-circle-fill"></i>
					</div>
				)
		}
	}

	const getPositionClasses = (pos: string) => {
		const positionClasses = {
			'top-right': 'top-0 end-0',
			'top-left': 'top-0 start-0',
			'bottom-right': 'bottom-0 end-0',
			'bottom-left': 'bottom-0 start-0',
			'top-center': 'top-0 start-50 translate-middle-x',
			'bottom-center': 'bottom-0 start-50 translate-middle-x'
		}
		return positionClasses[pos as keyof typeof positionClasses] || positionClasses['top-right']
	}

	return (
		<div className={`position-fixed ${getPositionClasses(position)} p-3`} style={{ zIndex: 1055 }}>
			<div className={`${getToastClasses(toastType)} p-3 rounded-3`} role="alert" aria-live="assertive" aria-atomic="true">
				<div className="d-flex">
					{getIcon(toastType)}
					<div className="toast-body">{toastMessage}</div>
					<button
						type="button"
						className="btn-close btn-close-white ms-2 m-auto"
						data-bs-dismiss="toast"
						aria-label="Fechar"
						onClick={() => setToastOpen(false)}
					></button>
				</div>
			</div>
		</div>
	)
}
