import { useState } from 'react'
import type { OptionItem } from './MultiSelectField'
import { useMultiSelectState } from './multiSelectState'
import { Check, CheckCircle, Edit } from 'lucide-react'

export const UpdateOptionInput = ({
	option,
	handleChangeOptionValue,
	onSave
}: {
	option: OptionItem
	handleChangeOptionValue: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void
	onSave: () => void
}) => {
	const { customOptionValues, setCustomOptionValue, showChangeOptionValueInput, setShowChangeOptionValueInputForKey } = useMultiSelectState()

	const toggleShowChangeOptionValueInput = (id: string) => {
		setShowChangeOptionValueInputForKey(id, !showChangeOptionValueInput[id])
	}

	const formatCurrency = (val: number | undefined): string => {
		if (typeof val !== 'number' || isNaN(val)) return ''
		return val.toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		})
	}

	const parseCurrency = (val: string): number | undefined => {
		const numeric = parseFloat(val.replace(/\D/g, '')) / 100
		return isNaN(numeric) ? undefined : numeric
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const num = parseCurrency(e.target.value)
		handleChangeOptionValue({ target: { value: num } } as any, option.id)
	}

	const handleSave = () => {
		toggleShowChangeOptionValueInput(option.id)
		onSave()
	}

	return (
		<>
			{showChangeOptionValueInput[option.id] && (
				<>
					<input
						type="text"
						className=""
						value={formatCurrency(customOptionValues[option.id] || option.value)}
						onChange={handleChange}
						style={{ width: '100px', border: '1px solid #ccc' }}
					/>
					<button title="Salvar" className="btn btn-sm p-0 pb-1 ps-1" onClick={handleSave}>
						<CheckCircle size={16} className="text-success" />
					</button>
				</>
			)}
			{!showChangeOptionValueInput[option.id] && (
				<button title="Editar" className="btn btn-sm p-0 pb-1 ps-1" onClick={() => toggleShowChangeOptionValueInput(option.id)}>
					<Edit size={16} />
				</button>
			)}
		</>
	)
}
