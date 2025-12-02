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
	estimated_date?: string | null
	options: ConfiguratorOption[]
}

export const configuratorApi = {
	async getSettings(): Promise<ConfiguratorSettingsResponse> {
		const response = await fetch(API_URL)
		if (!response.ok) {
			throw new Error('Failed to fetch configurator settings')
		}
		return response.json()
	},

	async updateSettings(data: Partial<ConfiguratorSettingsResponse>): Promise<ConfiguratorSettingsResponse> {
		const response = await fetch(API_URL, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		})
		if (!response.ok) {
			throw new Error('Failed to update configurator settings')
		}
		return response.json()
	}
}

