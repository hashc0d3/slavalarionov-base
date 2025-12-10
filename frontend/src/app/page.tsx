import { ConfiguratorClient } from '@/widgets/configurator/ui/ConfiguratorClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Создай уникальный ремешок для своих Apple Watch | Slava Larionov',
	description: 'Конфигуратор ремешков для Apple Watch. Выберите модель часов, ремешок и персонализируйте его по своему вкусу.',
}

// Server Component - загружаем данные на сервере для SSR
async function getInitialData() {
	try {
		// В серверном компоненте Next.js используем абсолютный URL
		// Так как Next.js работает через NestJS middleware, API доступно на том же хосте
		const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
			(process.env.NODE_ENV === 'production' 
				? 'http://localhost:8081' 
				: 'http://localhost:8081')
		
		const [modelsResponse, strapsResponse, settingsResponse] = await Promise.allSettled([
			fetch(`${baseUrl}/api/watch-models`, { 
				// Кэшируем на 60 секунд для ускорения, затем ревалидируем в фоне
				next: { revalidate: 60 },
				headers: {
					'Accept': 'application/json',
				}
			}),
			fetch(`${baseUrl}/api/watch-straps`, { 
				// Кэшируем на 60 секунд
				next: { revalidate: 60 },
				headers: {
					'Accept': 'application/json',
				}
			}),
			fetch(`${baseUrl}/api/configurator/settings`, { 
				// Настройки могут меняться чаще, кэшируем на 30 секунд
				next: { revalidate: 30 },
				headers: {
					'Accept': 'application/json',
				}
			})
		])

		const models = modelsResponse.status === 'fulfilled' && modelsResponse.value.ok
			? await modelsResponse.value.json()
			: []
		
		const straps = strapsResponse.status === 'fulfilled' && strapsResponse.value.ok
			? await strapsResponse.value.json()
			: []
		
		const settings = settingsResponse.status === 'fulfilled' && settingsResponse.value.ok
			? await settingsResponse.value.json()
			: null

		return {
			models: Array.isArray(models) ? models : [],
			straps: Array.isArray(straps) ? straps : [],
			settings: settings && typeof settings === 'object' ? settings : null
		}
	} catch (error) {
		// В SSR ошибки логируем, но не прерываем рендеринг
		console.error('[SSR] Error fetching initial data:', error)
		return {
			models: [],
			straps: [],
			settings: null
		}
	}
}

export default async function Home() {
	// Загружаем данные на сервере для SSR
	const initialData = await getInitialData()
	
	return <ConfiguratorClient initialData={initialData} />
}
