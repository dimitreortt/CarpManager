import { formatYm, isLater, isSame } from './utils'

export interface PickerStatus {
	value: string
	name: string
	clickMonth(month: string, year: string): PickerStatus
	closePicker(): PickerStatus
	getMonthClasses(value: string): string
	getYearClasses(year: number): string
	getDisplay(): string
}

export class EmptyPeriod implements PickerStatus {
	value: string = ''
	name: string = 'EmptyPeriod'

	clickMonth(month: string, year: string): PickerStatus {
		this.value = `${year}-${month}`
		return new StartMonthDraft(this.value)
	}

	closePicker(): PickerStatus {
		return this
	}

	getMonthClasses(value: string): string {
		return ''
	}

	getYearClasses(year: number): string {
		return ''
	}

	getDisplay(): string {
		return 'Selecione o período'
	}
}

export class StartMonthDraft implements PickerStatus {
	name: string = 'StartMonthDraft'
	constructor(public value: string, public periodSelected: string = '') {}

	clickMonth(month: string, year: string): PickerStatus {
		if (isLater(`${year}-${month}`, this.value)) {
			return new PeriodSelected(`${this.value}::${year}-${month}`)
		}
		return this
	}

	closePicker(): PickerStatus {
		return this.periodSelected ? new PeriodSelected(this.periodSelected) : new EmptyPeriod()
	}

	getMonthClasses(value: string): string {
		if (isSame(value, this.value)) return 'btn-primary text-white'
		return isLater(value, this.value) ? '' : 'disabled'
	}

	getYearClasses(year: number): string {
		return ''
	}

	getDisplay(): string {
		return formatYm(this.value)
	}
}

export class PeriodSelected implements PickerStatus {
	name: string = 'PeriodSelected'
	constructor(public value: string) {}

	clickMonth(month: string, year: string): PickerStatus {
		return new StartMonthDraft(`${year}-${month}`)
	}

	closePicker(): PickerStatus {
		return this
	}

	getMonthClasses(value: string): string {
		const [from, to] = this.value.split('::')
		if (isLater(from, value)) return ''
		if (isLater(value, to)) return ''
		return 'btn-primary text-white'
	}

	getYearClasses(year: number): string {
		const [from, to] = this.value.split('::')
		if (year >= parseInt(from.split('-')[0]) && year <= parseInt(to.split('-')[0])) return 'btn-primary text-white'
		return ''
	}

	getDisplay(): string {
		const [from, to] = this.value.split('::')
		return `${formatYm(from)} - ${formatYm(to)}`
	}
}
