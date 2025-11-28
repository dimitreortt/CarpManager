import { useEffect } from 'react'
import type { UseFormReturn, FieldValues } from 'react-hook-form'

export const useExposeFormToCypress = <T extends FieldValues>(form: UseFormReturn<T>, entityKey?: string) => {
	useEffect(() => {
		if (entityKey && typeof window !== 'undefined' && (window as any).Cypress) {
			;(window as any)[`${entityKey}FormInstance`] = form
			return () => {
				delete (window as any)[`${entityKey}FormInstance`]
			}
		}
	}, [form, entityKey])
}
