"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import { StrapParams, StrapColor } from '@/shared/store/configurator.store'
import { resolveMediaUrl } from '@/shared/lib/media'
import styles from './StrapDesignParams.module.css'

const defaultButterflyImage = 'https://api.slavalarionov.store/uploads/buckle_butterfly_d2b9bce6c1.png'

interface StrapDesignParamsProps {
	params: StrapParams
	selectedStrapModel: any
}

export const StrapDesignParams = observer(function StrapDesignParams({ params, selectedStrapModel }: StrapDesignParamsProps) {
	const buckleButterfly = configuratorStore.selectedStrapModel?.attributes.watch_strap.buckle_butterfly_choosen

	const paramConfigs = [
		{
			id: 1,
			title: 'Цвет кожи',
			paramName: 'leather_color',
			colors: params.leather_colors,
			func: (title: string) => configuratorStore.chooseStrapLeatherColor(title)
		},
		{
			id: 2,
			title: 'Цвет строчки',
			paramName: 'stitching_color',
			colors: params.stitching_colors,
			func: (title: string) => configuratorStore.chooseStitchingColor(title)
		},
		{
			id: 3,
			title: 'Цвет края',
			paramName: 'edge_color',
			colors: params.edge_colors,
			func: (title: string) => configuratorStore.chooseEdgeColor(title)
		},
		{
			id: 4,
			title: 'Цвет пряжки',
			paramName: 'buckle_color',
			colors: params.buckle_colors,
			func: (title: string) => configuratorStore.chooseBuckleColor(title),
			hasButterflyBuckle: params.has_buckle_butterfly
		},
		{
			id: 5,
			title: 'Цвет адаптеров',
			paramName: 'adapter_color',
			colors: params.adapter_colors,
			func: (title: string) => configuratorStore.chooseAdapterColor(title)
		}
	]

	return (
		<div className={styles.params}>
			{paramConfigs.map((config) => (
				<StrapDesignParamItem
					key={config.id}
					id={config.id}
					paramsAmount={paramConfigs.length}
					paramTitle={config.title}
					paramName={config.paramName}
					colors={config.colors}
					func={config.func}
					hasButterflyBuckle={config.hasButterflyBuckle}
				/>
			))}
		</div>
	)
})

interface StrapDesignParamItemProps {
	id: number
	paramsAmount: number
	paramTitle: string
	paramName: string
	colors: StrapColor[]
	func: (title: string) => void
	hasButterflyBuckle?: boolean
}

const StrapDesignParamItem = observer(function StrapDesignParamItem({
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
	const butterflyImageSrc = strapData?.buckle_butterfly_image
		? resolveMediaUrl(strapData.buckle_butterfly_image)
		: defaultButterflyImage
	const butterflyPriceLabel =
		butterflyPrice > 0 ? `+ ${butterflyPrice.toLocaleString('ru-RU')} ₽` : 'В комплекте'

	const getAdapterImageUrl = (color: StrapColor) => {
		const icon = resolveMediaUrl(color.images?.icon || color.icon)
		if (icon) {
			return icon
		}

		const dynamic = resolveMediaUrl(color.images?.view1 || color.view1)

		if (dynamic) {
			return dynamic
		}

		const baseUrl = 'https://api.slavalarionov.store/uploads'
		const colorMapping: Record<string, { name: string; hash: string }> = {
			'Серебряный': { name: 'silver', hash: '1fd6eb2557' },
			'Чёрный': { name: 'black', hash: 'dcc8a881ac' },
			'Роз. золото': { name: 'rosegold', hash: '0ac1883663' },
			'Синий': { name: 'blue', hash: '398dff917a' },
			'Зелёный': { name: 'green', hash: 'dcf0b463d9' }
		}
		const colorInfo = colorMapping[color.color_title] || { name: color.color_title.toLowerCase(), hash: '1fd6eb2557' }
		return `${baseUrl}/adapter_${colorInfo.name}_${colorInfo.hash}.png`
	}

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
