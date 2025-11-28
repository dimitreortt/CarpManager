import { useEffect, useState } from 'react'
import type { Repository } from '../../infra/repository/Repository'
import { useAppContext } from '../../main/AppContextProvider'
import { useQuery } from '@tanstack/react-query'
import type { BaseRepository } from '../../infra/repository/BaseRepository'

interface UseLoadRecordsProps<T> {
	entityName?: string
	repository: Repository<any>
	options?: Record<string, any>
	errorMessage?: string
	paramRecords?: T[] | null
	paramSetRecords?: ((records: T[]) => void) | null
}

export const useLoadRecordsByEntity = (entity: string) => {
	const { ...appContext } = useAppContext()
	const entityRepository = appContext[`${entity}Repository` as keyof typeof appContext] as BaseRepository<any>
	const { records, invalidate } = useLoadRecords<any>({
		entityName: entity,
		repository: entityRepository,
		errorMessage: 'Erro ao carregar registros'
	})
	return { records, invalidate }
}

export const useLoadRecords = <T>({ entityName, repository, options, errorMessage, paramRecords, paramSetRecords }: UseLoadRecordsProps<T>) => {
	const { showToast, invalidate } = useAppContext()
	const [records, setRecords] = useState<T[]>(paramRecords || [])

	const { data, isLoading, error } = useQuery({
		queryKey: [`${entityName}LoadRecords`],
		queryFn: () => {
			return repository.getAll(options)
		},
		initialData: paramRecords || undefined,
		staleTime: 60 * 60 * 24 * 1000
	})

	useEffect(() => {
		if (error) {
			return showToast(errorMessage || 'Erro ao carregar registros', 'error')
		}
		setRecords(data || [])
	}, [data, error])

	return { records, loading: isLoading, setRecords: paramSetRecords || setRecords, invalidate: () => invalidate(`${entityName}LoadRecords`) }
}
