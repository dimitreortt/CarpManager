import type { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form'
import { FormField } from './FormField'

interface YesNoFieldProps<T extends FieldValues> {
	form: UseFormReturn<T>
	name: FieldPath<T>
	label: string
	className?: string
	required?: boolean
	disabled?: boolean
	defaultValue?: 'yes' | 'no'
}

export const YesNoField = <T extends FieldValues>({
	form,
	name,
	label,
	className = '',
	required = false,
	disabled = false,
	defaultValue = 'no'
}: YesNoFieldProps<T>) => {
	const {
		register,
		formState: { errors },
		watch
	} = form
	const error = errors[name]
	const currentValue = watch(name) || defaultValue

	return (
		<FormField form={form} name={name} label={label} required={required} className={className}>
			<div className="d-flex gap-3">
				<div className="form-check">
					<input
						className="form-check-input"
						type="radio"
						id={`${name}-no`}
						{...register(name)}
						value="no"
						checked={currentValue === 'no'}
						disabled={disabled}
					/>
					<label className="form-check-label" htmlFor={`${name}-no`}>
						Não
					</label>
				</div>
				<div className="form-check">
					<input
						className="form-check-input"
						type="radio"
						id={`${name}-yes`}
						{...register(name)}
						value="yes"
						checked={currentValue === 'yes'}
						disabled={disabled}
					/>
					<label className="form-check-label" htmlFor={`${name}-yes`}>
						Sim
					</label>
				</div>
			</div>
		</FormField>
	)
}
