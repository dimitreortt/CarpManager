import { useForm, type UseFormReturn, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { validateAndProvideDefaults } from '../../service/schemaValidation'
import type { Repository } from '../../../infra/repository/Repository'
import { useAppContext } from '../../../main/AppContextProvider'
import { SubmitButton } from './SubmitButton'
import { useExposeFormToCypress } from '../../hooks/useExposeFormToCypress'
import { getEnv } from '../../../infra/service/getEnv'

export interface BaseFormProps<T extends FieldValues> {
	schema: z.ZodSchema<T>
	onSubmit?: SubmitHandler<T>
	children: (form: UseFormReturn<T>) => React.ReactNode
	defaultValues?: Partial<T>
	className?: string
	isEdit?: boolean
	repository?: Repository<T>
	label?: string
	navigateTo?: string
	baseData?: T
	header?: string
	labelFeminine?: boolean
	navigateBackTo?: string
	showHeader?: boolean
	showSaveButton?: boolean
	maxWidth?: string
	entityKey?: string
}

export const BaseForm = <T extends FieldValues>({
	schema,
	onSubmit,
	children,
	defaultValues,
	className = '',
	isEdit = false,
	repository,
	label,
	navigateTo,
	baseData,
	showSaveButton = true,
	maxWidth = '700px',
	entityKey,
	labelFeminine = false
}: BaseFormProps<T>) => {
	const { showToast, navigate, searchParams, invalidate } = useAppContext()

	const isDuplicate = searchParams.get('duplicate')

	const form = useForm<T>({
		resolver: zodResolver(schema as any),
		defaultValues: defaultValues as any
	})

	useExposeFormToCypress(form, entityKey)

	const handleSubmit = form.handleSubmit(
		async values => {
			const validatedValues = validateAndProvideDefaults(values, schema)

			if (onSubmit) {
				await onSubmit(validatedValues as T)
				await invalidate(`${entityKey}LoadRecords`)
				return
			}

			if (!repository || !label || !navigateTo) {
				return
			}

			try {
				if (isEdit && !isDuplicate && baseData) {
					await repository.update({ ...baseData, ...validatedValues } as T)
					showToast(`${label} atualizad${labelFeminine ? 'a' : 'o'} com sucesso`, 'success')
				} else {
					await repository.create({ ...validatedValues, createdAt: new Date().toISOString() } as T)
					showToast(`${label} criad${labelFeminine ? 'a' : 'o'} com sucesso`, 'success')
				}
				await invalidate(`${entityKey}LoadRecords`)
				navigate(navigateTo)
			} catch (error) {
				showToast(`Erro ao salvar ${label.toLowerCase()}`, 'error')
			}
		},
		errors => {
			if (getEnv() === 'production') {
				console.log('Form validation errors', errors)
			}
			showToast('Erro ao validar o formulário', 'error')
		}
	)

	return (
		<form onSubmit={handleSubmit} className={className}>
			<div style={{ maxWidth: maxWidth }}>
				{children(form)}
				{showSaveButton && (
					<div className="mt-4">
						<SubmitButton form={form} className="btn-primary">
							<i className="bi bi-check-circle me-2"></i>
							Salvar
						</SubmitButton>
					</div>
				)}
			</div>
		</form>
	)
}
