import { useEffect, useRef } from 'react'
import type { ActionItem } from './ActionItem'

export const DropdownMenu = <T extends Record<string, any>>({
	dropdownPos,
	actions,
	row,
	closeDropdown,
	dropdownRef
}: {
	dropdownPos: { top: number; right: number; width: number }
	actions: ActionItem<T>[]
	row: T
	closeDropdown: () => void
	dropdownRef: React.RefObject<HTMLDivElement | null>
}) => {
	return (
		<div
			ref={dropdownRef}
			className="dropdown-menu show"
			style={{
				position: 'absolute',
				top: dropdownPos.top,
				right: window.innerWidth - (dropdownPos.right || 0),
				minWidth: dropdownPos.width,
				zIndex: 9999
			}}
		>
			{actions.map((action, actionIndex) => (
				<button
					key={actionIndex}
					className={`dropdown-item btn btn-sm btn-${action.variant || ''}`}
					onClick={() => {
						action.onClick(row)
						closeDropdown()
					}}
				>
					{action.icon && <span className="me-2">{action.icon}</span>}
					{action.label}
				</button>
			))}
		</div>
	)
}
