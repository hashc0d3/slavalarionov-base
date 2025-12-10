/**
 * Типы для configurator store
 * Вынесены в отдельный файл согласно FSD архитектуре
 */

export type StepKey = 'model' | 'strap' | 'strapDesign' | 'final'

export type FrameColorViewImages = {
	view1?: string
	view2?: string
	view3?: string
}

export type FrameColor = {
	colorId: number
	choosen: boolean
	view_images?: FrameColorViewImages
	color_name?: string
	color_code?: string
}

export type WatchSize = { 
	watch_size: string
	choosen: boolean 
}

export type WatchModel = {
	id?: number
	model_name: string
	watch_model_name: string
	watch_model_manufacturer?: string
	main_image?: string
	choosen: boolean
	watch_sizes: WatchSize[]
	frame_colors: FrameColor[]
	available_strap_ids?: number[]
}

export type StrapColorImages = {
	view1?: string
	view2?: string
	view3?: string
	icon?: string
	[key: string]: string | undefined
}

export type StrapColor = {
	color_title: string
	color_code?: string
	choosen: boolean
	price?: number
	images?: StrapColorImages
	view1?: string
	view2?: string
	view3?: string
	icon?: string
}

export type StrapParams = {
	leather_colors?: StrapColor[]
	stitching_colors?: StrapColor[]
	edge_colors?: StrapColor[]
	buckle_colors?: StrapColor[]
	adapter_colors?: StrapColor[]
	has_buckle_butterfly?: boolean
	view_images?: {
		view1?: string
		view2?: string
		view3?: string
	}
}

export type StrapBaseImage = {
	id: number
	colorId: number
	view1Image?: string
	view2Image?: string
	view3Image?: string
	color?: {
		id: number
		technical_name: string
		display_name: string
		hex_code: string
	}
}

export type Strap = {
	choosen: boolean
	dataFetched?: boolean
	attributes: {
		watch_strap: {
			id: number
			strap_name: string
			strap_title: string
			strap_description?: string
			strap_short_description?: string
			price: number
			preview_image?: string
			ultra_preview_image?: string
			has_buckle_butterfly?: boolean
			buckle_butterfly_choosen?: boolean
			buckle_butterfly_price?: number
			buckle_butterfly_image?: string
			strap_params: StrapParams
			base_images?: StrapBaseImage[]
		}
	}
}

export type Promo = {
	promoFound: boolean
	type: 'percent' | 'ruble'
	discountValue: number
	code: string
}

export type AdditionalOptionMedia = {
	data?: {
		attributes: {
			url: string
		}
	}
}

export type AdditionalOptionItem = {
	option_name: string
	option_title: string
	option_price: number
	option_image?: AdditionalOptionMedia
	choosen: boolean
}

export type AdditionalOptionPayload = {
	data: {
		attributes: {
			title: string
			description: string
			additional_options: AdditionalOptionItem[]
		}
	}
}


