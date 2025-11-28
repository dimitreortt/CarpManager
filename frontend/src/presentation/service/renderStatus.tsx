export const renderStatus = (value: string | number | undefined) => {
	if (typeof value === 'string') {
		const statusConfig = {
			pending: { label: 'Pendente', class: 'bg-warning' },
			received: { label: 'Recebido', class: 'bg-success' },
			cancelled: { label: 'Cancelado', class: 'bg-danger' }
		}
		const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.pending
		return <span className={`badge ${config.class}`}>{config.label}</span>
	}
	return '-'
}
