"use client"

import styles from './ConfiguratorSteps.module.css'
import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import { StepsFrameColors } from './StepsFrameColors'
import { StrapModelStep } from './StrapModelStep'
import { StrapDesignStep } from './StrapDesignStep'
import { FinalStep } from './FinalStep'
import { useEffect, useRef, useState } from 'react'

export const ConfiguratorSteps = observer(function ConfiguratorSteps() {
	const step = configuratorStore.currentStepNum
	const prevStepRef = useRef(step)
	const [animClass, setAnimClass] = useState(styles.fadeRightStatic)

	useEffect(() => {
		const prev = prevStepRef.current
		const next = configuratorStore.currentStepNum
		setAnimClass(prev > next ? styles.fadeLeftStatic : styles.fadeRightStatic)
		prevStepRef.current = next
	}, [configuratorStore.currentStepNum])

	return (
		<div className={styles.configuratorSteps}>
			{step === 1 && (
				<section className={[styles.section, animClass].join(' ')}>
					<div className={styles.stepInner}>
						{configuratorStore.watchModels.map((model, idx) => (
							<div
								key={model.watch_model_name}
								className={[styles.stepItem, model.choosen ? styles.choosen : ''].join(' ')}
								onClick={() => !model.choosen && configuratorStore.chooseWatchModel(idx)}
							>
								<img src={model.main_image || '/window.svg'} width={150} height={270} alt="" className={styles.stepItemImage} />
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
					<StepsFrameColors />
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
