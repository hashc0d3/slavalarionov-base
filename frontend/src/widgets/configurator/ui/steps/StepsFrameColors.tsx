"use client"

import s from './StepsFrameColors.module.css'
import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'

export const StepsFrameColors = observer(function StepsFrameColors() {
	const colors = configuratorStore.selectedWatchModelFrameColors
	if (colors === null) {
		return (
			<div className={s.root}>
				<div className={s.inner}>
					<div className={[s.item, s.emptyItem].join(' ')}>
						<div className={s.itemPreview}></div>
						<p className={s.itemName}>Цвет часов</p>
					</div>
				</div>
			</div>
		)
	}
	if (!colors?.length) return null
	return (
		<div className={s.root}>
			<div className={s.inner}>
				<div className={s.itemsRow}>
					{colors.map((color) => (
						<button key={color.color_name} type="button"
							className={[s.item, color.choosen ? s.choosen : ''].join(' ')}
							onClick={() => configuratorStore.chooseFrameColor(color.color_name)}
						>
							<div className={s.itemPreview} style={{ background: color.color_code || '#e9e9e9' }} />
							<p className={s.itemName}>{color.color_name}</p>
						</button>
					))}
				</div>
			</div>
		</div>
	)
})
