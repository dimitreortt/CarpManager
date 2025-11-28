import { AdminAuth } from "../../src/infra/firebase/firebase"

export class AdminAuthMock implements AdminAuth {
	createUser = jest.fn()
	updateUser = jest.fn()
	createSessionCookie = jest.fn()
	verifySessionCookie = jest.fn()
	getUserByEmail = jest.fn()
	deleteUser = jest.fn()
}
