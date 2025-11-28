import { SignOutUser } from '../usecase/SignOutUser'

export class AuthHandler {
	constructor(readonly signOutUser: SignOutUser) {}

	async handleUnauthorized(): Promise<void> {
		await this.signOutUser.execute()
	}
}
