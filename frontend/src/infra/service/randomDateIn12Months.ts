export const randomDateIn12Months = () => {
	const now = new Date()
	const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate())
	const randomTime = twelveMonthsAgo.getTime() + Math.random() * (now.getTime() - twelveMonthsAgo.getTime())
	const randomDate = new Date(randomTime)
	return randomDate.toISOString().split('T')[0]
}