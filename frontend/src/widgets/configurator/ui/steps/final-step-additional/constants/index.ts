/**
 * Константы для FinalStepAdditional
 */

export const DEFAULT_OPTIONS = [
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
] as const

export const OPTION_IMAGE_MAP: Record<string, string> = {
	'initials': '/additional-options/image-1.png',
	'present_box': '/additional-options/image-2.png',
	'postcard': '/additional-options/image-3.png'
}


