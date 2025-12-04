"use client"

import styles from './StrapModelStep.module.css'
import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export const StrapModelStep = observer(function StrapModelStep() {
	const isUltra = configuratorStore.selectedWatchModel?.model_name.toLowerCase().includes('ultra')
	const strapCardsRef = useRef<(HTMLDivElement | null)[]>([])

	// Анимация для карточек ремешков
	useEffect(() => {
		const cards = strapCardsRef.current.filter(Boolean)
		
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
	}, [])
	
	// Функция для получения изображения ремешка
	const getStrapImage = (strap: any): string => {
		// Используем preview_image для отображения карточки ремешка на втором шаге
		if (!isUltra) {
			return strap.attributes.watch_strap.preview_image || '/window.svg'
		} else {
			return strap.attributes.watch_strap.ultra_preview_image || '/window.svg'
		}
	}
	
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
							src={getStrapImage(strap)}
							width={150}
							height={185}
							alt=""
							className={styles.itemImage}
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
