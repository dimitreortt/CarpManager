import { z } from 'zod'
import { Layout } from '../../components/Layout/Layout'
import { DateFormField } from '../../components/Form/FormField/DateFormField'
import { useAppContext } from '../../../main/AppContextProvider'
import type { UseFormReturn } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import type { Material } from '../../../infra/repository/MaterialRepository'
import type { Trip } from '../../../infra/repository/TripRepository'
import type { Client } from '../../../infra/repository/ClientRepository'
import { formatPrice } from '../../service/formatPrice'
import { useEstimatesViewState } from './useEstimatesViewState'
import { LoadingForm } from '../../components/Form/LoadingForm'
import { useMultiSelectState } from '../../components/Form/FormField/multiSelectState'
import { BaseFormPage } from '../../components/Form/BaseFormPage'
import { TextFormField } from '../../components/Form/FormField/TextFormField'
import { SelectWithSearchFormField } from '../../components/Form/FormField/SelectWithSearchFormField'
import { BrazilianCurrencyField } from '../../components/Form/FormField/BrazilianCurrencyField'
import { MultiSelectField } from '../../components/Form/FormField/MultiSelectField'
import type { Repository } from '../../../infra/repository/Repository'

const estimateSchema = z.object({
	name: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
	clientId: z.string().optional(),
	description: z.string().optional(),
	precutCost: z.coerce.number().min(0, 'Valor do cortado deve ser maior ou igual a zero').optional(),
	laborCost: z.coerce.number().min(0, 'Valor da mão de obra deve ser maior ou igual a zero'),
	totalValue: z.coerce.number().min(0, 'Valor deve ser maior ou igual a zero'),
	status: z.enum(['pending', 'accepted']),
	dueDate: z.string(),
	notes: z.string().optional(),
	materials: z.array(z.object({ id: z.string(), value: z.coerce.number() })).optional(),
	tripServiceCosts: z.array(z.object({ id: z.string(), value: z.coerce.number() })).optional()
})

type EstimateFormData = z.infer<typeof estimateSchema>

export const EstimatesForm = () => {
	const { estimateRepository, supplierRepository, materialRepository, tripRepository, clientRepository, user, searchParams, refresh } =
		useAppContext()
	const { estimate: estimateData, loading } = useEstimatesViewState()
	const [materials, setMaterials] = useState<Material[]>([])
	const [trips, setTrips] = useState<Trip[]>([])
	const [clients, setClients] = useState<Client[]>([])
	const { customOptionValues } = useMultiSelectState()

	const status = (searchParams.get('status') as 'pending' | 'accepted') || 'pending'

	useEffect(() => {
		refresh()
	}, [customOptionValues])

	const loadMaterials = useCallback(async () => {
		const materials = await materialRepository.getAll()
		setMaterials(materials)
	}, [materialRepository])

	const loadTrips = useCallback(async () => {
		if (loading) return
		const trips = await tripRepository.getAll({ available: true, estimateId: estimateData?.id })
		setTrips(trips)
	}, [loading])

	useEffect(() => {
		loadMaterials()
	}, [materialRepository])

	useEffect(() => {
		loadTrips()
	}, [tripRepository, loadTrips])

	const loadClients = useCallback(async () => {
		const clients = await clientRepository.getAll()
		setClients(clients)
	}, [clientRepository])

	useEffect(() => {
		loadClients()
	}, [clientRepository])

	const calculateTripValue = (trip: Trip | undefined) => {
		if (!trip) return 0
		if (trip.numberOfServices) {
			return trip.totalCost / trip.numberOfServices
		}
		return trip.totalCost || 0
	}

	const calculateTotal = (form: UseFormReturn<EstimateFormData>) => {
		const selectedMaterialObjs = form.getValues('materials')
		const materialsCost = selectedMaterialObjs?.map(material => material.value).reduce((sum, val) => sum + val, 0) || 0

		const serviceCosts = form.getValues('tripServiceCosts')
		const tripsCost = serviceCosts?.map(service => service.value).reduce((sum, val) => sum + val, 0) || 0

		const precutCost = Number(form.getValues('precutCost') || 0)
		const laborCost = Number(form.getValues('laborCost') || 0)

		const total = materialsCost + tripsCost + precutCost + laborCost

		form.setValue('totalValue', total, { shouldDirty: true, shouldValidate: true })
	}

	if (loading) {
		return <LoadingForm />
	}

	return (
		<Layout>
			<BaseFormPage<EstimateFormData>
				schema={estimateSchema}
				isEdit={!!estimateData}
				repository={estimateRepository as Repository<EstimateFormData>}
				label={status === 'pending' ? 'Orçamento' : 'Pedido'}
				navigateTo={`${status === 'pending' ? '/estimates' : '/orders'}`}
				navigateBackTo={`${status === 'pending' ? '/estimates' : '/orders'}`}
				baseData={estimateData as EstimateFormData | undefined}
				defaultValues={{
					name: estimateData?.name || '',
					clientId: estimateData?.clientId || undefined,
					description: estimateData?.description || '',
					precutCost: (estimateData as any)?.precutCost || 0,
					totalValue: estimateData?.totalValue || 0,
					laborCost: estimateData?.laborCost || 0,
					dueDate: estimateData?.dueDate ? estimateData.dueDate.split('T')[0] : '',
					notes: estimateData?.notes || '',
					materials: estimateData?.estimateMaterials?.map(material => ({ id: material.materialId, value: material.price })) || [],
					tripServiceCosts: estimateData?.tripServiceCosts?.map(service => ({ id: service.id, value: service.cost })) || [],
					status: status || 'pending'
				}}
				entityKey={status === 'pending' ? 'estimate' : 'order'}
			>
				{form => {
					return (
						<div>
							<TextFormField
								form={form}
								name="name"
								label={`Título do ${status === 'pending' ? 'Orçamento' : 'Pedido'}`}
								placeholder="Ex: Reforma Residencial"
							/>

							<SelectWithSearchFormField
								form={form}
								name="clientId"
								label="Cliente"
								placeholder="Selecione um cliente"
								options={clients.map(client => ({
									value: client.id,
									label: client.name
								}))}
								reloadItems={loadClients}
								addNewPath="/clients/form"
								addNewLabel="Adicionar Cliente"
							/>

							<BrazilianCurrencyField form={form} name="precutCost" label="Valor do Cortado (R$)" />

							<MultiSelectField
								form={form}
								name="materials"
								label="Materiais"
								placeholder="Selecione os materiais"
								addNewPath="/materials/form"
								addNewLabel="Adicionar Material"
								loadItems={loadMaterials}
								blurb="Selecione os materiais que serão usados no pedido (a soma dos valores dos materiais será exibida abaixo)"
								mb="mb-1"
								showValueAsCurrency={true}
								allowChangeOptionValue={true}
								options={materials.map(material => {
									const currentMaterialObjs = estimateData?.estimateMaterials || []
									const mat = currentMaterialObjs.find(m => m.materialId === material.id)
									const price = mat?.price || material.price || 0
									return {
										item: {
											id: material.id,
											value: price
										},
										label: material.name
									}
								})}
							/>

							<div className="mb-3">
								<span className="form-label">Valor dos materiais: </span>
								{formatPrice(
									form
										.getValues('materials')
										?.map(material => material.value || materials.find(m => m.id === material.id)?.price || 0)
										.reduce((sum, val) => sum + val, 0) || '0'
								)}
							</div>

							<MultiSelectField
								form={form}
								name="tripServiceCosts"
								label="Viagens"
								placeholder="Nome"
								addNewPath="/trips/form"
								addNewLabel="Adicionar Viagem"
								loadItems={loadTrips}
								options={trips
									.map(trip => {
										const serviceCosts = trip.serviceCosts || []
										return serviceCosts.map((service, index) => {
											return {
												item: {
													id: service.id,
													value: service.cost
												},
												label: `${trip.name} - ${formatPrice(service.cost)}`
											}
										})
									})
									.flat()}
							/>

							<BrazilianCurrencyField form={form} name="laborCost" label="Valor da Mão de Obra (R$)" />

							<BrazilianCurrencyField
								form={form}
								name="totalValue"
								label="Valor Total (R$)"
								mb="mb-2"
								blurb="Valor total é a soma do custo do cortado, valores dos materiais utilizados, viagens realizadas para concluir o pedido e a mão de obra."
							/>

							<button type="button" className="btn btn-outline-secondary mb-3 py-1" onClick={() => calculateTotal(form)}>
								Calcular total
							</button>

							<DateFormField form={form} name="dueDate" label="Data de Fechamento" />

							<TextFormField
								form={form}
								name="notes"
								label="Observações"
								type="textarea"
								placeholder="Observações sobre o orçamento..."
								rows={3}
							/>
						</div>
					)
				}}
			</BaseFormPage>
		</Layout>
	)
}
