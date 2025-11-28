import { useState, useCallback } from 'react'

export const useRefresher = () => {
	const [refresh, setRefresh] = useState(1)

	const doRefresh = useCallback(() => {
		setRefresh(prev => prev + 1)
	}, [])

	return { refresh: doRefresh }
}
