/**
 * Утилита для получения изображения опции
 */

import { OPTION_IMAGE_MAP } from '../constants'

export const getOptionImage = (optionName: string): string => {
	return OPTION_IMAGE_MAP[optionName] || '/additional-options/image-1.png'
}


