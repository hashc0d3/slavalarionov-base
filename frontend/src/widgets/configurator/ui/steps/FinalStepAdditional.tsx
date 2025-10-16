"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import styles from './FinalStepAdditional.module.css'

interface FinalStepAdditionalProps {
	className?: string
}

export const FinalStepAdditional = observer(function FinalStepAdditional({ className }: FinalStepAdditionalProps) {
	const additionalOptions = configuratorStore.additionalOption?.data.attributes.additional_options || []

	const getOptionChoosen = (optionName: string) => {
		switch (optionName) {
			case 'initials':
				return configuratorStore.steps.final.additionalOptions.initials.choosen
			case 'present_box':
				return configuratorStore.steps.final.additionalOptions.presentBox.choosen
			case 'postcard':
				return configuratorStore.steps.final.additionalOptions.postCard.choosen
			default:
				return false
		}
	}

	const handleOptionClick = (optionId: string) => {
		switch (optionId) {
			case 'initials':
				configuratorStore.toggleInitials(!configuratorStore.steps.final.additionalOptions.initials.choosen)
				break
			case 'present_box':
				configuratorStore.togglePresentBox(!configuratorStore.steps.final.additionalOptions.presentBox.choosen)
				break
			case 'postcard':
				configuratorStore.togglePostCard(!configuratorStore.steps.final.additionalOptions.postCard.choosen)
				break
		}
	}

	const handleInputChange = (optionId: string, value: string) => {
		switch (optionId) {
			case 'initials':
				configuratorStore.setInitialsText(value)
				break
			case 'postcard':
				configuratorStore.setPostCardText(value)
				break
		}
	}

	return (
		<div className={`${styles.additional} ${className || ''}`}>
			{additionalOptions.map((option: any) => {
				const isChoosen = getOptionChoosen(option.option_name)
				return (
				<div
					key={option.option_name}
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
								onClick={(e) => e.stopPropagation()}
							/>
						)}
						
						{option.option_name === 'postcard' && (
							<textarea
								className={`${styles.captionOptionInput} ${styles.postCardInput}`}
								placeholder="Надпись"
								value={configuratorStore.steps.final.additionalOptions.postCard.text || ''}
								onChange={(e) => handleInputChange(option.option_name, e.target.value)}
								onClick={(e) => e.stopPropagation()}
							/>
						)}
						
						<div className={styles.additionalOptionPlus}>+</div>
					</div>
					
					<div className={styles.additionalOptionImageInner}>
						<img
							src={`https://api.slavalarionov.store${option.option_image.data.attributes.url}`}
							alt={option.option_title}
							className={styles.additionalOptionImage}
						/>
					</div>
				</div>
				)
			})}
		</div>
	)
})
