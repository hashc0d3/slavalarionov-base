'use client'

import { SectionConfigurator } from '@/widgets/configurator/ui/SectionConfigurator'
import { configuratorStore } from '@/shared/store/configurator.store'
import { AdminButton } from '@/features/admin/ui/AdminButton'
import { useEffect } from 'react'

export default function Home() {
	useEffect(() => {
		// Загружаем данные из API при старте
		configuratorStore.loadWatchModelsFromAPI()
		configuratorStore.loadWatchStrapsFromAPI()
		configuratorStore.loadConfiguratorSettings()
	}, [])

	return (
		<>
			<AdminButton />
			<SectionConfigurator />
		</>
	)
}