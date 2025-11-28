import { ArrowLeft, Edit, Trash2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router'
import { BaseViewTitle } from './BaseViewTitlte'
import type { ActionItem } from '../List/ActionItem'
import type { FieldDefinition } from './FieldDefinition'
import { useRenderField } from './useRenderField'

export interface BaseViewProps<T> {
	record: T
	fields: FieldDefinition<T>[]
	title: string
	subtitle?: string
	actions?: ActionItem<T>[]
	onEdit?: (record: T) => void
	onDelete?: (record: T) => void
	onBack?: () => void
	className?: string
	loading?: boolean
	emptyMessage?: string
}

export const BaseView = <T extends Record<string, any>>({
	record,
	fields,
	title,
	subtitle,
	actions = [],
	onEdit,
	onDelete,
	onBack,
	className = '',
	loading = false,
	emptyMessage = 'Registro não encontrado'
}: BaseViewProps<T>) => {
	const renderField = useRenderField(record)
	const navigate = useNavigate()

	const handleBack = () => {
		if (onBack) {
			onBack()
		} else {
			navigate(-1)
		}
	}

	const handleEdit = () => {
		if (onEdit) {
			onEdit(record)
		}
	}

	const handleDelete = () => {
		if (onDelete) {
			onDelete(record)
		}
	}

	if (loading) {
		return (
			<div className={`container-fluid ${className}`}>
				<div className="row justify-content-center">
					<div className="col-12">
						<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
							<div className="spinner-border text-primary" role="status">
								<span className="visually-hidden">Carregando...</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (!record) {
		return (
			<div className={`container-fluid ${className}`}>
				<div className="row justify-content-center">
					<div className="col-12">
						<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
							<div className="text-center">
								<div className="text-muted mb-3">
									<Eye size={48} />
								</div>
								<h5 className="text-muted">{emptyMessage}</h5>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={`container-fluid ${className}`}>
			{/* Header */}
			<div className="row mb-4">
				<div className="col-12">
					<div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-3">
						<div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3 mb-3 mb-md-0">
							<BaseViewTitle title={title} subtitle={subtitle} />
							<button type="button" className="btn btn-outline-secondary py-1 btn-sm" onClick={handleBack}>
								<ArrowLeft size={16} />
								<span className="ms-1">Voltar</span>
							</button>
						</div>

						<div className="d-flex gap-2">
							{actions.map((action, index) => (
								<button
									key={index}
									type="button"
									className={`btn btn-${action.variant || 'secondary'} btn-sm py-1`}
									onClick={() => action.onClick(record)}
								>
									{action.icon}
									<span className="ms-1">{action.label}</span>
								</button>
							))}
							{onEdit && (
								<button title="Editar" type="button" className="btn btn-outline-primary btn-sm py-1" onClick={handleEdit}>
									<Edit size={16} />
									<span className="ms-1">Editar</span>
								</button>
							)}
							{onDelete && (
								<button type="button" className="btn btn-outline-danger btn-sm py-1" onClick={handleDelete}>
									<Trash2 size={16} />
									<span className="ms-1">Excluir</span>
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="row">
				<div className="col-12 pb-5">
					<div className="card ">
						<div className="card-body" style={{ maxWidth: '750px' }}>
							<div className="d-flex flex-column gap-3">
								{fields
									.filter(field => !field.hide)
									.map((field, index) => (
										<div key={String(field.key)} className={field.className || ''}>
											<div className="mb-1">
												<label className="form-label fw-bold text-muted small mb-1">{field.label}</label>
												<div className="border rounded p-2 bg-light" style={{ minHeight: '39px' }}>
													{renderField(field)}
												</div>
											</div>
										</div>
									))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
