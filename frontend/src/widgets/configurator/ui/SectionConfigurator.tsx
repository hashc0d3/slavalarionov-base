"use client"

import styles from './SectionConfigurator.module.css'
import { observer } from 'mobx-react-lite'
import { ConfiguratorSteps } from './steps/ConfiguratorSteps'
import { ConfiguratorControls } from './controls/ConfiguratorControls'
import { StepsProgress } from './steps/StepsProgress'
import { OrderPopup } from './order-popup/OrderPopup'
import { ConfiguratorCart } from './cart/ConfiguratorCart'
import { configuratorStore } from '@/shared/store/configurator.store'
import { useConfiguratorRouting } from '@/shared/hooks/useConfiguratorRouting'

export const SectionConfigurator = observer(function SectionConfigurator() {
	// Инициализация синхронизации URL с состоянием конфигуратора
	useConfiguratorRouting()

	return (
		<section className={styles.configuratorSection}>
			<div className={["container", styles.container, styles.configuratorSectionContainer].join(' ')}>
				<div className={styles.configuratorControlsWrap}>
					<ConfiguratorControls navOnly />
				</div>
				<h2 className={styles.configuratorTitle}>Создай уникальный ремешок для своих Apple Watch</h2>
				<div className={styles.configuratorContent}>
					<StepsProgress />
					<div className={styles.configuratorFixedViewLayer}></div>
					<div className={styles.configuratorControlsDesktop}>
						<ConfiguratorControls />
					</div>
					<div className={styles.configuratorControlsMobile}>
						<ConfiguratorControls selectsOnly />
					</div>
					<ConfiguratorSteps />
				</div>
			</div>
			<OrderPopup visible={configuratorStore.orderPopupVisible} onClose={() => configuratorStore.closeOrderPopup()} />
			<ConfiguratorCart />
		</section>
	)
})
