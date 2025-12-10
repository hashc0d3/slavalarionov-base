/**
 * Компонент дополнительных опций финального шага
 * Рефакторинг по FSD архитектуре
 */

"use client"

import { observer } from 'mobx-react-lite'
import styles from '../FinalStepAdditional.module.css'
import { DEFAULT_OPTIONS } from './constants'
import { useFinalStepAdditionalAnimation } from './hooks/useFinalStepAdditionalAnimation'
import { useClickOutside } from './hooks/useClickOutside'
import { AdditionalOptionItem } from './components/AdditionalOptionItem'

interface FinalStepAdditionalProps {
	className?: string
}

export const FinalStepAdditional = observer(function FinalStepAdditional({ 
	className 
}: FinalStepAdditionalProps) {
	const additionalOptions = DEFAULT_OPTIONS
	const imagesRef = useFinalStepAdditionalAnimation()
	const containerRef = useClickOutside()

	return (
		<div ref={containerRef} className={`${styles.additional} ${className || ''}`}>
			{additionalOptions.map((option: any, index: number) => (
				<AdditionalOptionItem
					key={option.option_name}
					option={option}
					index={index}
					imageRef={(el) => { imagesRef.current[index] = el }}
				/>
			))}
		</div>
	)
})


