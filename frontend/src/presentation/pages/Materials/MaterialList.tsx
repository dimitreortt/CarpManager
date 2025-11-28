import { useMemo } from 'react'
import { BaseList } from '../../components/List/BaseList'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Material } from '../../../infra/repository/MaterialRepository'
import { getColumns } from './getColumns'
import { EmptyList } from '../../components/List/EmptyList'
import { useLoadRecords } from '../../hooks/useLoadRecords'
import { LoadingList } from '../../components/List/LoadingList'

export const MaterialList = () => {
	const { materialRepository } = useAppContext()
	const {
		records: materials,
		loading,
		setRecords: setMaterials,
		invalidate
	} = useLoadRecords<Material>({ entityName: 'material', repository: materialRepository, errorMessage: 'Erro ao carregar materiais' })
	const columns = useMemo(() => getColumns(), [])

	const handleConfirmDelete = async (selectedMaterials: Material[]) => {
		await materialRepository.deleteMany(selectedMaterials)
		setMaterials(materials.filter(material => !selectedMaterials.includes(material)))
		await invalidate()
	}

	if (loading) {
		return <LoadingList />
	}

	return (
		<div className="container-fluid px-0">
			{materials.length === 0 && (
				<EmptyList
					icon="bi bi-box-seam-fill"
					title="Catálogo de Materiais"
					description="Gerencie seu catálogo de materiais, controle de estoque e informações de preços."
					entityFormPath="/materials/form"
					entitySingular="material"
				/>
			)}
			{materials.length > 0 && (
				<BaseList
					columns={columns}
					data={materials}
					enableCheckboxes={true}
					enableSearch={true}
					searchPlaceholder="Buscar materiais..."
					emptyMessage="Nenhum material encontrado"
					loading={loading}
					className="bg-white rounded shadow-sm"
					entityViewPath="/materials/view"
					entityKey="material"
					entityFormPath="/materials/form"
					onConfirmDelete={handleConfirmDelete}
					confirmEntitySingular="material"
					confirmEntityPlural="materiais"
				/>
			)}
		</div>
	)
}
