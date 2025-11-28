import { useMemo } from 'react'
import { BaseList } from '../../components/List/BaseList'
import { useAppContext } from '../../../main/AppContextProvider'
import type { Supplier } from '../../../infra/repository/SupplierRepository'
import { EmptyList } from '../../components/List/EmptyList'
import { getColumns } from './getColumns'
import { useLoadRecords } from '../../hooks/useLoadRecords'
import { LoadingList } from '../../components/List/LoadingList'

export const SupplierList = () => {
	const { supplierRepository } = useAppContext()
	const columns = useMemo(() => getColumns(), [])
	const {
		records: suppliers,
		loading,
		setRecords: setSuppliers,
		invalidate
	} = useLoadRecords<Supplier>({ entityName: 'supplier', repository: supplierRepository, errorMessage: 'Erro ao carregar fornecedores' })

	const handleConfirmDelete = async (selectedSuppliers: Supplier[]) => {
		await supplierRepository.deleteMany(selectedSuppliers)
		setSuppliers(suppliers.filter(supplier => !selectedSuppliers.includes(supplier)))
		await invalidate()
	}

	if (loading) {
		return <LoadingList />
	}

	return (
		<div className="container-fluid px-0">
			{suppliers.length === 0 && !loading && (
				<EmptyList
					icon="bi bi-building"
					title="Lista de Fornecedores"
					description="Gerencie seus fornecedores, informações de contato e produtos disponíveis."
					entityFormPath="/suppliers/form"
					entitySingular="fornecedor"
				/>
			)}
			{suppliers.length > 0 && (
				<BaseList
					columns={columns}
					data={suppliers}
					enableCheckboxes={true}
					enableSearch={true}
					searchPlaceholder="Buscar fornecedores..."
					emptyMessage="Nenhum fornecedor encontrado"
					loading={loading}
					className="bg-white rounded shadow-sm"
					entityViewPath="/suppliers/view"
					entityKey="supplier"
					entityFormPath="/suppliers/form"
					onConfirmDelete={handleConfirmDelete}
					confirmEntitySingular="fornecedor"
					confirmEntityPlural="fornecedores"
				/>
			)}
		</div>
	)
}
