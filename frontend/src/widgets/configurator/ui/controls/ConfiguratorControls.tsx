"use client"

import styles from './ConfiguratorControls.module.css'
import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'

export const ConfiguratorControls = observer(function ConfiguratorControls() {
	const isFinal = configuratorStore.currentStepNum === configuratorStore.stepsAmount
	return (
		<div className={styles.configuratorControls}>
			<div>
				{configuratorStore.currentStepNum > 1 && (
					<div className={styles.paramsBox}>
						<div className={styles.paramRow}>Модель: {configuratorStore.steps.model.modelName}</div>
						<div className={styles.paramRow}>Размер: {configuratorStore.steps.model.modelSize}</div>
					</div>
				)}
			</div>
			<nav className={styles.configuratorControlsNav}>
				<button className={[styles.btn, styles.btnGhost].join(' ')} onClick={() => configuratorStore.prevStep()} disabled={configuratorStore.currentStepNum === 1}>Назад</button>
				{!isFinal ? (
					<button className={[styles.btn, styles.btnPrimary].join(' ')} onClick={() => configuratorStore.nextStep()} disabled={!configuratorStore.nextStepReady}>Далее</button>
				) : (
					<button className={[styles.btn, styles.btnPrimary].join(' ')} onClick={() => configuratorStore.showOrderPopup()}>
						Перейти к оформлению
					</button>
				)}
			</nav>
		</div>
	)
})
