"use client"

import styles from './ConfiguratorSteps.module.css'
import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import { StepsFrameColors } from './StepsFrameColors'
import { StrapModelStep } from './StrapModelStep'
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
					<h3>{configuratorStore.steps.strapDesign.title}</h3>
					<div className={styles.pillsGrid}>
						<div>
							<p className={styles.pillTitle}>Кожа</p>
							<div className={styles.pillsRow}>
								{configuratorStore.selectedStrapModelParams?.leather_colors.map((c) => (
									<button key={c.color_title} className={[styles.pill, c.choosen ? styles.pillActive : ''].join(' ')} onClick={() => configuratorStore.chooseStrapLeatherColor(c.color_title)}>
										<span className={styles.pillPreview} style={{ background: c.color_code || '#e9e9e9' }} />
										<span className={styles.pillName}>{c.color_title}</span>
									</button>
								))}
							</div>
						</div>
						<div>
							<p className={styles.pillTitle}>Строчка</p>
							<div className={styles.pillsRow}>
								{configuratorStore.selectedStrapModelParams?.stitching_colors.map((c) => (
									<button key={c.color_title} className={[styles.pill, c.choosen ? styles.pillActive : ''].join(' ')} onClick={() => configuratorStore.chooseStitchingColor(c.color_title)}>
										<span className={styles.pillPreview} style={{ background: c.color_code || '#e9e9e9' }} />
										<span className={styles.pillName}>{c.color_title}</span>
									</button>
								))}
							</div>
						</div>
						<div>
							<p className={styles.pillTitle}>Край</p>
							<div className={styles.pillsRow}>
								{configuratorStore.selectedStrapModelParams?.edge_colors.map((c) => (
									<button key={c.color_title} className={[styles.pill, c.choosen ? styles.pillActive : ''].join(' ')} onClick={() => configuratorStore.chooseEdgeColor(c.color_title)}>
										<span className={styles.pillPreview} style={{ background: c.color_code || '#e9e9e9' }} />
										<span className={styles.pillName}>{c.color_title}</span>
									</button>
								))}
							</div>
						</div>
						<div>
							<p className={styles.pillTitle}>Пряжка</p>
							<div className={styles.pillsRow}>
								{configuratorStore.selectedStrapModelParams?.buckle_colors.map((c) => (
									<button key={c.color_title} className={[styles.pill, c.choosen ? styles.pillActive : ''].join(' ')} onClick={() => configuratorStore.chooseBuckleColor(c.color_title)}>
										<span className={styles.pillPreview} style={{ background: c.color_code || '#e9e9e9' }} />
										<span className={styles.pillName}>{c.color_title}</span>
									</button>
								))}
							</div>
						</div>
						<div>
							<p className={styles.pillTitle}>Адаптер</p>
							<div className={styles.pillsRow}>
								{configuratorStore.selectedStrapModelParams?.adapter_colors.map((c) => (
									<button key={c.color_title} className={[styles.pill, c.choosen ? styles.pillActive : ''].join(' ')} onClick={() => configuratorStore.chooseAdapterColor(c.color_title)}>
										<span className={styles.pillPreview} style={{ background: c.color_code || '#e9e9e9' }} />
										<span className={styles.pillName}>{c.color_title}</span>
									</button>
								))}
							</div>
						</div>
					</div>
				</section>
			)}

			{step === 4 && (
				<section className={[styles.section, animClass].join(' ')}>
					<h3>{configuratorStore.steps.final.title}</h3>
					<div className={styles.finalGrid}>
						<label className={styles.finalRow}><input type="checkbox" checked={configuratorStore.steps.final.additionalOptions.initials.choosen} onChange={(e) => configuratorStore.toggleInitials(e.target.checked)} /> Инициалы (+{configuratorStore.steps.final.additionalOptions.initials.price} ₽)</label>
						<label className={styles.finalRow}><input type="checkbox" checked={configuratorStore.steps.final.additionalOptions.presentBox.choosen} onChange={(e) => configuratorStore.togglePresentBox(e.target.checked)} /> Подарочная коробка (+{configuratorStore.steps.final.additionalOptions.presentBox.price} ₽)</label>
						<label className={styles.finalRow}><input type="checkbox" checked={configuratorStore.steps.final.additionalOptions.postCard.choosen} onChange={(e) => configuratorStore.togglePostCard(e.target.checked)} /> Открытка (+{configuratorStore.steps.final.additionalOptions.postCard.price} ₽)</label>
						<div className={styles.promoRow}>
							<input placeholder="Промокод" value={configuratorStore.promoCode || ''} onChange={(e) => configuratorStore.updatePromoCodeValue(e.target.value)} />
							<button onClick={() => configuratorStore.applyPromo(configuratorStore.promoCode || '')}>Применить</button>
							{configuratorStore.promoAccepted && <span>Скидка применена</span>}
						</div>
						<div className={styles.totalBox}>Итого: {configuratorStore.totalPriceWithDiscount} ₽</div>
					</div>
				</section>
			)}
		</div>
	)
})
