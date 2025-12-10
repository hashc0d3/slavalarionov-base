/**
 * Утилита для получения конфигурации параметров
 */

import type { StrapParams } from '@/shared/store/configurator.store'
import { configuratorStore } from '@/shared/store/configurator.store'

export type ParamConfig = {
	id: number
	title: string
	paramName: string
	colors: any[]
	func: (title: string) => void
	hasButterflyBuckle?: boolean
}

export const getParamConfigs = (params: StrapParams): ParamConfig[] => {
	return [
		{
			id: 1,
			title: 'Цвет кожи',
			paramName: 'leather_color',
			colors: params.leather_colors ?? [],
			func: (title: string) => configuratorStore.chooseStrapLeatherColor(title)
		},
		{
			id: 2,
			title: 'Цвет строчки',
			paramName: 'stitching_color',
			colors: params.stitching_colors ?? [],
			func: (title: string) => configuratorStore.chooseStitchingColor(title)
		},
		{
			id: 3,
			title: 'Цвет края',
			paramName: 'edge_color',
			colors: params.edge_colors ?? [],
			func: (title: string) => configuratorStore.chooseEdgeColor(title)
		},
		{
			id: 4,
			title: 'Цвет пряжки',
			paramName: 'buckle_color',
			colors: params.buckle_colors ?? [],
			func: (title: string) => configuratorStore.chooseBuckleColor(title),
			hasButterflyBuckle: params.has_buckle_butterfly
		},
		{
			id: 5,
			title: 'Цвет адаптеров',
			paramName: 'adapter_color',
			colors: params.adapter_colors ?? [],
			func: (title: string) => configuratorStore.chooseAdapterColor(title)
		}
	]
}


