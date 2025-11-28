import { z } from 'zod'
import { Layout } from '../../components/Layout/Layout'
import { BrazilianCurrencyField } from '../../components/Form/FormField/BrazilianCurrencyField'
import { TextFormField } from '../../components/Form/FormField/TextFormField'
import { BaseFormPage } from '../../components/Form/BaseFormPage'
import { DateFormField } from '../../components/Form/FormField/DateFormField'
import { useAppContext } from '../../../main/AppContextProvider'
import type { UseFormReturn } from 'react-hook-form'
import type { Trip } from '../../../infra/repository/TripRepository'
import { useCallback, useEffect, useState } from 'react'
import type { Estimate } from '../../../infra/repository/EstimateRepository'
import { Plus, Trash2 } from 'lucide-react'

const tripSchema = z.object({
	name: z.string(),
	destination: z.string(),
	date: z.string(),
	numberOfTolls: z.coerce.number().min(0, 'Número de pedágios deve ser maior ou igual a zero'),
	costOfTolls: z.coerce.number().min(0, 'Custo dos pedágios deve ser maior ou igual a zero'),
	numberOfLunches: z.coerce.number().min(0, 'Número de almoços deve ser maior ou igual a zero'),
	costOfLunches: z.coerce.number().min(0, 'Custo dos almoços deve ser maior ou igual a zero'),
	costOfFuel: z.coerce.number().min(0, 'Custo do combustível deve ser maior ou igual a zero'),
	numberOfServices: z.coerce.number().min(1, 'Número de serviços deve ser pelo menos 1'),
	estimateId: z.string().optional(),
	serviceCosts: z
		.array(
			z.object({
				id: z.string().optional(),
				cost: z.coerce.number().min(0, 'Valor do serviço deve ser maior ou igual a zero')
			})
		)
		.optional(),
	totalCost: z.coerce.number().min(0, 'Custo total deve ser maior ou igual a zero'),
	notes: z.string().optional()
})

type TripFormData = z.infer<typeof tripSchema>

interface TripFormProps {
	trip?: Trip
}

export const TripForm = ({ trip }: TripFormProps) => {
	const [numberOfServices, setNumberOfServices] = useState(1)
	const [estimates, setEstimates] = useState<Estimate[]>([])
	const { tripRepository, estimateRepository, showToast, navigate, user, location, searchParams } = useAppContext()
	const tripFromState = location.state?.trip as Trip | undefined
	const tripData = trip || tripFromState
	const isDuplicate = searchParams.get('duplicate') === 'true'

	const loadEstimates = useCallback(async () => {
		const estimates = await estimateRepository.getAll()
		setEstimates(estimates)
	}, [estimateRepository])

	useEffect(() => {
		loadEstimates()
	}, [estimateRepository])

	useEffect(() => {
		const number = tripData?.numberOfServices ? (tripData.numberOfServices > 5 ? 5 : tripData.numberOfServices) : 1
		setNumberOfServices(number)
	}, [tripData?.numberOfServices])

	const getInitialServiceCosts = () => {
		const numberOfServices = tripData?.numberOfServices || 1
		const existingServiceCosts = tripData?.serviceCosts || []

		return Array.from({ length: numberOfServices }, (_, index) => ({
			id: existingServiceCosts[index]?.id || '',
			cost: existingServiceCosts[index]?.cost || 0
		}))
	}

	const calculateTotalCost = (form: UseFormReturn<TripFormData>) => {
		const costOfTolls = parseFloat(String(form.watch('costOfTolls') || '0')) || 0
		const costOfLunches = parseFloat(String(form.watch('costOfLunches') || '0')) || 0
		const costOfFuel = parseFloat(String(form.watch('costOfFuel') || '0')) || 0
		const calculatedTotal = costOfTolls + costOfLunches + costOfFuel
		form.setValue('totalCost', calculatedTotal)
	}

	const handleSetNumberOfServices = (form: UseFormReturn<TripFormData>, numberOfServices: number) => {
		form.setValue('numberOfServices', numberOfServices)
		setNumberOfServices(numberOfServices)
	}

	const handleAddService = (form: UseFormReturn<TripFormData>) => {
		let newNumberOfServices = numberOfServices + 1
		const currentServiceCosts = tripData?.serviceCosts || form.getValues('serviceCosts') || []

		if (newNumberOfServices > 5) newNumberOfServices = 5
		handleSetNumberOfServices(form, newNumberOfServices)

		if (newNumberOfServices < currentServiceCosts.length) {
			const newServiceCosts = currentServiceCosts.slice(0, newNumberOfServices)
			form.setValue('serviceCosts', newServiceCosts)
			return
		}

		const newServiceCosts = [...currentServiceCosts]
		for (let i = currentServiceCosts.length; i < newNumberOfServices; i++) {
			newServiceCosts.push({ cost: 0 })
		}
		form.setValue('serviceCosts', newServiceCosts)
	}

	const handleRemoveService = (form: UseFormReturn<TripFormData>, index: number) => {
		const serviceCosts = form.getValues('serviceCosts') || []
		const newServiceCosts = [...serviceCosts]
		newServiceCosts.splice(index, 1)
		form.setValue('serviceCosts', newServiceCosts)
		form.setValue('numberOfServices', newServiceCosts.length)
		handleSetNumberOfServices(form, newServiceCosts.length)
	}

	return (
		<Layout>
			<BaseFormPage
				schema={tripSchema}
				defaultValues={{
					name: tripData?.name || '',
					destination: tripData?.destination || '',
					date: tripData?.date ? tripData.date.split('T')[0] : '',
					numberOfTolls: tripData?.numberOfTolls || 0,
					costOfTolls: tripData?.costOfTolls || 0,
					numberOfLunches: tripData?.numberOfLunches || 0,
					costOfLunches: tripData?.costOfLunches || 0,
					costOfFuel: tripData?.costOfFuel || 0,
					numberOfServices: tripData?.numberOfServices || 1,
					serviceCosts: getInitialServiceCosts(),
					totalCost: tripData?.totalCost || 0,
					notes: tripData?.notes || '',
					estimateId: tripData?.estimate || ''
				}}
				label="Viagem"
				labelFeminine={true}
				navigateBackTo="/trips"
				isEdit={!!tripData}
				baseData={tripData as any}
				repository={tripRepository}
				navigateTo="/trips"
				entityKey="trip"
			>
				{form => {
					return (
						<div>
							<TextFormField form={form} name="name" label="Título da Viagem" placeholder="Ex: Viagem para São Paulo" />

							<TextFormField form={form} name="destination" label="Destino" placeholder="Ex: São Paulo, SP" />

							<DateFormField form={form} name="date" label="Data" />

							<div className="row">
								<div className="col-md-6">
									<TextFormField form={form} name="numberOfTolls" label="Número de Pedágios" type="number" placeholder="0" />
								</div>
								<div className="col-md-6">
									<BrazilianCurrencyField form={form} name="costOfTolls" label="Custo dos Pedágios (R$)" />
								</div>
							</div>

							<div className="row">
								<div className="col-md-6">
									<TextFormField form={form} name="numberOfLunches" label="Número de Almoços" type="number" placeholder="0" />
								</div>
								<div className="col-md-6">
									<BrazilianCurrencyField form={form} name="costOfLunches" label="Custo dos Almoços (R$)" />
								</div>
							</div>

							<BrazilianCurrencyField form={form} name="costOfFuel" label="Custo do Combustível (R$)" />

							<BrazilianCurrencyField
								form={form}
								name="totalCost"
								label="Custo Total (R$)"
								mb="mb-2"
								blurb="Custo total é a soma do custo dos pedágios, custo dos almoços e custo do combustível"
							/>

							<button type="button" className="btn btn-outline-secondary mb-3 py-1" onClick={() => calculateTotalCost(form)}>
								Calcular Total
							</button>

							<div className="d-flex gap-2 align-items-end mb-3">
								<div className="d-flex flex-column">
									<span className="form-label">Número de Serviços</span>
									<span>Número de serviços realizados nesta viagem</span>
									<span className="form-control mt-2 disabled text-muted bg-light">{numberOfServices}</span>
								</div>

								<button type="button" className="btn btn-outline-primary py-2" onClick={() => handleAddService(form)}>
									<Plus /> Adicionar Serviço
								</button>
							</div>
							<label className="form-label">Distribuição dos custos por serviço</label>

							{numberOfServices > 0 && (
								<div className="mb-1">
									{form.watch('serviceCosts')?.map((_: any, index: number) => (
										<div key={index} className="d-flex align-items-end">
											<BrazilianCurrencyField
												form={form}
												name={`serviceCosts.${index}.cost`}
												label={`Valor do Serviço ${index + 1}`}
												placeholder="0"
												className="flex-grow-1"
												maxWidth="275px"
											/>

											<button
												type="button"
												className="btn btn-outline-danger mb-3 ms-2"
												onClick={() => handleRemoveService(form, index)}
												style={{ paddingTop: '12px', paddingBottom: '12px' }}
											>
												<Trash2 size={16} />
											</button>
										</div>
									))}
								</div>
							)}

							<TextFormField
								form={form}
								name="notes"
								label="Observações"
								type="textarea"
								placeholder="Observações sobre a viagem..."
								rows={3}
							/>
						</div>
					)
				}}
			</BaseFormPage>
		</Layout>
	)
}
