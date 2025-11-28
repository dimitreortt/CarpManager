import axios from "axios"
import { useState } from "react"
import { getServerUrl } from "./getServerUrl"

export const Home = () => {
	const [response, setResponse] = useState<object | null>(null)

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.target as HTMLFormElement)
		const email = formData.get("email") as string
		const password = formData.get("password") as string
		const userEmail = formData.get("userEmail") as string
		const userPassword = formData.get("userPassword") as string

		axios
			.post(`${getServerUrl()}/cypress/setup-auth-integration-test`, { email, password, userEmail, userPassword })
			.then((res) => {
				setResponse(res.data)
			})
			.catch((err) => {
				console.log(err)
			})
	}
	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input type="text" id="email" name="email" />
				<input type="text" id="password" name="password" />
				<input type="text" id="userEmail" name="userEmail" />
				<input type="text" id="userPassword" name="userPassword" />
				<button type="submit">Submit</button>
			</form>
			{response && <div>{JSON.stringify(response)}</div>}
		</div>
	)
}
