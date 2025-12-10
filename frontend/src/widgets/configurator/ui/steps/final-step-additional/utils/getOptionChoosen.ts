/**
 * Утилита для проверки выбранности опции
 */

import { configuratorStore } from '@/shared/store/configurator.store'

export const getOptionChoosen = (optionName: string): boolean => {
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


