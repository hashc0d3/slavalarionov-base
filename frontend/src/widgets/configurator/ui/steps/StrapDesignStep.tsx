"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import styles from './StrapDesignStep.module.css'
import { StrapDesignPreview } from './StrapDesignPreview'
import { StrapDesignParams } from './StrapDesignParams'

export const StrapDesignStep = observer(function StrapDesignStep() {
	const selectedStrapModel = configuratorStore.selectedStrapModel
	const selectedStrapModelParams = configuratorStore.selectedStrapModelParams

	if (!selectedStrapModel || !selectedStrapModelParams) {
		return null
	}

	const strapData = selectedStrapModel.attributes.watch_strap

	return (
		<div className={styles.step}>
			<div className={styles.stepContent}>
				<div className={styles.stepColumn}>
					<StrapDesignPreview layout="grid" />
				</div>
				<div className={styles.stepRightColumn}>
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

