import { useState, useRef } from 'react'
import { useHandleClickOutside } from '../useHandleClickOutside'

export const useDropdownMenu = <T>() => {
	const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number; width: number; row: T } | null>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const closeDropdown = () => setDropdownPos(null)

	useHandleClickOutside(dropdownRef, closeDropdown, ['more-actions-button', 'more-actions-icon'])

	const handleMoreActionsClick = (row: T, e: React.MouseEvent<HTMLButtonElement>) => {
		if (dropdownPos) {
			return closeDropdown()
		}
		const button = e.currentTarget
		const rect = button.getBoundingClientRect()

		setDropdownPos({
			top: rect.bottom + window.scrollY,
			right: rect.right,
			width: rect.width,
			row
		})
	}

	return {
		dropdownPos,
		dropdownRef,
		closeDropdown,
		handleMoreActionsClick
	}
}
