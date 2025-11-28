import { z } from 'zod'
import { Layout } from '../../components/Layout/Layout'
import { useLocation } from 'react-router'
import { TextFormField } from '../../components/Form/FormField/TextFormField'
import { BaseFormPage } from '../../components/Form/BaseFormPage'
import { useAppContext } from '../../../main/AppContextProvider'
import type { UseFormReturn } from 'react-hook-form'
import type { Client } from '../../../infra/repository/ClientRepository'

const clientSchema = z.object({
	name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
	contactPerson: z.string(),
	email: z.string(),
	phone: z.string(),
	city: z.string(),
	status: z.enum(['active', 'inactive']),
	code: z.string().optional(),
	address: z.string().optional(),
	deliveryAddress: z.string().optional(),
	notes: z.string().optional()
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientFormProps {
	client?: Client
}

export const ClientForm = ({ client }: ClientFormProps) => {
	const { clientRepository, user } = useAppContext()
	const location = useLocation()
	const clientFromState = location.state?.client as Client | undefined
	const clientData = client || clientFromState

	return (
		<Layout>
			<BaseFormPage
				schema={clientSchema}
				defaultValues={{
					name: clientData?.name || '',
					contactPerson: clientData?.contactPerson || '',
					code: clientData?.code || '',
					email: clientData?.email || '',
					phone: clientData?.phone || '',
					city: clientData?.city || '',
					status: clientData?.status || 'active',
					address: clientData?.address || '',
					deliveryAddress: (clientData as any)?.deliveryAddress || '',
					notes: clientData?.notes || ''
				}}
				baseData={clientData as Client}
				label="Cliente"
				isEdit={!!clientData}
				navigateBackTo="/clients"
				repository={clientRepository}
				navigateTo="/clients"
				entityKey="client"
			>
				{form => (
					<div>
						<TextFormField form={form} name="name" label="Nome do Cliente" placeholder="Ex: João Silva" />

						<TextFormField form={form} name="contactPerson" label="Nome do Representante" placeholder="Ex: João Silva" />

						<TextFormField form={form} name="email" label="Email" type="email" placeholder="joao.silva@email.com" />

						<TextFormField form={form} name="phone" label="Telefone" type="tel" placeholder="(11) 99999-9999" />

						<TextFormField form={form} name="city" label="Cidade" placeholder="Ex: São Paulo" />

						<TextFormField form={form} name="address" label="Endereço" placeholder="Endereço completo..." />

						<TextFormField
							form={form}
							name="deliveryAddress"
							label="Endereço de Entrega"
							placeholder="Endereço de entrega (opcional)..."
						/>

						<TextFormField form={form} type="textarea" name="notes" label="Observações" placeholder="Observações sobre o cliente..." />
					</div>
				)}
			</BaseFormPage>
		</Layout>
	)
}
