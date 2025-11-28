export const BaseViewTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => {
	return (
		<div>
			<h4 className="mb-0">{title}</h4>
			{subtitle && <p className="text-muted mb-0">{subtitle}</p>}
		</div>
	)
}
