import { ConfiguratorClient } from '@/widgets/configurator/ui/ConfiguratorClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Создай уникальный ремешок для своих Apple Watch | Slava Larionov',
	description: 'Конфигуратор ремешков для Apple Watch. Выберите модель часов, ремешок и персонализируйте его по своему вкусу.',
}

export default function Home() {
	return <ConfiguratorClient />
}