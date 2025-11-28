import { z } from 'zod'
import { Layout } from '../../../components/Layout/Layout'
import { useLocation } from 'react-router'
import { TextFormField } from '../../../components/Form/FormField/TextFormField'
import { SelectFormField } from '../../../components/Form/FormField/SelectFormField'
import { BaseFormPage } from '../../../components/Form/BaseFormPage'
import { PaymentMethodField } from '../../../components/Form/FormField/PaymentMethodField'
import { SelectWithSearchFormField } from '../../../components/Form/FormField/SelectWithSearchFormField'
import { useAppContext } from '../../../../main/AppContextProvider'
import type { UseFormReturn } from 'react-hook-form'
import type { Incoming } from '../../../../infra/repository/IncomingRepository'
import { useState, useEffect, useCallback } from 'react'
import { DateFormField } from '../../../components/Form/FormField/DateFormField'
import { BrazilianCurrencyField } from '../../../components/Form/FormField/BrazilianCurrencyField'
import { getCategoryOptions, getNumberOfInstallmentsOptions, getPaymentMethodOptions, getStatusOptions } from './getOptions'
import { YesNoField } from '../../../components/Form/FormField/YesNoField'
import { HandleCreateOrder } from './HandleCreateOrder'

const incomingSchema = z.object({
	name: z.string(),
	amount: z.number().optional(),
	date: z.string(),
	paymentMethod: z.string(),
	status: z.string().optional(),
	notes: z.string().optional(),
	numberOfInstallments: z.coerce.number().optional(),
	installmentNumber: z.coerce.number().optional(),
	shouldCreateInstallments: z.enum(['yes', 'no']).optional(),
	estimateId: z.string().optional(),
	clientId: z.string().optional().nullable()
})

type IncomingFormData = z.infer<typeof incomingSchema>

interface IncomingFormProps {
	incoming?: Incoming
}

export const IncomingForm = ({ incoming }: IncomingFormProps) => {
	const { incomingRepository, estimateRepository, showToast, navigate, user, clientRepository, useParams, searchParams } = useAppContext()
	const location = useLocation()
	const incomingFromState = location.state?.incoming as Incoming | undefined
	const incomingData = incoming || incomingFromState
	const [estimates, setEstimates] = useState<any[]>([])
	const [clients, setClients] = useState<any[]>([])
	const [incomingForOrder, setIncomingForOrder] = useState<Incoming | null>(null)
	const status = searchParams.get('status')
	const isDuplicate = searchParams.get('duplicate')
	const isEdit = !!incomingData

	const loadEstimates = useCallback(async () => {
		const estimatesList = await estimateRepository.getAll()
		setEstimates(estimatesList)
	}, [estimateRepository])

	useEffect(() => {
		loadEstimates()
	}, [estimateRepository])

	const loadClients = useCallback(async () => {
		const clientsList = await clientRepository.getAll()
		setClients(clientsList)
	}, [clientRepository])

	useEffect(() => {
		loadClients()
	}, [clientRepository])

	const handleCreateOrder = async (incoming: Incoming) => {
		const estimate = await estimateRepository.getById(incoming.estimateId!)
		if (estimate?.status === 'accepted') {
			doNavigate()
			return
		}
		setIncomingForOrder(incoming)
	}

	const doNavigate = () => {
		navigate(`/finance/incoming?tab=${status}`)
	}

	const handleCreate = async (validatedValues: IncomingFormData, isDuplicate: boolean) => {
		await incomingRepository.create({ ...validatedValues, createdAt: new Date().toISOString() } as Incoming)
		showToast(`Entrada ${isDuplicate ? 'duplicada' : 'criada'} com sucesso`, 'success')

		if (validatedValues.estimateId && status === 'received') {
			await handleCreateOrder(validatedValues as Incoming)
		} else {
			doNavigate()
		}
	}

	const handleUpdate = async (validatedValues: IncomingFormData) => {
		await incomingRepository.update({ ...incomingData, ...validatedValues } as Incoming)
		showToast(`Entrada atualizada com sucesso`, 'success')
	}

	const handleSubmit = async (validatedValues: IncomingFormData) => {
		try {
			if (isDuplicate) {
				await handleCreate(validatedValues, !!isDuplicate)
				return
			} else if (isEdit) {
				await handleUpdate(validatedValues)
			} else {
				await handleCreate(validatedValues, !!isDuplicate)
				return
			}

			doNavigate()
		} catch (error) {
			showToast(`Erro ao salvar entrada`, 'error')
		}
	}

	return (
		<Layout>
			<BaseFormPage
				schema={incomingSchema}
				defaultValues={{
					name: incomingData?.name || '',
					amount: incomingData?.amount || 0,
					date: incomingData?.date ? incomingData.date.split('T')[0] : undefined,
					clientId: incomingData?.clientId,
					paymentMethod: incomingData?.paymentMethod || '',
					numberOfInstallments: incomingData?.numberOfInstallments || 1,
					installmentNumber: incomingData?.installmentNumber || 1,
					status: status || 'pending',
					notes: incomingData?.notes || '',
					estimateId: incomingData?.estimateId || '',
					shouldCreateInstallments: 'no'
				}}
				label="Entrada"
				labelFeminine={true}
				onSubmit={handleSubmit}
				isEdit={isEdit}
				baseData={incomingData as Incoming}
				repository={incomingRepository}
				navigateTo={`/finance/incoming?tab=${status}`}
				navigateBackTo={`/finance/incoming?tab=${status}`}
				entityKey={status + 'Incoming'}
			>
				{form => (
					<div>
						<TextFormField form={form} name="name" label="Título da Entrada" placeholder="Ex: Pagamento de Serviço" required />

						<SelectWithSearchFormField
							form={form}
							name="clientId"
							label="Cliente"
							placeholder="Selecione um cliente"
							addNewPath="/clients/form"
							addNewLabel="Adicionar Cliente"
							reloadItems={loadClients}
							options={clients.map(client => ({
								value: client.id,
								label: client.name
							}))}
						/>

						<SelectWithSearchFormField
							form={form}
							name="estimateId"
							label="Orçamento/Pedido Relacionado"
							placeholder="Selecione uma opção"
							addNewPath="/estimates/form"
							addNewLabel="Adicionar Orçamento"
							reloadItems={loadEstimates}
							options={estimates.map(estimate => ({
								value: estimate.id,
								label: estimate.name
							}))}
						/>

						<BrazilianCurrencyField form={form} name="amount" label="Valor (R$)" />

						<DateFormField form={form} name="date" label="Data" />

						<PaymentMethodField form={form} name="paymentMethod" />

						<div className="mb-3">
							<label htmlFor="notes" className="form-label">
								Observações
							</label>
							<textarea
								{...form.register('notes')}
								className="form-control"
								id="notes"
								rows={3}
								placeholder="Observações sobre a entrada..."
							></textarea>
						</div>
					</div>
				)}
			</BaseFormPage>

			<HandleCreateOrder
				incomingForOrder={incomingForOrder}
				setIncomingForOrder={setIncomingForOrder}
				callback={() => {
					doNavigate()
				}}
			/>
		</Layout>
	)
}
