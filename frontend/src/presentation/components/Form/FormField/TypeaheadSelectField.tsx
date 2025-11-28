import { useEffect, useRef, useState } from 'react'
import { type UseFormReturn, type FieldPath, type FieldValues } from 'react-hook-form'

interface TypeaheadSelectFieldProps<T extends FieldValues> {
	form: UseFormReturn<T>
	name: FieldPath<T>
	label: string
	placeholder?: string
	disabled?: boolean
	className?: string
	required?: boolean
	fetchSuggestions: (query: string) => Promise<string[]>
}

export const TypeaheadSelectField = <T extends FieldValues>({
	form,
	name,
	label,
	placeholder,
	disabled,
	className,
	required,
	fetchSuggestions
}: TypeaheadSelectFieldProps<T>) => {
	const {
		register,
		formState: { errors }
	} = form
	const error = errors[name]

	const inputRef = useRef<HTMLInputElement>(null)
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [isFocused, setIsFocused] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		inputRef.current!.value = form.watch(name)
	}, [])

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value
		if (timerRef.current) {
			clearTimeout(timerRef.current)
		}
		timerRef.current = setTimeout(async () => {
			const results = await fetchSuggestions(query)
			form.setValue(name, inputRef.current!.value as any)
			setSuggestions(results)
			setSelectedIndex(-1)
		}, 300)
	}

	const handleSuggestionSelect = (suggestion: string) => {
		form.setValue(name, suggestion as any)
		inputRef.current!.value = suggestion
		setSuggestions([])
		setSelectedIndex(-1)
	}

	const handleInputFocus = () => {
		setIsFocused(true)
	}

	const handleInputBlur = () => {
		setTimeout(() => {
			setIsFocused(false)
		}, 150)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (suggestions.length === 0) return

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault()
				setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0))
				break
			case 'ArrowUp':
				e.preventDefault()
				setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1))
				break
			case 'Enter':
				e.preventDefault()
				if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
					handleSuggestionSelect(suggestions[selectedIndex])
				}
				break
			case 'Escape':
				setSuggestions([])
				setSelectedIndex(-1)
				break
		}
	}

	return (
		<div className={`mb-3 position-relative ${className}`}>
			<label htmlFor={name} className="form-label">
				{label}
				{required && <span className="text-danger ms-1">*</span>}
			</label>
			<input
				{...register(name)}
				ref={inputRef}
				type="text"
				id={name}
				className={`form-control ${error ? 'is-invalid' : ''}`}
				placeholder={placeholder}
				disabled={disabled}
				onChange={handleChange}
				onFocus={handleInputFocus}
				onBlur={handleInputBlur}
				onKeyDown={handleKeyDown}
			/>

			{suggestions.length > 0 && inputRef.current!.value && isFocused && (
				<div
					className="position-absolute w-100 bg-white border rounded shadow-sm"
					style={{ top: '100%', zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
				>
					{suggestions.map((suggestion, index) => (
						<div
							className={`p-2 cursor-pointer-important ${index === selectedIndex ? 'bg-primary text-white' : 'hover-bg-light'}`}
							key={suggestion}
							onClick={() => handleSuggestionSelect(suggestion)}
							onMouseEnter={() => setSelectedIndex(index)}
						>
							{suggestion}
						</div>
					))}
				</div>
			)}

			{error && <div className="invalid-feedback">{error.message as string}</div>}
		</div>
	)
}
