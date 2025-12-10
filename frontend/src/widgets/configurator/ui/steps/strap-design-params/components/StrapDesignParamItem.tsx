/**
 * Компонент элемента параметра дизайна ремешка
 */

"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import type { StrapColor } from '@/shared/store/configurator.store'
import styles from '../../StrapDesignParams.module.css'
import { getAdapterImageUrl } from '../utils/getAdapterImageUrl'
import { getButterflyImage } from '../utils/getButterflyImage'
import { getButterflyPriceLabel } from '../utils/getButterflyPriceLabel'

interface StrapDesignParamItemProps {
	id: number
	paramsAmount: number
	paramTitle: string
	paramName: string
	colors: StrapColor[]
	func: (title: string) => void
	hasButterflyBuckle?: boolean
}

export const StrapDesignParamItem = observer(function StrapDesignParamItem({
	id,
	paramsAmount,
	paramTitle,
	paramName,
	colors,
	func,
	hasButterflyBuckle
}: StrapDesignParamItemProps) {
	const buckleButterfly = configuratorStore.selectedStrapModel?.attributes.watch_strap.buckle_butterfly_choosen
	const strapData = configuratorStore.selectedStrapModel?.attributes.watch_strap
	const butterflyPrice = strapData?.buckle_butterfly_price ?? 0
	const butterflyImageSrc = getButterflyImage(strapData?.buckle_butterfly_image)
	const butterflyPriceLabel = getButterflyPriceLabel(butterflyPrice)

	return (
		<div className={styles.param}>
			<div className={styles.paramHead}>
				<h4 className={styles.paramTitle}>
					<span className={styles.paramTitleNum}>
						{id}/{paramsAmount}
					</span>
					<span className={styles.paramTitleText}>{paramTitle}</span>
				</h4>
			</div>
			
			{paramName !== 'adapter_color' && (
				<div className={styles.paramContent}>
					{colors.map((color, idx) => (
						<button
							key={idx}
							className={`${styles.paramOption} ${color.choosen ? styles.choosen : ''}`}
							onClick={() => func(color.color_title)}
						>
							<div
								className={styles.paramOptionColorPreview}
								style={{ backgroundColor: color.color_code || '#e9e9e9' }}
							/>
							<span className={styles.paramOptionTitle}>
								{color.color_title}
							</span>
						</button>
					))}
				</div>
			)}

			{paramName === 'buckle_color' && hasButterflyBuckle && (
				<div 
					className={`${styles.paramBuckleButterfly} ${buckleButterfly ? styles.choosen : ''}`}
					onClick={() => configuratorStore.chooseBuckleButterfly()}
				>
					<div className={styles.paramBuckleButterflyInner}>
						<p className={styles.paramBuckleButterflyName}>
							Butterfly
						</p>
						<p className={styles.paramBuckleButterflyPrice}>
							{butterflyPriceLabel}
						</p>
					</div>
					<img
						src={butterflyImageSrc}
						alt="Butterfly buckle"
						className={styles.paramBuckleButterflyImage}
						loading="lazy"
						decoding="async"
					/>
				</div>
			)}

			{paramName === 'adapter_color' && (
				<div className={styles.adapterParamContent}>
					{colors.map((color, idx) => (
						<button
							key={idx}
							className={`${styles.paramOption} ${styles.adapterParamOption} ${color.choosen ? styles.choosen : ''}`}
							onClick={() => func(color.color_title)}
						>
							<div className={styles.paramOptionPreviewImgInner}>
								<img
									src={getAdapterImageUrl(color)}
									alt={color.color_title}
									className={styles.paramOptionPreviewImg}
									loading="lazy"
									decoding="async"
								/>
							</div>
							<span className={styles.paramOptionTitle}>
								{color.color_title}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	)
})


