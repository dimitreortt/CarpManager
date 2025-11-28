import { atom, useAtom } from 'jotai'

const customOptionValuesAtom = atom<Record<string, number>>({})
const showChangeOptionValueInputAtom = atom<Record<string, boolean>>({})

export const useMultiSelectState = () => {
	const [customOptionValues, setCustomOptionValues] = useAtom(customOptionValuesAtom)
	const [showChangeOptionValueInput, setShowChangeOptionValueInput] = useAtom(showChangeOptionValueInputAtom)

	const setCustomOptionValue = (key: string, value: number) => {
		setCustomOptionValues(prev => ({ ...prev, [key]: value }))
	}

	const setShowChangeOptionValueInputForKey = (key: string, show: boolean) => {
		setShowChangeOptionValueInput(prev => ({ ...prev, [key]: show }))
	}

	const reset = () => {
		setCustomOptionValues({})
		setShowChangeOptionValueInput({})
	}

	return {
		customOptionValues,
		showChangeOptionValueInput,
		setCustomOptionValue,
		setShowChangeOptionValueInputForKey,
		reset
	}
}
