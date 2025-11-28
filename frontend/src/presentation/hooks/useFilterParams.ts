import { useAppContext } from '../../main/AppContextProvider'

export const useFilterParams = () => {
	const { searchParams } = useAppContext()
	const filter = searchParams.get('filter')
	const value = searchParams.get('value')
	return { filter, value }
}
