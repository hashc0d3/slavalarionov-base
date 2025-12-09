'use client'

import { SectionConfigurator } from '@/widgets/configurator/ui/SectionConfigurator'
import { configuratorStore } from '@/shared/store/configurator.store'
import { AdminButton } from '@/features/admin/ui/AdminButton'
import { useEffect } from 'react'

export function ConfiguratorClient() {
	useEffect(() => {
		// Загружаем данные из API при старте
		// Используем Promise.all для параллельной загрузки
		Promise.all([
			configuratorStore.loadWatchModelsFromAPI(),
			configuratorStore.loadWatchStrapsFromAPI(),
			configuratorStore.loadConfiguratorSettings()
		]).catch((error) => {
			console.error('Error loading configurator data:', error)
		})
	}, [])

	return (
		<>
			<AdminButton />
			<SectionConfigurator />
		</>
	)
}

