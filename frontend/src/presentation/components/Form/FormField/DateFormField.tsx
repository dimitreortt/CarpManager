import { type UseFormReturn } from 'react-hook-form'
import { FormField } from './FormField'
import { useEffect } from 'react'

export const DateFormField = ({
	form,
	name,
	label,
	required,
	defaultValue,
	className
}: {
	form: UseFormReturn<any>
	name: string
	label: string
	required?: boolean
	defaultValue?: Date | string
	className?: string
}) => {
	const {
		setValue,
		register,
		formState: { errors }
	} = form
	const error = errors[name]

	const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
		e.currentTarget.showPicker?.()
	}

	useEffect(() => {
		if (defaultValue) {
			const dateString = typeof defaultValue === 'string' ? defaultValue : defaultValue.toISOString().split('T')[0]
			setValue(name, dateString)
		}
	}, [defaultValue])

	return (
		<FormField form={form} name={name} label={label} required={required} className={className}>
			<input
				{...register(name)}
				type="date"
				className={`form-control ${error ? 'is-invalid' : ''}`}
				id={name}
				style={{ cursor: 'pointer' }}
				onClick={handleInputClick}
			/>
		</FormField>
	)
}
