import { Eye, Edit, MoreVertical } from 'lucide-react'
import { useBaseListConfig, useBaseListState } from './BaseListContext'
import { DropdownMenu } from './DropdownMenu'

interface TableRowProps<T> {
	row: T
	index: number
	rowId: string
	isSelected: boolean
	showEntityIcons: boolean
}

export const TableRow = <T extends Record<string, any>>({ row, index, rowId, isSelected, showEntityIcons }: TableRowProps<T>) => {
	const { columns, entityViewPath, entityFormPath, entityKey, enableCheckboxes, enableActions, hideEntityIcons, actions, onNavigate, renderCell } =
		useBaseListConfig<T>()
	const { handleRowSelect, dropdownPos, handleMoreActionsClick, dropdownRef, closeDropdown } = useBaseListState<T>()

	return (
		<tr key={rowId} className={isSelected ? 'table-primary' : ''}>
			{enableCheckboxes && (
				<td className="align-middle">
					<div className="form-check d-flex align-items-center justify-content-center">
						<input
							className="form-check-input"
							type="checkbox"
							checked={isSelected}
							onChange={e => handleRowSelect(rowId, e.target.checked)}
						/>
					</div>
				</td>
			)}
			{showEntityIcons && !hideEntityIcons && (
				<td className="align-middle">
					<div className="d-flex align-items-center btn-group">
						{entityViewPath && (
							<button
								className="btn btn-sm btn-outline-secondary py-1"
								onClick={() => onNavigate(entityViewPath, { state: { [entityKey || 'entity']: row } })}
								title="Visualizar"
							>
								<Eye size={16} />
							</button>
						)}
						{entityFormPath && (
							<button
								className="btn btn-sm btn-outline-secondary py-1"
								onClick={() => onNavigate(entityFormPath, { state: { [entityKey || 'entity']: row } })}
								title="Editar"
							>
								<Edit size={16} />
							</button>
						)}
					</div>
				</td>
			)}
			{columns
				.filter(column => !column.hide)
				.map(column => (
					<td
						key={String(column.key)}
						className={`text-center align-middle ${
							column.key === 'name' || column.key === 'number' ? 'cursor-pointer-important underline' : ''
						}`}
						onClick={() => {
							;(column.key === 'name' || column.key === 'number') &&
								entityViewPath &&
								onNavigate(entityViewPath, { state: { [entityKey || 'entity']: row } })
						}}
					>
						{renderCell(column, row)}
					</td>
				))}
			{enableActions && (
				<td className="align-middle">
					<button
						id="more-actions-button"
						className="btn btn-sm btn-outline-secondary p-2 py-1"
						type="button"
						aria-expanded="false"
						aria-label="Ações"
						onClick={e => {
							e.preventDefault()
							handleMoreActionsClick(row, e)
						}}
					>
						<MoreVertical size={16} id="more-actions-icon" />
					</button>
					{dropdownPos && (
						<DropdownMenu<T>
							dropdownRef={dropdownRef}
							dropdownPos={dropdownPos}
							actions={actions}
							row={dropdownPos.row}
							closeDropdown={closeDropdown}
						/>
					)}
				</td>
			)}
		</tr>
	)
}
