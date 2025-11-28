import { Link, useLocation } from 'react-router'
import { useState, useEffect } from 'react'
import Logo from '../Logo'
import { SidebarHeader } from './SidebarHeader'
import { FabicSidebarHeader } from './FabicSidebarHeader'

interface MenuItem {
	path: string
	label: string
	icon: string
	subItems?: { path: string; label: string; icon: string }[]
}

interface SidebarProps {
	isOpen: boolean
	onToggle: () => void
}

const menuItems: MenuItem[] = [
	{ path: '/', label: 'Home', icon: 'bi-house-fill' },
	{ path: '/clients', label: 'Clientes', icon: 'bi-people-fill' },
	{ path: '/materials', label: 'Materiais', icon: 'bi-box-seam-fill' },
	{
		path: '/finance',
		label: 'Financeiro',
		icon: 'bi-cash-stack',
		subItems: [
			{ path: '/finance/incoming?tab=pending', label: 'Entradas', icon: 'bi-arrow-down-circle' },
			{ path: '/finance/outgoing?tab=pending', label: 'Saídas', icon: 'bi-arrow-up-circle' }
		]
	},
	{ path: '/trips', label: 'Viagens', icon: 'bi-geo-alt-fill' },
	{ path: '/suppliers', label: 'Fornecedores', icon: 'bi-truck' },
	{ path: '/quotes', label: 'Cotações', icon: 'bi-file-earmark-text' },
	{ path: '/estimates', label: 'Orçamentos', icon: 'bi-calculator-fill' },
	{ path: '/orders', label: 'Pedidos', icon: 'bi-cart-fill' },
	{ path: '/employees', label: 'Funcionários', icon: 'bi-people-fill' }
]

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
	const location = useLocation()
	const [expandedItems, setExpandedItems] = useState<string[]>([])

	useEffect(() => {
		const currentPath = location.pathname
		menuItems.forEach(item => {
			if (item.subItems && item.subItems.some(subItem => subItem.path === currentPath)) {
				if (!expandedItems.includes(item.path)) {
					setExpandedItems(prev => [...prev, item.path])
				}
			}
		})
	}, [location.pathname])

	const toggleExpanded = (path: string) => {
		setExpandedItems(prev => (prev.includes(path) ? prev.filter(item => item !== path) : [...prev, path]))
	}

	const isItemActive = (item: MenuItem) => {
		const fullPath = location.pathname + location.search
		if (item.path === '/orders') {
			return fullPath.includes(item.path) || (fullPath.includes('/estimates/') && fullPath.includes('status=accepted'))
		}
		if (item.path === '/estimates') {
			return fullPath.includes(item.path) && !fullPath.includes('status=accepted')
		}
		if (item.path === location.pathname) return true
		if (item.path !== '/' && fullPath.includes(item.path)) return true
		return false
	}

	const isSubItemActive = (subItem: MenuItem) => {
		const fullPath = location.pathname + location.search
		if (subItem.path !== '/' && fullPath.includes(subItem.path)) {
			return true
		}
	}

	return (
		<>
			{isOpen && (
				<div
					className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
					style={{ zIndex: 1040 }}
					onClick={onToggle}
				></div>
			)}

			<div
				className={`sidebar bg-white shadow-sm d-flex flex-column d-lg-block`}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					height: '100vh',
					zIndex: 1050,
					transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
					transition: 'transform 0.3s ease-in-out',
					overflowY: 'auto',
					overflowX: 'hidden'
				}}
			>
				<div className="p-3 py-2 border-bottom d-flex justify-content-center align-items-center" style={{ height: '61px' }}>
					<FabicSidebarHeader />
				</div>

				<nav className="p-3 flex-grow-1">
					<ul className="nav flex-column">
						{menuItems.map(item => (
							<li key={item.path} className="nav-item mb-2">
								<Link
									to={item.path}
									className={`nav-link d-flex align-items-center py-1 px-3 rounded-3 text-decoration-none ${
										isItemActive(item) ? 'bg-primary text-white' : 'text-neutral-700 hover-bg-neutral-100'
									}`}
									onClick={() => {
										if (window.innerWidth < 992) {
											onToggle()
										}
									}}
								>
									<i className={`bi ${item.icon} me-3`} style={{ fontSize: '1.1rem' }}></i>
									<span className={`body-medium ${isItemActive(item) ? 'text-light' : ''}`}>{item.label}</span>
								</Link>
								{item.subItems && (
									<ul className="nav flex-column mt-1 ms-3">
										{item.subItems.map(subItem => (
											<li key={subItem.path} className="nav-item mb-1">
												<Link
													to={subItem.path}
													className={`nav-link d-flex align-items-center py-1 px-3 rounded-3 text-decoration-none ${
														isSubItemActive(subItem) ? 'bg-primary text-white' : 'text-neutral-700 hover-bg-neutral-100'
													}`}
												>
													<i className={`bi ${subItem.icon} me-3`} style={{ fontSize: '1.1rem' }}></i>
													<span className={`body-medium ${isSubItemActive(subItem) ? 'text-light' : ''}`}>
														{subItem.label}
													</span>
												</Link>
											</li>
										))}
									</ul>
								)}
							</li>
						))}
					</ul>
				</nav>
			</div>
		</>
	)
}
