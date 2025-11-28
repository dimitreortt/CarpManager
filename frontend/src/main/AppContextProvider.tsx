import { createContext, useContext, useEffect, useMemo } from 'react'
import { AuthenticateUser } from '../usecase/AuthenticateUser'
import { useUser, type User } from './useUser'
import { SignOutUser } from '../usecase/SignOutUser'
import { SignUpUser } from '../usecase/SignUpUser'
import { MaterialRepository, type Material } from '../infra/repository/MaterialRepository'
import { ClientRepository, type Client } from '../infra/repository/ClientRepository'
import { EstimateRepository, type Estimate } from '../infra/repository/EstimateRepository'
import { IncomingRepository, type Incoming } from '../infra/repository/IncomingRepository'
import { OutgoingRepository, type Outgoing } from '../infra/repository/OutgoingRepository'
import { SupplierRepository, type Supplier } from '../infra/repository/SupplierRepository'
import { TripRepository, type Trip } from '../infra/repository/TripRepository'
import { QuoteRepository, type Quote } from '../infra/repository/QuoteRepository'
import { EmployeeRepository, type Employee } from '../infra/repository/EmployeeRepository'
import { useToastState, type ToastType } from '../presentation/components/Toast/useToastState'
import { Toast } from '../presentation/components/Toast/Toast'
import { useLocation, useNavigate, type NavigateFunction, type Location, useSearchParams, useParams } from 'react-router'
import { useRefresher } from '../presentation/hooks/useRefresher'
import { AxiosHttpClient } from '../infra/http/AxiosHttpClient'
import type { HttpClient } from '../infra/http/HttpClient'
import { setHandleUnauthorized } from './apiContextAtom'
import { ValidateEmail } from '../usecase/ValidateEmail'
import { ResetPasswordService } from '../usecase/ResetPasswordService'
import { UserRepository } from '../infra/repository/UserRepository'
import { AuthHandler } from './AuthHandler'
import { useQueryClient } from '@tanstack/react-query'

export const AppContext = createContext(
	{} as {
		AuthenticateUser: AuthenticateUser
		SignUpUser: SignUpUser
		user: User | null
		loadingUser: boolean
		SignOutUser: SignOutUser
		materialRepository: MaterialRepository
		clientRepository: ClientRepository
		estimateRepository: EstimateRepository
		incomingRepository: IncomingRepository
		outgoingRepository: OutgoingRepository
		supplierRepository: SupplierRepository
		tripRepository: TripRepository
		quoteRepository: QuoteRepository
		employeeRepository: EmployeeRepository
		toastOpen: boolean
		setToastOpen: (open: boolean) => void
		toastMessage: string
		toastType: ToastType
		showToast: (message: string, type?: ToastType, timeOut?: number) => void
		hideToast: () => void
		navigate: NavigateFunction
		location: Location
		searchParams: URLSearchParams
		refresh: () => void
		useParams: typeof useParams
		ValidateEmail: ValidateEmail
		ResetPasswordService: ResetPasswordService
		userRepository: UserRepository
		setUser: (user: any) => void
		invalidate: (queryKey: string | string[]) => Promise<void>
	}
)

export const useAppContext = () => {
	return useContext(AppContext)
}

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
	const { toastOpen, setToastOpen, toastMessage, toastType, showToast, hideToast, timeOut } = useToastState()
	const navigate = useNavigate()
	const location = useLocation()
	const [searchParams] = useSearchParams()
	const { refresh } = useRefresher()
	const httpClient = new AxiosHttpClient()
	const { user, loadingUser, setUser } = useUser(httpClient as HttpClient<any>)

	const {
		materialRepository,
		clientRepository,
		estimateRepository,
		incomingRepository,
		outgoingRepository,
		supplierRepository,
		tripRepository,
		quoteRepository,
		employeeRepository,
		userRepository,
		signOutUser,
		authenticateUser,
		validateEmail,
		resetPasswordService,
		signUpUser
	} = useMemo(() => {
		return {
			materialRepository: new MaterialRepository(httpClient as HttpClient<Material>),
			clientRepository: new ClientRepository(httpClient as HttpClient<Client>),
			estimateRepository: new EstimateRepository(httpClient as HttpClient<Estimate>),
			incomingRepository: new IncomingRepository(httpClient as HttpClient<Incoming>),
			outgoingRepository: new OutgoingRepository(httpClient as HttpClient<Outgoing>),
			supplierRepository: new SupplierRepository(httpClient as HttpClient<Supplier>),
			tripRepository: new TripRepository(httpClient as HttpClient<Trip>),
			quoteRepository: new QuoteRepository(httpClient as HttpClient<Quote>),
			employeeRepository: new EmployeeRepository(httpClient as HttpClient<Employee>),
			userRepository: new UserRepository(httpClient as HttpClient<User>),
			signOutUser: new SignOutUser(httpClient, () => setUser(null), navigate),
			authenticateUser: new AuthenticateUser(httpClient),
			validateEmail: new ValidateEmail(httpClient),
			resetPasswordService: new ResetPasswordService(httpClient),
			signUpUser: new SignUpUser(httpClient, navigate)
		}
	}, [user])

	useEffect(() => {
		const authHandler = new AuthHandler(signOutUser)
		setHandleUnauthorized(authHandler.handleUnauthorized)
	}, [signOutUser])

	const queryClient = useQueryClient()
	const invalidate = (queryKey: string | string[]) => {
		return queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] })
	}

	return (
		<AppContext.Provider
			value={{
				AuthenticateUser: authenticateUser,
				ValidateEmail: validateEmail,
				ResetPasswordService: resetPasswordService,
				SignUpUser: signUpUser,
				user,
				loadingUser,
				SignOutUser: signOutUser,
				materialRepository: materialRepository as MaterialRepository,
				clientRepository: clientRepository as ClientRepository,
				estimateRepository: estimateRepository as EstimateRepository,
				incomingRepository: incomingRepository as IncomingRepository,
				outgoingRepository: outgoingRepository as OutgoingRepository,
				supplierRepository: supplierRepository as SupplierRepository,
				tripRepository: tripRepository as TripRepository,
				quoteRepository: quoteRepository as QuoteRepository,
				employeeRepository: employeeRepository as EmployeeRepository,
				userRepository: userRepository as UserRepository,
				toastOpen,
				setToastOpen,
				toastMessage,
				toastType,
				showToast,
				hideToast,
				navigate,
				location,
				searchParams,
				refresh,
				useParams,
				setUser,
				invalidate
			}}
		>
			<Toast autoHideDuration={timeOut} />
			{children}
		</AppContext.Provider>
	)
}
