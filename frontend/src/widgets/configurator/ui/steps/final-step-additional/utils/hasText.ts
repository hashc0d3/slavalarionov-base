/**
 * Утилита для проверки наличия текста в опции
 */

import { configuratorStore } from '@/shared/store/configurator.store'

export const hasText = (optionName: string): boolean => {
	switch (optionName) {
		case 'initials':
			return !!configuratorStore.steps.final.additionalOptions.initials.text
		case 'postcard':
			return !!configuratorStore.steps.final.additionalOptions.postCard.text
		default:
			return false
	}
}


