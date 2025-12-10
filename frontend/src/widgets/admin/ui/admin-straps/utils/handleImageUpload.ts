/**
 * Утилита для загрузки изображения
 */

import type { Strap } from '@/shared/store/configurator.store'

export const handleImageUpload = (
	file: File | null,
	setFormData: React.Dispatch<React.SetStateAction<Partial<Strap>>>
) => {
	if (!file) return
	
	const reader = new FileReader()
	reader.onloadend = () => {
		const imageUrl = reader.result as string
		setFormData((prev) => ({
			attributes: {
				watch_strap: {
					...prev.attributes!.watch_strap,
					preview_image: imageUrl,
					ultra_preview_image: imageUrl
				}
			}
		}))
	}
	reader.readAsDataURL(file)
}


