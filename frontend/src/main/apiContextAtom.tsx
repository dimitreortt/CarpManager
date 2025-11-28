import { atom } from 'jotai'
import { store } from '../infra/store/store'

export interface ApiContext {
	handleUnauthorized: () => Promise<void>
	csrfToken?: string
}

export const apiContextAtom = atom<ApiContext>({
	handleUnauthorized: async () => {},
	csrfToken: ''
})

export const setCsrfToken = (csrfToken: string) => {
	store.set(apiContextAtom, { ...store.get(apiContextAtom), csrfToken })
}

export const setHandleUnauthorized = (handleUnauthorized: () => Promise<void>) => {
	store.set(apiContextAtom, { ...store.get(apiContextAtom), handleUnauthorized })
}
