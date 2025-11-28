import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { Provider as JotaiProvider } from 'jotai'
import { store } from '../infra/store/store'
import { AppContextProvider } from './AppContextProvider'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '../styles/main.scss'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={new QueryClient()}>
			<JotaiProvider store={store}>
				<BrowserRouter>
					<AppContextProvider>
						<App />
					</AppContextProvider>
				</BrowserRouter>
			</JotaiProvider>
		</QueryClientProvider>
	</StrictMode>
)
