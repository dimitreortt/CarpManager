import { Edit, Eye } from 'lucide-react'

interface Props {
	item: any
	itemName: string
	handleView: (item: any) => void
	handleEdit: (item: any) => void
}

export const ViewEditButtons = ({ item, itemName, handleView, handleEdit }: Props) => {
	return (
		<div className="d-flex gap-1">
			<button
				type="button"
				className="btn btn-sm btn-outline-info py-1"
				onClick={() => handleView(item)}
				title={`Visualizar ${itemName.toLowerCase()}`}
			>
				<Eye size={16} />
			</button>
			<button
				type="button"
				className="btn btn-sm btn-outline-primary py-1"
				onClick={() => handleEdit(item)}
				title={`Editar ${itemName.toLowerCase()}`}
			>
				<Edit size={16} />
			</button>
		</div>
	)
}
