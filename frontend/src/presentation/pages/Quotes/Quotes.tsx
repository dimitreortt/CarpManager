import { BaseListPage } from '../../components/List/BaseListPage'
import { QuotesList } from './QuotesList'

export const Quotes = () => {
	return (
		<BaseListPage title="Cotações" description="Gerencie as cotações de fornecedores">
			<QuotesList />
		</BaseListPage>
	)
}
