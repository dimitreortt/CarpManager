import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { usePickerState } from './usePickerState'
import { months } from './months'

interface MonthPickerProps {
	value: string
	onChange: (value: string) => void
	className?: string
	placeholder?: string
	disabled?: boolean
	typeOfPicker?: 'month' | 'period'
}

export const MonthPicker = ({
	value,
	onChange,
	className = '',
	placeholder = 'Selecione o período',
	disabled = false,
	typeOfPicker = 'period'
}: MonthPickerProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const pickerRef = useRef<HTMLDivElement>(null)

	const [selectedMonth, setSelectedMonth] = useState('')
	const [selectedYear, setSelectedYear] = useState('')
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const { state, handleClickMonth, handleClosePicker: onClosePicker, reset: resetPickerState } = usePickerState(typeOfPicker)

	useEffect(() => {
		if (!value) {
			return resetPickerState(typeOfPicker)
		}
		if (typeOfPicker === 'month') {
			const [year, month] = value.split('-')
			setSelectedYear(year)
			setCurrentYear(parseInt(year))
			setSelectedMonth(month)
		}
	}, [value, isOpen])

	useEffect(() => {
		setCurrentYear(new Date().getFullYear())
	}, [])

	useEffect(() => {
		resetPickerState(typeOfPicker)
	}, [typeOfPicker])

	useEffect(() => {
		if (!isOpen) {
			onClosePicker()
		}
	}, [isOpen])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen])

	const handleMonthSelect = (month: string) => {
		const newState = handleClickMonth(month, currentYear.toString())
		if (newState.name === 'PeriodSelected' || newState.name === 'MonthSelected') {
			onChange(newState.value)
			setTimeout(() => {
				setIsOpen(false)
			}, 600)
		}
	}

	const handleYearSelect = (year: number) => {
		setCurrentYear(year)
	}

	const handleYearChange = (increment: number) => {
		const newYear = currentYear + increment
		setCurrentYear(newYear)
	}

	const getMonthItemClasses = (month: string) => {
		return state.getMonthClasses(`${currentYear}-${month}`)
	}

	const getYearItemClasses = (year: number) => {
		return state.getYearClasses(year)
	}

	const displayValue = value ? `${months[parseInt(selectedMonth) - 1]?.label} ${selectedYear}` : placeholder

	return (
		<div className={className} ref={pickerRef}>
			<style>
				{`
					@media (min-width: 768px) {
						.month-picker-popover {
							--month-picker-transform: -100px;
						}
					}
				`}
			</style>
			<button
				type="button"
				className={`form-control d-flex align-items-center justify-content-between ${disabled ? 'disabled' : ''}`}
				onClick={() => !disabled && setIsOpen(!isOpen)}
				disabled={disabled}
				style={{ minHeight: '30px' }}
			>
				<span className={value ? 'text-dark' : 'text-muted'}>{typeOfPicker === 'month' ? displayValue : state.getDisplay()}</span>
				<Calendar size={16} className="text-muted" />
			</button>

			{isOpen && !disabled && (
				<div
					className="position-absolute mt-2 bg-white border rounded shadow-lg month-picker-popover"
					style={{
						minWidth: '350px',
						maxWidth: '500px',
						zIndex: 1000,
						transform: 'translateX(var(--month-picker-transform, 0px))'
					}}
				>
					<div className="d-flex align-items-center justify-content-between p-4 border-bottom">
						<button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => handleYearChange(-1)}>
							<ChevronLeft size={16} />
						</button>
						<span className="fw-semibold fs-5">{currentYear}</span>
						<button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => handleYearChange(1)}>
							<ChevronRight size={16} />
						</button>
					</div>

					<div className="p-4">
						<div className="row g-3">
							{months.map(month => (
								<div key={month.value} className="col-4">
									<button
										type="button"
										className={`btn w-100 ${getMonthItemClasses(month.value) || 'btn-outline-secondary'}`}
										onClick={() => handleMonthSelect(month.value)}
									>
										{month.label}
									</button>
								</div>
							))}
						</div>
					</div>

					<div className="p-4 border-top bg-light">
						<div className="d-flex gap-2 flex-wrap justify-content-center">
							{[currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(year => (
								<button
									key={year}
									type="button"
									className={`btn btn-sm btn-outline-secondary ${getYearItemClasses(year)}`}
									onClick={() => handleYearSelect(year)}
								>
									{year}
								</button>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
