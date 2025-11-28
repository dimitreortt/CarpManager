import { z } from 'zod'
import { Layout } from '../../../components/Layout/Layout'
import { TextFormField } from '../../../components/Form/FormField/TextFormField'
import { SelectFormField } from '../../../components/Form/FormField/SelectFormField'
import { useAppContext } from '../../../../main/AppContextProvider'
import type { UseFormReturn } from 'react-hook-form'
import type { Outgoing } from '../../../../infra/repository/OutgoingRepository'
import { DateFormField } from '../../../components/Form/FormField/DateFormField'
import { TypeaheadSelectField } from '../../../components/Form/FormField/TypeaheadSelectField'
import { BaseFormPage } from '../../../components/Form/BaseFormPage'
import { BrazilianCurrencyField } from '../../../components/Form/FormField/BrazilianCurrencyField'
import { SelectWithSearchFormField } from '../../../components/Form/FormField/SelectWithSearchFormField'
import { PaymentMethodField } from '../../../components/Form/FormField/PaymentMethodField'
import { outgoingCategories } from './outgoingCategories'
import { useLoadRecordsByEntity } from '../../../hooks/useLoadRecords'

const outgoingSchema = z.object({
	name: z.string(),
	date: z.string().optional(),
	paymentMethod: z.string().optional(),
	description: z.string().optional(),
	category: z.string().optional(),
	accountType: z.string().optional(),
	status: z.string().optional(),
	supplierId: z.string().optional(),
	employeeId: z.string().optional(),
	amount: z.number().optional()
})

type OutgoingFormData = z.infer<typeof outgoingSchema>

interface OutgoingFormProps {
	outgoing?: Outgoing
}

export const OutgoingForm = ({ outgoing }: OutgoingFormProps) => {
	const { outgoingRepository, user, location, searchParams } = useAppContext()
	const outgoingFromState = location.state?.outgoing as Outgoing | undefined
	const outgoingData = outgoing || outgoingFromState
	const status = searchParams.get('status')
	const { records: employees } = useLoadRecordsByEntity('employee')
	const { records: suppliers, invalidate: loadSuppliers } = useLoadRecordsByEntity('supplier')

	return (
		<Layout>
			<BaseFormPage
				schema={outgoingSchema}
				defaultValues={{
					name: outgoingData?.name || '',
					date: outgoingData?.date ? outgoingData.date.split('T')[0] : '',
					paymentMethod: outgoingData?.paymentMethod,
					description: outgoingData?.description || '',
					category: outgoingData?.category,
					supplierId: outgoingData?.supplierId || '',
					employeeId: outgoingData?.employeeId || '',
					accountType: outgoingData?.accountType || '',
					status: status || 'pending',
					amount: outgoingData?.amount || 0
				}}
				label={`Saída ${status === 'pending' ? 'A Pagar' : 'Paga'}`}
				labelFeminine={true}
				navigateTo={`/finance/outgoing?tab=${status}`}
				navigateBackTo={`/finance/outgoing?tab=${status}`}
				isEdit={!!outgoingData}
				baseData={outgoingData as Outgoing}
				repository={outgoingRepository}
				entityKey={status + 'Outgoing'}
			>
				{form => (
					<div>
						<TextFormField form={form} name="name" label="Nome" placeholder="Ex: Folha de pagamento, Número de pedido" />

						<SelectWithSearchFormField
							form={form}
							name="supplierId"
							label="Fornecedor"
							placeholder="Selecione um fornecedor"
							reloadItems={loadSuppliers}
							addNewPath="/suppliers/form"
							addNewLabel="Adicionar Fornecedor"
							options={suppliers.map(supplier => ({
								value: supplier.id,
								label: supplier.name
							}))}
						/>

						<BrazilianCurrencyField form={form} name="amount" label="Valor (R$)" />

						<PaymentMethodField
							form={form}
							name="paymentMethod"
							label="Método de Pagamento"
							placeholder="Selecione o método de pagamento"
						/>

						<SelectFormField
							form={form}
							name="category"
							label="Categoria"
							placeholder="Selecione uma categoria"
							options={outgoingCategories}
						/>

						{form.watch('category') === 'salary' && (
							<SelectFormField
								form={form}
								name="employeeId"
								label="Funcionário"
								placeholder="Selecione um funcionário"
								options={employees.map(employee => ({
									value: employee.id,
									label: employee.name
								}))}
							/>
						)}

						<DateFormField form={form} name="date" label="Data" />

						<TypeaheadSelectField
							form={form}
							name="accountType"
							label="Tipo de Conta"
							placeholder="Digite para buscar tipos de conta..."
							fetchSuggestions={outgoingRepository.lookupAccountType}
						/>

						{/* <SelectFormField form={form} name="status" label="Status" placeholder="Selecione um status" options={outgoingStatuses} /> */}

						<TextFormField form={form} name="description" label="Descrição" type="textarea" placeholder="Detlhes da saída..." rows={3} />
					</div>
				)}
			</BaseFormPage>
		</Layout>
	)
}
