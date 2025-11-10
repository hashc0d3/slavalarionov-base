const API_URL = '/api/configurator/settings'

export interface ConfiguratorOption {
	id: number
	option_name: string
	option_title: string
	option_price: number
	option_image?: string | null
	sort_order: number
}

export interface ConfiguratorSettingsResponse {
	id: number | null
	title: string
	description: string
	options: ConfiguratorOption[]
}

export const configuratorApi = {
	async getSettings(): Promise<ConfiguratorSettingsResponse> {
		const response = await fetch(API_URL)
		if (!response.ok) {
			throw new Error('Failed to fetch configurator settings')
		}
		return response.json()
	}
}

