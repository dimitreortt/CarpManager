export class AuthError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "AuthError"
	}
}

export class WeakPasswordError extends AuthError {
	constructor(message: string) {
		super(message)
		this.name = "WeakPasswordError"
	}
}

export class EmailAlreadyExistsError extends AuthError {
	constructor() {
		super("Email já cadastrado")
		this.name = "EmailAlreadyExistsError"
	}
}

export class InvalidCredentialsError extends AuthError {
	constructor() {
		super("Email ou senha inválidos")
		this.name = "InvalidCredentialsError"
	}
}

export class EmailNotVerifiedError extends AuthError {
	constructor() {
		super("Email não verificado. Por favor, verifique seu email antes de fazer login.")
		this.name = "EmailNotVerifiedError"
	}
}

export class UserNotFoundError extends AuthError {
	constructor() {
		super("Usuário não encontrado")
		this.name = "UserNotFoundError"
	}
}

export class InvalidTokenError extends AuthError {
	constructor() {
		super("Token inválido ou expirado")
		this.name = "InvalidTokenError"
	}
}

export class InvalidSessionCookieError extends AuthError {
	constructor() {
		super("Cookie de sessão inválido ou expirado")
		this.name = "InvalidSessionCookieError"
	}
}

export class TooManyLoginAttemptsError extends AuthError {
	constructor() {
		super("Muitas tentativas de login. Tente novamente mais tarde.")
		this.name = "TooManyLoginAttemptsError"
	}
}

export class TooManyRequestsError extends AuthError {
	constructor() {
		super("Muitas requisições. Tente novamente mais tarde.")
		this.name = "TooManyRequestsError"
	}
}
