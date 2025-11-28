import { Plus, Copy, Trash2 } from 'lucide-react'
import { useBaseListState } from './BaseListContext'
import { getRowId } from './tableUtils.tsx'

interface TableButtonBarProps<T> {
	entityFormPath?: string
	sortedData: T[]
	onNavigate: (path: string) => void
	onDuplicate?: (row: T) => void
	onDelete: (rows: T[]) => void
}

export const TableButtonBar = <T extends Record<string, any>>({
	entityFormPath,
	sortedData,
	onNavigate,
	onDuplicate,
	onDelete
}: TableButtonBarProps<T>) => {
	const { selectedRows } = useBaseListState<T>()

	return (
		<div className="d-flex align-items-center gap-2 mb-3 ps-2">
			{entityFormPath && (
				<button className="btn btn-primary py-1" onClick={() => onNavigate(entityFormPath)}>
					<Plus size={16} />
					Adicionar
				</button>
			)}

			{onDuplicate && (
				<button
					className={`btn btn-outline-primary py-1 ${selectedRows.size !== 1 ? 'disabled' : ''}`}
					onClick={() => {
						const selectedData = sortedData.filter((_, index) => selectedRows.has(getRowId(sortedData[index], index)))
						if (selectedData.length === 1) {
							onDuplicate(selectedData[0])
						}
					}}
				>
					<Copy size={16} />
					Duplicar item
				</button>
			)}

			<button
				title="Deletar Itens"
				className={`btn btn-danger py-1 ${selectedRows.size === 0 ? 'disabled' : ''}`}
				onClick={() => {
					const selectedData = sortedData.filter((_, index) => selectedRows.has(getRowId(sortedData[index], index)))
					onDelete(selectedData)
				}}
			>
				<Trash2 size={16} />
				Deletar {selectedRows.size > 0 ? ` ${selectedRows.size} ${selectedRows.size === 1 ? 'item' : 'itens'}` : ''}
			</button>
		</div>
	)
}
