"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore, StrapParams } from '@/shared/store/configurator.store'
import { resolveMediaUrl, getMediaBaseUrl } from '@/shared/lib/media'
import styles from './StrapDesignPreview.module.css'

interface StrapDesignPreviewProps {
	className?: string
	variant?: 'default' | 'final'
	layout?: 'grid' | 'flex'
}

export const StrapDesignPreview = observer(function StrapDesignPreview({ className, variant = 'default', layout = 'flex' }: StrapDesignPreviewProps) {
	const selectedStrapModel = configuratorStore.selectedStrapModel
	const selectedLeatherColor = configuratorStore.selectedLeatherColor
	const selectedStitchingColor = configuratorStore.selectedStitchingColor
	const selectedEdgeColor = configuratorStore.selectedEdgeColor
	const selectedBuckleColor = configuratorStore.selectedBuckleColor
	const selectedAdapterColor = configuratorStore.selectedAdapterColor
	const frameColorImages = configuratorStore.selectedFrameColorImages

	if (!selectedStrapModel) {
		return null
	}

	const strapData = selectedStrapModel.attributes.watch_strap

	const baseImageUrl = `${getMediaBaseUrl()}/uploads`

	const pickImagePath = (value: any): string | undefined => {
		if (!value) return undefined
		if (typeof value === 'string') return value
		if (typeof value === 'object') {
			if ('url' in value && typeof value.url === 'string') return value.url
			if ('data' in value && value.data?.attributes?.url) return value.data.attributes.url
		}
		return undefined
	}

	const getDynamicColorImage = (color: any, view: number): string | undefined => {
		if (!color) return undefined
		const candidates = [
			pickImagePath(color.images?.[`view${view}`]),
			pickImagePath(color.images?.[`view_${view}`]),
			pickImagePath(color[`view${view}`]),
			pickImagePath(color[`view_${view}`])
		]
		for (const candidate of candidates) {
			const resolved = resolveMediaUrl(candidate)
			if (resolved) {
				return resolved
			}
		}
		return undefined
	}

	const getLegacyImageUrl = (type: string, view: number, color?: any) => {
		const colorName = (color?.color_title ?? '').toLowerCase()

		// Маппинг цветов для правильных URL с хешами для разных видов
		const getColorHash = (colorName: string, type: string, view: number) => {
			// Базовые хеши для view 1
			const baseHashes: Record<string, string> = {
				'белый': '86adc58985',
				'чёрный': '9c801e142a',
				'бежевый': '6169213005',
				'чароит': '653977efb4',
				'зеленовато-желтый': '2364420848',
				'шоколадный': '1d1db68de2',
				'зелёный': 'c17ca133b5',
				'фуксия': 'ca2dcc2f02',
				'голубой': 'a88df8430f',
				'марсала': '75bd7cd494',
				'мятный': 'a0816126e4',
				'оранжевый': '95c42a67f7',
				'пудра': '4bc43c08dd',
				'красный': '8913d26f63',
				'королевский синий': '9d09637ac0',
				'серый': '6014a4e990',
				'ультрамарин': '212e9a998f',
				'фиолетовый': 'ebebddb95c',
				'жёлтый': '298301fe98',
				'серебряный': '16b6862ef4',
				'розовое золото': 'bb2fe92f54',
				'роз. золото': 'bb2fe92f54',
				'синий': 'a918feda5c',
				'зеленый': '26a256f55a'
			}
			
			// Специальные хеши для разных видов и типов
			if (view === 2) {
				const view2Hashes: Record<string, string> = {
					'белый': 'f88b2a322e',
					'чёрный': 'a6dcdbde19',
					'бежевый': 'b64acbe902',
					'чароит': 'fdde96690d',
					'зеленовато-желтый': '53662de960',
					'шоколадный': '497ce25484',
					'зелёный': '44e0fe8e3d',
					'фуксия': '55b09ef2af',
					'голубой': 'fe0efcf272',
					'марсала': '69560e2855',
					'мятный': '218aec500a',
					'оранжевый': 'eb0eec4abd',
					'пудра': '3ddd0e9f1b',
					'красный': 'c0081a5a24',
					'королевский синий': 'fcb638174b',
					'серый': 'e17919735e',
					'ультрамарин': '2abcbe8398',
					'фиолетовый': '2ac621e263',
					'жёлтый': 'dc6909aa8f'
				}
				return view2Hashes[colorName] || baseHashes[colorName] || '86adc58985'
			} else if (view === 3) {
				const view3Hashes: Record<string, string> = {
					'белый': 'd023ce495f',
					'чёрный': '849bbdbed1',
					'бежевый': '83ea932857',
					'чароит': 'cb2997252d',
					'зеленовато-желтый': '873a3a716c',
					'шоколадный': 'ba3bb399c5',
					'зелёный': 'd083d34833',
					'фуксия': '395089cccc',
					'голубой': 'e4d834d19a',
					'марсала': '9508f04d60',
					'мятный': 'e2816e0b0e',
					'оранжевый': '6c5e86ceb9',
					'пудра': '4dd996bd53',
					'красный': '746d8b7ee1',
					'королевский синий': '1380a4d0f0',
					'серый': '92b8a8a38a',
					'ультрамарин': 'a885e06cfe',
					'фиолетовый': '7a9b262388',
					'жёлтый': 'a0212fbfc2'
				}
				return view3Hashes[colorName] || baseHashes[colorName] || '86adc58985'
			}
			
			return baseHashes[colorName] || '86adc58985'
		}
		
		const colorMapping: Record<string, string> = {
			'белый': 'white',
			'чёрный': 'black',
			'бежевый': 'beige',
			'чароит': 'charoite',
			'зеленовато-желтый': 'chartrouse',
			'шоколадный': 'chocolate',
			'зелёный': 'forest',
			'фуксия': 'fuchsia',
			'голубой': 'louisblue',
			'марсала': 'marsala',
			'мятный': 'mint',
			'оранжевый': 'orange',
			'пудра': 'pudra',
			'красный': 'red',
			'королевский синий': 'royalblue',
			'серый': 'spacegray',
			'ультрамарин': 'ultramarine',
			'фиолетовый': 'violet',
			'жёлтый': 'yellow',
			'серебряный': 'silver',
			'розовое золото': 'rosegold',
			'роз. золото': 'rosegold',
			'синий': 'blue',
			'зеленый': 'green'
		}
		
		const mappedColor = colorMapping[colorName] || colorName || 'white'
		const hash = getColorHash(colorName, type, view)
		
		// Для разных типов ремешков используются разные префиксы
		if (strapData.strap_name === 'brogue') {
			return `${baseImageUrl}/${type}_brogue_${mappedColor}_${view}_${hash}.png`
		} else {
			return `${baseImageUrl}/${type}_classic_${mappedColor}_${view}_${hash}.png`
		}
	}

	const getImageUrl = (type: 'leather' | 'stitching' | 'edge' | 'buckle' | 'adapter', view: number) => {
		const color =
			type === 'leather'
				? selectedLeatherColor
				: type === 'stitching'
					? selectedStitchingColor
					: type === 'edge'
						? selectedEdgeColor
						: type === 'buckle'
							? selectedBuckleColor
							: selectedAdapterColor

		const dynamic = getDynamicColorImage(color, view)
		if (dynamic) {
			return dynamic
		}

		return getLegacyImageUrl(type, view, color)
	}

	type ViewImageKey = keyof NonNullable<StrapParams['view_images']>
	const getBaseViewImage = (view: number) => {
		const viewKey = `view${view}` as ViewImageKey
		const baseViews = strapData?.strap_params?.view_images
		const dynamic = resolveMediaUrl(pickImagePath(baseViews?.[viewKey]))
		if (dynamic) {
			return dynamic
		}
		if (view === 1) {
			return `${baseImageUrl}/base_${strapData.strap_name}_1_739ae2aa10.png`
		}
		if (view === 2) {
			return `${baseImageUrl}/base_${strapData.strap_name}_2_26fa993a75.png`
		}
		return `${baseImageUrl}/base_${strapData.strap_name}_3_50228196b7.png`
	}

	return (
		<div className={`${variant === 'final' ? styles.previewFinal : styles.preview} ${className || ''}`}>
			<div className={`${styles.previewContainer} ${layout === 'grid' ? styles.previewContainerGrid : styles.previewContainerFlex}`}>
			{/* View 1 */}
			<div className={styles.previewView}>
				<img src={getBaseViewImage(1)} alt="Strap view 1" className={styles.baseImage} />
				{(() => {
					const url = resolveMediaUrl(frameColorImages?.view1)
					return url ? <img src={url} alt="" className={`${styles.overlayImage} ${styles.frameOverlay}`} /> : null
				})()}
				{/* Overlay images for different parts */}
				{selectedLeatherColor && (() => {
					const url = getImageUrl('leather', 1)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
				{selectedStitchingColor && (() => {
					const url = getImageUrl('stitching', 1)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
				{selectedEdgeColor && (() => {
					const url = getImageUrl('edge', 1)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
				{selectedBuckleColor && (() => {
					const url = getImageUrl('buckle', 1)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
				{selectedAdapterColor && (() => {
					const url = getImageUrl('adapter', 1)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
			</div>

			{/* View 2 */}
			<div className={styles.previewView}>
				<img src={getBaseViewImage(2)} alt="Strap view 2" className={styles.baseImage} />
				{(() => {
					const url = resolveMediaUrl(frameColorImages?.view2)
					return url ? <img src={url} alt="" className={`${styles.overlayImage} ${styles.frameOverlay}`} /> : null
				})()}
				{selectedLeatherColor && (() => {
					const url = getImageUrl('leather', 2)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
				{selectedStitchingColor && (() => {
					const url = getImageUrl('stitching', 2)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
				{selectedEdgeColor && (() => {
					const url = getImageUrl('edge', 2)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
				{selectedBuckleColor && (() => {
					const url = getImageUrl('buckle', 2)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
				{selectedAdapterColor && (() => {
					const url = getImageUrl('adapter', 2)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
			</div>

			{/* View 3 */}
			<div className={styles.previewView}>
				<img src={getBaseViewImage(3)} alt="Strap view 3" className={styles.baseImage} />
				{(() => {
					const url = resolveMediaUrl(frameColorImages?.view3)
					return url ? <img src={url} alt="" className={`${styles.overlayImage} ${styles.frameOverlay}`} /> : null
				})()}
				{selectedLeatherColor && (() => {
					const url = getImageUrl('leather', 3)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
				{selectedStitchingColor && (() => {
					const url = getImageUrl('stitching', 3)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
				{selectedEdgeColor && (() => {
					const url = getImageUrl('edge', 3)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
				{selectedBuckleColor && (() => {
					const url = getImageUrl('buckle', 3)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
				{selectedAdapterColor && (() => {
					const url = getImageUrl('adapter', 3)
					return url ? <img src={url} alt="" className={styles.overlayImage} /> : null
				})()}
			</div>
			</div>
		</div>
	)
})
