const BASE_URL = '/api/delivery'

export interface CdekCity {
	cityName: string
	cityCode: number
	cityUuid: string
	country: string
	countryCode: string
	region: string
	subRegion?: string
	regionCode?: number
	latitude?: number
	longitude?: number
	kladr?: string
}

export interface CdekPvz {
	code: string
	name: string
	address: string
	addressComment?: string
	type: string
	city: string
	cityCode: number
	workTime?: string
	postalCode?: string
	phone?: string
	phoneDetails?: string
	coordX?: number
	coordY?: number
}

export interface CdekCalculation {
	price: number
	minDays: number
	tariffId: number
}

export interface DadataSuggestion {
	value: string
	unrestricted_value: string
	data: Record<string, any>
}

async function handleResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		let message = 'Network request failed'
		let errorDetails: any = null
		try {
			const error = await response.json()
			if (error?.message) message = error.message
			errorDetails = error
		} catch {
			// ignore
		}
		
		// Логируем ошибку в консоль для отладки
		console.error(`API Error [${response.status}]:`, {
			url: response.url,
			status: response.status,
			statusText: response.statusText,
			message,
			errorDetails,
		})
		
		throw new Error(message)
	}
	return response.json() as Promise<T>
}

export const deliveryApi = {
	async searchCities(query: string): Promise<CdekCity[]> {
		if (!query?.trim()) return []
		const response = await fetch(`${BASE_URL}/cdek/cities`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query })
		})
		return handleResponse<CdekCity[]>(response)
	},

	async getPvzList(cityCode: number): Promise<CdekPvz[]> {
		if (!cityCode) return []
		const response = await fetch(`${BASE_URL}/cdek/pvz`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ cityCode })
		})
		return handleResponse<CdekPvz[]>(response)
	},

	async calculateTariffs(cityCode: number): Promise<CdekCalculation[]> {
		if (!cityCode) return []
		const response = await fetch(`${BASE_URL}/cdek/calc`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ cityCode })
		})
		return handleResponse<CdekCalculation[]>(response)
	},

	async searchStreets(query: string, cityName: string): Promise<DadataSuggestion[]> {
		if (!query?.trim()) return []
		const response = await fetch(`${BASE_URL}/address/streets`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query, cityName })
		})
		return handleResponse<DadataSuggestion[]>(response)
	},

	async searchBuildings(streetFiasId: string, query: string): Promise<DadataSuggestion[]> {
		if (!streetFiasId || !query?.trim()) return []
		const response = await fetch(`${BASE_URL}/address/buildings`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ streetFiasId, query })
		})
		return handleResponse<DadataSuggestion[]>(response)
	}
}


