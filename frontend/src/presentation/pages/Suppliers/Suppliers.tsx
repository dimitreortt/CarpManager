
import { SupplierList } from './SupplierList'
import { BaseListPage } from '../../components/List/BaseListPage'

export const Suppliers = () => {
	return (
		<BaseListPage title="Fornecedores" description="Gerencie seus fornecedores">
			<SupplierList />
		</BaseListPage>
	)
}
