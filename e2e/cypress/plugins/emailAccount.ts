import { getLastEmail } from "./getLastEmail"

export const makeEmailAccount = async () => {
	return {
		email: process.env.INTEGRATION_TEST_EMAIL,
		password: "**** **** **** ****",
		getLastEmail: getLastEmail,
	}
}
