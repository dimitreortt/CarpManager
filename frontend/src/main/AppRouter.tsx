import { Routes, Route, Navigate } from 'react-router'
import { Home } from '../presentation/pages/Home/Home'
import { Clients } from '../presentation/pages/Clients/Clients'
import { Materials } from '../presentation/pages/Materials/Materials'
import { MaterialForm } from '../presentation/pages/Materials/MaterialForm'
import { MaterialView } from '../presentation/pages/Materials/MaterialView'
import { Estimates } from '../presentation/pages/Estimates/Estimates'
import { Trips } from '../presentation/pages/Trips/Trips'
import { Suppliers } from '../presentation/pages/Suppliers/Suppliers'
import { ClientForm } from '../presentation/pages/Clients/ClientForm'
import { ClientView } from '../presentation/pages/Clients/ClientView'
import { EstimatesForm } from '../presentation/pages/Estimates/EstimatesForm'
import { EstimatesView } from '../presentation/pages/Estimates/EstimatesView'
import { IncomingForm } from '../presentation/pages/Finance/Incoming/IncomingForm'
import { IncomingView } from '../presentation/pages/Finance/Incoming/IncomingView'
import { OutgoingForm } from '../presentation/pages/Finance/Outgoing/OutgoingForm'
import { SupplierForm } from '../presentation/pages/Suppliers/SupplierForm'
import { TripForm } from '../presentation/pages/Trips/TripForm'
import { TripView } from '../presentation/pages/Trips/TripView'
import { SupplierView } from '../presentation/pages/Suppliers/SupplierView'
import { OutgoingView } from '../presentation/pages/Finance/Outgoing/OutgoingView'
import { Quotes } from '../presentation/pages/Quotes/Quotes'
import { QuotesForm } from '../presentation/pages/Quotes/QuotesForm'
import { QuotesView } from '../presentation/pages/Quotes/QuotesView'
import { ClientTransactionsList } from '../presentation/pages/Clients/ClientTransactionsList'
import { Incoming } from '../presentation/pages/Finance/Incoming/Incoming'
import { Outgoing } from '../presentation/pages/Finance/Outgoing/Outgoing'
import { Orders } from '../presentation/pages/Orders/Orders'
import { Employees } from '../presentation/pages/Employees/Employees'
import { EmployeeForm } from '../presentation/pages/Employees/EmployeeForm'
import { EmployeeView } from '../presentation/pages/Employees/EmployeeView'
import { CreateOrder } from '../presentation/pages/Estimates/CreateOrder'
import { ClientEstimatesList } from '../presentation/pages/Clients/ClientEstimatesList'

export const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/home" element={<Home />} />
			<Route path="/clients" element={<Clients />} />
			<Route path="/clients/form" element={<ClientForm />} />
			<Route path="/clients/view" element={<ClientView />} />
			<Route path="/clients/transactions" element={<ClientTransactionsList />} />
			<Route path="/clients/estimates" element={<ClientEstimatesList />} />
			<Route path="/materials" element={<Materials />} />
			<Route path="/materials/form" element={<MaterialForm />} />
			<Route path="/materials/view" element={<MaterialView />} />
			<Route path="/estimates" element={<Estimates />} />
			<Route path="/estimates/form" element={<EstimatesForm />} />
			<Route path="/estimates/view" element={<EstimatesView />} />
			<Route path="/estimates/create-order/:estimateId" element={<CreateOrder />} />
			<Route path="/finance/incoming" element={<Incoming />} />
			<Route path="/finance/outgoing" element={<Outgoing />} />
			<Route path="/finance" element={<Incoming />} />
			<Route path="/finance/incoming/form" element={<IncomingForm />} />
			<Route path="/finance/incoming/view" element={<IncomingView />} />
			<Route path="/finance/outgoing/form" element={<OutgoingForm />} />
			<Route path="/finance/outgoing/view" element={<OutgoingView />} />
			<Route path="/trips" element={<Trips />} />
			<Route path="/trips/form" element={<TripForm />} />
			<Route path="/trips/view" element={<TripView />} />
			<Route path="/suppliers" element={<Suppliers />} />
			<Route path="/suppliers/form" element={<SupplierForm />} />
			<Route path="/suppliers/view" element={<SupplierView />} />
			<Route path="/quotes" element={<Quotes />} />
			<Route path="/quotes/form" element={<QuotesForm />} />
			<Route path="/quotes/view" element={<QuotesView />} />
			<Route path="/orders" element={<Orders />} />
			<Route path="/employees" element={<Employees />} />
			<Route path="/employees/form" element={<EmployeeForm />} />
			<Route path="/employees/view" element={<EmployeeView />} />
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	)
}
