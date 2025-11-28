import { type UseFormReturn, type FieldPath, type FieldValues } from 'react-hook-form'
import { FormField } from './FormField'
import { useState, useEffect, useRef } from 'react'
import { AddButton } from '../../Buttons/AddButton'

interface SelectOption {
	value: string
	label: string
}

interface SelectWithSearchFormFieldProps<T extends FieldValues> {
	form: UseFormReturn<T>
	name: FieldPath<T>
	label: string
	options?: SelectOption[]
	placeholder?: string
	className?: string
	required?: boolean
	disabled?: boolean
	addNewPath?: string
	addNewLabel?: string
	reloadItems?: () => Promise<void>
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const SelectWithSearchFormField = <T extends FieldValues>({
	form,
	name,
	label,
	options = [],
	placeholder,
	className = '',
	required = false,
	disabled = false,
	addNewPath = '',
	addNewLabel,
	reloadItems,
	onChange
}: SelectWithSearchFormFieldProps<T>) => {
	const [searchTerm, setSearchTerm] = useState('')
	const [currentLabel, setCurrentLabel] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const {
		register,
		formState: { errors },
		watch
	} = form

	const { ref, ...registerProps } = register(name, { required })
	const error = errors[name]
	const currentValue = watch(name)

	useEffect(() => {
		if (currentValue && options.length > 0) {
			setCurrentLabel(options.find(option => option.value === currentValue)?.label || '')
		}
	}, [options])

	const filteredOptions = options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()))

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleSelectOption = (option: SelectOption) => {
		form.setValue(name, option.value as any)
		const foundOption = options.find(o => o.value === option.value)
		if (foundOption) {
			setCurrentLabel(foundOption.label)
			setSearchTerm('')
		}
		setIsOpen(false)

		if (onChange) {
			onChange({ target: { value: option.value } } as React.ChangeEvent<HTMLInputElement>)
		}
	}

	const handleChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
	}

	const handleRefresh = async () => {
		setIsLoading(true)
		await reloadItems?.()

		setTimeout(() => {
			setIsLoading(false)
		}, 100)
	}

	return (
		<>
			<FormField
				form={form}
				name={name}
				label={label}
				required={required}
				className={className}
				onRefresh={reloadItems ? handleRefresh : undefined}
			>
				<input type="hidden" {...registerProps} ref={ref} />

				{currentLabel && <div className="mb-2">{currentLabel}</div>}
				{options.length === 0 && (
					<div>
						<div className="text-muted mb-2">Nenhuma opção encontrada</div>
						{addNewPath && (
							<AddButton
								label={addNewLabel || 'Adicionar'}
								onClick={() => window.open(addNewPath, '_blank')}
								btnClass="btn-outline-primary"
							/>
						)}
					</div>
				)}
				{options.length > 0 && (
					<div ref={containerRef} className="position-relative">
						{isLoading && (
							<div
								className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75"
								style={{ zIndex: 1001 }}
							>
								<div className="spinner-border spinner-border-sm text-primary" role="status">
									<span className="visually-hidden">Carregando...</span>
								</div>
							</div>
						)}
						<input
							type="text"
							className="form-control"
							id={`${name}-search-input`}
							placeholder="Buscar opções..."
							value={searchTerm}
							onChange={handleChangeSearchTerm}
							onFocus={() => setIsOpen(true)}
						/>

						{isOpen && (
							<div
								className="position-absolute w-100 bg-white border rounded shadow-sm"
								style={{ top: '100%', zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
							>
								{filteredOptions.length > 0 ? (
									filteredOptions.map((option: SelectOption) => (
										<div
											key={option.value}
											className="px-3 py-2 cursor-pointer hover:bg-light"
											onClick={() => handleSelectOption(option)}
											style={{ cursor: 'pointer' }}
										>
											{option.label}
										</div>
									))
								) : (
									<div className="px-3 py-2 text-muted">Nenhuma opção encontrada</div>
								)}
							</div>
						)}
					</div>
				)}
			</FormField>
		</>
	)
}
