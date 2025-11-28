import { z } from 'zod'
import { Layout } from '../../components/Layout/Layout'
import { BrazilianCurrencyField } from '../../components/Form/FormField/BrazilianCurrencyField'
import { TextFormField } from '../../components/Form/FormField/TextFormField'
import { BaseFormPage } from '../../components/Form/BaseFormPage'
import { DateFormField } from '../../components/Form/FormField/DateFormField'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Employee } from '../../../infra/repository/EmployeeRepository'

const employeeSchema = z.object({
	name: z.string().min(1, 'Nome é obrigatório'),
	code: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	position: z.string().optional(),
	department: z.string().optional(),
	hireDate: z.string().optional(),
	salary: z.coerce.number().min(0, 'Salário deve ser maior ou igual a zero'),
	status: z.enum(['active', 'inactive', 'on_leave']),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	emergencyContact: z.string().optional(),
	emergencyPhone: z.string().optional(),
	bankAccount: z.string().optional(),
	bankBranch: z.string().optional(),
	bankCode: z.string().optional(),
	notes: z.string().optional()
})

type EmployeeFormData = z.infer<typeof employeeSchema>

interface EmployeeFormProps {
	employee?: Employee
}

export const EmployeeForm = ({ employee }: EmployeeFormProps) => {
	const { employeeRepository, showToast, navigate, location, user } = useAppContext()
	const employeeFromState = location.state?.employee as Employee | undefined
	const employeeData = employee || employeeFromState

	const handleSubmit = async (values: EmployeeFormData) => {
		try {
			if (employeeData?.id) {
				await employeeRepository.update({ ...employeeData, ...values } as Employee)
				showToast('Funcionário atualizado com sucesso', 'success')
			} else {
				await employeeRepository.create({ ...values, createdAt: new Date().toISOString() } as Employee)
				showToast('Funcionário criado com sucesso', 'success')
			}
			navigate('/employees')
		} catch (error) {
			showToast('Erro ao salvar funcionário', 'error')
		}
	}

	return (
		<Layout>
			<BaseFormPage
				schema={employeeSchema}
				defaultValues={{
					name: employeeData?.name || '',
					code: employeeData?.code || '',
					email: employeeData?.email || '',
					phone: employeeData?.phone || '',
					position: employeeData?.position || '',
					department: employeeData?.department || '',
					hireDate: employeeData?.hireDate ? employeeData.hireDate.split('T')[0] : '',
					salary: employeeData?.salary || 0,
					status: employeeData?.status || 'active',
					address: employeeData?.address || '',
					city: employeeData?.city || '',
					state: employeeData?.state || '',
					emergencyContact: employeeData?.emergencyContact || '',
					emergencyPhone: employeeData?.emergencyPhone || '',
					bankAccount: employeeData?.bankAccount || '',
					bankBranch: employeeData?.bankBranch || '',
					bankCode: employeeData?.bankCode || '',
					notes: employeeData?.notes || ''
				}}
				label="Funcionário"
				labelFeminine={false}
				navigateBackTo="/employees"
				isEdit={!!employeeData}
				baseData={employeeData as any}
				repository={employeeRepository}
				navigateTo="/employees"
				onSubmit={handleSubmit}
				entityKey="employee"
			>
				{form => {
					return (
						<div>
							<div className="">
								<TextFormField form={form} name="name" label="Nome Completo" placeholder="Ex: João Silva" />
							</div>

							<div className="row">
								<div className="col-md-6">
									<TextFormField form={form} name="email" label="Email" type="email" placeholder="Ex: joao@empresa.com" />
								</div>
								<div className="col-md-6">
									<TextFormField form={form} name="phone" label="Telefone" placeholder="Ex: (11) 99999-9999" />
								</div>
							</div>

							<div className="row">
								<div className="col-md-6">
									<TextFormField form={form} name="position" label="Cargo" placeholder="Ex: Operador" />
								</div>
								<div className="col-md-6">
									<TextFormField form={form} name="department" label="Departamento" placeholder="Ex: Produção" />
								</div>
							</div>

							<div className="row">
								<div className="col-md-6">
									<DateFormField form={form} name="hireDate" label="Data de Contratação" />
								</div>
								<div className="col-md-6">
									<BrazilianCurrencyField form={form} name="salary" label="Salário (R$)" />
								</div>
							</div>

							<TextFormField form={form} name="address" label="Endereço" placeholder="Ex: Rua das Flores, 123" />

							<div className="row">
								<div className="col-md-6">
									<TextFormField form={form} name="city" label="Cidade" placeholder="Ex: São Paulo" />
								</div>
								<div className="col-md-6">
									<TextFormField form={form} name="state" label="Estado" placeholder="Ex: SP" />
								</div>
							</div>

							<div className="row">
								<div className="col-md-6">
									<TextFormField form={form} name="emergencyContact" label="Contato de Emergência" placeholder="Ex: Maria Silva" />
								</div>
								<div className="col-md-6">
									<TextFormField
										form={form}
										name="emergencyPhone"
										label="Telefone de Emergência"
										placeholder="Ex: (11) 88888-8888"
									/>
								</div>
							</div>

							<div className="row">
								<div className="col-md-4">
									<TextFormField form={form} name="bankAccount" label="Conta Bancária" placeholder="Ex: 123456-7" />
								</div>
								<div className="col-md-4">
									<TextFormField form={form} name="bankBranch" label="Agência" placeholder="Ex: 0001" />
								</div>
								<div className="col-md-4">
									<TextFormField form={form} name="bankCode" label="Código do Banco" placeholder="Ex: 001" />
								</div>
							</div>

							<TextFormField
								form={form}
								name="notes"
								label="Observações"
								type="textarea"
								placeholder="Observações sobre o funcionário..."
								rows={3}
							/>
						</div>
					)
				}}
			</BaseFormPage>
		</Layout>
	)
}
