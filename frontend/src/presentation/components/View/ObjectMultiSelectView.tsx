import { useState, useEffect } from 'react'
import { ViewEditButtons } from './ViewEditButtons'

interface ObjectMultiSelectViewProps<T> {
	ids: string[]
	repository: {
		getAll: () => Promise<T[]>
	}
	itemName: string
	viewPath: string
	editPath: string
	className?: string
	extraDisplayFields?: { key: string; render: (value: string) => string }[]
	labelFeminine?: boolean
}

export const ObjectMultiSelectView = <T extends { id: string; name: string }>({
	ids,
	repository,
	itemName,
	viewPath,
	editPath,
	className = '',
	extraDisplayFields = [],
	labelFeminine = false
}: ObjectMultiSelectViewProps<T>) => {
	const [items, setItems] = useState<T[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const loadItems = async () => {
		if (!ids || ids.length === 0) {
			setItems([])
			setLoading(false)
			return
		}

		try {
			setLoading(true)
			setError(null)
			const allItems = await repository.getAll()

			const filteredItems = allItems.filter(item => ids.includes(item.id))
			setItems(filteredItems)
		} catch (err) {
			console.error(`Error loading ${itemName}:`, err)
			setError(`Erro ao carregar ${itemName}`)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadItems()
	}, [ids, repository, itemName])

	const handleView = (item: T) => {
		window.open(`${viewPath}?id=${item.id}`, '_blank')
	}

	const handleEdit = (item: T) => {
		window.open(`${editPath}?id=${item.id}`, '_blank')
	}

	if (loading) {
		return (
			<div className={`d-flex justify-content-center align-items-center p-3 ${className}`}>
				<div className="spinner-border spinner-border-sm text-primary" role="status">
					<span className="visually-hidden">Carregando...</span>
				</div>
			</div>
		)
	}

	if (error) {
		return <div className={`text-danger small ${className}`}>{error}</div>
	}

	if (!items || items.length === 0) {
		return (
			<div className={`text-muted ${className}`}>
				{labelFeminine ? 'Nenhuma' : 'Nenhum'} {itemName.toLowerCase()} {labelFeminine ? 'selecionada' : 'selecionado'}
			</div>
		)
	}

	return (
		<div className={`d-flex flex-column gap-2 ${className}`}>
			{items.map(item => (
				<div key={item.id} className="d-flex align-items-center justify-content-between rounded bg-light">
					<span className="">
						{item.name}
						{extraDisplayFields.map(field => (
							<span key={field.key}>
								{' '}
								- {field.render ? field.render(item[field.key as keyof T] as string) : (item[field.key as keyof T] as string)}
							</span>
						))}
					</span>
					<ViewEditButtons item={item} itemName={itemName} handleView={handleView} handleEdit={handleEdit} />
				</div>
			))}
		</div>
	)
}
