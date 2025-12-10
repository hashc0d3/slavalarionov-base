/**
 * Компонент элемента дополнительной опции
 */

"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import styles from '../../FinalStepAdditional.module.css'
import { getOptionImage } from '../utils/getOptionImage'
import { getOptionChoosen } from '../utils/getOptionChoosen'
import { hasText } from '../utils/hasText'
import { handleOptionClick } from '../utils/handleOptionClick'
import { handleInputChange } from '../utils/handleInputChange'
import { handleInputBlur } from '../utils/handleInputBlur'

interface AdditionalOptionItemProps {
	option: {
		option_name: string
		option_title: string
		option_price: number
		option_image: any
	}
	index: number
	imageRef: (el: HTMLDivElement | null) => void
}

export const AdditionalOptionItem = observer(function AdditionalOptionItem({
	option,
	index,
	imageRef
}: AdditionalOptionItemProps) {
	const isChoosen = getOptionChoosen(option.option_name)
	const hasValue = hasText(option.option_name) || (option.option_name === 'present_box' && isChoosen)

	return (
		<div
			className={`${styles.additionalOption} ${isChoosen ? styles.choosen : ''} ${(option.option_name === 'initials' || option.option_name === 'postcard') ? styles.captionOption : ''}`}
		>
			<div
				className={styles.additionalOptionField}
				onClick={() => handleOptionClick(option.option_name)}
			>
				<div className={styles.additionalOptionInner}>
					<div className={styles.additionalOptionTitle}>
						{option.option_title}
					</div>
					<div className={styles.additionalOptionPrice}>
						+ {option.option_price}₽
					</div>
				</div>
				
				{option.option_name === 'initials' && (
					<input
						className={styles.captionOptionInput}
						placeholder="А.А."
						maxLength={4}
						value={configuratorStore.steps.final.additionalOptions.initials.text || ''}
						onChange={(e) => handleInputChange(option.option_name, e.target.value)}
						onBlur={() => handleInputBlur(option.option_name)}
						onClick={(e) => e.stopPropagation()}
					/>
				)}
				
				{option.option_name === 'postcard' && (
					<textarea
						className={`${styles.captionOptionInput} ${styles.postCardInput}`}
						placeholder="Надпись"
						value={configuratorStore.steps.final.additionalOptions.postCard.text || ''}
						onChange={(e) => handleInputChange(option.option_name, e.target.value)}
						onBlur={() => handleInputBlur(option.option_name)}
						onClick={(e) => e.stopPropagation()}
					/>
				)}
				
				<div className={styles.additionalOptionPlus}>
					{hasValue ? '×' : '+'}
				</div>
			</div>
		
			<div 
				ref={imageRef}
				className={styles.additionalOptionImageInner}
			>
				<img
					src={getOptionImage(option.option_name)}
					alt={option.option_title}
					className={styles.additionalOptionImage}
				/>
			</div>
		</div>
	)
})


