"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import styles from './FinalStep.module.css'
import { FinalStepMain } from './FinalStepMain'
import { FinalStepAdditional } from './FinalStepAdditional'
import { FinalStepTotal } from './FinalStepTotal'

export const FinalStep = observer(function FinalStep() {
	const totalPrice = configuratorStore.totalPriceWithDiscount
	const readyDate = configuratorStore.closestReadyDate

	const handlePay = () => {
		configuratorStore.showOrderPopup()
	}

	return (
		<div className={styles.step}>
			<FinalStepMain className={styles.stepMain} />
			<FinalStepAdditional className={styles.stepAdditional} />
			<FinalStepTotal
				className={styles.stepTotal}
				totalPrice={totalPrice}
				readyDate={readyDate}
				onPay={handlePay}
			/>
		</div>
	)
})

