import { Request, Response, NextFunction } from "express"

interface ErrorResponse {
	status: number
	message: string
	error?: string
}

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next)
	}
}

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(`[${new Date().toISOString()}] Error in ${req.method} ${req.path}:`, error.message)

	const errorResponse = mapErrorToResponse(error)

	res.status(errorResponse.status).json({
		error: errorResponse.error || error.name,
		message: errorResponse.message,
	})
}

function mapErrorToResponse(error: Error): ErrorResponse {
	let status = 500
	let message = ""
	switch (error.name) {
		case "InvalidTokenError":
			status = 401
			message = error.message
			break
		case "NotAllowedByCorsError":
		case "EmailNotVerifiedError":
			status = 403
			message = error.message
			break
		case "UserNotFoundError":
		case "AcceptEstimateNotFound":
			status = 404
			message = error.message
			break
		case "EmailAlreadyExistsError":
			status = 409
			message = error.message
			break
		case "InvalidCredentialsError":
		case "WeakPasswordError":
		case "AuthError":
		case "PrismaClientKnownRequestError":
		case "ValidationError":
		case "TooManyLoginAttemptsError":
			status = 400
			message = error.message
			break
		case "TooManyRequestsError":
			status = 429
			message = error.message
			break
		default:
			status = 500
			message = "Ocorreu um erro inesperado"
			break
	}

	return {
		status: status,
		message: message,
		error: error.name,
	}
}
