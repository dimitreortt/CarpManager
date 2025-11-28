import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { Sidebar } from '../Sidebar/Sidebar'
import { HamburgerIcon } from '../Icons/HamburgerIcon'
import { useAppContext } from '../../../main/AppContextProvider'

interface LayoutProps {
	children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
	const { user, SignOutUser, navigate } = useAppContext()
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 992) {
				setSidebarOpen(false)
				setIsMobile(false)
			} else {
				setIsMobile(true)
			}
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen)
	}

	return (
		<div className="d-flex min-vh-100 bg-neutral-50">
			<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
			<div className="flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
				<nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top-nav">
					<div className="container-fluid">
						<button
							className="btn btn-link d-lg-none p-0 me-3 text-neutral-600"
							onClick={toggleSidebar}
							style={{ width: '40px', height: '40px' }}
						>
							<HamburgerIcon width={24} height={24} color="#6c757d" />
						</button>

						<div className="flex-grow-1"></div>
						<div className="d-flex align-items-center">
							<span className="body-medium text-neutral-700 me-3">{user?.name}</span>
							<button
								onClick={async () => {
									await SignOutUser.execute()
									navigate('/login')
								}}
								className="btn btn-outline-danger btn-sm py-1"
							>
								<i className="bi bi-box-arrow-right me-1"></i>
								<span>Sair</span>
							</button>
						</div>
					</div>
				</nav>
				<main className="flex-grow-1 main-content">{children}</main>
				<footer className="bg-white border-top py-3 mt-auto d-flex">
					{!isMobile && <div style={{ width: '220px', minWidth: '220px' }}></div>}
					<div className="container-fluid">
						<div className="row align-items-center">
							<div className="col-md-8 text">
								<small className="text-muted">© 2025 CarpManager - Sistema de Gestão para Marcenaria</small>
							</div>
							<div className="col-md-4 text-md-end">
								<small className="text-muted">
									<a href="/about.html" className="text-decoration-none me-3">
										Sobre
									</a>
									<a href="/privacy-policy.html" className="text-decoration-none me-3">
										Privacidade
									</a>
									<a href="/terms-of-service.html" className="text-decoration-none">
										Termos
									</a>
								</small>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</div>
	)
}
