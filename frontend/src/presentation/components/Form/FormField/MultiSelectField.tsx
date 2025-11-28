import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import type { UseFormReturn, FieldValues, Path } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { UpdateOptionInput } from './UpdateOptionInput'
import { formatPrice } from '../../../service/formatPrice'
import { useMultiSelectState } from './multiSelectState'

export type OptionItem = { id: string; value: number }

export interface MultiSelectOption {
	item: OptionItem
	label: string
}

export interface MultiSelectFieldProps<T extends FieldValues> {
	form: UseFormReturn<T>
	name: Path<T>
	label: string
	options: MultiSelectOption[]
	placeholder?: string
	className?: string
	required?: boolean
	disabled?: boolean
	maxItems?: number
	searchable?: boolean
	hidePrice?: boolean
	addNewPath?: string
	addNewLabel?: string
	loadItems?: () => void
	mb?: string
	showSelectedItems?: boolean
	blurb?: string
	showValueAsCurrency?: boolean
	allowChangeOptionValue?: boolean
}

export const MultiSelectField = <T extends FieldValues>({
	form,
	name,
	label,
	options: baseOptions,
	className = '',
	required = false,
	disabled = false,
	maxItems,
	searchable = false,
	hidePrice = true,
	addNewPath,
	addNewLabel = 'Adicionar',
	loadItems,
	mb = 'mb-3',
	showSelectedItems = false,
	blurb,
	showValueAsCurrency = false,
	allowChangeOptionValue = false
}: MultiSelectFieldProps<T>) => {
	const [searchTerm, setSearchTerm] = useState('')
	const [options, setOptions] = useState<MultiSelectOption[]>(baseOptions)
	const { customOptionValues, setCustomOptionValue, showChangeOptionValueInput, reset: resetMultiSelectState } = useMultiSelectState()

	useEffect(() => {
		const options = [...baseOptions]
		setOptions(options)
	}, [baseOptions])

	useEffect(() => {
		if (Object.keys(customOptionValues).length > 0) {
			setOptions(prevOptions => {
				const updatedOptions = [...prevOptions]
				for (const key in customOptionValues) {
					const option = updatedOptions.find(opt => opt.item.id === key)
					if (option) {
						option.item.value = customOptionValues[key]
					}
				}

				return updatedOptions
			})
		}
	}, [customOptionValues, baseOptions])

	useEffect(() => {
		return () => {
			resetMultiSelectState()
		}
	}, [])

	const selectedValues = (form.watch(name) as OptionItem[]) || []
	const error = form.formState.errors[name]

	const filteredOptions = options.filter(option =>
		searchable
			? option.label.toLowerCase().includes(searchTerm.toLowerCase()) || option.item.id.toLowerCase().includes(searchTerm.toLowerCase())
			: true
	)

	const handleToggleOption = (item: OptionItem) => {
		const currentValues = selectedValues || []
		const isSelected = currentValues.some(i => i.id === item.id)

		let newValues: OptionItem[]
		if (isSelected) {
			newValues = currentValues.filter(v => v.id !== item.id)
		} else {
			if (maxItems && currentValues.length >= maxItems) {
				return
			}
			newValues = [...currentValues, item]
		}

		form.setValue(name, newValues as any, { shouldValidate: true })
	}

	const handleRemoveOption = (valueToRemove: string) => {
		const newValues = selectedValues.filter(item => item.id !== valueToRemove)
		form.setValue(name, newValues as any, { shouldValidate: true })
	}

	const getSelectedLabels = () => {
		return selectedValues.map(item => options.find(option => option.item.id === item.id)?.label).filter(Boolean)
	}

	const selectedLabels = useMemo(() => getSelectedLabels().sort((a: any, b: any) => a?.localeCompare(b) || 0), [selectedValues, options])

	const formatLabel = (label?: string) => {
		if (!label) return ''
		if (!hidePrice) return label
		const [labelWithoutPrice] = label.split('- R$')
		return labelWithoutPrice
	}

	const handleAddNew = () => {
		if (!addNewPath) return
		window.open(`${addNewPath}`, '_blank')
	}

	const handleChangeOptionValue = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
		const value = Number(e.target.value)
		setCustomOptionValue(id, value)
	}

	return (
		<Controller
			control={form.control}
			name={name}
			render={() => (
				<div className={`${mb} ${className}`}>
					<label htmlFor={name} className="form-label">
						{label}
						{required && <span className="text-danger ms-1">*</span>}
					</label>
					{blurb && <div className="text-muted mb-2 d-block">{blurb}</div>}

					<div className="mb-1">
						{showSelectedItems && (
							<div className="d-flex flex-wrap gap-1">
								{selectedLabels.length > 0 ? (
									selectedLabels.map((label, index) => (
										<span
											key={index}
											className="badge bg-primary d-flex align-items-center gap-1"
											style={{ fontSize: '0.75rem', height: '22px' }}
										>
											{formatLabel(label)}
											{!disabled && (
												<X
													size={12}
													className="cursor-pointer"
													onClick={() => handleRemoveOption(selectedValues[index].id)}
												/>
											)}
										</span>
									))
								) : (
									<span
										className="badge border sec-light d-flex align-items-center gap-1"
										style={{ fontSize: '0.75rem', height: '22px' }}
									>
										Nenhum item selecionado
									</span>
								)}
							</div>
						)}
						{maxItems && selectedValues.length >= maxItems && (
							<small className="text-muted d-block mt-1">Máximo de {maxItems} itens selecionados</small>
						)}
					</div>

					{searchable && (
						<div className="mb-1">
							<input
								type="text"
								className="form-control form-control-sm"
								placeholder="Buscar opções..."
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								disabled={disabled}
							/>
						</div>
					)}

					<div className={`border rounded ${error ? 'border-danger' : ''}`} style={{ maxHeight: '300px', overflowY: 'auto' }}>
						{options.length > 0 &&
							(filteredOptions.length > 0 ? (
								<div className="d-flex flex-column gap-1 p-3">
									{filteredOptions.map((option, index) => {
										const isSelected = selectedValues.some(item => item.id === option.item.id) || false
										const isDisabled = maxItems && !isSelected && selectedValues.length >= maxItems

										const value = customOptionValues[option.item.id] || option.item.value

										return (
											<div key={option.item.id} className="form-check d-flex gap-1">
												<input
													className="form-check-input"
													type="checkbox"
													id={`${name}-${option.item.id}`}
													checked={!!isSelected}
													onChange={() => !isDisabled && handleToggleOption(option.item)}
													disabled={Boolean(disabled || isDisabled)}
												/>
												<label
													className={`form-check-label ms-1 ${isDisabled ? 'text-muted' : ''}`}
													htmlFor={`${name}-${option.item.id}`}
													style={{ cursor: disabled || isDisabled ? 'not-allowed' : 'pointer' }}
												>
													{option.label}{' '}
													{showValueAsCurrency && !showChangeOptionValueInput[option.item.id]
														? `- ${formatPrice(value)}`
														: ''}
												</label>
												{allowChangeOptionValue && (
													<span style={{ marginTop: '-2px' }}>
														<UpdateOptionInput
															option={option.item}
															handleChangeOptionValue={handleChangeOptionValue}
															onSave={() => handleToggleOption(option.item)}
														/>
													</span>
												)}
											</div>
										)
									})}
								</div>
							) : (
								<div className="text-muted text-center py-3">Nenhuma opção encontrada</div>
							))}
						{options.length === 0 && (
							<div className="text-muted text-center py-3">
								<p>Nenhuma opção disponível</p>
								{addNewPath && (
									<button type="button" className="btn btn-outline-primary py-1" onClick={handleAddNew}>
										<Plus size={20} className="cursor-pointer" />
										{addNewLabel || 'Adicionar'}
									</button>
								)}
							</div>
						)}
					</div>

					{error && <div className="invalid-feedback d-block">{error.message as string}</div>}
				</div>
			)}
		/>
	)
}
