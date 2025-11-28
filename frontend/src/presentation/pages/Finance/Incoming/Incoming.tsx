import { useState } from 'react'
import { IncomingList } from './IncomingList'
import { TabPage } from '../TabPage'
import { Filters } from '../Filters'

export const Incoming = () => {
	const [selectedPeriod, setSelectedPeriod] = useState('')

	const handlePeriodChange = (value: string) => {
		setSelectedPeriod(value)
	}

	const tabs = [
		{ label: 'Contas a Receber', icon: 'bi-arrow-down-circle', code: 'pending' },
		{ label: 'Contas Recebidas', icon: 'bi-arrow-up-circle', code: 'received' }
	]

	const tabContent = [
		<IncomingList periodFilter={selectedPeriod} status="pending" />,
		<IncomingList periodFilter={selectedPeriod} status="received" />
	]

	const filters = <Filters selectedPeriod={selectedPeriod} handlePeriodChange={handlePeriodChange} />

	return <TabPage tabs={tabs} tabContent={tabContent} defaultTab="pending" filters={filters} title="Entradas" />
}
