export type DeliveryValue =
	| 'point-delivery'
	| 'parcel-locker-omnicdek'
	| 'cdek-door-delivery'
	| 'post-office'
	| 'city-courier-delivery'
	| 'self-pickup'

export interface DeliveryOption {
	value: DeliveryValue
	label: string
	time?: string
	price?: number
	priceFixed?: boolean
	note?: string
	requiresPvz?: boolean
	requiresCourierAddress?: boolean
	requiresMailAddress?: boolean
	tariffs?: number[]
}

