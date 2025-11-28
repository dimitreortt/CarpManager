import type { User } from '../../main/useUser'

export const makeDbPath = (user: User, path: string) => {
	return `company/${user.companyId}/${path}`
}
