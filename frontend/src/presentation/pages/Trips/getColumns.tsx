import type { Trip } from '../../../infra/repository/TripRepository'
import type { ColumnDefinition } from '../../components/List/ColumnDefinition'
import { renderDateField } from '../../service/renderDateField'
import { getBaseColumns } from '../../components/List/getBaseColumns'
import { formatPrice } from '../../service/formatPrice'

type RenderParam = string | number | { cost: number }[] | undefined | Trip

export const getColumns = (): ColumnDefinition<Trip>[] => {
	return [
		...getBaseColumns(),
		{
			key: 'name',
			header: 'Nome',
			sortable: false,
			searchable: true
		},
		{
			key: 'destination',
			header: 'Destino',
			sortable: false,
			searchable: false
		},
		{
			key: 'date',
			header: 'Data',
			sortable: false,
			searchable: false,
			render: renderDateField
		},
		{
			key: 'numberOfTolls',
			header: 'Nº de Pedágios',
			sortable: false,
			searchable: false,
			render: (value: RenderParam, row: Trip) => {
				if (typeof value === 'number') {
					return value.toString()
				}
				return '-'
			}
		},
		{
			key: 'costOfTolls',
			header: 'Custo dos Pedágios',
			sortable: false,
			searchable: false,
			render: (value: RenderParam, row: Trip) => {
				if (typeof value === 'number') {
					return formatPrice(value)
				}
				return '-'
			},
			useRenderAsView: true
		},
		{
			key: 'numberOfLunches',
			header: 'Nº de Almoços',
			sortable: false,
			searchable: false,
			render: (value: RenderParam, row: Trip) => {
				if (typeof value === 'number') {
					return value.toString()
				}
				return '-'
			}
		},
		{
			key: 'costOfLunches',
			header: 'Custo dos Almoços',
			sortable: false,
			searchable: false,
			render: (value: RenderParam, row: Trip) => {
				if (typeof value === 'number') {
					return formatPrice(value)
				}
				return '-'
			},
			useRenderAsView: true
		},
		{
			key: 'costOfFuel',
			header: 'Custo do Combustível',
			sortable: false,
			searchable: false,
			render: (value: RenderParam, row: Trip) => {
				if (typeof value === 'number') {
					return formatPrice(value)
				}
				return '-'
			},
			useRenderAsView: true
		},
		{
			key: 'totalCost',
			header: 'Custo Total',
			sortable: false,
			searchable: false,
			render: (value: RenderParam, row: Trip) => {
				if (typeof value === 'number') {
					return formatPrice(value)
				}
				return '-'
			},
			useRenderAsView: true
		},
		{
			key: 'numberOfServices',
			header: 'Serviços Realizados',
			sortable: false,
			searchable: false,
			render: (value: RenderParam, row: Trip) => {
				if (typeof value === 'number') {
					return value.toString()
				}
				return '1'
			}
		}
	]
}
