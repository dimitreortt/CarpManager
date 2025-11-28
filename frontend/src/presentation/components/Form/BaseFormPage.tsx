import { type FieldValues } from 'react-hook-form'
import { useAppContext } from '../../../main/AppContextProvider'
import { Link } from 'react-router'
import { useCallback } from 'react'
import { BaseForm, type BaseFormProps } from './BaseForm'

export const BaseFormPage = <T extends FieldValues>({ showHeader = true, navigateBackTo, header, ...props }: BaseFormProps<T>) => {
	const { searchParams } = useAppContext()

	const isDuplicate = searchParams.get('duplicate')

	const getHeader = useCallback(() => {
		if (header) {
			return header
		}
		if (isDuplicate) {
			return `Duplicar ${props.label}`
		}
		if (props.isEdit) {
			return `Editar ${props.label}`
		}
		return `Nov${props.labelFeminine ? 'a' : 'o'} ${props.label}`
	}, [isDuplicate, props.label, header, props.labelFeminine, props.isEdit])

	return (
		<div className="container-fluid py-4">
			<div className="row">
				<div className="col-12">
					{showHeader && (
						<div className="d-flex justify-content-between align-items-center mb-4">
							<div className="d-flex align-items-center">
								<h2 className=" mb-0 d-inline me-4">{getHeader()}</h2>
								<Link to={navigateBackTo || '/'} className="btn btn-outline-secondary py-1 me-3">
									<i className="bi bi-arrow-left me-1"></i>
									Voltar
								</Link>
							</div>
						</div>
					)}

					<div className="card">
						<div className="card-body p-4">
							<div>
								<BaseForm {...props} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
