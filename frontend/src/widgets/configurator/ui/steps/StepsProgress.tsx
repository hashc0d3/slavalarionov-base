"use client"

import s from './StepsProgress.module.css'
import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'

export const StepsProgress = observer(function StepsProgress() {
	const steps = configuratorStore.steps
	const current = configuratorStore.currentStepNum
	const stepsAmount = configuratorStore.stepsAmount

	const canGoTo = (id: number) => id <= configuratorStore.currentAvailableStep
	const navigate = (id: number) => { if (canGoTo(id)) configuratorStore.currentStepNum = id }

	return (
		<div className={s.progress}>
			<div className={s.progressList}>
				{(Object.keys(steps) as Array<keyof typeof steps>).map((key) => {
					const item = steps[key]
					const isCurrent = current === item.id
					const isCompleted = item.id <= current
					return (
						<button key={key as string} type="button" onClick={() => navigate(item.id)}
							className={[s.progressItem, isCurrent ? s.current : '', isCompleted ? s.completed : ''].join(' ')}
						>
							{isCurrent && (<span className={s.progressItemNum}>{`${item.id}/${stepsAmount}`}</span>)}
							{item.title}
						</button>
					)
				})}
			</div>
		</div>
	)
})
