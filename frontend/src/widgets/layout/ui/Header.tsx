'use client'

import { AppLogo } from './AppLogo'
import { AppNav } from './AppNav'
import styles from './Header.module.css'

const generalNavItems = [
	{
		text: 'Вернуться на сайт',
		href: 'https://slavalarionov.com/',
		type: 'link' as const
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
	return (
		<header className={styles.header}>
			<div className={`container ${styles.headerContainer}`}>
				<AppLogo className={styles.headerLogo} />
				<div className={styles.headerNavInner}>
					<AppNav
						className={`${styles.headerNav} ${styles.headerNavGeneral}`}
						navItems={generalNavItems}
					/>
					<AppNav
						className={`${styles.headerNav} ${styles.headerNavOther}`}
						navItems={otherNavItems}
					/>
				</div>
			</div>
		</header>
	)
}

