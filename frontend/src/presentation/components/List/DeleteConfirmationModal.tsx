import { ConfirmationModal, type ConfirmationModalVariant } from '../Modals/ConfirmationModal'

interface DeleteConfirmationModalProps<T> {
	isOpen: boolean
	rows: T[]
	loading: boolean
	confirmDeleteTitle: string
	confirmDeleteMessage?: string
	confirmEntitySingular: string
	confirmEntityPlural: string
	confirmDeleteVariant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
	confirmDeleteConfirmText: string
	onClose: () => void
	onConfirm: (rows: T[]) => Promise<void>
}

export const DeleteConfirmationModal = <T,>({
	isOpen,
	rows,
	loading,
	confirmDeleteTitle,
	confirmDeleteMessage,
	confirmEntitySingular,
	confirmEntityPlural,
	confirmDeleteVariant,
	confirmDeleteConfirmText,
	onClose,
	onConfirm
}: DeleteConfirmationModalProps<T>) => {
	return (
		<ConfirmationModal
			isOpen={isOpen}
			onClose={onClose}
			onConfirm={async () => {
				await onConfirm(rows)
			}}
			title={confirmDeleteTitle}
			message={
				confirmDeleteMessage ||
				`${'Tem certeza que deseja excluir'} ${rows.length} ${
					rows.length === 1 ? confirmEntitySingular : confirmEntityPlural
				}? Esta ação não pode ser desfeita.`
			}
			variant={confirmDeleteVariant as ConfirmationModalVariant}
			confirmText={confirmDeleteConfirmText}
			loading={loading}
		/>
	)
}
