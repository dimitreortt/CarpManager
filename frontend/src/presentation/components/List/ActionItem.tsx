import type { ReactNode } from 'react'

export interface ActionItem<T> {
	label: string
	onClick: (row: T) => void
	icon?: ReactNode
	variant?:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'danger'
		| 'warning'
		| 'info'
		| 'light'
		| 'dark'
		| 'outline-success'
		| 'outline-danger'
		| 'outline-secondary'
		| 'outline-info'
		| 'outline-warning'
		| 'outline-primary'
	className?: string
}
