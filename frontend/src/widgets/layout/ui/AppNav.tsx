'use client'

import Link from 'next/link'
import styles from './AppNav.module.css'

interface NavItem {
	text: string
	href: string
	type: 'link' | 'anchor'
}

interface AppNavProps {
	navItems: NavItem[]
	className?: string
}

export const AppNav = ({ navItems, className }: AppNavProps) => {
	return (
		<nav className={`${styles.nav} ${className || ''}`}>
			<ul className={styles.navList}>
				{navItems.map((item, idx) => (
					<li key={idx} className={styles.navListItem}>
						{item.type === 'anchor' ? (
							<a href={item.href}>{item.text}</a>
						) : (
							<Link href={item.href}>{item.text}</Link>
						)}
					</li>
				))}
			</ul>
		</nav>
	)
}

