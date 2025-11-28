import { useBaseListConfig, useBaseListState } from './BaseListContext'

interface TableHeaderProps<T> {
	showEntityIcons: boolean
	dataLength: number
}

export const TableHeader = <T extends Record<string, any>>({ showEntityIcons, dataLength }: TableHeaderProps<T>) => {
	const { columns, enableCheckboxes, enableActions, hideEntityIcons, renderSortIcon } = useBaseListConfig<T>()
	const { selectedRows, handleSelectAll, handleSort } = useBaseListState<T>()

	return (
		<thead className="table-light">
			<tr>
				{enableCheckboxes && (
					<th style={{ width: '30px' }}>
						<div className="form-check">
							<input
								className="form-check-input"
								type="checkbox"
								checked={selectedRows.size === dataLength && dataLength > 0}
								onChange={e => handleSelectAll(e.target.checked)}
							/>
						</div>
					</th>
				)}
				{showEntityIcons && !hideEntityIcons && (
					<th style={{ width: '80px' }} className="ps-2">
						Ações
					</th>
				)}
				{columns
					.filter(column => !column.hide)
					.map(column => (
						<th
							key={String(column.key)}
							style={{ width: column.width, minWidth: column.minWidth }}
							className={` ${column.sortable ? 'cursor-pointer user-select-none' : ''}`}
							onClick={() => column.sortable && handleSort(column.key)}
						>
							<div className="d-flex align-items-center justify-content-center gap-1">
								<span>{column.header}</span>
								{column.sortable && renderSortIcon(column.key)}
							</div>
						</th>
					))}
				{enableActions && <th style={{ width: '80px' }}>Ações Extras</th>}
			</tr>
		</thead>
	)
}
