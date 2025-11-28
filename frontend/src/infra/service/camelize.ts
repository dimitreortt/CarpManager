export const camelize = (str: string): string => {
	return str.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^(.)/, c => c.toLowerCase())
}
