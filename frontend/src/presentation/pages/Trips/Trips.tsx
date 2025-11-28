import { TripList } from './TripList'
import { BaseListPage } from '../../components/List/BaseListPage'

export const Trips = () => {
	return (
		<BaseListPage title="Viagens" description="Gerencie as viagens de trabalho">
			<TripList />
		</BaseListPage>
	)
}
