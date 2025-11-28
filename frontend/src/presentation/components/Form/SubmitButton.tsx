import { type UseFormReturn, type FieldValues } from 'react-hook-form'

interface SubmitButtonProps<T extends FieldValues> {
	form: UseFormReturn<T>
	children: React.ReactNode
	className?: string
	variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
	size?: 'sm' | 'lg'
	disabled?: boolean
}

export const SubmitButton = <T extends FieldValues>({
	form,
	children,
	className = '',
	variant = 'primary',
	size,
	disabled = false
}: SubmitButtonProps<T>) => {
	const {
		formState: { isSubmitting }
	} = form

	return (
		<button
			data-testid="submit-button"
			type="submit"
			className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`}
			disabled={isSubmitting || disabled}
		>
			{isSubmitting && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
			{children}
		</button>
	)
}
