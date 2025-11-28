import { Plus } from 'lucide-react'

export const AddButton = ({ label, onClick, btnClass = 'btn-primary' }: { label: string; onClick: () => void; btnClass?: string | undefined }) => {
	return (
		<button type="button" className={`btn ${btnClass} py-1`} onClick={onClick}>
			<Plus size={16} />
			{label}
		</button>
	)
}
