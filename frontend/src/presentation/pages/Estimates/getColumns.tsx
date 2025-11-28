import type { Client } from '../../../infra/repository/ClientRepository'
import type { Estimate } from '../../../infra/repository/EstimateRepository'
import type { MaterialRepository } from '../../../infra/repository/MaterialRepository'
import type { TripRepository } from '../../../infra/repository/TripRepository'
import { useAppContext } from '../../../main/AppContextProvider'
import type { ColumnDefinition } from '../../components/List/ColumnDefinition'
import { formatPrice } from '../../service/formatPrice'
import { renderCurrency } from '../../service/renderCurrency'
import { useEffect, useState } from 'react'
import { renderDateField } from '../../service/renderDateField'
import { getBaseColumns } from '../../components/List/getBaseColumns'

type EstimateColumns = ColumnDefinition<Estimate>[]

export const useEstimateColumns = (status: 'pending' | 'accepted'): { columns: EstimateColumns } => {
	const { materialRepository, tripRepository, supplierRepository, clientRepository, incomingRepository, navigate } = useAppContext()
	const [columns, setColumns] = useState<EstimateColumns>([])

	useEffect(() => {
		const fetch = async () => {
			let columns = getColumns(materialRepository, tripRepository, status)
			setColumns(columns)
		}

		fetch()
	}, [materialRepository, tripRepository, supplierRepository, clientRepository, incomingRepository, status])

	return { columns }
}

type RenderValue =
	| string
	| number
	| string[]
	| undefined
	| Estimate
	| { name: string; price: number; materialId: string; estimateMaterialId: string }[]
	| { id: string; cost: number }[]
	| { id: string; value: number }[]
	| Client
	| undefined
	| { id: string; amount: number; status: 'pending' | 'received'; name: string }[]

const ViewFieldTable = ({ columns, rows }: { columns: { field: string; label: string; width?: string }[]; rows: any[] }) => {
	if (rows.length === 0) {
		return '-'
	}
	return (
		<div>
			<div className="row mb-1">
				{columns.map(column => {
					return (
						<div key={column.field} className={`col-${column.width} fw-bold text-muted`}>
							{column.label}
						</div>
					)
				})}
			</div>
			{rows.map(row => {
				return (
					<div key={row.id} className="row mb-1">
						{columns.map(column => {
							return (
								<div key={column.field} className={`col-${column.width}`}>
									{row[column.field].price && formatPrice(row[column.field].value)}
									{row[column.field].date && renderDateField(row[column.field].value)}
									{row[column.field].basic && row[column.field].value}
								</div>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}

export const getColumns = (
	materialRepository: MaterialRepository,
	tripRepository: TripRepository,
	status: 'pending' | 'accepted'
): ColumnDefinition<Estimate>[] => {
	return [
		...getBaseColumns(),
		{
			key: 'name' as keyof Estimate,
			header: 'Título',
			sortable: false,
			searchable: true,
			type: 'text'
		},
		{
			key: 'clientId',
			header: 'Cliente',
			sortable: false,
			searchable: true,
			type: 'select',
			render: (value: RenderValue, row: Estimate) => {
				return row.client?.name || '-'
			},
			useRenderAsView: true
		},
		{
			key: 'precutCost' as keyof Estimate,
			header: 'Cortado',
			sortable: false,
			type: 'currency',
			render: (value: RenderValue) => {
				if (typeof value === 'number') {
					return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
				}
				return '-'
			}
		},
		{
			key: 'materials',
			header: 'Materiais',
			sortable: false,
			searchable: true,
			type: 'objectMultiSelect',
			objectMultiSelectConfig: {
				repository: materialRepository,
				itemName: 'Material',
				viewPath: '/materials/view',
				editPath: '/materials/form',
				extraDisplayFields: [
					{
						key: 'price',
						render: (value: RenderValue) => {
							return formatPrice(value as number)
						}
					}
				]
			},
			render: (_value: RenderValue, row: Estimate) => {
				const materials = row.estimateMaterials || []
				return materials.map(material => material.name).join(', ')
			},
			renderView: (value: RenderValue, row: Estimate) => {
				const materials = row.estimateMaterials || []
				return (
					<ViewFieldTable
						columns={[
							{ field: 'name', label: 'Nome', width: '4' },
							{ field: 'price', label: 'Valor', width: '3' }
						]}
						rows={materials.map(material => ({
							name: { value: material.name, basic: true },
							price: { value: material.price, price: true }
						}))}
					/>
				)
			}
		},
		{
			key: 'tripServiceCosts',
			header: 'Viagens',
			sortable: false,
			searchable: true,
			type: 'objectMultiSelect',
			objectMultiSelectConfig: {
				labelFeminine: true,
				repository: tripRepository,
				itemName: 'Viagem',
				viewPath: '/trips/view',
				editPath: '/trips/form',
				extraDisplayFields: [
					{
						key: 'totalCost',
						render: (value: RenderValue) => {
							return formatPrice(value as number)
						}
					}
				]
			},
			render: (value: RenderValue, row: Estimate) => {
				const tripObjs = row.tripServiceCosts || []
				return tripObjs.map(trip => trip.name).join(',')
			},
			renderView: (value: RenderValue, row: Estimate) => {
				const tripObjs = row.tripServiceCosts || []
				return (
					<ViewFieldTable
						columns={[
							{ field: 'name', label: 'Nome', width: '4' },
							{ field: 'cost', label: 'Valor', width: '3' }
						]}
						rows={tripObjs.map(trip => ({ name: { value: trip.name, basic: true }, cost: { value: trip.cost, price: true } }))}
					/>
				)
			}
		},
		{
			key: 'laborCost' as keyof Estimate,
			header: 'Valor da Mão de Obra',
			minWidth: '120px',
			sortable: false,
			type: 'currency',
			render: (value: RenderValue) => renderCurrency(value as number)
		},
		{
			key: 'totalValue' as keyof Estimate,
			header: 'Valor Total',
			sortable: false,
			type: 'currency',
			render: (value: RenderValue) => renderCurrency(value as number)
		},
		{
			key: 'paymentReceived' as keyof Estimate,
			header: 'Pagamento(s) Recebido(s)',
			hide: status !== 'accepted',
			sortable: false,
			type: 'currency',
			render: (value: RenderValue, row: Estimate) => {
				const incomings = row.incomings || []
				const filtered = incomings.filter(incoming => incoming.status === 'received')
				const amount = filtered.reduce((acc, incoming) => acc + incoming.amount, 0)

				return formatPrice(amount)
			},
			renderView: (value: RenderValue, row: Estimate) => {
				const incomings = row.incomings || []
				const filtered = incomings
					.filter(incoming => incoming.status === 'received')
					.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

				if (filtered.length === 0) {
					return '-'
				}

				return (
					<ViewFieldTable
						columns={[
							{ field: 'name', label: 'Nome', width: '4' },
							{ field: 'amount', label: 'Valor', width: '3' },
							{ field: 'date', label: 'Data', width: '3' }
						]}
						rows={filtered.map(incoming => ({
							name: { value: incoming.name, basic: true },
							amount: { value: incoming.amount, price: true },
							date: { value: incoming.date, date: true }
						}))}
					/>
				)
			}
		},
		{
			key: 'dueDate',
			header: 'Data de Fechamento',
			hide: status !== 'accepted',
			type: 'date',
			render: (value: RenderValue) => {
				return renderDateField(value as string)
			},
			useRenderAsView: true
		}
	]
}
