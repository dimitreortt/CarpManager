import { type UseFormReturn, type FieldPath, type FieldValues } from 'react-hook-form'
import { FormField } from './FormField'
import { useState } from 'react'

interface SelectOption {
	value: string
	label: string
}

export interface SelectFormFieldProps<T extends FieldValues> {
	form: UseFormReturn<T>
	name: FieldPath<T>
	label: string
	options?: SelectOption[]
	placeholder?: string
	className?: string
	required?: boolean
	disabled?: boolean
}

export const SelectFormField = <T extends FieldValues>({
	form,
	name,
	label,
	options = [],
	placeholder,
	className = '',
	required = false,
	disabled = false
}: SelectFormFieldProps<T>) => {
	const [searchTerm, setSearchTerm] = useState('')
	const {
		register,
		formState: { errors },
		watch
	} = form
	const error = errors[name]
	const currentValue = watch(name)

	return (
		<>
			<FormField form={form} name={name} label={label} required={required} className={className}>
				<select
					{...register(name)}
					id={name}
					className={`form-select cursor-pointer-important ${error ? 'is-invalid' : ''}`}
					disabled={disabled}
					value={currentValue || ''}
					style={{ paddingTop: '8px', paddingBottom: '8px', borderWidth: '2px' }}
				>
					{placeholder && (
						<option value="" disabled>
							{placeholder}
						</option>
					)}
					{options.map((option: SelectOption) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</FormField>
		</>
	)
}
