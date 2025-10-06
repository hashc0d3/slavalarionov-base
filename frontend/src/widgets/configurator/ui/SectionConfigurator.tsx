"use client"

import styles from './SectionConfigurator.module.css'
import { observer } from 'mobx-react-lite'
import { ConfiguratorSteps } from './steps/ConfiguratorSteps'
import { ConfiguratorControls } from './controls/ConfiguratorControls'
import { StepsProgress } from './steps/StepsProgress'
import { OrderPopup } from './order-popup/OrderPopup'
import { configuratorStore } from '@/shared/store/configurator.store'

export const SectionConfigurator = observer(function SectionConfigurator() {
	return (
		<section className={styles.configuratorSection}>
			<div className={["container", styles.container, styles.configuratorSectionContainer].join(' ')}>
				<h2 className={styles.configuratorTitle}>Создай уникальный ремешок для своих Apple Watch</h2>
				<div className={styles.configuratorContent}>
					<StepsProgress />
					<div className={styles.configuratorFixedViewLayer}></div>
					<ConfiguratorControls />
					<ConfiguratorSteps />
				</div>
			</div>
			<OrderPopup visible={configuratorStore.orderPopupVisible} onClose={() => configuratorStore.closeOrderPopup()} />
		</section>
	)
})
