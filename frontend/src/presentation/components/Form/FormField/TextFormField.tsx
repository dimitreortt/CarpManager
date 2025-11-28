import { useState } from 'react'
import { type UseFormReturn, type FieldPath, type FieldValues } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { FormField } from './FormField'

interface TextFormFieldProps<T extends FieldValues> {
	form: UseFormReturn<T>
	name: FieldPath<T>
	label: string
	type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'date' | 'percentage'
	placeholder?: string
	className?: string
	required?: boolean
	disabled?: boolean
	rows?: number
	onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
	mb?: string
	blurb?: string
	inputGroupClassName?: string
}

export const TextFormField = <T extends FieldValues>({
	form,
	name,
	label,
	type = 'text',
	placeholder,
	className = '',
	required = false,
	disabled = false,
	rows = 3,
	onChange,
	mb,
	blurb,
	inputGroupClassName
}: TextFormFieldProps<T>) => {
	const {
		register,
		formState: { errors }
	} = form
	const error = errors[name]

	const registerOptions = onChange ? { onChange } : undefined
	const registration = register(name, registerOptions as any)

	const [showPassword, setShowPassword] = useState(false)

	return (
		<FormField form={form} name={name} label={label} required={required} className={className} mb={mb} blurb={blurb}>
			{type === 'textarea' ? (
				<textarea
					{...registration}
					id={name}
					data-testid={name}
					className={`form-control ${error ? 'is-invalid' : ''}`}
					placeholder={placeholder}
					disabled={disabled}
					rows={rows}
				/>
			) : type === 'percentage' ? (
				<div className={`input-group ${inputGroupClassName}`}>
					<input
						{...registration}
						type="number"
						id={name}
						data-testid={name}
						className={`form-control ${error ? 'is-invalid' : ''}`}
						placeholder={placeholder}
						disabled={disabled}
						onChange={onChange}
					/>
					<span className="input-group-text">%</span>
				</div>
			) : type === 'password' ? (
				<div className={`input-group ${inputGroupClassName || ''}`}>
					<input
						{...registration}
						type={showPassword ? 'text' : 'password'}
						id={name}
						data-testid={name}
						className={`form-control ${error ? 'is-invalid' : ''}`}
						placeholder={placeholder}
						disabled={disabled}
						onChange={onChange}
					/>
					<button
						type="button"
						className="input-group-text bg-white border-start-0"
						onClick={() => setShowPassword(!showPassword)}
						tabIndex={-1}
						style={{ cursor: 'pointer' }}
					>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
				</div>
			) : (
				<input
					{...registration}
					type={type}
					id={name}
					data-testid={name}
					className={`form-control ${error ? 'is-invalid' : ''}`}
					placeholder={placeholder}
					disabled={disabled}
					onChange={onChange}
				/>
			)}
		</FormField>
	)
}
