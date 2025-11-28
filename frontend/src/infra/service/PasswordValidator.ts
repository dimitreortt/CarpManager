export class PasswordValidator {
	private static readonly MIN_LENGTH = 8
	private static readonly UPPERCASE_REGEX = /[A-Z]/
	private static readonly LOWERCASE_REGEX = /[a-z]/
	private static readonly NUMBER_REGEX = /[0-9]/
	private static readonly SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
	public static errors: string[] = []

	static validate(password: string): { isValid: boolean; errors: string[] } {
		const errors: string[] = []

		if (password.length < this.MIN_LENGTH) {
			errors.push(`${this.MIN_LENGTH} caracteres`)
		}

		if (!this.UPPERCASE_REGEX.test(password)) {
			errors.push('uma letra maiúscula')
		}

		if (!this.LOWERCASE_REGEX.test(password)) {
			errors.push('uma letra minúscula')
		}

		if (!this.NUMBER_REGEX.test(password)) {
			errors.push('um número')
		}

		if (!this.SPECIAL_CHAR_REGEX.test(password)) {
			errors.push('um caractere especial')
		}

		this.errors = errors

		return {
			isValid: errors.length === 0,
			errors: errors
		}
	}

	static getErrorMessage(errors: string[]): string {
		return `A senha deve conter pelo menoss: ${errors.join(', ')}`
	}

	static validateOrThrow(password: string): void {
		const result = this.validate(password)
		if (!result.isValid) {
			throw new Error(`Validação de senha falhou: ${result.errors.join(', ')}`)
		}
	}

	static checkSamePassword(password: string, confirmPassword: string): void {
		if (password !== confirmPassword) {
			throw new Error('As senhas não coincidem')
		}
	}
}
