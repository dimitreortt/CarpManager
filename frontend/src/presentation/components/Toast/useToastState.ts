import { useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastState {
	open: boolean
	message: string
	type: ToastType
	timeOut: number
}

export const useToastState = () => {
	const [toastState, setToastState] = useState<ToastState>({
		open: false,
		message: '',
		type: 'info',
		timeOut: 6000
	})

	const showToast = useCallback((message: string, type: ToastType = 'info', timeOut: number = 6000) => {
		setToastState({
			open: true,
			message,
			type,
			timeOut
		})
	}, [])

	const hideToast = useCallback(() => {
		setToastState(prev => ({
			...prev,
			open: false
		}))
	}, [])

	return {
		toastOpen: toastState.open,
		toastMessage: toastState.message,
		toastType: toastState.type,
		timeOut: toastState.timeOut,
		setToastOpen: (open: boolean) => {
			if (!open) hideToast()
		},
		setToastMessage: (message: string) => {
			setToastState(prev => ({ ...prev, message }))
		},
		showToast,
		hideToast
	}
}
