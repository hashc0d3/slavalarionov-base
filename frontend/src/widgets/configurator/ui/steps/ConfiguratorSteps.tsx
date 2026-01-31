"use client"

import styles from './ConfiguratorSteps.module.css'
import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import { StepsFrameColors } from './StepsFrameColors'
import { StrapModelStep } from './strap-model-step/StrapModelStep'
import { StrapDesignStep } from './StrapDesignStep'
import { FinalStep } from './FinalStep'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export const ConfiguratorSteps = observer(function ConfiguratorSteps() {
	const step = configuratorStore.currentStepNum
	const prevStepRef = useRef(step)
	const [animClass, setAnimClass] = useState(styles.fadeRightStatic)
	const watchModelCardsRef = useRef<(HTMLDivElement | null)[]>([])

	useEffect(() => {
		const prev = prevStepRef.current
		const next = configuratorStore.currentStepNum
		setAnimClass(prev > next ? styles.fadeLeftStatic : styles.fadeRightStatic)
		prevStepRef.current = next
	}, [configuratorStore.currentStepNum])

	// Анимация для карточек моделей часов на первом шаге
	useEffect(() => {
		if (step === 1 && configuratorStore.watchModels.length > 0) {
			// Небольшая задержка, чтобы убедиться, что DOM обновлен
			const timeoutId = setTimeout(() => {
				const cards = watchModelCardsRef.current.filter(Boolean)
				
				if (cards.length === 0) return
				
				// Начальное состояние
				gsap.set(cards, { 
					opacity: 0, 
					y: 40,
					scale: 0.9
				})

				// Анимация появления
				gsap.to(cards, {
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.7,
					stagger: 0.12,
					ease: 'power3.out',
					delay: 0.1
				})
			}, 100)
			
			return () => clearTimeout(timeoutId)
		}
	}, [step, configuratorStore.watchModels.length])

	return (
		<div className={`${styles.configuratorSteps} ${step === 4 ? styles.configuratorStepsFinal : ''}`}>
			{step === 1 && (
				<section className={[styles.section, animClass].join(' ')}>
					{configuratorStore.isLoading && configuratorStore.watchModels.length === 0 ? (
						<div style={{ textAlign: 'center', padding: '40px' }}>
							<p>Загрузка моделей часов...</p>
						</div>
					) : configuratorStore.watchModels.length === 0 ? (
						<div style={{ textAlign: 'center', padding: '40px' }}>
							<p>Модели часов не найдены. Проверьте подключение к серверу.</p>
						</div>
					) : (
						<div className={styles.stepInner}>
							{configuratorStore.watchModels.map((model, idx) => (
							<div
								key={model.watch_model_name}
								ref={(el) => { watchModelCardsRef.current[idx] = el }}
								className={[styles.stepItem, model.choosen ? styles.choosen : ''].join(' ')}
								onClick={() => !model.choosen && configuratorStore.chooseWatchModel(idx)}
							>
								<img 
								src={model.main_image || '/window.svg'} 
								alt="" 
								className={styles.stepItemImage}
								loading="lazy"
								decoding="async"
							/>
								<div className={styles.stepItemInfo}>
									<div className={styles.stepItemTitle}>
										<p className={styles.stepItemTitlePart}>{model.watch_model_manufacturer}</p>
										<p className={styles.stepItemTitlePart}>{model.watch_model_name}</p>
									</div>
									<div className={styles.stepItemSizes}>
										{model.watch_sizes.map((size, id) => (
											<button
												key={size.watch_size}
												type="button"
												className={[styles.stepItemSizesItem, size.choosen ? styles.choosen : ''].join(' ')}
												onClick={(e) => { e.stopPropagation(); configuratorStore.chooseWatchModel(idx, id) }}
											>
												{size.watch_size}mm
											</button>
										))}
									</div>
								</div>
								{model.choosen && (
									<div className={styles.stepItemColors}>
										{configuratorStore.selectedWatchModelFrameColors?.map((color) => (
											<button key={color.color_name} className={[styles.stepItemColor, color.choosen ? styles.choosen : ''].join(' ')} onClick={(e) => { e.stopPropagation(); configuratorStore.chooseFrameColor(color.color_name) }}>
												<span className={styles.stepItemColorPreview} style={{ background: color.color_code || '#eee' }} />
											</button>
										))}
									</div>
								)}
							</div>
							))}
						</div>
					)}
					{configuratorStore.watchModels.length > 0 && <StepsFrameColors />}
				</section>
			)}

			{step === 2 && (
				<section className={[styles.section, animClass].join(' ')}>
					<StrapModelStep />
				</section>
			)}

			{step === 3 && (
				<section className={[styles.section, animClass].join(' ')}>
					<StrapDesignStep />
				</section>
			)}

			{step === 4 && (
				<section className={[styles.section, animClass].join(' ')}>
					<FinalStep />
				</section>
			)}
		</div>
	)
})
