/**
 * Утилита для обработки изменения ввода
 */

import { configuratorStore } from '@/shared/store/configurator.store'

export const handleInputChange = (optionId: string, value: string) => {
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


