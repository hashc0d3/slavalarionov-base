"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import styles from './StrapDesignStep.module.css'
import { StrapDesignPreview } from './StrapDesignPreview'
import { StrapDesignParams } from './strap-design-params/StrapDesignParams'

export const StrapDesignStep = observer(function StrapDesignStep() {
	const selectedStrapModel = configuratorStore.selectedStrapModel
	const selectedStrapModelParams = configuratorStore.selectedStrapModelParams

	if (!selectedStrapModel) {
		return (
			<div className={styles.step}>
				<div style={{ textAlign: 'center', padding: '40px' }}>
					<p>Пожалуйста, выберите модель ремешка на предыдущем шаге.</p>
					<button
						onClick={() => configuratorStore.currentStepNum = 2}
						style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
					>
						Вернуться к выбору ремешка
					</button>
				</div>
			</div>
		)
	}

	if (!selectedStrapModelParams) {
		return (
			<div className={styles.step}>
				<div style={{ textAlign: 'center', padding: '40px' }}>
					<p>Загрузка параметров ремешка...</p>
				</div>
			</div>
		)
	}

	const strapData = selectedStrapModel.attributes.watch_strap

	return (
		<div className={styles.step}>
			<div className={styles.stepContent}>
				<div className={styles.stepColumn}>
					<StrapDesignPreview key="step3-preview" layout="grid" />
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

