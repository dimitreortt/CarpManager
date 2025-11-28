import { Layout } from '../../components/Layout/Layout'
import { Link } from 'react-router'
import { useAppContext } from '../../../main/AppContextProvider'

export const Home = () => {
	const dashboardItems = [
		{
			title: 'Clientes',
			description: 'Gerencie seus clientes',
			icon: 'bi-people-fill',
			path: '/clients',
			color: 'primary'
		},
		{
			title: 'Materiais',
			description: 'Catálogo de materiais',
			icon: 'bi-box-seam-fill',
			path: '/materials',
			color: 'success'
		},
		{
			title: 'Financeiro',
			description: 'Controle financeiro',
			icon: 'bi-cash-stack',
			path: '/finance',
			color: 'info'
		},
		{
			title: 'Viagens',
			description: 'Gestão de viagens',
			icon: 'bi-geo-alt-fill',
			path: '/trips',
			color: 'secondary'
		},
		{
			title: 'Fornecedores',
			description: 'Gestão de fornecedores',
			icon: 'bi-truck',
			path: '/suppliers',
			color: 'dark'
		},
		{
			title: 'Cotações',
			description: 'Gestão de cotações',
			icon: 'bi-calculator-fill',
			path: '/quotes',
			color: 'info'
		},
		{
			title: 'Orçamentos',
			description: 'Crie e gerencie orçamentos',
			icon: 'bi-calculator-fill',
			path: '/estimates',
			color: 'warning'
		},
		{
			title: 'Pedidos',
			description: 'Gestão de pedidos',
			icon: 'bi-cart-fill',
			path: '/orders',
			color: 'danger'
		},
		{
			title: 'Funcionários',
			description: 'Gestão de funcionários',
			icon: 'bi-person-fill',
			path: '/employees',
			color: 'primary'
		}
	]

	const { user, clientRepository } = useAppContext()

	const handlePost = () => {
		clientRepository.createTrol({ name: 'Trolololo', email: 'trolololo@trolololo.com', phone: '1234567890' } as any)
	}

	const handlePut = () => {
		clientRepository.updateTrol({ id: '1', name: 'Trolololo', email: 'trolololo@trolololo.com', phone: '1234567890' } as any)
	}

	const handleDelete = () => {
		clientRepository.deleteTrol({ id: '1' } as any)
	}

	return (
		<Layout>
			<div className="container-fluid py-4">
				<div className="row">
					<div className="col-12">
						<h1 className="heading-3 text-neutral-900 mb-4">Dashboard</h1>

						{user?.isDevUser && <h2 className="heading-3 text-primary mb-4">Conta do Desenvolvedor</h2>}

						<div className="row g-3 g-md-4">
							{dashboardItems.map(item => (
								<div key={item.path} className="col-6 col-md-6 col-lg-4">
									<Link to={item.path} className="text-decoration-none">
										<div className="card h-100 border-0 shadow-sm hover-shadow">
											<div className="card-body text-center p-3 p-md-4">
												<div
													className={`bg-${item.color} bg-gradient rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3`}
													style={{ width: '50px', height: '50px' }}
												>
													<i className={`bi ${item.icon} text-white`} style={{ fontSize: '1.2rem' }}></i>
												</div>
												<h5 className="heading-5 text-neutral-900 mb-2">{item.title}</h5>
												<p className="body-medium text-neutral-600 mb-0 small">{item.description}</p>
											</div>
										</div>
									</Link>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
