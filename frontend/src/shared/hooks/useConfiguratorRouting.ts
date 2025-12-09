"use client"

import { useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { configuratorStore } from '@/shared/store/configurator.store'

/**
 * Хук для синхронизации URL с состоянием конфигуратора
 * Обеспечивает навигацию через browser back/forward
 */
export function useConfiguratorRouting() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const isUpdatingFromUrl = useRef(false)
	const isUpdatingFromStore = useRef(false)

	// Получить queryParam для шага по ID
	const getStepQueryParam = useCallback((stepId: number): string | null => {
		const steps = configuratorStore.steps
		for (const key in steps) {
			if (steps[key].id === stepId) {
				return steps[key].queryParam
			}
		}
		return null
	}, [])

	// Получить stepId по queryParam
	const getStepIdByQueryParam = useCallback((queryParam: string | null): number | null => {
		if (!queryParam) return null
		const steps = configuratorStore.steps
		for (const key in steps) {
			if (steps[key].queryParam === queryParam) {
				return steps[key].id
			}
		}
		return null
	}, [])

	// Обновить URL при изменении шага
	const updateUrlFromStep = useCallback((stepId: number) => {
		if (isUpdatingFromUrl.current) return // Предотвращаем цикл
		
		const queryParam = getStepQueryParam(stepId)
		if (queryParam) {
			const currentStep = searchParams.get('step')
			if (currentStep !== queryParam) {
				isUpdatingFromStore.current = true
				router.push(`${pathname}?step=${queryParam}`, { scroll: false })
				// Сбрасываем флаг после небольшой задержки
				setTimeout(() => {
					isUpdatingFromStore.current = false
				}, 100)
			}
		}
	}, [router, searchParams, pathname, getStepQueryParam])

	// Обновить шаг из URL
	const updateStepFromUrl = useCallback(() => {
		if (isUpdatingFromStore.current) return // Предотвращаем цикл
		
		const stepParam = searchParams.get('step')
		if (stepParam) {
			const stepId = getStepIdByQueryParam(stepParam)
			if (stepId && stepId !== configuratorStore.currentStepNum) {
				// Проверяем, можем ли перейти на этот шаг
				if (stepId <= configuratorStore.currentAvailableStep) {
					isUpdatingFromUrl.current = true
					configuratorStore.currentStepNum = stepId
					// Сбрасываем флаг после небольшой задержки
					setTimeout(() => {
						isUpdatingFromUrl.current = false
					}, 100)
				}
			}
		} else {
			// Если нет параметра step, устанавливаем первый шаг
			if (configuratorStore.currentStepNum !== 1) {
				isUpdatingFromUrl.current = true
				configuratorStore.currentStepNum = 1
				setTimeout(() => {
					isUpdatingFromUrl.current = false
				}, 100)
			}
		}
	}, [searchParams, getStepIdByQueryParam])

	// Навигация на шаг
	const navigateToStep = useCallback((stepId: number) => {
		if (stepId <= configuratorStore.currentAvailableStep) {
			configuratorStore.currentStepNum = stepId
			updateUrlFromStep(stepId)
		}
	}, [updateUrlFromStep])

	// Инициализация: синхронизация при первой загрузке
	useEffect(() => {
		const stepParam = searchParams.get('step')
		if (!stepParam) {
			// Если нет параметра step, устанавливаем URL для текущего шага
			updateUrlFromStep(configuratorStore.currentStepNum)
		} else {
			// Если есть параметр, синхронизируем состояние
			updateStepFromUrl()
		}
	}, []) // Только при монтировании

	// Синхронизация шага при изменении URL (browser back/forward)
	useEffect(() => {
		if (!isUpdatingFromStore.current) {
			updateStepFromUrl()
		}
	}, [searchParams, updateStepFromUrl])

	// Синхронизация URL при изменении currentStepNum (только если не обновляется из URL)
	useEffect(() => {
		if (!isUpdatingFromUrl.current && !isUpdatingFromStore.current) {
			updateUrlFromStep(configuratorStore.currentStepNum)
		}
	}, [configuratorStore.currentStepNum, updateUrlFromStep])

	return {
		navigateToStep,
		getStepQueryParam,
		getStepIdByQueryParam
	}
}

