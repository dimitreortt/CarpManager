import { useEffect } from 'react'

export const useHandleClickOutside = (ref: React.RefObject<HTMLDivElement | null>, callback: () => void, excludedIds: string[] = []) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node) && !excludedIds.includes((event.target as HTMLElement).id)) {
				callback()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [ref.current])
}
