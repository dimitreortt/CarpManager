import { useMemo } from 'react'
import { BaseList } from '../../components/List/BaseList'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Trip } from '../../../infra/repository/TripRepository'
import { EmptyList } from '../../components/List/EmptyList'
import { getColumns } from './getColumns'
import { useLoadRecords } from '../../hooks/useLoadRecords'
import { LoadingList } from '../../components/List/LoadingList'

export const TripList = () => {
	const { tripRepository } = useAppContext()
	const columns = useMemo(() => getColumns(), [])
	const {
		records: trips,
		loading,
		setRecords: setTrips,
		invalidate
	} = useLoadRecords<Trip>({ entityName: 'trip', repository: tripRepository, errorMessage: 'Erro ao carregar viagens' })

	const handleConfirmDelete = async (selectedTrips: Trip[]) => {
		await tripRepository.deleteMany(selectedTrips)
		setTrips(trips.filter(trip => !selectedTrips.includes(trip)))
		await invalidate()
	}

	if (loading) {
		return <LoadingList />
	}

	return (
		<div className="container-fluid px-0">
			{trips.length === 0 && !loading && (
				<EmptyList
					icon="bi bi-geo-alt"
					title="Lista de Viagens"
					description="Gerencie suas viagens de trabalho, rotas e custos de transporte."
					entityFormPath="/trips/form"
					entitySingular="viagem"
				/>
			)}
			{trips.length > 0 && (
				<BaseList
					columns={columns}
					data={trips}
					enableCheckboxes={true}
					enableSearch={true}
					searchPlaceholder="Buscar viagens..."
					emptyMessage="Nenhuma viagem encontrada"
					loading={loading}
					className="bg-white rounded shadow-sm"
					entityViewPath="/trips/view"
					entityKey="trip"
					entityFormPath="/trips/form"
					onConfirmDelete={handleConfirmDelete}
					confirmEntitySingular="viagem"
					confirmEntityPlural="viagens"
				/>
			)}
		</div>
	)
}
