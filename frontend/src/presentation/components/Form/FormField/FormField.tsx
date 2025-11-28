import { RefreshCcw } from 'lucide-react'
import { type UseFormReturn, type FieldPath } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
	form: UseFormReturn<T>
	name: FieldPath<T>
	label: string
	className?: string
	required?: boolean
	children?: React.ReactNode
	mb?: string
	blurb?: string
	onRefresh?: () => void
	maxWidth?: string
}

export const FormField = <T extends FieldValues>({
	form,
	name,
	label,
	className = '',
	required = false,
	children,
	mb = 'mb-3',
	blurb,
	onRefresh,
	maxWidth
}: FormFieldProps<T>) => {
	const {
		formState: { errors }
	} = form
	const error = errors[name]

	return (
		<div className={`${mb} ${className}`} style={{ maxWidth }}>
			<label htmlFor={name} className="form-label">
				{label}
				{required && <span className="text-danger ms-1">*</span>}
				{onRefresh && (
					<span
						title="Recarregar opções"
						className="btn btn-outline-secondary p-1 border-none-important text-muted ms-1 cursor-pointer-important"
						onClick={onRefresh}
						style={{ marginTop: '-2px' }}
					>
						<RefreshCcw size={14} />
					</span>
				)}
			</label>
			{blurb && <div className="text-muted mb-2 d-block">{blurb}</div>}
			{children}
			{error && <div className="invalid-feedback">{error.message as string}</div>}
		</div>
	)
}
