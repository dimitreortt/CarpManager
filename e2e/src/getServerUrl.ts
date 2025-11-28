export const getServerUrl = () => {
	if (import.meta.env.DEV) {
		return "http://localhost:3000/api"
	}
	return "/api"
}
