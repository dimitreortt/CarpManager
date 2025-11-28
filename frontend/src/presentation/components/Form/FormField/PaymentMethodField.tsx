import { SelectFormField, type SelectFormFieldProps } from './SelectFormField'
import { getPaymentMethodOptions } from '../../../pages/Finance/Incoming/getOptions'
import { type UseFormReturn, type FieldPath } from 'react-hook-form'

export const PaymentMethodField = (props: Partial<SelectFormFieldProps<any>>) => {
	return (
		<SelectFormField
			form={props.form as UseFormReturn<any>}
			name={props.name as FieldPath<any>}
			label={props.label || 'Método de Pagamento'}
			placeholder={props.placeholder || 'Selecione um método'}
			options={getPaymentMethodOptions()}
			className={props.className}
		/>
	)
}
