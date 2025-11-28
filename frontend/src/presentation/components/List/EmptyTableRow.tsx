import { useBaseListConfig } from './BaseListContext'

interface EmptyTableRowProps {
	message: string
	showEntityIcons: boolean
}

export const EmptyTableRow = ({ message, showEntityIcons }: EmptyTableRowProps) => {
	const { columns, enableCheckboxes, enableActions, hideEntityIcons } = useBaseListConfig()

	const colSpan = columns.length + (enableCheckboxes ? 1 : 0) + (enableActions ? 1 : 0) + (showEntityIcons && !hideEntityIcons ? 1 : 0)

	return (
		<tr>
			<td colSpan={colSpan} className="text-center py-4">
				<p className="text-muted mb-0">{message}</p>
			</td>
		</tr>
	)
}
