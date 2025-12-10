/**
 * Утилита для загрузки изображения модели
 */

import type { WatchModel } from '@/shared/store/configurator.store'

export const handleImageUpload = (
	file: File | null,
	setFormData: React.Dispatch<React.SetStateAction<Partial<WatchModel>>>
) => {
	if (!file) return
	
	const reader = new FileReader()
	reader.onloadend = () => {
		setFormData((prev) => ({ ...prev, main_image: reader.result as string }))
	}
	reader.readAsDataURL(file)
}


