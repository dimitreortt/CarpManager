import { makeEmailAccount } from "./emailAccount"

export const config = async (on: any, config: any) => {
	const emailAccount = await makeEmailAccount()

	on("task", {
		getUserEmail() {
			return emailAccount.email
		},
		getUserPassword() {
			return emailAccount.password
		},
		getLastEmail() {
			return emailAccount.getLastEmail()
		},
	})

	return config
}
