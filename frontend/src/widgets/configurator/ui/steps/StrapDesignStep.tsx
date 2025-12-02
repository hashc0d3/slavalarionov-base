"use client"

import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { configuratorStore } from '@/shared/store/configurator.store'
import styles from './StrapDesignStep.module.css'
import { StrapDesignPreview } from './StrapDesignPreview'
import { StrapDesignParams } from './StrapDesignParams'
import gsap from 'gsap'

export const StrapDesignStep = observer(function StrapDesignStep() {
	const selectedStrapModel = configuratorStore.selectedStrapModel
	const selectedStrapModelParams = configuratorStore.selectedStrapModelParams
	const previewRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)

	if (!selectedStrapModel || !selectedStrapModelParams) {
		return null
	}

	const strapData = selectedStrapModel.attributes.watch_strap

	// Анимация для третьего шага
	useEffect(() => {
		const elements = []
		if (previewRef.current) elements.push(previewRef.current)
		if (contentRef.current) elements.push(contentRef.current)

		// Начальное состояние
		gsap.set(elements, { 
			opacity: 0, 
			y: 40,
			scale: 0.95
		})

		// Анимация появления
		gsap.to(elements, {
			opacity: 1,
			y: 0,
			scale: 1,
			duration: 0.7,
			stagger: 0.15,
			ease: 'power3.out',
			delay: 0.1
		})
	}, [])

	return (
		<div className={styles.step}>
			<div className={styles.stepContent}>
				<div ref={previewRef} className={styles.stepColumn}>
					<StrapDesignPreview layout="grid" />
				</div>
				<div ref={contentRef} className={styles.stepRightColumn}>
					<h3 className={styles.stepTitle}>
						Ваш ремешок {strapData.strap_title}
					</h3>
					<p className={styles.stepPrice}>{strapData.price} ₽</p>
					<div className={styles.stepDescription}>
						<p 
							className={styles.stepDescriptionText}
							dangerouslySetInnerHTML={{ __html: strapData.strap_description || '' }}
						/>
					</div>
					<StrapDesignParams 
						params={selectedStrapModelParams}
						selectedStrapModel={strapData}
					/>
					<button
						className={styles.stepNextStepBtn}
						disabled={!configuratorStore.nextStepReady}
						onClick={() => configuratorStore.nextStep()}
					>
						Далее {configuratorStore.currentStepNum + 1}/{configuratorStore.stepsAmount}
					</button>
				</div>
			</div>
		</div>
	)
})

