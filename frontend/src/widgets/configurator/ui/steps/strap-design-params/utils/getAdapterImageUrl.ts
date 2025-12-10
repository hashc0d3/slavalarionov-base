/**
 * Утилита для получения URL изображения адаптера
 */

import { resolveMediaUrl } from '@/shared/lib/media'
import type { StrapColor } from '@/shared/store/configurator.store'
import { BASE_IMAGE_URL, ADAPTER_COLOR_MAPPING } from '../constants'

export const getAdapterImageUrl = (color: StrapColor): string => {
	const icon = resolveMediaUrl(color.images?.icon || color.icon)
	if (icon) {
		return icon
	}

	const dynamic = resolveMediaUrl(color.images?.view1 || color.view1)

	if (dynamic) {
		return dynamic
	}

	const colorInfo = ADAPTER_COLOR_MAPPING[color.color_title] || { 
		name: color.color_title.toLowerCase(), 
		hash: '1fd6eb2557' 
	}
	return `${BASE_IMAGE_URL}/adapter_${colorInfo.name}_${colorInfo.hash}.png`
}


