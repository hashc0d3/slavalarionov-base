"use client"

import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { configuratorStore } from '@/shared/store/configurator.store'
import styles from './FinalStepAdditional.module.css'
import gsap from 'gsap'

interface FinalStepAdditionalProps {
	className?: string
}

// Статичные дефолтные опции
const DEFAULT_OPTIONS = [
	{
		option_name: 'initials',
		option_title: 'Нанесение инициалов',
		option_price: 390,
		option_image: null
	},
	{
		option_name: 'present_box',
		option_title: 'Подарочная коробка',
		option_price: 300,
		option_image: null
	},
	{
		option_name: 'postcard',
		option_title: 'Подарочная открытка',
		option_price: 300,
		option_image: null
	}
]

export const FinalStepAdditional = observer(function FinalStepAdditional({ className }: FinalStepAdditionalProps) {
	// Всегда используем статичные опции
	const additionalOptions = DEFAULT_OPTIONS
	const imagesRef = useRef<(HTMLDivElement | null)[]>([])

	// Анимация при монтировании компонента
	useEffect(() => {
		const images = imagesRef.current.filter(Boolean)
		
		// Начальное состояние - изображения невидимы
		gsap.set(images, { 
			opacity: 0, 
			y: 30,
			scale: 0.95 
		})

		// Анимация появления с задержкой для каждого изображения
		gsap.to(images, {
			opacity: 1,
			y: 0,
			scale: 1,
			duration: 0.6,
			stagger: 0.15,
			ease: 'power2.out',
			delay: 0.2
		})
	}, [])

	// Локальные изображения для опций
	const getOptionImage = (optionName: string) => {
		const imageMap: Record<string, string> = {
			'initials': '/additional-options/image-1.png',
			'present_box': '/additional-options/image-2.png',
			'postcard': '/additional-options/image-3.png'
		}
		return imageMap[optionName] || '/additional-options/image-1.png'
	}

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
				const initialsChosen = configuratorStore.steps.final.additionalOptions.initials.choosen
				const initialsText = configuratorStore.steps.final.additionalOptions.initials.text
				// Если опция выбрана И есть текст - очищаем текст и снимаем выбор
				if (initialsChosen && initialsText) {
					configuratorStore.setInitialsText('')
					configuratorStore.toggleInitials(false)
				} else {
					// Если опция не выбрана или нет текста - включаем
					configuratorStore.toggleInitials(true)
				}
				break
			case 'present_box':
				configuratorStore.togglePresentBox(!configuratorStore.steps.final.additionalOptions.presentBox.choosen)
				break
			case 'postcard':
				const postCardChosen = configuratorStore.steps.final.additionalOptions.postCard.choosen
				const postCardText = configuratorStore.steps.final.additionalOptions.postCard.text
				// Если опция выбрана И есть текст - очищаем текст и снимаем выбор
				if (postCardChosen && postCardText) {
					configuratorStore.setPostCardText('')
					configuratorStore.togglePostCard(false)
				} else {
					// Если опция не выбрана или нет текста - включаем
					configuratorStore.togglePostCard(true)
				}
				break
		}
	}

	const handleInputChange = (optionId: string, value: string) => {
		switch (optionId) {
			case 'initials':
				configuratorStore.setInitialsText(value)
				// Автоматически активируем опцию при вводе текста
				if (value && !configuratorStore.steps.final.additionalOptions.initials.choosen) {
					configuratorStore.toggleInitials(true)
				}
				// Деактивируем опцию если текст пустой
				if (!value && configuratorStore.steps.final.additionalOptions.initials.choosen) {
					configuratorStore.toggleInitials(false)
				}
				break
			case 'postcard':
				configuratorStore.setPostCardText(value)
				// Автоматически активируем опцию при вводе текста
				if (value && !configuratorStore.steps.final.additionalOptions.postCard.choosen) {
					configuratorStore.togglePostCard(true)
				}
				// Деактивируем опцию если текст пустой
				if (!value && configuratorStore.steps.final.additionalOptions.postCard.choosen) {
					configuratorStore.togglePostCard(false)
				}
				break
		}
	}

	// Проверяем, есть ли текст в опции
	const hasText = (optionName: string) => {
		switch (optionName) {
			case 'initials':
				return !!configuratorStore.steps.final.additionalOptions.initials.text
			case 'postcard':
				return !!configuratorStore.steps.final.additionalOptions.postCard.text
			default:
				return false
		}
	}

	return (
		<div className={`${styles.additional} ${className || ''}`}>
			{additionalOptions.map((option: any, index: number) => {
				const isChoosen = getOptionChoosen(option.option_name)
				const hasValue = hasText(option.option_name) || (option.option_name === 'present_box' && isChoosen)
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
						
						<div className={styles.additionalOptionPlus}>
							{hasValue ? '×' : '+'}
						</div>
					</div>
				
				<div 
					ref={(el) => { imagesRef.current[index] = el }}
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
			})}
		</div>
	)
})
