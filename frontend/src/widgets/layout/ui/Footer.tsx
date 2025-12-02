'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { VkIcon } from './icons/VkIcon'
import { TelegramIcon } from './icons/TelegramIcon'
import { WhatsappIcon } from './icons/WhatsappIcon'
import { YandexDzenIcon } from './icons/YandexDzenIcon'
import { PinterestIcon } from './icons/PinterestIcon'
import styles from './Footer.module.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Регистрируем плагин ScrollTrigger
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger)
}

export const Footer = () => {
	const footerRef = useRef<HTMLElement>(null)
	const columnsRef = useRef<(HTMLDivElement | null)[]>([])
	const bottomRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!footerRef.current) return

		// Анимация для footer при скролле
		gsap.fromTo(
			footerRef.current,
			{
				opacity: 0,
				y: 50
			},
			{
				opacity: 1,
				y: 0,
				duration: 0.8,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: footerRef.current,
					start: 'top bottom-=100',
					toggleActions: 'play none none reverse'
				}
			}
		)

		// Анимация для колонок
		const columns = columnsRef.current.filter(Boolean)
		gsap.fromTo(
			columns,
			{
				opacity: 0,
				y: 30
			},
			{
				opacity: 1,
				y: 0,
				duration: 0.6,
				stagger: 0.15,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: footerRef.current,
					start: 'top bottom-=50',
					toggleActions: 'play none none reverse'
				}
			}
		)

		// Анимация для нижней части
		if (bottomRef.current) {
			gsap.fromTo(
				bottomRef.current,
				{
					opacity: 0,
					y: 20
				},
				{
					opacity: 1,
					y: 0,
					duration: 0.6,
					delay: 0.4,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: bottomRef.current,
						start: 'top bottom',
						toggleActions: 'play none none reverse'
					}
				}
			)
		}

		// Cleanup
		return () => {
			ScrollTrigger.getAll().forEach(trigger => trigger.kill())
		}
	}, [])

	return (
		<footer ref={footerRef} className={styles.footer}>
			<div className={`${styles.footerContainer} container`}>
				<div className={styles.footerMain}>
					<div ref={(el) => { columnsRef.current[0] = el }} className={`${styles.footerColumn} ${styles.footerOtherMarkets}`}>
						<h4 className={styles.footerColumnTitle}>Покупайте нас везде!</h4>
						<div className={styles.footerOtherMarketsLinks}>
							<a
								href="https://ozon.ru/seller/slava-larionov-215259/?utm_source=ozonfooter&utm_campaign=vendor_org_147975"
								className={styles.footerOtherMarketsLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<img
									src="/ozon.svg"
									alt="ozon"
									className={styles.footerOtherMarketsLinkImage}
									width="160"
									height="35"
								/>
							</a>
							<a
								href="https://market.yandex.ru/business--slava-larionov-official-store/2967837?utm_source=yandexmarket-footer"
								className={styles.footerOtherMarketsLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<img
									src="/yandex-market.svg"
									alt="yandex market"
									className={styles.footerOtherMarketsLinkImage}
									width="160"
									height="30"
								/>
							</a>
						</div>
						<p className={`${styles.footerColumnText} ${styles.footerOtherMarketsText}`}>
							Часть наших изделий продаётся на маркетплейсах. Там
							нельзя выбрать опции с кастомизацией, зато можно
							использовать бонусы и скидки от озона и яндекс.маркета.
						</p>
						<a
							href="https://slavalarionov.com/marketplaces"
							className={styles.footerOtherMarketsMoreLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							подробнее об этом
						</a>
					</div>
					<div ref={(el) => { columnsRef.current[1] = el }} className={`${styles.footerColumn} ${styles.footerPayment}`}>
						<h4 className={styles.footerColumnTitle}>Оплата на сайте</h4>
						<div className={styles.footerPaymentTypes}>
							<div className={styles.footerPaymentTypesItem}>
								<img
									src="/yandex-pay.svg"
									alt="yandex pay"
									className={styles.footerPaymentTypesItemImage}
								/>
								<p className={styles.footerPaymentTypesItemText}>
									через аккаунт в Яндекс
								</p>
							</div>
							<div className={styles.footerPaymentTypesItem}>
								<img
									src="/visa-mastercard-mir.svg"
									alt="visa mastercard mir"
									className={styles.footerPaymentTypesItemImage}
								/>
								<p className={styles.footerPaymentTypesItemText}>
									выпущенные в России
								</p>
							</div>
						</div>
						<div className={styles.footerPaymentTextInner}>
							<p className={`${styles.footerColumnText} ${styles.footerPaymentText}`}>
								После оплаты вам придёт чек об оплате заказа на
								почту или в смс.
							</p>
							<p className={`${styles.footerColumnText} ${styles.footerPaymentText}`}>
								После мы подтвердим заказ в WhatsApp, в Telegram или
								на почте.
							</p>
						</div>
					</div>
					<div ref={(el) => { columnsRef.current[2] = el }} className={`${styles.footerColumn} ${styles.footerContact}`}>
						<h4 className={`${styles.footerColumnTitle} ${styles.footerContactTitle}`}>
							Пишите нам в чат на сайте или тут:
						</h4>
						<div className={styles.footerContactSocials}>
							<a
								href="https://zen.yandex.ru/id/6239b8e506547728a365d388"
								className={styles.footerContactSocialsItem}
								target="_blank"
								rel="noopener noreferrer"
							>
								<YandexDzenIcon
									className={styles.footerContactSocialsItemIcon}
									color="#424242"
								/>
							</a>
							<a
								href="https://vk.com/slavalarionov.store"
								className={styles.footerContactSocialsItem}
								target="_blank"
								rel="noopener noreferrer"
							>
								<VkIcon
									className={styles.footerContactSocialsItemIcon}
									color="#424242"
								/>
							</a>
							<a
								href="https://www.pinterest.ru/slavalarionov_store/"
								className={styles.footerContactSocialsItem}
								target="_blank"
								rel="noopener noreferrer"
							>
								<PinterestIcon
									className={styles.footerContactSocialsItemIcon}
									color="#424242"
								/>
							</a>
							<a
								href="https://t.me/slavalarionovstore"
								className={styles.footerContactSocialsItem}
								target="_blank"
								rel="noopener noreferrer"
							>
								<TelegramIcon
									className={styles.footerContactSocialsItemIcon}
									color="#424242"
								/>
							</a>
							<a
								href="https://wa.me/79957715030"
								className={styles.footerContactSocialsItem}
								target="_blank"
								rel="noopener noreferrer"
							>
								<WhatsappIcon
									className={styles.footerContactSocialsItemIcon}
									color="#424242"
								/>
							</a>
						</div>
						<p className={`${styles.footerColumnText} ${styles.footerContactText}`}>
							А так же можете звонить по телефону и писать на почту:
						</p>
						<a
							href="https://wa.me/79957715030"
							className={styles.footerContactLink}
						>
							+7 (995) 771-50-30
						</a>
						<a
							href="mailto:hello@slavalarionov.store"
							className={styles.footerContactLink}
						>
							hello@slavalarionov.store
						</a>
					</div>
				</div>
				<div ref={bottomRef} className={styles.footerBottom}>
					<p className={styles.footerOwner}>
						©2025 ИП Ларионов Вячеслав Владимирович
					</p>
					<div className={styles.footerBottomInner}>
						<div className={styles.footerBottomCol}>
							<p className={styles.footerInn}>ИНН: 550517616144</p>
							<p className={styles.footerCity}>Санкт-Петербург</p>
						</div>
						<div className={styles.footerBottomCol}>
							<a
								href="https://slavalarionov.com/slavalarionovstore/terms"
								className={styles.footerBottomLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								Условия использования
							</a>
							<a
								href="https://slavalarionov.com/slavalarionovstore/policy"
								className={styles.footerBottomLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								Политика конфиденциальности
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}



