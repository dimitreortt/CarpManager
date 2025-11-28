import { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../../../../main/AppContextProvider'
import type { Incoming } from '../../../../infra/repository/IncomingRepository'
import type { Outgoing } from '../../../../infra/repository/OutgoingRepository'
import { isSameOrEarlier, isSameOrLater } from '../../../components/Form/MonthPicker/utils'

interface ReportsProps {
	periodFilter: string
}

export const Reports = ({ periodFilter }: ReportsProps) => {
	const { incomingRepository, outgoingRepository, showToast } = useAppContext()
	const [incomings, setIncomings] = useState<Incoming[]>([])
	const [outgoings, setOutgoings] = useState<Outgoing[]>([])
	const [filteredIncomings, setFilteredIncomings] = useState<Incoming[]>([])
	const [filteredOutgoings, setFilteredOutgoings] = useState<Outgoing[]>([])
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		let isMounted = true
		const load = async () => {
			try {
				setLoading(true)
				const [allIncomings, allOutgoings] = await Promise.all([incomingRepository.getAll(), outgoingRepository.getAll()])
				if (!isMounted) return
				setIncomings(allIncomings)
				setOutgoings(allOutgoings)
			} catch (e) {
				showToast('Erro ao carregar dados para relatórios', 'error')
			} finally {
				if (isMounted) setLoading(false)
			}
		}
		load()
		return () => {
			isMounted = false
		}
	}, [incomingRepository, outgoingRepository, periodFilter, showToast])

	useEffect(() => {
		if (!periodFilter) {
			setFilteredIncomings(incomings)
			setFilteredOutgoings(outgoings)
			return
		}
		const isPeriod = periodFilter.includes('::')

		if (isPeriod) {
			const [from, to] = periodFilter.split('::')
			const incomingsList = incomings.filter(
				incoming => isSameOrLater(incoming.date.substring(0, 7), from) && isSameOrEarlier(incoming.date.substring(0, 7), to)
			)
			setFilteredIncomings(incomingsList || [])
			const outgoingsList = outgoings.filter(
				outgoing => isSameOrLater(outgoing.date.substring(0, 7), from) && isSameOrEarlier(outgoing.date.substring(0, 7), to)
			)
			setFilteredOutgoings(outgoingsList || [])
		} else {
			const incomingsList = incomings.filter(incoming => incoming.date.startsWith(periodFilter))
			const outgoingsList = outgoings.filter(outgoing => outgoing.date.startsWith(periodFilter))
			setFilteredIncomings(incomingsList || [])
			setFilteredOutgoings(outgoingsList || [])
		}
	}, [periodFilter, incomings, outgoings])

	const { totalIncoming, totalOutgoing, net, outgoingByCategory, incomingByStatus } = useMemo(() => {
		const totalIncoming = filteredIncomings.reduce((sum, i) => sum + (i.amount || 0), 0)
		const totalOutgoing = filteredOutgoings.reduce((sum, o) => sum + (o.amount || 0), 0)
		const net = totalIncoming - totalOutgoing

		const outgoingByCategory = filteredOutgoings.reduce<Record<string, number>>((acc, o) => {
			const key = o.category || 'outros'
			acc[key] = (acc[key] || 0) + (o.amount || 0)
			return acc
		}, {})

		const incomingByStatus = filteredIncomings.reduce<Record<string, number>>((acc, i) => {
			const key = i.status || 'pendente'
			acc[key] = (acc[key] || 0) + (i.amount || 0)
			return acc
		}, {})

		return { totalIncoming, totalOutgoing, net, outgoingByCategory, incomingByStatus }
	}, [filteredIncomings, filteredOutgoings])

	const maxBar = Math.max(totalIncoming, totalOutgoing, 1)
	const incomingHeight = Math.round((totalIncoming / maxBar) * 160)
	const outgoingHeight = Math.round((totalOutgoing / maxBar) * 160)

	const categoryLabels: Record<string, string> = {
		light: 'Luz',
		fixed: 'Fixo',
		other: 'Outro',
		outros: 'Outros'
	}
	const statusLabels: Record<string, string> = {
		pending: 'Pendente',
		received: 'Recebido',
		cancelled: 'Cancelado',
		pendente: 'Pendente'
	}

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Carregando...</span>
				</div>
			</div>
		)
	}

	return (
		<div className="container-fluid">
			<div className="row g-3 mb-4">
				<div className="col-12 col-md-4">
					<div className="card shadow-sm h-100">
						<div className="card-body">
							<h6 className="text-muted">Entradas</h6>
							<h3 className="mb-0">R$ {totalIncoming.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
						</div>
					</div>
				</div>
				<div className="col-12 col-md-4">
					<div className="card shadow-sm h-100">
						<div className="card-body">
							<h6 className="text-muted">Saídas</h6>
							<h3 className="mb-0">R$ {totalOutgoing.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
						</div>
					</div>
				</div>
				<div className="col-12 col-md-4">
					<div className="card shadow-sm h-100">
						<div className="card-body">
							<h6 className="text-muted">Saldo</h6>
							<h3 className={`mb-0 ${net >= 0 ? 'text-success' : 'text-danger'}`}>
								R$ {net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
							</h3>
						</div>
					</div>
				</div>
			</div>

			<div className="card shadow-sm mb-4">
				<div className="card-body">
					<h5 className="card-title mb-3">Desempenho do Período</h5>
					<div className="d-flex align-items-end justify-content-center" style={{ height: 180 }}>
						<div className="d-flex flex-column align-items-center mx-4">
							<div className="bg-success rounded-top" style={{ width: 60, height: incomingHeight }} />
							<small className="mt-2">Entradas</small>
							<small className="text-muted">R$ {totalIncoming.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</small>
						</div>
						<div className="d-flex flex-column align-items-center mx-4">
							<div className="bg-danger rounded-top" style={{ width: 60, height: outgoingHeight }} />
							<small className="mt-2">Saídas</small>
							<small className="text-muted">R$ {totalOutgoing.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</small>
						</div>
					</div>
				</div>
			</div>

			<div className="row g-3">
				<div className="col-12 col-lg-6">
					<div className="card shadow-sm h-100">
						<div className="card-body">
							<h6 className="card-title">Saídas por Categoria</h6>
							{Object.keys(outgoingByCategory).length === 0 ? (
								<p className="text-muted mb-0">Sem dados.</p>
							) : (
								<ul className="list-group list-group-flush">
									{Object.entries(outgoingByCategory).map(([cat, value]) => (
										<li className="list-group-item d-flex justify-content-between" key={cat}>
											<span className="text-capitalize">{categoryLabels[cat] || cat}</span>
											<span>R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
				<div className="col-12 col-lg-6">
					<div className="card shadow-sm h-100">
						<div className="card-body">
							<h6 className="card-title">Entradas por Status</h6>
							{Object.keys(incomingByStatus).length === 0 ? (
								<p className="text-muted mb-0">Sem dados.</p>
							) : (
								<ul className="list-group list-group-flush">
									{Object.entries(incomingByStatus).map(([st, value]) => (
										<li className="list-group-item d-flex justify-content-between" key={st}>
											<span className="text-capitalize">{statusLabels[st] || st}</span>
											<span>R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
