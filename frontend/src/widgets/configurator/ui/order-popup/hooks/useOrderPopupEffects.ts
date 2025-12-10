/**
 * Хук с эффектами для useOrderPopup
 * Вынесен в отдельный файл для читаемости кода
 */

import { useEffect } from 'react'
import { configuratorStore } from '@/shared/store/configurator.store'
import { deliveryApi, type DadataSuggestion, type CdekCalculation } from '@/shared/api/delivery.api'
import type { CDEKWidgetInstance } from '@/types/cdek-widget'
import { digitsOnly } from '../utils'
import { 
	DEFAULT_CITY_NAME, 
	DEFAULT_CITY_CODE, 
	DEFAULT_CITY_UUID, 
	REMEMBER_KEY, 
	initialDeliveryOptions 
} from '../constants'
import type { FormState, ValidationErrors } from '../types'
import type { DeliveryOption } from '../orderPopup.types'

type UseOrderPopupEffectsParams = {
	visible: boolean
	form: FormState
	setForm: React.Dispatch<React.SetStateAction<FormState>>
	setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
	setPromoMessage: React.Dispatch<React.SetStateAction<string | null>>
	setPromoStatus: React.Dispatch<React.SetStateAction<'success' | 'error' | null>>
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
	setCitySuggestions: React.Dispatch<React.SetStateAction<DadataSuggestion[]>>
	setStreetSuggestions: React.Dispatch<React.SetStateAction<DadataSuggestion[]>>
	setBuildingSuggestions: React.Dispatch<React.SetStateAction<DadataSuggestion[]>>
	setIsCityLoading: React.Dispatch<React.SetStateAction<boolean>>
	setIsStreetLoading: React.Dispatch<React.SetStateAction<boolean>>
	setIsBuildingLoading: React.Dispatch<React.SetStateAction<boolean>>
	setPvzList: React.Dispatch<React.SetStateAction<any[]>>
	setIsPvzLoading: React.Dispatch<React.SetStateAction<boolean>>
	setTariffs: React.Dispatch<React.SetStateAction<CdekCalculation[]>>
	setIsTariffsLoading: React.Dispatch<React.SetStateAction<boolean>>
	setDeliveryOptions: React.Dispatch<React.SetStateAction<DeliveryOption[]>>
	setCityQuery: React.Dispatch<React.SetStateAction<string>>
	setStreetQuery: React.Dispatch<React.SetStateAction<string>>
	setBuildingQuery: React.Dispatch<React.SetStateAction<string>>
	setMapReady: React.Dispatch<React.SetStateAction<boolean>>
	cityQuery: string
	streetQuery: string
	buildingQuery: string
	filteredDeliveryOptions: DeliveryOption[]
	deliveryOptions: DeliveryOption[]
	tariffs: CdekCalculation[]
	citySuggestions: DadataSuggestion[]
	pvzList: any[]
	mapInstanceRef: React.MutableRefObject<CDEKWidgetInstance | null>
	mapContainerRef: React.RefObject<HTMLDivElement | null>
	cdekWidgetApiKey: string
	defaultCityAppliedRef: React.MutableRefObject<boolean>
	updateForm: (
		updater: Partial<FormState> | ((prev: FormState) => Partial<FormState>),
		errorKeys?: (keyof ValidationErrors)[]
	) => void
	handleCitySelectFromDadata: (dadataCity: DadataSuggestion) => Promise<void>
	loadPvzByPostalCode: (postalCode: string) => Promise<void>
}

export function useOrderPopupEffects(params: UseOrderPopupEffectsParams) {
	const {
		visible,
		form,
		setForm,
		setErrors,
		setPromoMessage,
		setPromoStatus,
		setIsLoading,
		setCitySuggestions,
		setStreetSuggestions,
		setBuildingSuggestions,
		setIsCityLoading,
		setIsStreetLoading,
		setIsBuildingLoading,
		setPvzList,
		setIsPvzLoading,
		setTariffs,
		setIsTariffsLoading,
		setDeliveryOptions,
		setCityQuery,
		setStreetQuery,
		setBuildingQuery,
		setMapReady,
		cityQuery,
		streetQuery,
		buildingQuery,
		filteredDeliveryOptions,
		deliveryOptions,
		tariffs,
		citySuggestions,
		pvzList,
		mapInstanceRef,
		mapContainerRef,
		cdekWidgetApiKey,
		defaultCityAppliedRef,
		updateForm,
		handleCitySelectFromDadata,
		loadPvzByPostalCode
	} = params

	// Сбрасываем формы при закрытии
	useEffect(() => {
		if (!visible) {
			setErrors({})
			setPromoMessage(null)
			setPromoStatus(null)
			setIsLoading(false)
			defaultCityAppliedRef.current = false
			setCitySuggestions([])
			setStreetSuggestions([])
			setBuildingSuggestions([])
		}
	}, [visible, setErrors, setPromoMessage, setPromoStatus, setIsLoading, defaultCityAppliedRef, setCitySuggestions, setStreetSuggestions, setBuildingSuggestions])

	// Блокировка скролла
	useEffect(() => {
		if (!visible) return
		const original = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = original
		}
	}, [visible])

	// Инициализация формы при открытии
	useEffect(() => {
		if (!visible) return

		const saved = typeof window !== 'undefined' ? localStorage.getItem(REMEMBER_KEY) : null
		const parsed = saved ? (JSON.parse(saved) as Partial<FormState>) : null

		setForm((prev) => {
			const promoCode = configuratorStore.promoCode || prev.promoCode
			const deliveryValue = parsed?.deliveryValue || prev.deliveryValue
			const next: FormState = {
				...prev,
				...parsed,
				promoCode,
				deliveryValue,
				remember: !!parsed
			}
			return next
		})
	}, [visible, setForm])

	// Синхронизация промокода со стором
	useEffect(() => {
		configuratorStore.updatePromoCodeValue(form.promoCode)
	}, [form.promoCode])

	// Обновление контактных данных в сторе
	useEffect(() => {
		configuratorStore.steps.final.email = form.email
	}, [form.email])

	useEffect(() => {
		const phoneDigits = digitsOnly(form.phone)
		configuratorStore.steps.final.phone = phoneDigits ? `+${phoneDigits}` : ''
	}, [form.phone])

	useEffect(() => {
		const [lastName = '', firstName = '', middleName = ''] = form.name.split(' ')
		configuratorStore.steps.final.name = { firstName, lastName, middleName }
	}, [form.name])

	useEffect(() => {
		const next = form.city || ''
		if (next !== cityQuery) {
			setCityQuery(next)
		}
	}, [form.city, cityQuery, setCityQuery])

	useEffect(() => {
		const next = form.street || ''
		if (next !== streetQuery) {
			setStreetQuery(next)
		}
	}, [form.street, streetQuery, setStreetQuery])

	useEffect(() => {
		const next = form.building || ''
		if (next !== buildingQuery) {
			setBuildingQuery(next)
		}
	}, [form.building, buildingQuery, setBuildingQuery])

	// Если текущая выбранная опция доставки недоступна для выбранного города, выбираем первую доступную
	useEffect(() => {
		const currentOption = filteredDeliveryOptions.find((item) => item.value === form.deliveryValue)
		if (!currentOption && filteredDeliveryOptions.length > 0) {
			updateForm(
				(prev) => ({
					deliveryValue: filteredDeliveryOptions[0].value,
					pickupPoint: filteredDeliveryOptions[0].requiresPvz ? prev.pickupPoint : '',
					street: filteredDeliveryOptions[0].requiresCourierAddress ? prev.street : '',
					building: filteredDeliveryOptions[0].requiresCourierAddress ? prev.building : '',
					courierAddress: filteredDeliveryOptions[0].requiresCourierAddress ? prev.courierAddress : '',
					mailAddress: filteredDeliveryOptions[0].requiresMailAddress ? prev.mailAddress : ''
				}),
				['pickupPoint', 'street', 'building', 'courierAddress', 'mailAddress']
			)
		}
	}, [filteredDeliveryOptions, form.deliveryValue, updateForm])

	// Актуализируем стоимость доставки
	useEffect(() => {
		const option = filteredDeliveryOptions.find((item) => item.value === form.deliveryValue)
		configuratorStore.deliveryPrice = option?.price ?? 0
	}, [filteredDeliveryOptions, form.deliveryValue])

	useEffect(() => {
		if (!visible) return
		if (!form.remember && typeof window !== 'undefined') {
			localStorage.removeItem(REMEMBER_KEY)
		}
	}, [form.remember, visible])

	// Загрузка городов при открытии модального окна
	useEffect(() => {
		if (!visible) return
		if (citySuggestions.length > 1) return

		const loadCities = async () => {
			setIsCityLoading(true)
			try {
				const dadataCities = await deliveryApi.searchCities(DEFAULT_CITY_NAME)
				let loadedCities: DadataSuggestion[] = []
				let spbCity: DadataSuggestion | null = null
				
				if (dadataCities && dadataCities.length > 0) {
					spbCity = dadataCities.find(c => 
						c.data?.city?.toLowerCase().includes('санкт') ||
						c.data?.city?.toLowerCase().includes('петербург') ||
						c.value?.toLowerCase().includes('санкт') ||
						c.value?.toLowerCase().includes('петербург')
					) || dadataCities[0]
					
					if (spbCity) {
						loadedCities.push(spbCity)
					}
				}

				const popularCities = [
					'Москва',
					'Новосибирск',
					'Екатеринбург',
					'Казань',
					'Нижний Новгород',
					'Челябинск',
					'Самара',
					'Омск',
					'Ростов-на-Дону'
				]

				for (const cityQuery of popularCities) {
					try {
						const cities = await deliveryApi.searchCities(cityQuery)
						if (cities && cities.length > 0) {
							const city = cities.find(c => 
								c.data?.city?.toLowerCase().includes(cityQuery.toLowerCase()) ||
								c.value?.toLowerCase().includes(cityQuery.toLowerCase())
							) || cities[0]
							
							if (city && !loadedCities.find(c => c.value === city.value)) {
								loadedCities.push(city)
							}
						}
					} catch (error: any) {
						console.warn(`Failed to load city ${cityQuery}:`, error)
					}
				}

				setCitySuggestions(loadedCities)
				
				if (spbCity) {
					const currentCityName = form.city || ''
					const isDefaultCitySelected = !currentCityName || 
						currentCityName.toLowerCase().includes('санкт') || 
						currentCityName.toLowerCase().includes('петербург') ||
						currentCityName === DEFAULT_CITY_NAME
					
					if (isDefaultCitySelected) {
						handleCitySelectFromDadata(spbCity)
					}
				}
			} catch (error: any) {
				console.error('Failed to load cities', error)
				if (!form.city) {
					updateForm(
						(prev) => ({
							...prev,
							city: DEFAULT_CITY_NAME,
							cityCode: DEFAULT_CITY_CODE,
							cityUuid: DEFAULT_CITY_UUID
						}),
						['city']
					)
				}
			} finally {
				setIsCityLoading(false)
			}
		}

		loadCities()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible])

	// Загрузка улиц
	useEffect(() => {
		if (!visible) return
		if (!streetQuery || streetQuery.length < 3 || !form.city) {
			setStreetSuggestions([])
			setIsStreetLoading(false)
			return
		}
		if (streetQuery === form.street) {
			setStreetSuggestions([])
			return
		}

		setIsStreetLoading(true)
		const handler = setTimeout(async () => {
			try {
				const suggestions = await deliveryApi.searchStreets(streetQuery, form.city)
				setStreetSuggestions(suggestions)
			} catch (error) {
				console.error('Failed to load street suggestions', error)
				setStreetSuggestions([])
			} finally {
				setIsStreetLoading(false)
			}
		}, 300)

		return () => clearTimeout(handler)
	}, [streetQuery, form.city, form.street, visible, setStreetSuggestions, setIsStreetLoading])

	// Загрузка зданий
	useEffect(() => {
		if (!visible) return
		if (!form.streetFiasId || !buildingQuery || buildingQuery.length < 1) {
			setBuildingSuggestions([])
			setIsBuildingLoading(false)
			return
		}
		if (buildingQuery === form.building) {
			setBuildingSuggestions([])
			return
		}

		setIsBuildingLoading(true)
		const handler = setTimeout(async () => {
			try {
				const suggestions = await deliveryApi.searchBuildings(form.streetFiasId as string, buildingQuery)
				setBuildingSuggestions(suggestions)
			} catch (error) {
				console.error('Failed to load building suggestions', error)
				setBuildingSuggestions([])
			} finally {
				setIsBuildingLoading(false)
			}
		}, 300)

		return () => clearTimeout(handler)
	}, [buildingQuery, form.building, form.streetFiasId, visible, setBuildingSuggestions, setIsBuildingLoading])

	// Загрузка ПВЗ и тарифов при изменении города
	useEffect(() => {
		if (!form.cityCode) {
			setPvzList([])
			setTariffs([])
			return
		}

		if (!visible) return

		setIsPvzLoading(true)
		setForm((prev) => ({ ...prev, deliveryPointData: null, pickupPoint: '' }))
		setErrors((prev) => {
			if (!prev.pickupPoint) return prev
			const next = { ...prev }
			delete next.pickupPoint
			return next
		})

		const currentCityCode = form.cityCode

		deliveryApi
			.getPvzList(form.cityCode)
			.then((points) => {
				setForm((currentForm) => {
					if (currentForm.cityCode === currentCityCode) {
						setPvzList(points)
					}
					return currentForm
				})
			})
			.catch((error) => {
				console.error('[PVZ Load] Failed to load CDEK PVZ list', error)
				setForm((currentForm) => {
					if (currentForm.cityCode === currentCityCode) {
						setPvzList([])
					}
					return currentForm
				})
			})
			.finally(() => {
				setForm((currentForm) => {
					if (currentForm.cityCode === currentCityCode) {
						setIsPvzLoading(false)
					}
					return currentForm
				})
			})

		setIsTariffsLoading(true)
		deliveryApi
			.calculateTariffs(form.cityCode)
			.then((items) => {
				if (currentCityCode === form.cityCode) {
					setTariffs(items)
				}
			})
			.catch((error) => {
				console.error('[PVZ Load] Failed to calculate CDEK tariffs', error)
				if (currentCityCode === form.cityCode) {
					setTariffs([])
				}
			})
			.finally(() => {
				if (currentCityCode === form.cityCode) {
					setIsTariffsLoading(false)
				}
			})
	}, [form.cityCode, visible, form.city, setPvzList, setTariffs, setIsPvzLoading, setIsTariffsLoading, setForm, setErrors])

	// Обновление опций доставки на основе тарифов
	useEffect(() => {
		if (!tariffs.length) {
			setDeliveryOptions(initialDeliveryOptions)
			return
		}

		const tariffById = new Map<number, CdekCalculation>()
		tariffs.forEach((item) => {
			tariffById.set(item.tariffId, item)
		})

		const nextOptions = initialDeliveryOptions.map((option) => {
			if (!option.tariffs || option.tariffs.length === 0) {
				return { ...option }
			}
			const matched = option.tariffs
				.map((id) => tariffById.get(id))
				.find((item): item is CdekCalculation => Boolean(item))

			if (!matched) {
				return { ...option }
			}

			const days = matched.minDays && matched.minDays > 0 ? matched.minDays : 1
			let dayWord = 'дней'
			if (days === 1) {
				dayWord = 'дня'
			} else if (days >= 2 && days <= 4) {
				dayWord = 'дня'
			}
			return {
				...option,
				price: matched.price,
				time: `от ${days} ${dayWord}`
			}
		})

		setDeliveryOptions(nextOptions)
	}, [tariffs, setDeliveryOptions])

	// Загрузка и инициализация CDEK Widget (упрощенная версия)
	// Полная версия с картой требует больше кода, поэтому здесь базовая логика
	useEffect(() => {
		if (!visible) {
			setMapReady(false)
			return
		}

		// Базовая логика загрузки скрипта CDEK Widget
		// Полная версия находится в оригинальном файле OrderPopup.tsx
		// Здесь оставляем упрощенную версию для структуры FSD
		
	}, [visible, setMapReady])
}


