import type { PickerStatus } from './PeriodPickerState'
import { formatYm, isSame, isLater } from './utils'

export class EmptyMonth implements PickerStatus {
	name = 'EmptyMonth'
	value = ''

	constructor(ym: string = '') {
		this.value = ym
	}

	clickMonth(month: string, year: string): PickerStatus {
		return new MonthSelected(`${year}-${month}`)
	}

	closePicker(): PickerStatus {
		return this
	}

	getMonthClasses(ym: string): string {
		return ''
	}

	getYearClasses(year: number): string {
		return ''
	}

	getDisplay(): string {
		return 'Selecione o mês'
	}
}

export class MonthSelected implements PickerStatus {
	name = 'MonthSelected'
	value: string

	constructor(value: string) {
		this.value = value
	}

	clickMonth(month: string, year: string): PickerStatus {
		return new MonthSelected(`${year}-${month}`)
	}

	closePicker(): PickerStatus {
		return this
	}

	getMonthClasses(ym: string): string {
		if (isSame(ym, this.value)) return 'btn-primary text-white'
		return ''
	}

	getYearClasses(year: number): string {
		if (year === parseInt(this.value.split('-')[0])) return 'btn-primary text-white'
		return ''
	}

	getDisplay(): string {
		return formatYm(this.value)
	}
}
