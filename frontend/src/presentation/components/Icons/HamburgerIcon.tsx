interface HamburgerIconProps {
	width?: number
	height?: number
	color?: string
}

export const HamburgerIcon = ({ width = 24, height = 24, color = 'currentColor' }: HamburgerIconProps) => {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M3 6H21M3 12H21M3 18H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}
