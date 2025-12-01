'use client'

import Link from 'next/link'
import { VkIcon } from './icons/VkIcon'
import { TelegramIcon } from './icons/TelegramIcon'
import { WhatsappIcon } from './icons/WhatsappIcon'
import { YandexDzenIcon } from './icons/YandexDzenIcon'
import { PinterestIcon } from './icons/PinterestIcon'
import styles from './Footer.module.css'

export const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={`${styles.footerContainer} container`}>
				<div className={styles.footerMain}>
					<div className={`${styles.footerColumn} ${styles.footerOtherMarkets}`}>
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
					<div className={`${styles.footerColumn} ${styles.footerPayment}`}>
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
					<div className={`${styles.footerColumn} ${styles.footerContact}`}>
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
				<div className={styles.footerBottom}>
					<p className={styles.footerOwner}>
						©2024 ИП Ларионов Вячеслав Владимирович
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

