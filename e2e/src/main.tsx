import { createRoot } from "react-dom/client"
import { Home } from "./Home"
import { Route, BrowserRouter, Routes } from "react-router"
import { ClearData } from "./ClearData"

const Main = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />}></Route>
				<Route path="/clear-data" element={<ClearData />}></Route>
			</Routes>
		</BrowserRouter>
	)
}

createRoot(document.getElementById("root")!).render(<Main />)
