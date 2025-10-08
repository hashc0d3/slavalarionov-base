"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import styles from './StrapDesignPreview.module.css'

interface StrapDesignPreviewProps {
	className?: string
	variant?: 'default' | 'final'
	layout?: 'grid' | 'flex'
}

export const StrapDesignPreview = observer(function StrapDesignPreview({ className, variant = 'default', layout = 'flex' }: StrapDesignPreviewProps) {
	const selectedStrapModel = configuratorStore.selectedStrapModel
	const selectedFrameColor = configuratorStore.selectedFrameColor
	const selectedLeatherColor = configuratorStore.selectedLeatherColor
	const selectedStitchingColor = configuratorStore.selectedStitchingColor
	const selectedEdgeColor = configuratorStore.selectedEdgeColor
	const selectedBuckleColor = configuratorStore.selectedBuckleColor
	const selectedAdapterColor = configuratorStore.selectedAdapterColor

	if (!selectedStrapModel) {
		return null
	}

	const strapData = selectedStrapModel.attributes.watch_strap

	// Real image URLs from the provided HTML
	const baseImageUrl = 'https://api.slavalarionov.store/uploads'
	
	// Генерируем URL для изображений на основе выбранных цветов
	const getImageUrl = (type: string, view: number) => {
		const colorName = type === 'leather' ? selectedLeatherColor?.color_title?.toLowerCase() || 'white' :
			type === 'stitching' ? selectedStitchingColor?.color_title?.toLowerCase() || 'white' :
			type === 'edge' ? selectedEdgeColor?.color_title?.toLowerCase() || 'white' :
			type === 'buckle' ? selectedBuckleColor?.color_title?.toLowerCase() || 'silver' :
			type === 'adapter' ? selectedAdapterColor?.color_title?.toLowerCase() || 'silver' : 'white'
		
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
				'зелёный': '26a256f55a'
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
			'зелёный': 'green'
		}
		
		const mappedColor = colorMapping[colorName] || colorName
		const hash = getColorHash(colorName, type, view)
		
		// Для разных типов ремешков используются разные префиксы
		if (strapData.strap_name === 'brogue') {
			return `${baseImageUrl}/${type}_brogue_${mappedColor}_${view}_${hash}.png`
		} else {
			return `${baseImageUrl}/${type}_classic_${mappedColor}_${view}_${hash}.png`
		}
	}

	// Получаем URL для изображения корпуса часов
	const getWatchImageUrl = (view: number) => {
		const frameColor = selectedFrameColor?.color_name?.toLowerCase() || 'starlight'
		
		const getWatchHash = (color: string, viewNum: number) => {
			const hashes: Record<string, Record<number, string>> = {
				'silver': { 1: 'c934eac370', 2: 'e0541c47ae', 3: 'e0541c47ae' },
				'black': { 1: '4487db25f0', 2: 'f0755d2934', 3: 'f0755d2934' },
				'red': { 1: '71beb18575', 2: '0e42bec469', 3: '0e42bec469' },
				'blue': { 1: '2a5db7479a', 2: '8eac170faa', 3: '8eac170faa' },
				'green': { 1: 'ade7cd8b2b', 2: '44d4c02d5d', 3: '44d4c02d5d' },
				'starlight': { 1: 'ad610ff403', 2: '8c161b111d', 3: '8c161b111d' }
			}
			return hashes[color]?.[viewNum] || hashes['starlight'][viewNum]
		}
		
		const colorMapping: Record<string, string> = {
			'silver': 'silver',
			'black': 'midnight',
			'red': 'red',
			'blue': 'blue',
			'green': 'green',
			'starlight': 'starlight'
		}
		
		const mappedColor = colorMapping[frameColor] || 'starlight'
		const hash = getWatchHash(mappedColor, view)
		
		return `${baseImageUrl}/watch_classic_${mappedColor}_${view}_${hash}.png`
	}

	return (
		<div className={`${variant === 'final' ? styles.previewFinal : styles.preview} ${className || ''}`}>
			<div className={`${styles.previewContainer} ${layout === 'grid' ? styles.previewContainerGrid : styles.previewContainerFlex}`}>
				{/* View 1 */}
				<div className={styles.previewView}>
					<img 
						src={`${baseImageUrl}/base_${strapData.strap_name}_1_739ae2aa10.png`} 
						alt="Strap view 1" 
						className={styles.baseImage}
					/>
					{/* Watch frame color */}
					{selectedFrameColor && (
						<img 
							src={getWatchImageUrl(1)} 
							alt="Watch frame" 
							className={styles.overlayImage}
						/>
					)}
					{/* Overlay images for different parts */}
					{selectedLeatherColor && (
						<img 
							src={getImageUrl('leather', 1)} 
							alt="Leather color" 
							className={styles.overlayImage}
						/>
					)}
					{selectedStitchingColor && (
						<img 
							src={getImageUrl('stitching', 1)} 
							alt="Stitching color" 
							className={styles.overlayImage}
						/>
					)}
					{selectedEdgeColor && (
						<img 
							src={getImageUrl('edge', 1)} 
							alt="Edge color" 
							className={styles.overlayImage}
						/>
					)}
					{selectedBuckleColor && (
						<img 
							src={getImageUrl('buckle', 1)} 
							alt="Buckle color" 
							className={styles.overlayImage}
						/>
					)}
					{selectedAdapterColor && (
						<img 
							src={getImageUrl('adapter', 1)} 
							alt="Adapter color" 
							className={styles.overlayImage}
						/>
					)}
				</div>

				{/* View 2 */}
				<div className={styles.previewView}>
					<img 
						src={`${baseImageUrl}/base_${strapData.strap_name}_2_26fa993a75.png`} 
						alt="Strap view 2" 
						className={styles.baseImage}
					/>
					{/* Watch frame color */}
					{selectedFrameColor && (
						<img 
							src={getWatchImageUrl(2)} 
							alt="Watch frame" 
							className={styles.overlayImage}
						/>
					)}
					{selectedLeatherColor && (
						<img 
							src={getImageUrl('leather', 2)} 
							alt="Leather color" 
							className={styles.overlayImage}
						/>
					)}
					{selectedStitchingColor && (
						<img 
							src={getImageUrl('stitching', 2)} 
							alt="Stitching color" 
							className={styles.overlayImage}
						/>
					)}
					{selectedEdgeColor && (
						<img 
							src={getImageUrl('edge', 2)} 
							alt="Edge color" 
							className={styles.overlayImage}
						/>
					)}
					{selectedBuckleColor && (
						<img 
							src={getImageUrl('buckle', 2)} 
							alt="Buckle color" 
							className={styles.overlayImage}
						/>
					)}
					{selectedAdapterColor && (
						<img 
							src={getImageUrl('adapter', 2)} 
							alt="Adapter color" 
							className={styles.overlayImage}
						/>
					)}
				</div>

				{/* View 3 */}
				<div className={styles.previewView}>
					<img 
						src={`${baseImageUrl}/base_${strapData.strap_name}_3_50228196b7.png`} 
						alt="Strap view 3" 
						className={styles.baseImage}
					/>
					{/* Watch frame color */}
					{selectedFrameColor && (
						<img 
							src={getWatchImageUrl(3)} 
							alt="Watch frame" 
							className={styles.overlayImage}
						/>
					)}
					{selectedLeatherColor && (
						<img 
							src={getImageUrl('leather', 3)} 
							alt="Leather color" 
							className={styles.overlayImage}
						/>
					)}
					{selectedStitchingColor && (
						<img 
							src={getImageUrl('stitching', 3)} 
							alt="Stitching color" 
							className={styles.overlayImage}
						/>
					)}
					{selectedEdgeColor && (
						<img 
							src={getImageUrl('edge', 3)} 
							alt="Edge color" 
							className={styles.overlayImage}
						/>
					)}
					{selectedBuckleColor && (
						<img 
							src={getImageUrl('buckle', 3)} 
							alt="Buckle color" 
							className={styles.overlayImage}
						/>
					)}
					{selectedAdapterColor && (
						<img 
							src={getImageUrl('adapter', 3)} 
							alt="Adapter color" 
							className={styles.overlayImage}
						/>
					)}
				</div>
			</div>
		</div>
	)
})
