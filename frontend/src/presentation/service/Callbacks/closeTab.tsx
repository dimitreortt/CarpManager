export const closeTab = (timeoutMs = 0) => {
	setTimeout(() => {
		window.close()
	}, timeoutMs)
}
