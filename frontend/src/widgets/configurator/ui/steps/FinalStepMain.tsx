"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import styles from './FinalStepMain.module.css'
import { StrapDesignPreview } from './StrapDesignPreview'

interface FinalStepMainProps {
	className?: string
}

export const FinalStepMain = observer(function FinalStepMain({ className }: FinalStepMainProps) {
	const handleDownloadRender = () => {
		// TODO: Implement render download functionality
		console.log('Downloading render...')
	}

	const additionalOption = configuratorStore.additionalOption

	return (
		<div className={`${styles.main} ${className || ''}`}>
			<div className={styles.mainData}>
				<h3 className={styles.mainTitle}>
					{additionalOption?.data.attributes.title || 'Ремешок почти готов!'}
				</h3>
				<p className={styles.mainDescription}>
					{additionalOption?.data.attributes.description || 'Вы создали уникальный ремешок и он просто прекрасен! Сейчас вы можете добавить инициалы (2-3 буквы на русском или английском языке), добавить подарочную упаковку и подписать открытку, которую мы приложим к этому ремешку.'}
				</p>
				<div className={styles.mainLoadRender} onClick={handleDownloadRender}>
					<button className={styles.mainLoadRenderBtn}>+</button>
					<p className={styles.mainLoadRenderText}>
						Скачайте рендер вашего будущего ремешка
					</p>
				</div>
			</div>
			<div className={styles.mainDesign}>
				<StrapDesignPreview className={styles.mainDesignPreview} variant="final" layout="flex" />
			</div>
		</div>
	)
})
