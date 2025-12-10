/**
 * Компонент параметров дизайна ремешка
 * Рефакторинг по FSD архитектуре
 */

"use client"

import { observer } from 'mobx-react-lite'
import type { StrapParams } from '@/shared/store/configurator.store'
import styles from '../StrapDesignParams.module.css'
import { StrapDesignParamItem } from './components/StrapDesignParamItem'
import { getParamConfigs } from './utils/getParamConfigs'

interface StrapDesignParamsProps {
	params: StrapParams
	selectedStrapModel: any
}

export const StrapDesignParams = observer(function StrapDesignParams({ 
	params, 
	selectedStrapModel 
}: StrapDesignParamsProps) {
	const paramConfigs = getParamConfigs(params)

	return (
		<div className={styles.params}>
			{paramConfigs.map((config) => (
				<StrapDesignParamItem
					key={config.id}
					id={config.id}
					paramsAmount={paramConfigs.length}
					paramTitle={config.title}
					paramName={config.paramName}
					colors={config.colors}
					func={config.func}
					hasButterflyBuckle={config.hasButterflyBuckle}
				/>
			))}
		</div>
	)
})


