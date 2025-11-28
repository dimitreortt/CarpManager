import { z } from 'zod'
import { Layout } from '../../components/Layout/Layout'
import { BaseForm } from '../../components/Form/BaseForm'
import { BrazilianCurrencyField } from '../../components/Form/FormField/BrazilianCurrencyField'
import { TextFormField } from '../../components/Form/FormField/TextFormField'
import { SelectWithSearchFormField } from '../../components/Form/FormField/SelectWithSearchFormField'
import { BaseFormPage } from '../../components/Form/BaseFormPage'
import { useAppContext } from '../../../main/AppContextProvider'
import type { UseFormReturn } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import type { Estimate } from '../../../infra/repository/EstimateRepository'
import type { Supplier } from '../../../infra/repository/SupplierRepository'
import { useQuoteViewState } from './useQuoteViewState'
import { LoadingForm } from '../../components/Form/LoadingForm'
import { DateFormField } from '../../components/Form/FormField/DateFormField'

const quoteSchema = z.object({
	name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
	description: z.string().optional(),
	amount: z.number().optional(),
	date: z.string(),
	supplierId: z.string().optional(),
	estimateId: z.string().optional()
})

type QuoteFormData = z.infer<typeof quoteSchema>

export const QuotesForm = () => {
	const { quoteRepository, estimateRepository, supplierRepository, user } = useAppContext()
	const { quote: quoteData, loading } = useQuoteViewState()
	const [estimates, setEstimates] = useState<Estimate[]>([])
	const [suppliers, setSuppliers] = useState<Supplier[]>([])

	const loadSuppliers = useCallback(async () => {
		const suppliers = await supplierRepository.getAll()
		setSuppliers(suppliers)
	}, [supplierRepository])

	const loadEstimates = useCallback(async () => {
		const estimates = await estimateRepository.getAll()
		setEstimates(estimates)
	}, [estimateRepository])

	useEffect(() => {
		loadSuppliers()
	}, [supplierRepository])

	useEffect(() => {
		loadEstimates()
	}, [estimateRepository])

	if (loading) {
		return <LoadingForm />
	}

	return (
		<Layout>
			<BaseFormPage
				schema={quoteSchema}
				defaultValues={{
					name: quoteData?.name || '',
					description: quoteData?.description || '',
					amount: quoteData?.amount || 0,
					date: quoteData?.date ? quoteData.date.split('T')[0] : '',
					supplierId: quoteData?.supplierId || '',
					estimateId: quoteData?.estimateId || ''
				}}
				label="Cotação"
				labelFeminine={true}
				navigateBackTo="/quotes"
				isEdit={!!quoteData}
				baseData={quoteData as any}
				repository={quoteRepository}
				navigateTo="/quotes"
				entityKey="quote"
			>
				{form => (
					<div>
						<TextFormField form={form} name="name" label="Nome da Cotação" placeholder="Ex: Cotação para Madeira" />

						<BrazilianCurrencyField form={form} name="amount" label="Valor da Cotação (R$)" />

						<SelectWithSearchFormField
							form={form}
							name="supplierId"
							label="Fornecedor"
							placeholder="Selecione um fornecedor"
							reloadItems={loadSuppliers}
							addNewPath="/suppliers/form"
							addNewLabel="Adicionar Fornecedor"
							options={suppliers.map((supplier: Supplier) => ({
								value: supplier.id,
								label: supplier.name
							}))}
						/>

						<SelectWithSearchFormField
							form={form}
							name="estimateId"
							label="Orçamento"
							placeholder="Selecione um orçamento"
							reloadItems={loadEstimates}
							addNewPath="/estimates/form"
							addNewLabel="Adicionar Orçamento"
							options={estimates.map((estimate: Estimate) => ({
								value: estimate.id,
								label: estimate.name
							}))}
						/>

						<DateFormField form={form} name="date" label="Data" />

						<TextFormField
							form={form}
							name="description"
							label="Descrição"
							type="textarea"
							placeholder="Detalhes da cotação..."
							rows={3}
						/>
					</div>
				)}
			</BaseFormPage>
		</Layout>
	)
}
