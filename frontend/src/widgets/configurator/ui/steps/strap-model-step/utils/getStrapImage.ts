/**
 * Утилита для получения изображения ремешка
 */

export const getStrapImage = (strap: any, isUltra: boolean): string => {
	// Используем preview_image для отображения карточки ремешка на втором шаге
	if (!isUltra) {
		return strap.attributes.watch_strap.preview_image || '/window.svg'
	} else {
		return strap.attributes.watch_strap.ultra_preview_image || '/window.svg'
	}
}


