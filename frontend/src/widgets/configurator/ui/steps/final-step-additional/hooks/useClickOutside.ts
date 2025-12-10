/**
 * Хук для обработки кликов вне контейнера
 */

import { useEffect, useRef } from 'react'
import { configuratorStore } from '@/shared/store/configurator.store'

export function useClickOutside() {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!containerRef.current) return
			
			// Проверяем, был ли клик вне контейнера
			if (!containerRef.current.contains(event.target as Node)) {
				// Проверяем инициалы
				const initialsChosen = configuratorStore.steps.final.additionalOptions.initials.choosen
				const initialsText = configuratorStore.steps.final.additionalOptions.initials.text
				if (initialsChosen && (!initialsText || initialsText.trim() === '')) {
					configuratorStore.setInitialsText('')
					configuratorStore.toggleInitials(false)
				}

				// Проверяем открытку
				const postCardChosen = configuratorStore.steps.final.additionalOptions.postCard.choosen
				const postCardText = configuratorStore.steps.final.additionalOptions.postCard.text
				if (postCardChosen && (!postCardText || postCardText.trim() === '')) {
					configuratorStore.setPostCardText('')
					configuratorStore.togglePostCard(false)
				}
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return containerRef
}


