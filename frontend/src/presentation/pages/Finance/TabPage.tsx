import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Layout } from '../../components/Layout/Layout'

type Tab = {
	label: string
	icon: string
	code: string
}

export const TabPage = ({
	tabs = [],
	tabContent,
	defaultTab = '',
	filters,
	title,
	subtitle,
	backButton
}: {
	tabs: Tab[]
	tabContent: React.ReactNode[]
	defaultTab?: string
	filters?: React.ReactNode
	title?: string
	subtitle?: string
	backButton?: React.ReactNode
}) => {
	const [activeTab, setActiveTab] = useState<string>(defaultTab)

	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		const params = new URLSearchParams(location.search)
		const tabParam = params.get('tab')
		if (tabParam && tabs.some(tab => tab.code === tabParam)) {
			setActiveTab(tabParam)
		}
	}, [location.search])

	const handleSwitchTab = (tab: string) => {
		setActiveTab(tab)
		const params = new URLSearchParams(location.search)
		params.set('tab', tab)
		navigate({ pathname: location.pathname, search: params.toString() }, { replace: false })
	}

	return (
		<Layout>
			<div className="container-fluid py-4">
				<div className="row">
					<div className="col-12">
						<div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
							<div>
								<div className="d-flex align-items-center gap-2">
									<div>
										<h2 className="mb-0">{title}</h2>
										{subtitle && <p className="text-muted mb-0">{subtitle}</p>}
									</div>
									{/* <h1 className="heading-3 text-neutral-900 mb-0 d-inline">{title}</h1> */}
									{backButton}
								</div>
							</div>
							{filters}
						</div>

						{/* Tabs */}
						<ul className="nav nav-tabs mb-4" id="accountabilityTabs" role="tablist">
							{tabs.map(tab => (
								<li key={tab.code} className="nav-item" role="presentation">
									<button
										className={`nav-link ${activeTab === tab.code ? 'active' : ''}`}
										id={`${tab.code}-tab`}
										data-bs-toggle="tab"
										data-bs-target={`#${tab.code}`}
										type="button"
										role="tab"
										aria-controls={tab.code}
										aria-selected={activeTab === tab.code}
										onClick={() => handleSwitchTab(tab.code)}
									>
										<i className={`bi ${tab.icon} me-2`}></i>
										{tab.label}
									</button>
								</li>
							))}
						</ul>

						{/* Tab Content */}
						<div className="tab-content" id="accountabilityTabContent">
							{tabContent
								.map((content, index) => (
									<div
										className={`tab-pane fade ${activeTab === tabs[index].code ? 'show active' : ''}`}
										id={tabs[index].code}
										key={tabs[index].code}
										role="tabpanel"
										aria-labelledby={`${tabs[index].code}-tab`}
									>
										{content}
									</div>
								))
								.filter((_, index) => tabs[index].code === activeTab)}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
