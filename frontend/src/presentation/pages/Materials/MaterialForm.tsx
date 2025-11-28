import { z } from 'zod'
import { Layout } from '../../components/Layout/Layout'
import { TextFormField } from '../../components/Form/FormField/TextFormField'
import { BaseFormPage } from '../../components/Form/BaseFormPage'
import { SelectWithSearchFormField } from '../../components/Form/FormField/SelectWithSearchFormField'
import { BrazilianCurrencyField } from '../../components/Form/FormField/BrazilianCurrencyField'
import { useAppContext } from '../../../main/AppContextProvider'
import type { UseFormReturn } from 'react-hook-form'
import type { Material } from '../../../infra/repository/MaterialRepository'
import type { Supplier } from '../../../infra/repository/SupplierRepository'
import { useCallback, useEffect, useState } from 'react'
import { useMaterialViewState } from './useMaterialViewState'
import { LoadingForm } from '../../components/Form/LoadingForm'
import { useLoadRecordsByEntity } from '../../hooks/useLoadRecords'

const materialSchema = z.object({
	name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
	category: z.string().optional(),
	price: z.number().min(0, 'Preço deve ser maior ou igual a zero'),
	supplierId: z.string().optional(),
	code: z.string().optional(),
	description: z.string().optional()
})

type MaterialFormData = z.infer<typeof materialSchema>

export const MaterialForm = () => {
	const { materialRepository, supplierRepository, user } = useAppContext()
	const { material: materialData, loading } = useMaterialViewState()
	const { records: suppliers, invalidate: loadSuppliers } = useLoadRecordsByEntity('supplier')

	if (loading) {
		return <LoadingForm />
	}

	return (
		<Layout>
			<BaseFormPage
				schema={materialSchema}
				defaultValues={{
					id: materialData?.id || '',
					name: materialData?.name || '',
					category: materialData?.category || undefined,
					price: materialData?.price || 0,
					supplierId: materialData?.supplierId || undefined,
					code: materialData?.code || '',
					description: materialData?.description || ''
				}}
				label="Material"
				navigateBackTo="/materials"
				isEdit={!!materialData}
				baseData={materialData as any}
				repository={materialRepository}
				navigateTo="/materials"
				entityKey="material"
			>
				{form => (
					<div>
						<TextFormField form={form} name="name" label="Nome do Material" placeholder="Ex: Madeira de Pinho" />

						<TextFormField form={form} name="code" label="Código do Fabricante" placeholder="Ex: MAT001" />

						<BrazilianCurrencyField form={form} name="price" label="Preço Unitário (R$)" />

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

						<TextFormField form={form} name="description" label="Descrição" type="textarea" placeholder="Detalhes do material..." />
					</div>
				)}
			</BaseFormPage>
		</Layout>
	)
}
