import admin, { ServiceAccount } from "firebase-admin"
import { Auth, DecodedIdToken, UserRecord } from "firebase-admin/auth"

let serviceAccount: any

if (process.env.NODE_ENV !== "prod") {
	serviceAccount = require("./serviceAccount.json")
} else {
	serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY as string)
}

export const firebaseAdmin = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as ServiceAccount),
})

export interface AdminAuth {
	createUser(data: any): Promise<any>
	updateUser(uid: string, data: any): Promise<UserRecord>
	createSessionCookie(idToken: string, options: any): Promise<string>
	verifySessionCookie(sessionCookie: string, checkRevoked?: boolean): Promise<DecodedIdToken>
	getUserByEmail(email: string): Promise<UserRecord>
	deleteUser(uid: string): Promise<void>
}
