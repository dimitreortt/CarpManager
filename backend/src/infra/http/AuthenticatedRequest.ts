import { Request } from "express"
import { DecodedIdToken } from "firebase-admin/auth"

export interface AuthenticatedRequest extends Request {
	user: DecodedIdToken
	companyId?: string
	userId?: string
}

export function isAuthenticated(req: Request): req is AuthenticatedRequest {
	return (req as AuthenticatedRequest).user !== undefined
}
