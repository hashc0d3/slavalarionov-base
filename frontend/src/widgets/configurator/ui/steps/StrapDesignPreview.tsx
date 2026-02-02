"use client"

import { observer } from 'mobx-react-lite'
import { useRef, useState, useEffect } from 'react'
import { configuratorStore, StrapParams } from '@/shared/store/configurator.store'
import { resolveMediaUrl, getMediaBaseUrl } from '@/shared/lib/media'
import styles from './StrapDesignPreview.module.css'

/** Плавный переход при смене цвета (как в custom Vue: transition name="fade-delay" — новая 0.1s, старая уходит с задержкой 0.2s за 0.4s) */
function FadingOverlayImage({
	url,
	loading = 'lazy',
	decoding = 'async',
	className = '',
	overlayClasses
}: {
	url: string | undefined
	loading?: 'lazy' | 'eager'
	decoding?: 'async' | 'sync'
	className?: string
	/** Отдельные классы для шага 4 — стили не пересекаются с шагом 3 */
	overlayClasses?: { base: string; active: string; exit: string }
}) {
	const prevUrlRef = useRef<string | undefined>(undefined)
	const [exitUrl, setExitUrl] = useState<string | undefined>(undefined)
	const [activeUrl, setActiveUrl] = useState<string | undefined>(url)

	// При смене url: запоминаем старый как exit, новый как active (чтобы переход был виден при переключении фильтра)
	useEffect(() => {
		if (url === undefined) {
			prevUrlRef.current = undefined
			setExitUrl(undefined)
			setActiveUrl(undefined)
			return
		}
		if (prevUrlRef.current !== url) {
			const previous = prevUrlRef.current
			prevUrlRef.current = url
			if (previous) {
				setExitUrl(previous)
			}
			setActiveUrl(url)
		}
	}, [url])

	useEffect(() => {
		if (!exitUrl) return
		const t = setTimeout(() => setExitUrl(undefined), 2600)
		return () => clearTimeout(t)
	}, [exitUrl])

	if (!activeUrl && !exitUrl) return null

	const base = overlayClasses?.base ?? styles.overlayImage
	const activeCls = overlayClasses?.active ?? styles.overlayImageActive
	const exitCls = overlayClasses?.exit ?? styles.overlayImageExit
	const baseClass = `${base} ${className}`.trim()
	return (
		<>
			{exitUrl && (
				<img key={`exit-${exitUrl}`} src={exitUrl} alt="" className={`${baseClass} ${exitCls}`} loading={loading} decoding={decoding} aria-hidden />
			)}
			{activeUrl && (
				<img key={`active-${activeUrl}`} src={activeUrl} alt="" className={`${baseClass} ${activeCls}`} loading={loading} decoding={decoding} aria-hidden />
			)}
		</>
	)
}

interface StrapDesignPreviewProps {
	className?: string
	variant?: 'default' | 'final'
	layout?: 'grid' | 'flex'
}

export const StrapDesignPreview = observer(function StrapDesignPreview({ className, variant = 'default', layout = 'flex' }: StrapDesignPreviewProps) {
	// На шагах 3 и 4 — всегда читаем из стора, чтобы при изменении фильтров картинки обновлялись
	const selectedStrapModel = configuratorStore.selectedStrapModel
	const selectedLeatherColor = configuratorStore.selectedLeatherColor
	const selectedStitchingColor = configuratorStore.selectedStitchingColor
	const selectedEdgeColor = configuratorStore.selectedEdgeColor
	const selectedBuckleColor = configuratorStore.selectedBuckleColor
	const selectedAdapterColor = configuratorStore.selectedAdapterColor
	const frameColorIdForPreview = configuratorStore.selectedFrameColorId
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
		
		// 1. Используем универсальные изображения из view_images (базовый слой)
		const baseViews = strapData?.strap_params?.view_images
		const dynamic = resolveMediaUrl(pickImagePath(baseViews?.[viewKey]))
		if (dynamic) {
			return dynamic
		}
		
		// 2. Fallback на legacy хардкодные URL
		if (view === 1) {
			return `${baseImageUrl}/base_${strapData.strap_name}_1_739ae2aa10.png`
		}
		if (view === 2) {
			return `${baseImageUrl}/base_${strapData.strap_name}_2_26fa993a75.png`
		}
		return `${baseImageUrl}/base_${strapData.strap_name}_3_50228196b7.png`
	}

	// Функция для получения изображения цвета корпуса (приоритетнее универсальных, отображается поверх)
	const getFrameColorImage = (view: number): string | undefined => {
		const frameColorId = frameColorIdForPreview
		if (!frameColorId || !strapData.base_images || !Array.isArray(strapData.base_images)) {
			return undefined
		}
		
		// Ищем изображение для выбранного цвета корпуса
		const matchingBaseImage = strapData.base_images.find((img: any) => img.colorId === frameColorId)
		if (!matchingBaseImage) {
			return undefined
		}
		
		const imageUrl = view === 1 
			? matchingBaseImage.view1Image 
			: view === 2 
				? matchingBaseImage.view2Image 
				: matchingBaseImage.view3Image
		
		if (imageUrl) {
			return resolveMediaUrl(imageUrl)
		}
		
		return undefined
	}

	const isStep4 = variant === 'final'
	const rootCls = isStep4 ? styles.step4Root : styles.preview
	const containerCls = isStep4 ? styles.step4Container : `${styles.previewContainer} ${layout === 'grid' ? styles.previewContainerGrid : styles.previewContainerFlex}`
	const viewCls = isStep4 ? styles.step4View : styles.previewView
	const baseImageCls = isStep4 ? styles.step4BaseImage : styles.baseImage
	const step4Overlay = isStep4
		? { base: styles.step4OverlayImage, active: styles.step4OverlayImageActive, exit: styles.step4OverlayImageExit }
		: undefined
	const frameCls = isStep4 ? styles.step4FrameOverlay : styles.frameOverlay

	return (
		<div className={`${rootCls} ${className || ''}`}>
			<div className={containerCls}>
			{/* View 1 */}
			<div className={viewCls}>
				<img 
					src={getBaseViewImage(1)} 
					alt="Strap view 1" 
					className={baseImageCls}
					loading="eager"
					decoding="async"
				/>
				{/* Overlay images — плавный переход при смене цвета (как на custom Vue) */}
				{selectedLeatherColor && <FadingOverlayImage url={getImageUrl('leather', 1)} loading="eager" overlayClasses={step4Overlay} />}
				{selectedStitchingColor && <FadingOverlayImage url={getImageUrl('stitching', 1)} loading="eager" overlayClasses={step4Overlay} />}
				{selectedEdgeColor && <FadingOverlayImage url={getImageUrl('edge', 1)} loading="eager" overlayClasses={step4Overlay} />}
				{selectedBuckleColor && <FadingOverlayImage url={getImageUrl('buckle', 1)} loading="eager" overlayClasses={step4Overlay} />}
				{selectedAdapterColor && <FadingOverlayImage url={getImageUrl('adapter', 1)} loading="eager" overlayClasses={step4Overlay} />}
				<FadingOverlayImage url={getFrameColorImage(1)} loading="eager" className={frameCls} overlayClasses={step4Overlay} />
			</div>

			{/* View 2 */}
			<div className={viewCls}>
				<img 
					src={getBaseViewImage(2)} 
					alt="Strap view 2" 
					className={baseImageCls}
					loading="lazy"
					decoding="async"
				/>
				{selectedLeatherColor && <FadingOverlayImage url={getImageUrl('leather', 2)} loading="lazy" overlayClasses={step4Overlay} />}
				{selectedStitchingColor && <FadingOverlayImage url={getImageUrl('stitching', 2)} loading="lazy" overlayClasses={step4Overlay} />}
				{selectedEdgeColor && <FadingOverlayImage url={getImageUrl('edge', 2)} loading="lazy" overlayClasses={step4Overlay} />}
				{selectedBuckleColor && <FadingOverlayImage url={getImageUrl('buckle', 2)} loading="lazy" overlayClasses={step4Overlay} />}
				{selectedAdapterColor && <FadingOverlayImage url={getImageUrl('adapter', 2)} loading="lazy" overlayClasses={step4Overlay} />}
				<FadingOverlayImage url={getFrameColorImage(2)} loading="lazy" className={frameCls} overlayClasses={step4Overlay} />
			</div>

			{/* View 3 */}
			<div className={viewCls}>
				<img 
					src={getBaseViewImage(3)} 
					alt="Strap view 3" 
					className={baseImageCls}
					loading="lazy"
					decoding="async"
				/>
				{selectedLeatherColor && <FadingOverlayImage url={getImageUrl('leather', 3)} loading="lazy" overlayClasses={step4Overlay} />}
				{selectedStitchingColor && <FadingOverlayImage url={getImageUrl('stitching', 3)} loading="lazy" overlayClasses={step4Overlay} />}
				{selectedEdgeColor && <FadingOverlayImage url={getImageUrl('edge', 3)} loading="lazy" overlayClasses={step4Overlay} />}
				{selectedBuckleColor && <FadingOverlayImage url={getImageUrl('buckle', 3)} loading="lazy" overlayClasses={step4Overlay} />}
				{selectedAdapterColor && <FadingOverlayImage url={getImageUrl('adapter', 3)} loading="lazy" overlayClasses={step4Overlay} />}
				<FadingOverlayImage url={getFrameColorImage(3)} loading="lazy" className={frameCls} overlayClasses={step4Overlay} />
			</div>
			</div>
		</div>
	)
})
