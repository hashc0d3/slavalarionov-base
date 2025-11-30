declare global {
	interface Window {
		CDEKWidget: new (options: CDEKWidgetOptions) => CDEKWidgetInstance
	}
}

export interface CDEKWidgetOptions {
	from: string
	root: string
	apiKey: string
	postal_code?: number
	servicePath?: string
	defaultLocation?: string
	tariffs?: {
		office?: number[]
	}
	hideDeliveryOptions?: {
		office?: boolean
		door?: boolean
	}
	hideFilters?: {
		type?: boolean
	}
	onChoose?: (mode: any, tarif: any, address: CDEKWidgetPoint) => void
	onReady?: () => void
}

export interface CDEKWidgetPoint {
	name: string
	address: string
	work_time?: string
	city?: string
	code?: string
	coordX?: number
	coordY?: number
}

export interface CDEKWidgetInstance {
	updateLocation: (coords: [number, number]) => void
	destroy?: () => void
}

