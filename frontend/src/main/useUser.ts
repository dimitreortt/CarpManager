import { useEffect, useState } from 'react'
import type { HttpClient } from '../infra/http/HttpClient'
import { setCsrfToken } from './apiContextAtom'

export type User = {
	companyId?: string
	token?: string
	isDevUser?: boolean
	name?: string
}

export const useUser = (httpClient: HttpClient<any>) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	const setLoggedUser = (user: any) => {
		setUser(user)
	}

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const { csrfToken }: any = await httpClient.get('/auth/csrf-token')
				setCsrfToken(csrfToken || '')
				const user = (await httpClient.post('/auth/get-logged-user', {})) as User
				setUser(user)
				setLoading(false)
			} catch (error) {
				console.error(error)
				setLoading(false)
			}
		}
		fetchUser()
	}, [])

	return { user, loadingUser: loading, setLoadingUser: setLoading, setUser: setLoggedUser }
}
