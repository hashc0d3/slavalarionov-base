/**
 * Утилита для обработки потери фокуса
 */

import { configuratorStore } from '@/shared/store/configurator.store'

export const handleInputBlur = (optionId: string) => {
	switch (optionId) {
		case 'initials':
			// При потере фокуса, если поле пустое - снимаем выбор
			const initialsText = configuratorStore.steps.final.additionalOptions.initials.text
			if (!initialsText || initialsText.trim() === '') {
				configuratorStore.setInitialsText('')
				configuratorStore.toggleInitials(false)
			}
			break
		case 'postcard':
			// При потере фокуса, если поле пустое - снимаем выбор
			const postCardText = configuratorStore.steps.final.additionalOptions.postCard.text
			if (!postCardText || postCardText.trim() === '') {
				configuratorStore.setPostCardText('')
				configuratorStore.togglePostCard(false)
			}
			break
	}
}


