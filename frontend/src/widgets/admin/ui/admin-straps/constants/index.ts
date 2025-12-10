/**
 * Константы для AdminStrapsMantine
 */

import type { Strap } from '@/shared/store/configurator.store'

export const INITIAL_FORM_DATA: Partial<Strap> = {
	attributes: {
		watch_strap: {
			id: 0,
			strap_name: '',
			strap_title: '',
			strap_description: '',
			strap_short_description: '',
			preview_image: '',
			ultra_preview_image: '',
			price: 0,
			has_buckle_butterfly: false,
			buckle_butterfly_price: 0,
			buckle_butterfly_image: '',
			strap_params: {
				leather_colors: [],
				stitching_colors: [],
				edge_colors: [],
				buckle_colors: [],
				adapter_colors: [],
				has_buckle_butterfly: false,
				view_images: {
					view1: '',
					view2: '',
					view3: ''
				}
			}
		}
	}
}


