import { z } from 'zod'
import { Layout } from '../../components/Layout/Layout'
import { TextFormField } from '../../components/Form/FormField/TextFormField'
import { BaseFormPage } from '../../components/Form/BaseFormPage'
import { useAppContext } from '../../../main/AppContextProvider'
import type { UseFormReturn } from 'react-hook-form'
import type { Supplier } from '../../../infra/repository/SupplierRepository'

const supplierSchema = z.object({
	name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
	email: z.string(),
	phone: z.string(),
	city: z.string(),
	state: z.string(),
	cnpj: z.string().optional(),
	contactPerson: z.string().optional(),
	status: z.string().optional(),
	address: z.string().optional(),
	notes: z.string().optional()
})

type SupplierFormData = z.infer<typeof supplierSchema>

interface SupplierFormProps {
	supplier?: Supplier
}

export const SupplierForm = ({ supplier }: SupplierFormProps) => {
	const { supplierRepository, showToast, navigate, user, location } = useAppContext()
	const supplierFromState = location.state?.supplier as Supplier | undefined
	const supplierData = supplier || supplierFromState

	return (
		<Layout>
			<BaseFormPage
				schema={supplierSchema}
				defaultValues={{
					name: supplierData?.name || '',
					email: supplierData?.email || '',
					phone: supplierData?.phone || '',
					city: supplierData?.city || '',
					state: supplierData?.state || '',
					cnpj: supplierData?.cnpj || '',
					contactPerson: supplierData?.contactPerson || '',
					status: supplierData?.status || 'active',
					address: supplierData?.address || '',
					notes: supplierData?.notes || ''
				}}
				label="Fornecedor"
				navigateBackTo="/suppliers"
				isEdit={!!supplierData}
				baseData={supplierData}
				repository={supplierRepository}
				navigateTo="/suppliers"
				entityKey="supplier"
			>
				{form => (
					<div>
						<TextFormField form={form} name="name" label="Nome do Fornecedor" placeholder="Ex: Loja de Materiais ABC" />

						<TextFormField form={form} name="email" label="Email" type="email" placeholder="contato@fornecedor.com" />

						<TextFormField form={form} name="phone" label="Telefone" type="tel" placeholder="(11) 99999-9999" />

						<div className="row">
							<div className="col-md-6">
								<TextFormField form={form} name="city" label="Cidade" placeholder="Ex: São Paulo" />
							</div>
							<div className="col-md-6">
								<TextFormField form={form} name="state" label="Estado" placeholder="Ex: SP" />
							</div>
						</div>

						<TextFormField form={form} name="cnpj" label="CNPJ" placeholder="00.000.000/0000-00" />

						<TextFormField form={form} name="contactPerson" label="Pessoa de Contato" placeholder="Ex: João Silva" />

						{/*<SelectFormField
							form={form}
							name="status"
							label="Status"
							placeholder="Selecione um status"
							options={[
								{ value: 'active', label: 'Ativo' },
								{ value: 'inactive', label: 'Inativo' }
							]}
						/> */}
						<TextFormField form={form} name="address" label="Endereço" type="textarea" placeholder="Endereço completo..." />

						<TextFormField form={form} name="notes" label="Observações" type="textarea" placeholder="Observações sobre o fornecedor..." />
					</div>
				)}
			</BaseFormPage>
		</Layout>
	)
}
