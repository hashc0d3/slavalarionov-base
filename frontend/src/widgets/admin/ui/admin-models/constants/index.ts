/**
 * Константы для AdminModelsMantine
 */

import type { WatchModel } from '@/shared/store/configurator.store'

export const INITIAL_FORM_DATA: Partial<WatchModel> = {
	model_name: '',
	watch_model_name: '',
	watch_model_manufacturer: '',
	main_image: '',
	watch_sizes: [],
	frame_colors: [],
	available_strap_ids: []
}


