import { Routes, Route, Navigate } from 'react-router'
import { Login } from '../presentation/pages/Auth/Login/Login'
import { SignUp } from '../presentation/pages/Auth/SignUp/SignUp'
import { useAppContext } from './AppContextProvider'
import { AppRouter } from './AppRouter'
import { EmailVerification } from '../presentation/pages/Auth/SignUp/EmailVerification'
import { VerifyEmail } from '../presentation/pages/Auth/SignUp/VerifyEmail'
import { ForgotPassword } from '../presentation/pages/Auth/ForgotPassword/ForgotPassword'
import { ResetPassword } from '../presentation/pages/Auth/ForgotPassword/ResetPassword'

export const App = () => {
	const { user, loadingUser } = useAppContext()

	if (loadingUser) {
		return (
			<div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-primary-gradient text-white">
				<div className="spinner-border mb-3" role="status">
					<span className="visually-hidden">Carregando...</span>
				</div>
				<p className="body-medium text-white mb-0">Carregando...</p>
			</div>
		)
	}

	if (!user) {
		return (
			<Routes>
				<Route path="/verify-email" element={<VerifyEmail />} />
				<Route path="/email-verification" element={<EmailVerification />} />
				<Route path="/cadastro" element={<SignUp />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route path="*" element={<Login />} />
			</Routes>
		)
	}

	return <AppRouter />
}
