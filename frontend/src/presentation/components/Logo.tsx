import React from 'react'

interface LogoProps {
	width?: number
	height?: number
	className?: string
	color?: string
	fillColor?: string
}

const Logo: React.FC<LogoProps> = ({ width = 32, height = 32, className = '', color = '#f17a1a', fillColor = '#fef7ed' }) => {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
			<path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={fillColor} />
			<path d="M2 17L12 22L22 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={fillColor} />
			<path d="M2 12L12 17L22 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={fillColor} />
		</svg>
	)
}

export default Logo
