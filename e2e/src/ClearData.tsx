import axios from "axios"
import { getServerUrl } from "./getServerUrl"
import { useState } from "react"

export const ClearData = () => {
	const [response, setResponse] = useState<object | null>(null)
	const handleClearData = () => {
		axios
			.get(`${getServerUrl()}/cypress/clear-data`)
			.then((res) => {
				console.log(res.data)
				setResponse(res.data)
			})
			.catch((err) => {
				console.log(err)
				setResponse(err.response.data)
			})
	}

	return (
		<div>
			<button
				id="clear-data-button"
				onClick={() => {
					handleClearData()
				}}
			>
				Clear Data
			</button>
			{response && <div>{JSON.stringify(response)}</div>}
		</div>
	)
}
