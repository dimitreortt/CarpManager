import { type UseFormReturn, type FieldPath, type FieldValues } from 'react-hook-form'
import { Form } from 'react-router'
import { FormField } from './FormField'

interface BrazilianCurrencyFieldProps<T extends FieldValues> {
	form: UseFormReturn<T>
	name: FieldPath<T>
	label: string
	value?: number
	placeholder?: string
	className?: string
	required?: boolean
	disabled?: boolean
	mb?: string
	blurb?: string
	readonly?: boolean
	maxWidth?: string
}

export const BrazilianCurrencyField = <T extends FieldValues>({
	form,
	name,
	label,
	value,
	placeholder,
	className = '',
	required = false,
	disabled = false,
	mb,
	blurb,
	readonly = false,
	maxWidth
}: BrazilianCurrencyFieldProps<T>) => {
	const {
		setValue,
		watch,
		formState: { errors }
	} = form

	const valueToUse = value || (watch(name) as number | undefined)

	const formatCurrency = (val: number | undefined): string => {
		if (typeof val !== 'number' || isNaN(val)) return ''
		return val.toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		})
	}

	const parseCurrency = (val: string): number | undefined => {
		const numeric = parseFloat(val.replace(/\D/g, '')) / 100
		return isNaN(numeric) ? undefined : numeric
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const num = parseCurrency(e.target.value)
		setValue(name, (num as any) || 0, { shouldValidate: true })
	}

	const error = errors[name]

	return (
		<FormField form={form} name={name} label={label} required={required} className={className} mb={mb} blurb={blurb} maxWidth={maxWidth}>
			<input
				id={name}
				className={`form-control ${error ? 'is-invalid' : ''}`}
				placeholder={placeholder ?? 'R$ 0,00'}
				disabled={disabled || readonly}
				value={formatCurrency(valueToUse)}
				onChange={handleChange}
			/>
		</FormField>
	)
}
