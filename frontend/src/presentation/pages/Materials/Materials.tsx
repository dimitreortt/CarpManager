import { MaterialList } from './MaterialList'
import { BaseListPage } from '../../components/List/BaseListPage'

export const Materials = () => {
	return (
		<BaseListPage title="Materiais" description="Gerencie o inventário de materiais">
			<MaterialList />
		</BaseListPage>
	)
}
