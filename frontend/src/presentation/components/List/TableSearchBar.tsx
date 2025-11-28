import { Search } from 'lucide-react'

interface TableSearchBarProps {
	searchTerm: string
	setSearchTerm: (value: string) => void
	searchPlaceholder: string
	filteredCount: number
	totalCount: number
	onClear: () => void
}

export const TableSearchBar = ({ searchTerm, setSearchTerm, searchPlaceholder, filteredCount, totalCount, onClear }: TableSearchBarProps) => {
	return (
		<div className="mb-3">
			<div className="input-group">
				<span className="input-group-text">
					<Search size={16} />
				</span>
				<input
					type="text"
					className="form-control"
					placeholder={searchPlaceholder}
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
				/>
				{searchTerm && (
					<button className="btn btn-outline-secondary" type="button" onClick={onClear}>
						Limpar
					</button>
				)}
			</div>
			{searchTerm && (
				<small className="text-muted">
					{filteredCount} de {totalCount} itens encontrados
				</small>
			)}
		</div>
	)
}
