import { useState } from 'react'

export const useDeleteModal = <T>() => {
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [rowsToDelete, setRowsToDelete] = useState<T[]>([])
	const [deleteLoading, setDeleteLoading] = useState(false)

	const openDeleteModal = (rows: T[]) => {
		setRowsToDelete(rows)
		setShowDeleteModal(true)
	}

	const closeDeleteModal = () => {
		setShowDeleteModal(false)
		setRowsToDelete([])
	}

	return {
		showDeleteModal,
		rowsToDelete,
		deleteLoading,
		setDeleteLoading,
		openDeleteModal,
		closeDeleteModal
	}
}
