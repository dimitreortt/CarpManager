import { useState } from 'react'
import { EmptyMonth } from './MonthPickerState'
import { EmptyPeriod, type PickerStatus } from './PeriodPickerState'

export const usePickerState = (typeOfPicker: 'month' | 'period') => {
	const [state, setState] = useState<PickerStatus>(typeOfPicker === 'month' ? new EmptyMonth() : new EmptyPeriod())

	const handleClickMonth = (month: string, year: string) => {
		const newState = state.clickMonth(month, year)
		setState(newState)
		return newState
	}

	const handleClosePicker = () => {
		setState(state.closePicker())
	}

	const reset = (typeOfPicker: 'month' | 'period') => {
		setState(typeOfPicker === 'month' ? new EmptyMonth() : new EmptyPeriod())
	}

	return {
		state,
		handleClickMonth,
		handleClosePicker,
		reset
	}
}
