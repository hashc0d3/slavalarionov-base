'use client'

interface TelegramIconProps {
	color?: string
	className?: string
}

export const TelegramIcon = ({ color = '#424242', className }: TelegramIconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			width="30px"
			height="30px"
			viewBox="0 0 2500 2500"
			xmlSpace="preserve"
			className={className}
		>
			<path
				d="M1250,2500c690.4,0,1250-559.6,1250-1250S1940.4,0,1250,0S0,559.6,0,1250S559.6,2500,1250,2500z"
				fill={color}
			/>
			<path
				d="M520.2,1239.2c0,0,625-256.5,841.8-346.8c83.1-36.1,364.9-151.7,364.9-151.7s130.1-50.6,119.2,72.3 c-3.6,50.6-32.5,227.6-61.4,419.1c-43.4,271-90.3,567.2-90.3,567.2s-7.2,83.1-68.6,97.5s-162.6-50.6-180.6-65 c-14.5-10.8-271-173.4-364.9-252.9c-25.3-21.7-54.2-65,3.6-115.6c130.1-119.2,285.4-267.3,379.3-361.3 c43.4-43.4,86.7-144.5-93.9-21.7c-256.5,177-509.4,343.2-509.4,343.2s-57.8,36.1-166.2,3.6c-108.4-32.5-234.8-75.9-234.8-75.9 S372.1,1297,520.2,1239.2L520.2,1239.2z"
				fill="#ffffff"
			/>
		</svg>
	)
}



