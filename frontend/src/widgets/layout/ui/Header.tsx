'use client'

import { useState } from 'react'
import { AppLogo } from './AppLogo'
import { AppNav } from './AppNav'
import styles from './Header.module.css'

const generalNavItems = [
	{
		text: 'Вернуться на сайт',
		href: 'https://slavalarionov.com/',
		type: 'anchor' as const
	}
]

const otherNavItems = [
	{
		text: 'О нас',
		href: '/',
		type: 'link' as const
	},
	{
		text: 'FAQ',
		href: '/',
		type: 'link' as const
	},
	{
		text: 'Контакты',
		href: '/',
		type: 'link' as const
	}
]

export const Header = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen)
	}

	const closeMobileMenu = () => {
		setMobileMenuOpen(false)
	}

	return (
		<header className={styles.header}>
			<div className={`container ${styles.headerContainer}`}>
				<AppLogo className={styles.headerLogo} />
				{/* Desktop Navigation */}
				<div className={styles.headerNavInner}>
					<AppNav
						className={styles.headerNav}
						navItems={[...generalNavItems, ...otherNavItems]}
					/>
				</div>
				{/* Mobile Menu Button */}
				<button
					className={styles.mobileMenuButton}
					onClick={toggleMobileMenu}
					aria-label="Toggle menu"
				>
					<span className={styles.hamburger}>
						<span className={mobileMenuOpen ? styles.hamburgerLineActive : styles.hamburgerLine}></span>
						<span className={mobileMenuOpen ? styles.hamburgerLineActive : styles.hamburgerLine}></span>
						<span className={mobileMenuOpen ? styles.hamburgerLineActive : styles.hamburgerLine}></span>
					</span>
				</button>
			</div>
			{/* Mobile Menu */}
			<div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
				<AppNav
					className={styles.mobileNav}
					navItems={[...generalNavItems, ...otherNavItems]}
					onItemClick={closeMobileMenu}
				/>
			</div>
		</header>
	)
}



