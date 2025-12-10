/**
 * Утилита для обработки клика по опции
 */

import { configuratorStore } from '@/shared/store/configurator.store'

export const handleOptionClick = (optionId: string) => {
	switch (optionId) {
		case 'initials':
			const initialsChosen = configuratorStore.steps.final.additionalOptions.initials.choosen
			const initialsText = configuratorStore.steps.final.additionalOptions.initials.text
			// Если опция выбрана И есть текст - очищаем текст и снимаем выбор
			if (initialsChosen && initialsText) {
				configuratorStore.setInitialsText('')
				configuratorStore.toggleInitials(false)
			} else if (!initialsChosen) {
				// Если опция не выбрана - включаем (фокус перейдет на поле ввода)
				configuratorStore.toggleInitials(true)
			}
			// Если опция выбрана, но текста нет - ничего не делаем (onBlur снимет выбор)
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
			} else if (!postCardChosen) {
				// Если опция не выбрана - включаем (фокус перейдет на поле ввода)
				configuratorStore.togglePostCard(true)
			}
			// Если опция выбрана, но текста нет - ничего не делаем (onBlur снимет выбор)
			break
	}
}


