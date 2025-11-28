import type { FieldDefinition } from './FieldDefinition'
import { ObjectMultiSelectView } from './ObjectMultiSelectView'

export const useRenderField =
	<T extends Record<string, any>>(record: T) =>
	(field: FieldDefinition<T>) => {
		const value = record[field.key]

		if (field.renderView) {
			return field.renderView(value, record)
		}

		if (field.useRenderAsView) {
			return field.render?.(value, record)
		}

		if (value === null || value === undefined) {
			return <span className="text-muted">-</span>
		}

		switch (field.type) {
			case 'currency':
				if (typeof value === 'number') {
					return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
				}
				return '-'

			case 'number':
				if (typeof value === 'number') {
					return value.toLocaleString('pt-BR')
				}
				return '-'

			case 'date':
				if (typeof value === 'string') {
					return new Date(value).toLocaleDateString('pt-BR')
				}
				return '-'

			case 'status':
				if (typeof value === 'string' && field.statusConfig) {
					const config = field.statusConfig[value] || field.statusConfig['default'] || { label: value, class: 'bg-secondary' }
					return <span className={`badge ${config.class}`}>{config.label}</span>
				}
				return '-'

			case 'boolean':
				if (typeof value === 'boolean') {
					return <span className={`badge ${value ? 'bg-success' : 'bg-secondary'}`}>{value ? 'Sim' : 'Não'}</span>
				}
				return '-'

			case 'array':
				if (Array.isArray(value)) {
					if (value.length === 0) {
						return <span className="text-muted">Nenhum item selecionado</span>
					}
					return (
						<div className="d-flex flex-wrap gap-1">
							{value.map((item: any, index: number) => (
								<span key={index} className="badge bg-info">
									{String(item)}
								</span>
							))}
						</div>
					)
				}
				return '-'

			case 'description':
			case 'notes':
				if (typeof value === 'string' && value) {
					return value
				}
				return <span className="text-muted">Nenhuma informação</span>

			case 'objectMultiSelect':
				if (Array.isArray(value) && field.objectMultiSelectConfig) {
					return (
						<ObjectMultiSelectView
							ids={value}
							repository={field.objectMultiSelectConfig.repository}
							itemName={field.objectMultiSelectConfig.itemName}
							viewPath={field.objectMultiSelectConfig.viewPath}
							editPath={field.objectMultiSelectConfig.editPath}
							extraDisplayFields={field.objectMultiSelectConfig.extraDisplayFields || ([] as any)}
						/>
					)
				}
				return <span className="text-muted">Nenhum item selecionado</span>
			case 'select':
				if (field.render) {
					return field.render(value, record)
				}
				return <span className="text-muted">Nenhum item selecionado</span>
			case 'text':
			default:
				if (typeof value === 'string') {
					if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
						return new Date(value).toLocaleDateString('pt-BR')
					}
					return value
				}
				if (typeof value === 'number') {
					return value.toLocaleString('pt-BR')
				}
				if (Array.isArray(value)) {
					return value.length > 0 ? value.join(', ') : '-'
				}
				return String(value)
		}
	}
