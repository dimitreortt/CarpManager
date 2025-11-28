import { months } from './months'

export const isLater = (ym1: string, ym2: string) => {
	const [y1, m1] = ym1.split('-')
	const [y2, m2] = ym2.split('-')

	if (parseInt(y1) > parseInt(y2)) return true
	if (parseInt(y1) < parseInt(y2)) return false

	return parseInt(m1) > parseInt(m2)
}

export const isSame = (ym1: string, ym2: string) => {
	const [y1, m1] = ym1.split('-')
	const [y2, m2] = ym2.split('-')

	return y1 === y2 && m1 === m2
}

export const isEarlier = (ym1: string, ym2: string) => {
	return !isLater(ym1, ym2)
}

export const isSameOrLater = (ym1: string, ym2: string) => {
	if (isSame(ym1, ym2)) return true
	return isLater(ym1, ym2)
}

export const isSameOrEarlier = (ym1: string, ym2: string) => {
	if (isSame(ym1, ym2)) return true
	return isEarlier(ym1, ym2)
}

export const formatYm = (ym: string) => {
	const [y, m] = ym.split('-')
	return `${months[parseInt(m) - 1]?.label.slice(0, 3)}. ${y.slice(2)}`
}
