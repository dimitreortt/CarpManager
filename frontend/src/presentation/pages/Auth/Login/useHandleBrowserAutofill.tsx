import type { UseFormReturn } from 'react-hook-form'
import type { LoginFormData } from './Login'
import { useEffect } from 'react'

export const useHandleBrowserAutofill = (form: UseFormReturn<LoginFormData>) => {
	useEffect(() => {
		const handleAutofill = () => {
			const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
			const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement

			if (emailInput && passwordInput) {
				const emailValue = emailInput.value
				const passwordValue = passwordInput.value

				if (emailValue && emailValue !== form.getValues('email')) {
					form.setValue('email', emailValue)
				}
				if (passwordValue && passwordValue !== form.getValues('password')) {
					form.setValue('password', passwordValue)
				}
			}
		}

		handleAutofill()
		const timeoutId = setTimeout(handleAutofill, 100)

		const emailInput = document.querySelector('input[type="email"]')
		const passwordInput = document.querySelector('input[type="password"]')

		if (emailInput) {
			emailInput.addEventListener('input', handleAutofill)
		}
		if (passwordInput) {
			passwordInput.addEventListener('input', handleAutofill)
		}

		return () => {
			clearTimeout(timeoutId)
			if (emailInput) {
				emailInput.removeEventListener('input', handleAutofill)
			}
			if (passwordInput) {
				passwordInput.removeEventListener('input', handleAutofill)
			}
		}
	}, [form])
}
