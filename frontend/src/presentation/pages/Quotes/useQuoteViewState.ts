import { useEntityViewState } from '../../hooks/useEntityViewState'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Quote } from '../../../infra/repository/QuoteRepository'

export const useQuoteViewState = () => {
	const { quoteRepository } = useAppContext()
	const { entity, setEntity, loading } = useEntityViewState<Quote>({
		repository: {
			getById: quoteRepository.getById
		},
		stateKey: 'quote',
		missingIdMessage: 'ID da cotação não fornecido',
		navigateOnErrorTo: '/quotes'
	})

	return { quote: entity, setQuote: setEntity, loading }
}
