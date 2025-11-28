import { useNavigate } from 'react-router'
import { Layout } from '../../components/Layout/Layout'
import { BaseView } from '../../components/View/BaseView'
import { convertColumnsToFields } from '../../components/View/convertColumnToField'
import type { FieldDefinition } from '../../components/View/FieldDefinition'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Quote } from '../../../infra/repository/QuoteRepository'
import { ConfirmationModal } from '../../components/Modals/ConfirmationModal'
import { useQuoteViewState } from './useQuoteViewState'
import { useMemo, useState } from 'react'
import { getColumns } from './getColumns'

export const QuotesView = () => {
	const { quoteRepository, showToast } = useAppContext()
	const navigate = useNavigate()
	const { quote, loading } = useQuoteViewState()
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const handleEdit = (quote: Quote) => {
		navigate('/quotes/form', { state: { quote } })
	}

	const handleDelete = (quote: Quote) => {
		setShowDeleteModal(true)
	}

	const handleConfirmDelete = async () => {
		if (!quote) return

		try {
			await quoteRepository.delete(quote)
			showToast('Cotação excluída com sucesso', 'success')
			navigate('/quotes')
		} catch (error) {
			console.error('Error deleting quote:', error)
			showToast('Erro ao excluir cotação', 'error')
		} finally {
			setShowDeleteModal(false)
		}
	}

	const columns = useMemo(() => getColumns(), [])
	const baseFields = convertColumnsToFields(columns)
	const additionalFields: FieldDefinition<Quote>[] = []
	const fields = [...baseFields, ...additionalFields]

	return (
		<Layout>
			<BaseView
				record={quote || ({} as Quote)}
				fields={fields}
				title="Detalhes da Cotação"
				subtitle={quote ? `${quote.name}` : undefined}
				loading={loading}
				onEdit={handleEdit}
				onDelete={handleDelete}
				emptyMessage="Cotação não encontrada"
			/>

			<ConfirmationModal
				isOpen={showDeleteModal}
				title="Confirmar Exclusão"
				message="Tem certeza que deseja excluir esta cotação? Esta ação não pode ser desfeita."
				confirmText="Excluir"
				cancelText="Cancelar"
				variant="danger"
				onConfirm={handleConfirmDelete}
				onClose={() => setShowDeleteModal(false)}
			/>
		</Layout>
	)
}
