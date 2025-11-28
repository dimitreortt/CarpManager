import { ClientList } from './ClientList'
import { BaseListPage } from '../../components/List/BaseListPage'

export const Clients = () => {
	return (
		<BaseListPage title="Clientes" description="Gerencie seus clientes">
			<ClientList />
		</BaseListPage>
	)
}
