import { useState } from 'react'
import { OutgoingList } from './OutgoingList'
import { TabPage } from '../TabPage'
import { Filters } from '../Filters'

export const Outgoing = () => {
	const [selectedPeriod, setSelectedPeriod] = useState('')

	const handlePeriodChange = (value: string | null) => {
		if (value === null) {
			setSelectedPeriod('')
			return
		}
		setSelectedPeriod(value)
	}

	const tabs = [
		{ label: 'Contas a Pagar', icon: 'bi-arrow-down-circle', code: 'pending' },
		{ label: 'Contas Pagas', icon: 'bi-arrow-up-circle', code: 'paid' }
	]

	const tabContent = [<OutgoingList periodFilter={selectedPeriod} status="pending" />, <OutgoingList periodFilter={selectedPeriod} status="paid" />]

	const filters = <Filters selectedPeriod={selectedPeriod} handlePeriodChange={handlePeriodChange} />

	return <TabPage tabs={tabs} tabContent={tabContent} defaultTab="outgoing" filters={filters} title="Saídas" />
}
