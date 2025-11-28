import { useLocation } from 'react-router'
import { useAppContext } from '../../../main/AppContextProvider'
import { z } from 'zod'
import { BaseForm } from '../../components/Form/BaseForm'
import { TextFormField } from '../../components/Form/FormField/TextFormField'
import { PaymentMethodField } from '../../components/Form/FormField/PaymentMethodField'
import { DateFormField } from '../../components/Form/FormField/DateFormField'
import { BrazilianCurrencyField } from '../../components/Form/FormField/BrazilianCurrencyField'
import type { Estimate } from '../../../infra/repository/EstimateRepository'
import { Layout } from '../../components/Layout/Layout'
import { BaseFormPage } from '../../components/Form/BaseFormPage'
import type { UseFormReturn } from 'react-hook-form'
import { Plus, X } from 'lucide-react'

export type Installment = {
	date: string
	amount: number
	paymentMethod: string
}

export type CreateOrderData = {
	orderDueDate: string
	signReceived: number
	paymentMethod: string
	clientId?: string
	estimateName: string
	installments: Installment[]
}

const schema = z.object({
	orderDueDate: z.string(),
	signReceived: z.coerce.number(),
	paymentMethod: z.string(),
	installments: z.array(
		z.object({
			date: z.string(),
			amount: z.coerce.number(),
			paymentMethod: z.string()
		})
	)
})

export const CreateOrder = () => {
	const { navigate, showToast, estimateRepository, refresh } = useAppContext()
	const { estimate } = useLocation().state as { estimate: Estimate }

	if (!estimate) {
		navigate('/estimates')
	}

	const handleSubmit = async (data: z.infer<typeof schema>) => {
		try {
			await estimateRepository.createOrder(estimate, {
				...data,
				clientId: estimate.clientId,
				estimateName: estimate.name
			})
			showToast('Pedido e entradas criados com sucesso', 'success')
		} catch (error: any) {
			showToast('Erro ao criar o pedido e as entradas: ' + error.message, 'error')
		} finally {
			navigate('/estimates')
		}
	}

	const handleClose = () => {
		navigate('/estimates')
	}

	const getDefaultOrderDueDate = () => {
		const date = new Date()
		date.setDate(date.getDate() + 45)
		return date.toISOString().split('T')[0]
	}

	const handleAddInstallments = (form: UseFormReturn<z.infer<typeof schema>>) => {
		form.setValue('installments', [
			...form.getValues('installments'),
			{ date: new Date().toISOString().split('T')[0], amount: 0, paymentMethod: '' }
		])
	}

	const handleRemoveInstallment = (form: UseFormReturn<z.infer<typeof schema>>) => {
		form.setValue('installments', form.getValues('installments').slice(0, -1))
	}

	return (
		<Layout>
			<BaseFormPage
				schema={schema}
				onSubmit={handleSubmit}
				showSaveButton={false}
				showHeader={true}
				header="Criar Pedido e Entradas"
				defaultValues={{
					signReceived: 0,
					installments: []
				}}
				className="px-md-4 pt-0"
				maxWidth="1000px"
				navigateBackTo="/estimates"
			>
				{form => (
					<>
						<div className="alert alert-secondary mb-4 mt-3">
							<strong>Orçamento:</strong> {estimate.name}
							<br />
							<strong>Cliente:</strong> {estimate.client?.name}
							<br />
							<strong>Valor Total:</strong> R$ {estimate.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
						</div>

						<div className="container">
							<div className="row justify-content-between">
								<DateFormField
									form={form}
									name="orderDueDate"
									label="Data de entrega do pedido (45 dias)"
									defaultValue={getDefaultOrderDueDate()}
									className="col-md-4"
								/>

								<BrazilianCurrencyField form={form} name="signReceived" label="Valor do sinal recebido" className="col-md-4" />

								<PaymentMethodField form={form} name="paymentMethod" className="col-md-4" />
							</div>

							{form.watch('installments').length > 0 && (
								<div className="d-flex">
									<div className="mb-3 mt-3 fw-bold text-muted fs-5">Entradas Futuras</div>
								</div>
							)}
							{form.watch('installments').map((installment, index) => (
								<div className="row justify-content-between" key={index}>
									<DateFormField form={form} name={`installments.${index}.date`} label="Data do vencimento" className="col-md-4" />
									<BrazilianCurrencyField form={form} name={`installments.${index}.amount`} label="Valor" className="col-md-4" />
									<PaymentMethodField form={form} name={`installments.${index}.paymentMethod`} className="col-md-4" />
								</div>
							))}
							{form.watch('installments').length > 0 && (
								<div className="d-flex">
									<button
										style={{ maxHeight: 30 }}
										type="button"
										className="btn btn-outline-primary py-1"
										onClick={() => handleAddInstallments(form)}
									>
										<Plus size={16} className="me-1" /> Adicionar
									</button>
									<button type="button" className="btn btn-outline-danger py-1 ms-2" onClick={() => handleRemoveInstallment(form)}>
										<X size={16} className="me-1" /> Remover
									</button>
								</div>
							)}
						</div>

						<div className="border-0 pt-5 mt-2 px-0 pb-0">
							<div className="d-flex flex-column flex-md-row">
								{form.watch('installments').length === 0 && (
									<button
										style={{ maxHeight: 30 }}
										type="button"
										className="btn btn-outline-primary py-1 mb-2 mb-md-0"
										onClick={() => handleAddInstallments(form)}
									>
										<Plus size={16} className="me-1" /> Adicionar Entradas Futuras
									</button>
								)}
								<div className="ms-md-auto d-flex flex-column flex-md-row">
									<button type="button" className="btn btn-outline-secondary me-md-2 py-1 mb-2 mb-md-0" onClick={handleClose}>
										Cancelar
									</button>
									<button type="submit" className="btn btn-primary py-1">
										Criar Pedido
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</BaseFormPage>
		</Layout>
	)
}
