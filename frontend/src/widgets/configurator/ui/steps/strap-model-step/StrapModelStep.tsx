/**
 * Компонент шага выбора модели ремешка
 * Рефакторинг по FSD архитектуре
 */

"use client"

import styles from '../StrapModelStep.module.css'
import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import { useStrapModelStepAnimation } from './hooks/useStrapModelStepAnimation'
import { getStrapImage } from './utils/getStrapImage'

export const StrapModelStep = observer(function StrapModelStep() {
	const isUltra = configuratorStore.selectedWatchModel?.model_name.toLowerCase().includes('ultra')
	const strapCardsRef = useStrapModelStepAnimation()

	return (
		<div className={styles.step}>
			<div className={styles.stepWrapper}>
				{configuratorStore.availableWatchStraps.map((strap, idx) => (
					<div
						key={strap.attributes.watch_strap.id}
						ref={(el) => { strapCardsRef.current[idx] = el }}
						className={[styles.item, strap.choosen ? styles.choosen : ''].join(' ')}
						onClick={() => configuratorStore.chooseStrapModel(strap.attributes.watch_strap.id)}
					>
						<div className={styles.itemImageInner}>
							<img
								src={getStrapImage(strap, !!isUltra)}
								width={150}
								height={185}
								alt=""
								className={styles.itemImage}
								loading="lazy"
								decoding="async"
							/>
						</div>
						<h4 className={styles.itemTitle}>
							{strap.attributes.watch_strap.strap_title}
						</h4>
						<p className={styles.itemDescription}>
							{strap.attributes.watch_strap.strap_short_description || strap.attributes.watch_strap.strap_description}
						</p>
						<p className={styles.itemPrice}>
							{strap.attributes.watch_strap.price}₽
						</p>
						{strap.choosen && (
							<button 
								className={styles.itemNextBtn}
								onClick={() => configuratorStore.nextStep()}
							>
								Далее {configuratorStore.currentStepNum + 1}/{configuratorStore.stepsAmount}
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	)
})


