import { BaseList } from '../../components/List/BaseList'
import { useAppContext } from '../../../main/AppContextProvider'
import { getColumns } from './getColumns'
import { useMemo } from 'react'
import type { Quote } from '../../../infra/repository/QuoteRepository'
import { EmptyList } from '../../components/List/EmptyList'
import { useLoadRecords } from '../../hooks/useLoadRecords'
import { LoadingList } from '../../components/List/LoadingList'

export const QuotesList = () => {
	const { quoteRepository } = useAppContext()
	const {
		records: quotes,
		loading,
		setRecords: setQuotes,
		invalidate
	} = useLoadRecords<Quote>({ entityName: 'quote', repository: quoteRepository, errorMessage: 'Erro ao carregar cotações' })

	const columns = useMemo(() => getColumns(), [])

	const handleConfirmDelete = async (selectedQuotes: Quote[]) => {
		await quoteRepository.deleteMany(selectedQuotes)
		setQuotes(quotes.filter(quote => !selectedQuotes.includes(quote)))
		await invalidate()
	}

	if (loading) {
		return <LoadingList />
	}

	return (
		<div className="container-fluid px-0">
			{quotes.length === 0 && !loading && (
				<EmptyList
					icon="bi bi-calculator-fill"
					title="Lista de Cotações"
					description="Crie e gerencie cotações de fornecedores."
					entityFormPath="/quotes/form"
					entitySingular="cotação"
				/>
			)}
			{quotes.length > 0 && (
				<BaseList<Quote>
					columns={columns}
					data={quotes}
					enableCheckboxes={true}
					enableSearch={true}
					searchPlaceholder="Buscar cotações..."
					emptyMessage="Nenhuma cotação encontrada"
					loading={loading}
					className="bg-white rounded shadow-sm"
					entityViewPath="/quotes/view"
					entityKey="quote"
					entityFormPath="/quotes/form"
					onConfirmDelete={handleConfirmDelete}
					confirmEntitySingular="cotação"
					confirmEntityPlural="cotações"
				/>
			)}
		</div>
	)
}
