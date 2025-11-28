import { useState } from 'react'
import { MonthPicker } from '../../components/Form/MonthPicker/MonthPicker'
import { X } from 'lucide-react'

export const Filters = ({ selectedPeriod, handlePeriodChange }: { selectedPeriod: string; handlePeriodChange: (value: string) => void }) => {
	const [pickerType, setPickerType] = useState<'month' | 'period'>('month')

	return (
		<div className="d-flex flex-column flex-md-row gap-2 mt-4 mt-md-0">
			<div className="form-group mb-0" style={{ width: '100px' }}>
				<label htmlFor="pickerType" className="form-label me-2">
					Tipo:
				</label>
				<select
					id="pickerType"
					className="form-select form-control cursor-pointer-important"
					value={pickerType}
					onChange={e => setPickerType(e.target.value as 'month' | 'period')}
				>
					<option value="month">Mês</option>
					<option value="period">Período</option>
				</select>
			</div>
			<div className="form-group mb-0" style={{ width: '250px' }}>
				<label htmlFor="period" className="form-label me-2">
					{pickerType === 'month' ? 'Mês:' : 'Período:'}
				</label>
				<MonthPicker
					value={selectedPeriod}
					onChange={handlePeriodChange}
					placeholder={pickerType === 'month' ? 'Selecione o mês' : 'Selecione o período'}
					typeOfPicker={pickerType}
				/>
			</div>
			<div className="form-group mb-0 align-self-end" style={{}}>
				<button title="Limpar" className="btn btn-sm btn-outline-light mb-1" onClick={() => handlePeriodChange('')}>
					<X size={16} />
				</button>
			</div>
		</div>
	)
}
