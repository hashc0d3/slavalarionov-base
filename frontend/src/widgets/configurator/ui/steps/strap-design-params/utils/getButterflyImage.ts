/**
 * Утилита для получения URL изображения пряжки-бабочки
 */

import { resolveMediaUrl } from '@/shared/lib/media'
import { DEFAULT_BUTTERFLY_IMAGE } from '../constants'

export const getButterflyImage = (butterflyImage?: string | null): string => {
	if (butterflyImage) {
		const resolved = resolveMediaUrl(butterflyImage)
		if (resolved) {
			return resolved
		}
	}
	return DEFAULT_BUTTERFLY_IMAGE
}


