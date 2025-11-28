import { act, render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { MemoryRouter } from 'react-router'
import { ResetPassword } from '../../../src/presentation/pages/Auth/ForgotPassword/ResetPassword'
import { clickButton, fillInput } from '../helpers/form'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const mockValidateToken = vi.fn(() => delay(100).then(() => undefined))
const mockExecute = vi.fn(() => delay(100).then(() => undefined))
const mockShowToast = vi.fn()
let mockSearchParams: URLSearchParams

vi.mock('../../../src/main/AppContextProvider', () => ({
	useAppContext: () => ({
		ResetPasswordService: {
			validateToken: mockValidateToken,
			execute: mockExecute
		},
		showToast: mockShowToast,
		get searchParams() {
			return mockSearchParams
		},
		invalidate: vi.fn()
	})
}))

const makeSut = (searchParamsString = '?token=test-token-123') => {
	mockSearchParams = new URLSearchParams(searchParamsString)
	return render(
		<MemoryRouter>
			<ResetPassword />
		</MemoryRouter>
	)
}

describe('ResetPassword', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockSearchParams = new URLSearchParams('?token=test-token-123')
	})

	it('should show validating token state initially', async () => {
		mockValidateToken.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
		makeSut()

		expect(screen.getByText('Validando token...')).toBeInTheDocument()
		expect(screen.getByRole('status')).toBeInTheDocument()
	})

	it('should show form when token validation succeeds', async () => {
		mockValidateToken.mockResolvedValue(undefined)
		makeSut()

		await waitFor(() => {
			expect(screen.getByTestId('page-title')).toHaveTextContent('Redefinir senha')
		})

		expect(screen.getByTestId('password')).toBeInTheDocument()
		expect(screen.getByTestId('confirmPassword')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /redefinir senha/i })).toBeInTheDocument()
		expect(mockValidateToken).toHaveBeenCalledWith('test-token-123')
	})

	it('should show invalid token state when token validation fails', async () => {
		mockValidateToken.mockRejectedValue(new Error('Token inválido'))
		makeSut()

		await waitFor(() => {
			expect(screen.getByText('Token inválido')).toBeInTheDocument()
		})

		expect(screen.getByRole('link', { name: /voltar para o login/i })).toBeInTheDocument()
		expect(mockValidateToken).toHaveBeenCalledWith('test-token-123')
	})

	it('should show toast when token is not found in search params', async () => {
		mockValidateToken.mockResolvedValue(undefined)
		makeSut('')

		await waitFor(() => {
			expect(mockShowToast).toHaveBeenCalledWith('Token de recuperação de senha não encontrado', 'error')
		})
	})

	it('should show form with submit button enabled in show_form state', async () => {
		mockValidateToken.mockResolvedValue(undefined)
		makeSut()

		await waitFor(() => {
			expect(screen.getByTestId('password')).toBeInTheDocument()
			expect(screen.getByTestId('confirmPassword')).toBeInTheDocument()
		})

		const submitButton = screen.getByRole('button', { name: /redefinir senha/i })
		expect(submitButton).toBeInTheDocument()
		expect(submitButton).not.toBeDisabled()
	})

	it('should show form with disabled button and loading text in form_submitted state', async () => {
		mockValidateToken.mockResolvedValue(undefined)
		mockExecute.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
		makeSut()

		await waitFor(() => {
			expect(screen.getByTestId('password')).toBeInTheDocument()
			expect(screen.getByTestId('confirmPassword')).toBeInTheDocument()
		})

		await fillInput('password', 'NewPassword123!')
		await fillInput('confirmPassword', 'NewPassword123!')
		await clickButton('submit-button')

		expect(screen.getByRole('button', { name: /Redefinindo senha.../i })).toBeInTheDocument()

		const loadingButton = screen.getByTestId('submit-button')
		expect(loadingButton).toBeDisabled()
	})

	it('should show success state when password reset succeeds', async () => {
		mockValidateToken.mockResolvedValue(undefined)
		mockExecute.mockResolvedValue(undefined)
		makeSut()

		await waitFor(() => {
			expect(screen.getByTestId('password')).toBeInTheDocument()
			expect(screen.getByTestId('confirmPassword')).toBeInTheDocument()
		})

		const submitButton = screen.getByTestId('submit-button')

		await fillInput('password', 'NewPassword123!')
		await fillInput('confirmPassword', 'NewPassword123!')
		await clickButton('submit-button')

		await waitFor(() => {
			expect(screen.getByText('Senha redefinida com sucesso')).toBeInTheDocument()
		})

		expect(screen.getByRole('link', { name: /voltar para o login/i })).toBeInTheDocument()
		expect(mockExecute).toHaveBeenCalledWith('test-token-123', 'NewPassword123!')
		expect(mockShowToast).toHaveBeenCalledWith('Senha redefinida com sucesso', 'success')
	})

	it('should show error and return to form when password reset fails', async () => {
		mockValidateToken.mockResolvedValue(undefined)
		mockExecute.mockRejectedValue(new Error('Erro ao redefinir senha'))
		makeSut()

		await waitFor(() => {
			expect(screen.getByTestId('password')).toBeInTheDocument()
		})

		await fillInput('password', 'NewPassword123!')
		await fillInput('confirmPassword', 'NewPassword123!')
		await clickButton('submit-button')

		await waitFor(() => {
			expect(screen.getByText('Erro ao redefinir senha')).toBeInTheDocument()
		})

		expect(screen.getByTestId('password')).toBeInTheDocument()
		expect(screen.getByTestId('confirmPassword')).toBeInTheDocument()
		expect(mockExecute).toHaveBeenCalledWith('test-token-123', 'NewPassword123!')
	})

	it('should show error when passwords do not match', async () => {
		mockValidateToken.mockResolvedValue(undefined)
		makeSut()

		await waitFor(() => {
			expect(screen.getByTestId('password')).toBeInTheDocument()
		})

		await fillInput('password', 'NewPassword123!')
		await fillInput('confirmPassword', 'DifferentPassword123!')
		await clickButton('submit-button')

		await waitFor(() => {
			expect(screen.getByText(/senhas não coincidem/i)).toBeInTheDocument()
		})

		expect(mockExecute).not.toHaveBeenCalled()
	})

	it('should show error when password does not meet validation requirements', async () => {
		mockValidateToken.mockResolvedValue(undefined)
		makeSut()

		await waitFor(() => {
			expect(screen.getByTestId('password')).toBeInTheDocument()
		})

		await fillInput('password', 'short')
		await fillInput('confirmPassword', 'short')
		await clickButton('submit-button')

		await waitFor(() => {
			expect(screen.queryAllByText(/Senha deve ter pelo menos 6 caracteres/i)).toHaveLength(2)
		})

		expect(mockExecute).not.toHaveBeenCalled()
	})
})
