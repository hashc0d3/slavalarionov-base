"use client"

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import s from './OrderPopup.module.css'
import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import { OrderItem, retailCrmApi } from '@/shared/api/retailcrm.api'
import { paymentApi } from '@/shared/api/payment.api'
import { StrapDesignPreview } from '@/widgets/configurator/ui/steps/StrapDesignPreview'
import { DeliveryOption, DeliveryValue } from './orderPopup.types'
import {
	deliveryApi,
	type CdekCalculation,
	type CdekCity,
	type CdekPvz,
	type DadataSuggestion
} from '@/shared/api/delivery.api'
import deliveryStyles from './OrderPopupDelivery.module.css'
import type { CDEKWidgetInstance, CDEKWidgetPoint, CDEKWidgetOptions } from '@/types/cdek-widget'
import { Select, MenuItem, TextField, Button, FormControl, InputLabel, FormHelperText } from '@mui/material'
import { resolveMediaUrl, getMediaBaseUrl } from '@/shared/lib/media'

// Типы CDEK Widget импортируются из @/types/cdek-widget

const DEFAULT_CITY_NAME = 'Санкт-Петербург'
const DEFAULT_CITY_CODE = 137
const DEFAULT_CITY_UUID = ''

type Props = {
	visible: boolean
	onClose: () => void
}

type FormState = {
	name: string
	phone: string
	email: string
	city: string
	cityCode: number | null
	cityUuid: string | null
	cityPostalCode: string | null // Добавили почтовый индекс (по аналогии с custom)
	courierAddress: string
	street: string
	streetFiasId: string | null
	building: string
	mailAddress: string
	pickupPoint: string
	deliveryPointData: CdekPvz | null
	comment: string
	promoCode: string
	remember: boolean
	deliveryValue: DeliveryValue
}

type ValidationErrors = Partial<Record<keyof FormState | 'general', string>>

const initialDeliveryOptions: DeliveryOption[] = [
	{
		value: 'point-delivery',
		label: 'СДЭК до пункта выдачи',
		time: 'от 3 дней',
		price: undefined,
		requiresPvz: true,
		tariffs: [136]
	},
	{
		value: 'parcel-locker-omnicdek',
		label: 'Постамат OmniCDEK',
		time: 'от 3 дней',
		price: undefined,
		requiresPvz: true,
		tariffs: [136]
	},
	{
		value: 'cdek-door-delivery',
		label: 'СДЭК курьером до двери',
		time: 'от 3 дней',
		price: undefined,
		requiresCourierAddress: true,
		tariffs: [137]
	},
	{
		value: 'post-office',
		label: 'Почта России 1 класс',
		time: '4–6 дней',
		price: undefined,
		priceFixed: true,
		requiresMailAddress: true
	},
	{
		value: 'city-courier-delivery',
		label: 'Доставка курьером по Санкт-Петербургу',
		price: 600,
		priceFixed: true,
		note: 'Согласуем удобное место и время доставки и передадим заказ Яндекс.Доставкой.'
	},
	{
		value: 'self-pickup',
		label: 'Самовывоз с производства в Санкт-Петербурге',
		price: 0,
		note: 'По готовности заказа согласуем удобное время. Забор с производства по адресу наб. Обводного канала, 199-201Е.'
	}
] as const

const PHONE_MIN_DIGITS = 11
const REMEMBER_KEY = 'configurator-order-popup'

const formatCurrency = (value?: number | null) => {
	const numeric = Number.isFinite(value) ? Number(value) : 0
	return new Intl.NumberFormat('ru-RU').format(Math.max(0, Math.round(numeric)))
}

const digitsOnly = (value: string) => value.replace(/\D/g, '')
const getRemeshokWord = (count: number) => {
	if (count === 1) return 'ремешка'
	if (count > 1 && count < 5) return 'ремешка'
	return 'ремешков'
}

const initialFormState: FormState = {
	name: '',
	phone: '',
	email: '',
	city: '', // Будет установлен после загрузки через DaData
	cityCode: null, // Будет установлен после загрузки через DaData
	cityUuid: null,
	cityPostalCode: null, // Почтовый индекс города (по аналогии с custom)
	courierAddress: '',
	street: '',
	streetFiasId: null,
	building: '',
	mailAddress: '',
	pickupPoint: '',
	deliveryPointData: null,
	comment: '',
	promoCode: '',
	remember: false,
	deliveryValue: initialDeliveryOptions[0].value
}

export const OrderPopup = observer(function OrderPopup({ visible, onClose }: Props) {
	const [form, setForm] = useState<FormState>(initialFormState)
	const [isLoading, setIsLoading] = useState(false)
	const [errors, setErrors] = useState<ValidationErrors>({})
	const [promoMessage, setPromoMessage] = useState<string | null>(null)
	const [promoStatus, setPromoStatus] = useState<'success' | 'error' | null>(null)
	const [promoLoading, setPromoLoading] = useState(false)
	const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>(initialDeliveryOptions)
	const [cityQuery, setCityQuery] = useState('')
	const [citySuggestions, setCitySuggestions] = useState<DadataSuggestion[]>([])
	const [isCityLoading, setIsCityLoading] = useState(false)
	const [pvzList, setPvzList] = useState<CdekPvz[]>([])
	const [isPvzLoading, setIsPvzLoading] = useState(false)
	const [tariffs, setTariffs] = useState<CdekCalculation[]>([])
	const [isTariffsLoading, setIsTariffsLoading] = useState(false)
	const [streetQuery, setStreetQuery] = useState('')
	const [streetSuggestions, setStreetSuggestions] = useState<DadataSuggestion[]>([])
	const [isStreetLoading, setIsStreetLoading] = useState(false)
	const [buildingQuery, setBuildingQuery] = useState('')
	const [buildingSuggestions, setBuildingSuggestions] = useState<DadataSuggestion[]>([])
	const [isBuildingLoading, setIsBuildingLoading] = useState(false)
	const defaultCityAppliedRef = useRef(false)
	const isSettingDefaultCityRef = useRef(false)
	const mapInstanceRef = useRef<CDEKWidgetInstance | null>(null)
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const [mapReady, setMapReady] = useState(false)
	// Используем YANDEX_API_KEY из .env.local (для CDEK Widget используется Yandex Maps)
	const cdekWidgetApiKey = process.env.NEXT_PUBLIC_YANDEX_API_KEY || process.env.NEXT_PUBLIC_CDEK_WIDGET_API_KEY || '6f29a26c-6dd5-42b8-a755-83a4d6d75b6c'

	const updateForm = (
		updater: Partial<FormState> | ((prev: FormState) => Partial<FormState>),
		errorKeys: (keyof ValidationErrors)[] = []
	) => {
		setForm((prev) => {
			const changes = typeof updater === 'function' ? updater(prev) : updater
			return { ...prev, ...changes }
		})
		if (errorKeys.length) {
			setErrors((prev) => {
				const next = { ...prev }
				errorKeys.forEach((key) => {
					delete next[key]
				})
				return next
			})
		}
	}

	const clearError = (key: keyof ValidationErrors) => {
		if (!errors[key]) return
		setErrors((prev) => {
			const next = { ...prev }
			delete next[key]
			return next
		})
	}

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
	}, [visible])

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
	}, [visible])

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
	}, [form.city, cityQuery])

	useEffect(() => {
		const next = form.street || ''
		if (next !== streetQuery) {
			setStreetQuery(next)
		}
	}, [form.street, streetQuery])

	useEffect(() => {
		const next = form.building || ''
		if (next !== buildingQuery) {
			setBuildingQuery(next)
		}
	}, [form.building, buildingQuery])

	// Фильтруем опции доставки в зависимости от выбранного города
	const filteredDeliveryOptions = useMemo(() => {
		const isSpb = form.cityCode === DEFAULT_CITY_CODE
		
		// Если выбран не Санкт-Петербург, скрываем самовывоз и доставку курьером по СПб
		if (!isSpb) {
			return deliveryOptions.filter(
				(option) => option.value !== 'self-pickup' && option.value !== 'city-courier-delivery'
			)
		}
		
		return deliveryOptions
	}, [deliveryOptions, form.cityCode])

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
	}, [filteredDeliveryOptions, form.deliveryValue])

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


	// Загрузка городов при открытии модального окна (по аналогии с custom - через DaData)
	useEffect(() => {
		if (!visible) return
		// Если уже загружены города (больше одного), не загружаем повторно
		if (citySuggestions.length > 1) return

		// Загружаем дефолтный город (Санкт-Петербург) и популярные города
		const loadCities = async () => {
			setIsCityLoading(true)
			try {
				// Сначала загружаем дефолтный город (Санкт-Петербург)
				const dadataCities = await deliveryApi.searchCities(DEFAULT_CITY_NAME)
				let loadedCities: DadataSuggestion[] = []
				let spbCity: DadataSuggestion | null = null
				
				if (dadataCities && dadataCities.length > 0) {
					// Ищем Санкт-Петербург в результатах DaData
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

				// Затем загружаем популярные города
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

				// Загружаем города последовательно через DaData
				for (const cityQuery of popularCities) {
					try {
						const cities = await deliveryApi.searchCities(cityQuery)
						if (cities && cities.length > 0) {
							const city = cities.find(c => 
								c.data?.city?.toLowerCase().includes(cityQuery.toLowerCase()) ||
								c.value?.toLowerCase().includes(cityQuery.toLowerCase())
							) || cities[0]
							
							// Добавляем город, если его еще нет в списке (проверяем по value)
							if (city && !loadedCities.find(c => c.value === city.value)) {
								loadedCities.push(city)
							}
						}
					} catch (error: any) {
						// Игнорируем ошибки для отдельных городов
						console.warn(`Failed to load city ${cityQuery}:`, error)
					}
				}

				// Устанавливаем загруженные города в список
				setCitySuggestions(loadedCities)
				
				// Автоматически выбираем Санкт-Петербург из списка при первой загрузке
				// (находим cityCode через CDEK API и устанавливаем в форму)
				if (spbCity) {
					// Выбираем Санкт-Петербург, если город еще не выбран или если выбран дефолтный
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
				// В случае ошибки используем константы как fallback
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
	}, [streetQuery, form.city, form.street, visible])

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
	}, [buildingQuery, form.building, form.streetFiasId, visible])

	// Загрузка ПВЗ и тарифов при изменении города (включая дефолтный)
	useEffect(() => {
		console.log('[PVZ Load] useEffect triggered:', { cityCode: form.cityCode, visible, city: form.city })
		
		if (!form.cityCode) {
			console.log('[PVZ Load] No cityCode, clearing PVZ list')
			setPvzList([])
			setTariffs([])
			return
		}

		// Загружаем ПВЗ только если модальное окно видимо
		if (!visible) {
			console.log('[PVZ Load] Modal not visible, skipping')
			return
		}

		console.log('[PVZ Load] Loading PVZ for cityCode:', form.cityCode)
		setIsPvzLoading(true)
		setForm((prev) => ({ ...prev, deliveryPointData: null, pickupPoint: '' }))
		setErrors((prev) => {
			if (!prev.pickupPoint) return prev
			const next = { ...prev }
			delete next.pickupPoint
			return next
		})

		const currentCityCode = form.cityCode // Сохраняем текущий cityCode для проверки

		deliveryApi
			.getPvzList(form.cityCode)
			.then((points) => {
				// Проверяем, что cityCode не изменился во время загрузки
				setForm((currentForm) => {
					if (currentForm.cityCode === currentCityCode) {
						console.log('[PVZ Load] PVZ loaded successfully:', points.length, 'points')
						setPvzList(points)
					} else {
						console.log('[PVZ Load] CityCode changed during load, ignoring results')
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
				// Сбрасываем isPvzLoading, проверяя актуальность через setForm
				setForm((currentForm) => {
					if (currentForm.cityCode === currentCityCode) {
						setIsPvzLoading(false)
					} else {
						// Если cityCode изменился, все равно сбрасываем загрузку для старого запроса
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
					console.log('[PVZ Load] Tariffs loaded successfully:', items.length, 'tariffs')
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
	}, [form.cityCode, visible, form.city])

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
			// Формат времени: "от 1 дня", "от 2 дней", "от 3 дней" и т.д.
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
	}, [tariffs])

	const currentDeliveryOption =
		filteredDeliveryOptions.find((item) => item.value === form.deliveryValue) ??
		filteredDeliveryOptions[0] ??
		initialDeliveryOptions[0]

	// Считаем общую сумму всех товаров в корзине
	const productsPrice = configuratorStore.cartItems.reduce((sum, item) => sum + (item.price || 0), 0)
	
	// Применяем промокод ко всей корзине (если есть)
	let productsPriceWithDiscount = productsPrice
	if (configuratorStore.promoAccepted && configuratorStore.usedPromo) {
		const promo = configuratorStore.usedPromo
		const discount = promo.type === 'percent'
			? productsPrice * (promo.discountValue / 100)
			: promo.discountValue
		productsPriceWithDiscount = Math.max(0, productsPrice - discount)
		console.log('[OrderPopup] Promo applied:', {
			productsPrice,
			discount,
			productsPriceWithDiscount,
			promoCode: promo.code,
			promoType: promo.type,
			discountValue: promo.discountValue
		})
	}
	
	const totalPrice = productsPrice + (form.deliveryValue ? (currentDeliveryOption?.price || 0) : 0)
	const totalPriceWithDiscount = productsPriceWithDiscount + (form.deliveryValue ? (currentDeliveryOption?.price || 0) : 0)
	const selectedStrapName = configuratorStore.steps.strap.strapName
	const selectedLeatherColorTitle =
		configuratorStore.selectedLeatherColor?.color_title ||
		configuratorStore.steps.strapDesign.leatherColor?.name ||
		'Не выбран'
	const selectedAdapterColorTitle =
		configuratorStore.selectedAdapterColor?.color_title ||
		configuratorStore.steps.strapDesign.adapterColor?.name ||
		'Не выбран'
	const selectedBuckleColorTitle =
		configuratorStore.selectedBuckleColor?.color_title ||
		configuratorStore.steps.strapDesign.buckleColor?.name ||
		'Не выбран'
	const selectedStitchingColorTitle =
		configuratorStore.selectedStitchingColor?.color_title ||
		configuratorStore.steps.strapDesign.stitchingColor?.name ||
		'в тон'
	const selectedEdgeColorTitle =
		configuratorStore.selectedEdgeColor?.color_title ||
		configuratorStore.steps.strapDesign.edgeColor?.name ||
		'в тон'


	// Генерация URL для первого вида (view 1) товара
	const getItemView1ImageUrl = (item: any) => {
		const baseImageUrl = `${getMediaBaseUrl()}/uploads`
		const strapData = item.strapModel?.attributes?.watch_strap
		
		if (!strapData) return null
		
		// Проверяем, есть ли динамическое изображение view1 в базе
		const dynamicView1 = resolveMediaUrl(strapData.strap_params?.view_images?.view1)
		if (dynamicView1) return dynamicView1
		
		// Fallback на legacy путь
		return `${baseImageUrl}/base_${strapData.strap_name}_1_739ae2aa10.png`
	}

	const handleFieldChange =
		(key: keyof FormState) =>
		(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const target = event.target
			const value =
				target instanceof HTMLInputElement && target.type === 'checkbox'
					? target.checked
					: target.value

			updateForm({ [key]: value } as Partial<FormState>, [key])
		}

	const handleRememberToggle = (event: ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked
		updateForm({ remember: checked })
	}

	const handleCitySelect = (city: CdekCity) => {
		updateForm(
			(prev) => ({
				city: city.cityName,
				cityCode: city.cityCode ?? null,
				cityUuid: city.cityUuid || null,
				pickupPoint: '',
				deliveryPointData: null,
				street: '',
				streetFiasId: null,
				building: '',
				courierAddress: '',
				mailAddress: '',
				deliveryValue: initialDeliveryOptions[0].value
			}),
			['city', 'pickupPoint', 'street', 'building', 'courierAddress', 'mailAddress']
		)
		setCityQuery(city.cityName)
		setCitySuggestions([])
		setStreetQuery('')
		setStreetSuggestions([])
		setBuildingQuery('')
		setBuildingSuggestions([])
	}

	// Функция загрузки ПВЗ по postalCode (по аналогии с custom)
	const loadPvzByPostalCode = async (postalCode: string) => {
		console.log('[Load PVZ] Starting to load PVZ for postalCode:', postalCode)
		setPvzList([])
		setTariffs([])
		setIsPvzLoading(true)
		setIsTariffsLoading(true)
		
		try {
			// Загружаем ПВЗ по postalCode (по аналогии с custom)
			const points = await deliveryApi.getPvzListByPostalCode(postalCode)
			console.log('[Load PVZ] PVZ loaded successfully:', points.length, 'points')
			setPvzList(points)
		} catch (error) {
			console.error('[Load PVZ] Failed to load CDEK PVZ list', error)
			setPvzList([])
		} finally {
			setIsPvzLoading(false)
		}
		
		try {
			// Загружаем тарифы по postalCode (по аналогии с custom)
			const items = await deliveryApi.calculateTariffsByPostalCode(postalCode)
			console.log('[Load PVZ] Tariffs loaded successfully:', items.length, 'tariffs')
			setTariffs(items)
		} catch (error) {
			console.error('[Load PVZ] Failed to calculate CDEK tariffs', error)
			setTariffs([])
		} finally {
			setIsTariffsLoading(false)
		}
	}

	// Обработчик выбора города из DaData (по аналогии с custom - используем postal_code)
	const handleCitySelectFromDadata = async (dadataCity: DadataSuggestion) => {
		console.log('[City Select] Starting city selection:', dadataCity)
		const cityName = dadataCity.data?.city || dadataCity.data?.settlement || dadataCity.value || ''
		const cityLat = dadataCity.data?.geo_lat ? parseFloat(dadataCity.data.geo_lat) : null
		const cityLon = dadataCity.data?.geo_lon ? parseFloat(dadataCity.data.geo_lon) : null
		const postalCode = dadataCity.data?.postal_code || ''
		const isDefaultCity = cityName.toLowerCase().includes('санкт') || cityName.toLowerCase().includes('петербург')
		
		console.log('[City Select] City data:', { cityName, postalCode, isDefaultCity })
		
		// Сначала ищем cityCode через CDEK API (для совместимости, хотя будем использовать postalCode)
		let finalCityCode: number | null = isDefaultCity ? DEFAULT_CITY_CODE : null
		let finalCityUuid: string | null = isDefaultCity ? DEFAULT_CITY_UUID : null
		
		try {
			console.log('[City Select] Searching CDEK cities for:', cityName, 'postalCode:', postalCode)
			const cdekCities = await deliveryApi.searchCdekCities(cityName, postalCode)
			console.log('[City Select] CDEK cities found:', cdekCities)
			
			if (cdekCities && cdekCities.length > 0) {
				const cdekCity = cdekCities.find(c => 
					c.cityName?.toLowerCase().includes(cityName.toLowerCase()) ||
					cityName.toLowerCase().includes(c.cityName?.toLowerCase() || '')
				) || cdekCities[0]
				
				if (cdekCity.cityCode) {
					console.log('[City Select] Found cityCode via CDEK API:', cdekCity.cityCode)
					finalCityCode = cdekCity.cityCode
					finalCityUuid = cdekCity.cityUuid || null
				}
			}
		} catch (error) {
			console.error('[City Select] Failed to find cityCode for city:', cityName, error)
		}
		
		// Обновляем форму (по аналогии с custom - добавляем postalCode)
		updateForm(
			(prev) => ({
				...prev,
				city: cityName,
				cityCode: finalCityCode,
				cityUuid: finalCityUuid,
				cityPostalCode: postalCode || null, // Почтовый индекс из DaData
				pickupPoint: '',
				deliveryPointData: null,
				street: '',
				streetFiasId: null,
				building: '',
				courierAddress: '',
				mailAddress: '',
				deliveryValue: initialDeliveryOptions[0].value
			}),
			['city', 'pickupPoint', 'street', 'building', 'courierAddress', 'mailAddress']
		)
		
		console.log('[City Select] City updated, postalCode:', postalCode, 'cityCode:', finalCityCode)
		
		// Загружаем ПВЗ по postalCode (по аналогии с custom), если он есть
		if (postalCode) {
			console.log('[City Select] Loading PVZ by postalCode:', postalCode)
			await loadPvzByPostalCode(postalCode)
		} else {
			console.warn('[City Select] No postalCode, cannot load PVZ')
		}
		
		// Обновляем локацию карты
		if (mapInstanceRef.current && cityLat && cityLon && !isNaN(cityLat) && !isNaN(cityLon)) {
			console.log('[CDEK Map] Updating location:', [cityLon, cityLat])
			try {
				mapInstanceRef.current.updateLocation([cityLon, cityLat])
			} catch (error) {
				console.warn('[CDEK Map] Error updating location:', error)
			}
		}
		
		setCityQuery(cityName)
		setStreetQuery('')
		setStreetSuggestions([])
		setBuildingQuery('')
		setBuildingSuggestions([])
	}

	const handlePvzSelect = (pvz: CdekPvz) => {
		updateForm(
			() => ({
				pickupPoint: `${pvz.name}, ${pvz.address}`,
				deliveryPointData: pvz
			}),
			['pickupPoint']
		)
	}

	// Загрузка скрипта CDEK Widget
	useEffect(() => {
		if (!visible || !currentDeliveryOption.requiresPvz) {
			console.log('[CDEK Map] Skipping script load:', { visible, requiresPvz: currentDeliveryOption.requiresPvz })
			setMapReady(false)
			return
		}

		console.log('[CDEK Map] Starting script load...')

		// Используем тот же URL, что и в старом проекте (через jsdelivr CDN)
		if (window.CDEKWidget && typeof window.CDEKWidget === 'function') {
			console.log('[CDEK Map] Widget already loaded')
			setMapReady(true)
			return
		}

		let script: HTMLScriptElement | null = null
		let isMounted = true

		const loadScript = () => {
			const existingScript = document.getElementById('ISDEKscript') as HTMLScriptElement | null
			if (existingScript) {
				// Если скрипт уже есть, ждем его загрузки
				if (window.CDEKWidget && typeof window.CDEKWidget === 'function') {
					if (isMounted) setMapReady(true)
					return
				}
				// Если скрипт есть, но виджет еще не готов, ждем
				existingScript.addEventListener('load', () => {
					if (isMounted && window.CDEKWidget && typeof window.CDEKWidget === 'function') {
						setMapReady(true)
					}
				})
				return
			}

			script = document.createElement('script')
			script.id = 'ISDEKscript'
			script.type = 'text/javascript'
			script.src = 'https://cdn.jsdelivr.net/gh/cdek-it/widget@latest/dist/cdek-widget.umd.js'
			script.async = true
			
			script.onload = () => {
				if (!isMounted) return
				console.log('[CDEK Map] Script loaded successfully, CDEKWidget available:', !!window.CDEKWidget)
				// Небольшая задержка для гарантии, что виджет полностью инициализирован
				setTimeout(() => {
					if (isMounted && window.CDEKWidget && typeof window.CDEKWidget === 'function') {
						setMapReady(true)
					}
				}, 100)
			}
			
			script.onerror = (error) => {
				if (!isMounted) return
				console.error('[CDEK Map] Failed to load CDEK Widget script:', error)
				setMapReady(false)
			}
			
			document.body.appendChild(script)
			console.log('[CDEK Map] Script element added to DOM:', script.src)
		}

		loadScript()

		return () => {
			isMounted = false
			// Не удаляем скрипт, так как он может использоваться повторно
			// Просто сбрасываем готовность
			setMapReady(false)
		}
	}, [visible, currentDeliveryOption.requiresPvz])

	// Инициализация карты
	useEffect(() => {
		// Если модальное окно закрыто или не требуется ПВЗ, уничтожаем виджет
		if (!visible || !currentDeliveryOption.requiresPvz) {
			if (mapInstanceRef.current && typeof mapInstanceRef.current.destroy === 'function') {
				console.log('[CDEK Map] Destroying widget - modal closed or PVZ not required')
				try {
					mapInstanceRef.current.destroy()
				} catch (error) {
					console.warn('[CDEK Map] Error destroying widget:', error)
				}
				mapInstanceRef.current = null
			}
			return
		}

		console.log('[CDEK Map] Init effect triggered:', {
			visible,
			mapReady,
			hasWidget: !!window.CDEKWidget,
			city: form.city,
			cityCode: form.cityCode,
			requiresPvz: currentDeliveryOption.requiresPvz,
			hasContainer: !!mapContainerRef.current
		})

		// Виджет CDEK работает с названием города, не требует cityCode (по аналогии с custom)
		if (!mapReady || !window.CDEKWidget || !form.city || !form.city.trim()) {
			console.log('[CDEK Map] Skipping map init - conditions not met', {
				mapReady,
				hasWidget: !!window.CDEKWidget,
				city: form.city
			})
			return
		}

		if (!mapContainerRef.current) {
			console.log('[CDEK Map] Container ref not available')
			return
		}

		// Уничтожаем предыдущий экземпляр карты перед созданием нового
		if (mapInstanceRef.current && typeof mapInstanceRef.current.destroy === 'function') {
			console.log('[CDEK Map] Destroying previous map instance')
			try {
				mapInstanceRef.current.destroy()
			} catch (error) {
				console.warn('[CDEK Map] Error destroying previous instance:', error)
			}
			mapInstanceRef.current = null
		}

		// Проверяем, что виджет действительно доступен и является функцией
		if (typeof window.CDEKWidget !== 'function') {
			console.error('[CDEK Map] CDEKWidget is not a function:', typeof window.CDEKWidget)
			return
		}

		let isMounted = true
		let widgetInstance: CDEKWidgetInstance | null = null
		let initTimeout: NodeJS.Timeout | null = null

		// Инициализируем виджет асинхронно, чтобы избежать проблем с отменой запросов
		const initWidget = async () => {
			try {
				// Проверяем, что контейнер все еще существует
				if (!mapContainerRef.current || !document.getElementById('cdek-delivery-map')) {
					console.warn('[CDEK Map] Container not found, skipping initialization')
					return
				}

				// Проверяем, что компонент все еще смонтирован
				if (!isMounted) {
					return
				}

				// Получаем почтовый индекс из данных города DaData (если есть) или используем дефолтный для СПб
				// Ищем выбранный город в списке citySuggestions
				const selectedCityData = citySuggestions.find((c) => 
					(c.data?.city || c.data?.settlement || c.value) === form.city
				)
				const cityPostalCode = selectedCityData?.data?.postal_code || (form.cityCode === DEFAULT_CITY_CODE ? 190000 : undefined)

				// Убеждаемся, что город есть перед инициализацией виджета (по аналогии с custom)
				if (!form.city || !form.city.trim()) {
					console.warn('[CDEK Map] City is not set, skipping widget initialization')
					return
				}

				const widgetOptions = {
					from: form.city,
					root: 'cdek-delivery-map',
					apiKey: cdekWidgetApiKey,
					postal_code: cityPostalCode || 190000,
					servicePath: '/api/delivery/cdek',
					defaultLocation: form.city,
					tariffs: {
						office: [137]
					},
					hideDeliveryOptions: {
						office: false,
						door: true
					},
					hideFilters: {
						type: true
					},
					onChoose: (_mode: any, _tarif: any, address: CDEKWidgetPoint) => {
						if (!isMounted) return
						console.log('[CDEK Map] Point chosen:', address)
						if (address && address.code) {
							// Находим пункт выдачи по коду
							const pvz = pvzList.find((p) => p.code === address.code)
							if (pvz) {
								console.log('[CDEK Map] Found PVZ in list:', pvz)
								handlePvzSelect(pvz)
							} else {
								console.log('[CDEK Map] PVZ not in list, creating from widget data')
								// Если пункт не найден в списке, создаем объект из данных виджета
								const widgetPvz: CdekPvz = {
									code: address.code || '',
									name: address.name || '',
									address: address.address || '',
									type: 'PVZ',
									workTime: address.work_time || '',
									city: address.city || form.city,
									cityCode: form.cityCode || DEFAULT_CITY_CODE,
									coordX: address.coordX,
									coordY: address.coordY
								}
								updateForm(
									() => ({
										pickupPoint: `${widgetPvz.name}, ${widgetPvz.address}`,
										deliveryPointData: widgetPvz
									}),
									['pickupPoint']
								)
							}
						}
					},
					onReady: () => {
						if (!isMounted) return
						console.log('[CDEK Map] Widget ready callback fired')
					}
				}

				console.log('[CDEK Map] Initializing widget with options:', {
					...widgetOptions,
					apiKey: widgetOptions.apiKey ? `${widgetOptions.apiKey.substring(0, 10)}...` : 'missing'
				})

				// Создаем виджет с обработкой ошибок
				// Используем setTimeout для выполнения в следующем тике event loop,
				// чтобы ошибки обрабатывались асинхронно
				await new Promise<void>((resolve, reject) => {
					setTimeout(() => {
						if (!isMounted) {
							resolve()
							return
						}
						
						try {
							widgetInstance = new window.CDEKWidget(widgetOptions)
							resolve()
						} catch (initError: any) {
							// Обрабатываем ошибки при создании экземпляра
							if (initError?.name === 'CanceledError' || initError?.message?.includes('canceled')) {
								console.warn('[CDEK Map] Widget initialization was canceled')
								resolve() // Разрешаем промис, чтобы не прерывать выполнение
								return
							}
							reject(initError)
						}
					}, 0)
				}).catch((error: any) => {
					// Обрабатываем другие ошибки
					if (error?.name === 'CanceledError' || error?.message?.includes('canceled')) {
						console.warn('[CDEK Map] Widget initialization was canceled')
						return
					}
					console.error('[CDEK Map] Error creating widget:', error)
					throw error
				})
				
				// Проверяем, что виджет был создан
				if (!widgetInstance) {
					console.warn('[CDEK Map] Widget instance was not created')
					return
				}
				
				// Проверяем, что компонент все еще смонтирован после создания виджета
				if (!isMounted) {
					// Если компонент размонтировался, уничтожаем виджет
					if (widgetInstance && typeof widgetInstance.destroy === 'function') {
						try {
							widgetInstance.destroy()
						} catch (destroyError) {
							console.warn('[CDEK Map] Error destroying widget after unmount:', destroyError)
						}
					}
					return
				}

				mapInstanceRef.current = widgetInstance
				console.log('[CDEK Map] Widget instance created:', widgetInstance)
			} catch (error: any) {
				// Обрабатываем CanceledError и другие ошибки
				if (error?.name === 'CanceledError' || error?.message?.includes('canceled')) {
					console.warn('[CDEK Map] Widget initialization was canceled (component unmounted or request aborted)')
				} else {
					console.error('[CDEK Map] Failed to initialize CDEK Widget:', error)
				}
			}
		}

		// Запускаем инициализацию с небольшой задержкой для гарантии готовности DOM
		initTimeout = setTimeout(() => {
			initWidget()
		}, 100)

		return () => {
			isMounted = false
			if (initTimeout) {
				clearTimeout(initTimeout)
			}
			if (mapInstanceRef.current && typeof mapInstanceRef.current.destroy === 'function') {
				console.log('[CDEK Map] Cleaning up map instance')
				try {
					mapInstanceRef.current.destroy()
				} catch (cleanupError) {
					console.warn('[CDEK Map] Error during cleanup:', cleanupError)
				}
				mapInstanceRef.current = null
			}
			// Также уничтожаем виджет, если он был создан, но еще не присвоен в ref
			if (widgetInstance && typeof widgetInstance.destroy === 'function') {
				try {
					widgetInstance.destroy()
				} catch (destroyError) {
					console.warn('[CDEK Map] Error destroying widget instance:', destroyError)
				}
			}
		}
		// Убираем pvzList из зависимостей, чтобы избежать переинициализации при изменении списка ПВЗ
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible, mapReady, form.city, form.cityCode, currentDeliveryOption.requiresPvz, cdekWidgetApiKey])

	// Обновление локации карты при изменении города (по аналогии с custom)
	useEffect(() => {
		// Не обновляем локацию, если виджет еще не готов или модальное окно закрыто
		if (!visible || !mapInstanceRef.current || !form.city || !currentDeliveryOption.requiresPvz) {
			return
		}

		// Используем debounce, чтобы не обновлять локацию слишком часто
		const timeoutId = setTimeout(() => {
			if (!mapInstanceRef.current || !form.city) return
			
			console.log('[CDEK Map] Updating location:', { city: form.city })
			// Находим координаты города из списка городов DaData или используем координаты первого ПВЗ
			const cityCoords = citySuggestions.find((c) => 
				(c.data?.city || c.data?.settlement || c.value) === form.city
			)
			if (cityCoords && cityCoords.data?.geo_lat && cityCoords.data?.geo_lon) {
				const lat = parseFloat(cityCoords.data.geo_lat)
				const lon = parseFloat(cityCoords.data.geo_lon)
				if (!isNaN(lat) && !isNaN(lon)) {
					console.log('[CDEK Map] Using city coordinates:', [lon, lat])
					try {
						mapInstanceRef.current.updateLocation([lon, lat])
					} catch (error) {
						console.warn('[CDEK Map] Error updating location:', error)
					}
				}
			} else if (pvzList.length > 0 && pvzList[0].coordX && pvzList[0].coordY) {
				console.log('[CDEK Map] Using PVZ coordinates:', [pvzList[0].coordX, pvzList[0].coordY])
				try {
					mapInstanceRef.current.updateLocation([pvzList[0].coordX, pvzList[0].coordY])
				} catch (error) {
					console.warn('[CDEK Map] Error updating location:', error)
				}
			} else {
				console.log('[CDEK Map] No coordinates available for update')
			}
		}, 300) // Debounce 300ms

		return () => {
			clearTimeout(timeoutId)
		}
		// Убираем pvzList из зависимостей, чтобы избежать частых обновлений
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible, form.city, citySuggestions, currentDeliveryOption.requiresPvz])

	const handleStreetSelect = (suggestion: DadataSuggestion) => {
		const streetName = suggestion.value || suggestion.unrestricted_value || ''
		const fias =
			suggestion.data?.street_fias_id ||
			suggestion.data?.fias_id ||
			suggestion.data?.street_kladr_id ||
			null

		setStreetQuery(streetName)
		setStreetSuggestions([])
		updateForm(
			(prev) => ({
				street: streetName,
				streetFiasId: fias,
				courierAddress: [streetName, prev.building].filter(Boolean).join(', ')
			}),
			['street', 'courierAddress']
		)
	}

	const handleBuildingSelect = (suggestion: DadataSuggestion) => {
		const buildingValue = suggestion.value || suggestion.unrestricted_value || ''

		setBuildingQuery(buildingValue)
		setBuildingSuggestions([])
		updateForm(
			(prev) => ({
				building: buildingValue,
				courierAddress: [prev.street || streetQuery, buildingValue].filter(Boolean).join(', ')
			}),
			['building', 'courierAddress']
		)
	}

	const validateForm = () => {
		const nextErrors: ValidationErrors = {}
		if (!form.name.trim()) {
			nextErrors.name = 'Пожалуйста, укажите ФИО полностью'
		}
		const phoneDigits = digitsOnly(form.phone)
		if (!phoneDigits || phoneDigits.length < PHONE_MIN_DIGITS) {
			nextErrors.phone = 'Введите полный номер телефона'
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!form.email.trim() || !emailRegex.test(form.email)) {
			nextErrors.email = 'Укажите корректный email'
		}
		if (!form.city.trim()) {
			nextErrors.city = 'Укажите город доставки'
		}
		if (!form.cityCode) {
			nextErrors.city = 'Выберите город из списка CDEK'
		}

		const selectedOption =
			filteredDeliveryOptions.find((item) => item.value === form.deliveryValue) ?? currentDeliveryOption

		if (selectedOption.requiresPvz) {
			if (!form.deliveryPointData) {
				nextErrors.pickupPoint = 'Выберите пункт выдачи'
			}
		}

		if (selectedOption.requiresCourierAddress) {
			if (!form.street.trim()) {
				nextErrors.street = 'Укажите улицу'
			}
			if (!form.building.trim()) {
				nextErrors.building = 'Укажите дом'
			}
			if (!form.courierAddress.trim()) {
				nextErrors.courierAddress = 'Укажите адрес доставки'
			}
		}

		if (selectedOption.requiresMailAddress) {
			if (!form.mailAddress.trim()) {
				nextErrors.mailAddress = 'Укажите адрес отделения или индекс'
			}
		}

		setErrors(nextErrors)
		return Object.keys(nextErrors).length === 0
	}

	const persistFormData = () => {
		if (typeof window === 'undefined') return
		if (!form.remember) {
			localStorage.removeItem(REMEMBER_KEY)
			return
		}
		const { remember, ...data } = form
		localStorage.setItem(REMEMBER_KEY, JSON.stringify(data))
	}

	const convertItemToRetailCrm = (item: any): OrderItem => {
		if (!item || !item.strapModel) {
			throw new Error('Товар не содержит необходимых данных')
		}

		const strapModelData = item.strapModel?.attributes?.watch_strap || {}
		const strapModel = strapModelData.strap_title || strapModelData.strap_name || 'Ремешок'

		const watchModelData = item.watchModel || {}
		const watchModel = watchModelData.watch_model_name || watchModelData.model_name || ''
		const watchSizes = watchModelData.watch_sizes || []
		const watchSize = watchSizes.find((s: any) => s.choosen)?.watch_size || ''

		const frameColor = item.frameColor?.color_name || 'Не выбран'
		const leatherColor = item.leatherColor?.color_title || 'Не выбран'
		const stitchingColor = item.stitchingColor?.color_title || 'Не выбран'
		const edgeColor = item.edgeColor?.color_title || 'Не выбран'
		const buckleColor = item.buckleColor?.color_title || 'Не выбран'
		const adapterColor = item.adapterColor?.color_title || 'Не выбран'

		const additionalOptions = item.additionalOptions || {
			initials: { choosen: false, text: null, price: 0 },
			presentBox: { choosen: false, price: 0 },
			postCard: { choosen: false, text: null, price: 0 }
		}

		const buckleButterflyAvailable = !!strapModelData.has_buckle_butterfly
		const buckleButterflyChoosen = item.buckleButterfly || false
		const basePrice = strapModelData.price || 0
		const strapButterflyPrice = strapModelData.buckle_butterfly_price || 0
		const butterflyPrice = buckleButterflyChoosen ? strapButterflyPrice : 0
		const productsPriceValue = basePrice + butterflyPrice
		const additionalOptionsPrice =
			(additionalOptions.initials?.choosen && additionalOptions.initials?.price ? additionalOptions.initials.price : 0) +
			(additionalOptions.presentBox?.choosen && additionalOptions.presentBox?.price ? additionalOptions.presentBox.price : 0) +
			(additionalOptions.postCard?.choosen && additionalOptions.postCard?.price ? additionalOptions.postCard.price : 0)

		return {
			strapModel: strapModel || 'Ремешок',
			strapLeatherColor: leatherColor || 'Не выбран',
			appleWatchModel: watchModel || '',
			appleWatchModelSize: watchSize ? `${watchSize}мм` : '',
			appleWatchModelColor: frameColor || 'Не выбран',
			stitchingColor: stitchingColor || 'Не выбран',
			edgeColor: edgeColor || 'Не выбран',
			buckleColor: buckleColor || 'Не выбран',
			adapterColor: adapterColor || 'Не выбран',
			initials: {
				choosen: additionalOptions.initials?.choosen || false,
				text: additionalOptions.initials?.text || null
			},
			presentBox: {
				choosen: additionalOptions.presentBox?.choosen || false
			},
			postCard: {
				choosen: additionalOptions.postCard?.choosen || false,
				text: additionalOptions.postCard?.text || null
			},
			buckleButterfly: {
				available: buckleButterflyAvailable,
				choosen: buckleButterflyChoosen
			},
			quantity: item.quantity || 1,
			productsPrice: Number(productsPriceValue) || 0,
			additionalOptionsPrice: Number(additionalOptionsPrice) || 0
		}
	}

	const buildDeliveryPayload = () => {
		const option = currentDeliveryOption
		const deliveryType = option.label

		return {
			deliveryCity: form.city,
			deliveryType,
			deliveryPoint: form.deliveryPointData
				? {
						name: form.deliveryPointData.name,
						address: form.deliveryPointData.address
				  }
				: null,
			deliveryAddressInfo:
				option.requiresCourierAddress && (form.street || form.building)
					? {
							street: form.street || '',
							building: form.building || ''
					  }
					: null,
			mailAddress: option.requiresMailAddress ? form.mailAddress : '',
			curierAddress: option.requiresCourierAddress ? form.courierAddress : '',
			deliveryComment: form.comment
		}
	}

	const submitOrder = async () => {
		if (!validateForm()) return

		setIsLoading(true)
		setErrors({})

		try {
			// Генерация номера заказа
			const orderNumber = Array.from({ length: 10 })
				.map(() => Math.floor(Math.random() * 10))
				.join('')

			const promo = configuratorStore.usedPromo || {
				promoFound: false,
				type: 'percent' as const,
				discountValue: 0,
				code: ''
			}

			const allItems: any[] = []

			if (configuratorStore.cartItems?.length) {
				configuratorStore.cartItems.forEach((cartItem) => {
					if (cartItem?.strapModel) {
						allItems.push(cartItem)
					}
				})
			}

		// Добавляем текущий товар в список (дубликаты разрешены)
		if (configuratorStore.steps.strap.isChoosen && configuratorStore.selectedStrapModel) {
			const currentProduct = {
				strapModel: configuratorStore.selectedStrapModel,
				watchModel: configuratorStore.selectedWatchModel,
				frameColor: configuratorStore.selectedFrameColor,
				leatherColor: configuratorStore.selectedLeatherColor,
				stitchingColor: configuratorStore.selectedStitchingColor,
				edgeColor: configuratorStore.selectedEdgeColor,
				buckleColor: configuratorStore.selectedBuckleColor,
				adapterColor: configuratorStore.selectedAdapterColor,
				buckleButterfly: configuratorStore.steps.strapDesign.buckleButterflyChoosen,
				additionalOptions: configuratorStore.steps.final.additionalOptions,
				quantity: configuratorStore.productAmount || 1
			}

			allItems.push(currentProduct)
		}

			if (!allItems.length) {
				setErrors({ general: 'Добавьте хотя бы один товар в корзину' })
				setIsLoading(false)
				return
			}

			const retailCrmItems = allItems.reduce<OrderItem[]>((acc, item) => {
				try {
					const converted = convertItemToRetailCrm(item)
					acc.push(converted)
				} catch (conversionError) {
					console.error('Ошибка преобразования товара для RetailCRM', conversionError)
				}
				return acc
			}, [])

			if (!retailCrmItems.length) {
				setErrors({ general: 'Не удалось подготовить товары к отправке. Попробуйте еще раз.' })
				setIsLoading(false)
				return
			}

			const delivery = buildDeliveryPayload()
			// Способ оплаты будет выбран на странице оплаты
			const paymentType = 'Будет выбран на странице оплаты'

			const retailCrmOrderData = {
				orderNumber,
				items: retailCrmItems,
				receiverFullname: form.name,
				email: form.email,
				tel: `+${digitsOnly(form.phone)}`,
				deliveryCity: delivery.deliveryCity,
				deliveryType: delivery.deliveryType,
				deliveryPoint: delivery.deliveryPoint,
				deliveryAddressInfo: delivery.deliveryAddressInfo,
				mailAddress: delivery.mailAddress,
				curierAddress: delivery.curierAddress,
				deliveryComment: delivery.deliveryComment,
				deliveryPrice: configuratorStore.deliveryPrice || 0,
				promo: {
					code: promo.code || '',
					used: promo.promoFound || false,
					discountValue: promo.discountValue || 0,
					discountValueFull:
						promo.type === 'percent' ? `${promo.discountValue}%` : `${promo.discountValue} руб`
				},
				totalPrice: totalPriceWithDiscount,
				paymentType
			}

			await retailCrmApi.createOrder(retailCrmOrderData)
			persistFormData()

			setErrors({})

			const amount = Math.max(0, Math.round(totalPriceWithDiscount))
			if (amount <= 0) {
				setIsLoading(false)
				onClose()
				window.location.href = 'https://slavalarionov.com/success'
				return
			}

			const totalItems = allItems.reduce<number>((acc, item) => acc + (Number(item.quantity) || 1), 0)
			const purpose = `Заказ ${totalItems} ${getRemeshokWord(totalItems)}`
			// Передаем оба способа оплаты, чтобы пользователь выбрал на странице оплаты
			const paymentMode = ['card', 'sbp']
			const redirectUrl = 'https://slavalarionov.com/success'

			try {
				const paymentResponse = await paymentApi.createPayment({
					amount,
					purpose,
					paymentMode,
					redirectUrl
				})

				const paymentLink = paymentResponse.data?.Data?.paymentLink
				if (paymentResponse.success && paymentLink) {
					window.location.href = paymentLink
				} else {
					setErrors({
						general: 'Не удалось создать платеж. Попробуйте еще раз или выберите другой способ оплаты.'
					})
				}
			} catch (paymentError: any) {
				console.error('Ошибка создания платежа', paymentError)
				setErrors({
					general: paymentError?.message || 'Не удалось создать платеж. Попробуйте повторить позднее.'
				})
			}
		} catch (error: any) {
			console.error('Ошибка при создании заказа', error)
			setErrors({
				general: error?.message || 'Не удалось отправить заказ. Попробуйте повторить позднее.'
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleApplyPromo = async () => {
		if (!form.promoCode.trim()) {
			setPromoMessage('Введите промокод')
			setPromoStatus('error')
			configuratorStore.promoUse(null)
			return
		}

		setPromoLoading(true)
		setPromoMessage(null)

		try {
			await configuratorStore.applyPromo(form.promoCode)
			if (configuratorStore.promoAccepted) {
				setPromoStatus('success')
				setPromoMessage('Промокод применен')
			} else {
				setPromoStatus('error')
				setPromoMessage('Промокод не найден')
			}
		} catch (error) {
			console.error('Ошибка применения промокода', error)
			setPromoStatus('error')
			setPromoMessage('Не удалось проверить промокод. Попробуйте позже.')
		} finally {
			setPromoLoading(false)
		}
	}

	if (!visible) return null

	return (
		<div className={s.overlay} role="dialog" aria-modal="true">
			<div className={s.container}>
				<header className={s.header}>
					<h3 className={s.title}>Оформление заказа</h3>
					<button className={s.close} onClick={onClose} aria-label="Закрыть попап" disabled={isLoading}>
						<span aria-hidden="true">×</span>
					</button>
				</header>

			<section className={s.section}>
				<h4 className={s.sectionTitle}>Ваш заказ ({configuratorStore.cartItems.length} {configuratorStore.cartItems.length === 1 ? 'товар' : 'товара'})</h4>
			{configuratorStore.cartItems.map((item, index) => {
			const itemStrapName = item.strapModel?.attributes?.watch_strap?.strap_title || 'Ремешок'
			const itemFrameColor = item.frameColor?.color_name || ''
			const itemLeatherColor = item.leatherColor?.color_title || ''
			const itemStitchingColor = item.stitchingColor?.color_title || ''
			const itemEdgeColor = item.edgeColor?.color_title || ''
			const itemBuckleColor = item.buckleColor?.color_title || ''
			const itemAdapterColor = item.adapterColor?.color_title || ''
			const itemModelSize = item.watchModel?.watch_sizes?.find((s: any) => s.choosen)?.watch_size || ''
			// Используем сохраненную цену из корзины (уже включает все опции и пряжку-бабочку)
			const itemPrice = item.price || 0
			
			// Вычисляем цену со скидкой для этого товара (пропорционально)
			let itemPriceWithDiscount = itemPrice
			if (configuratorStore.promoAccepted && configuratorStore.usedPromo && productsPrice > 0) {
				const discountRatio = productsPriceWithDiscount / productsPrice
				itemPriceWithDiscount = itemPrice * discountRatio
			}
					
			const itemView1Url = getItemView1ImageUrl(item)
			const baseImageUrl = `${getMediaBaseUrl()}/uploads`
			
			// Генерируем URL для overlay слоев (цвета)
			const getOverlayUrl = (color: any, type: string) => {
				if (!color) return null
				// Проверяем динамические изображения из базы
				const dynamic = resolveMediaUrl(color.images?.view1)
				if (dynamic) return dynamic
				// Legacy путь
				const colorName = (color.color_title || '').toLowerCase()
				const strapName = item.strapModel?.attributes?.watch_strap?.strap_name || 'classic'
				return `${baseImageUrl}/${type}_${strapName}_${colorName}_1.png`
			}
			
			return (
				<div key={item.id || index} className={s.productCard} style={{ marginBottom: '16px' }}>
					<div className={s.productPreview} style={{ position: 'relative' }}>
						{itemView1Url ? (
							<>
								<img 
									src={itemView1Url} 
									alt={itemStrapName}
									style={{ 
										position: 'absolute',
										top: '50%',
										left: '50%',
										transform: 'translate(-50%, -50%)',
										width: '85%', 
										height: '85%', 
										objectFit: 'contain' 
									}}
								/>
								{/* Frame color overlay */}
								{item.frameColor && resolveMediaUrl(item.frameColor.view1Image) && (
									<img 
										src={resolveMediaUrl(item.frameColor.view1Image)!}
										alt=""
										style={{ 
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											width: '85%', 
											height: '85%', 
											objectFit: 'contain',
											zIndex: 1,
											pointerEvents: 'none'
										}}
									/>
								)}
								{/* Leather color overlay */}
								{item.leatherColor && getOverlayUrl(item.leatherColor, 'leather') && (
									<img 
										src={getOverlayUrl(item.leatherColor, 'leather')!}
										alt=""
										style={{ 
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											width: '85%', 
											height: '85%', 
											objectFit: 'contain',
											zIndex: 2,
											pointerEvents: 'none'
										}}
									/>
								)}
								{/* Stitching color overlay */}
								{item.stitchingColor && getOverlayUrl(item.stitchingColor, 'stitching') && (
									<img 
										src={getOverlayUrl(item.stitchingColor, 'stitching')!}
										alt=""
										style={{ 
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											width: '85%', 
											height: '85%', 
											objectFit: 'contain',
											zIndex: 2,
											pointerEvents: 'none'
										}}
									/>
								)}
								{/* Edge color overlay */}
								{item.edgeColor && getOverlayUrl(item.edgeColor, 'edge') && (
									<img 
										src={getOverlayUrl(item.edgeColor, 'edge')!}
										alt=""
										style={{ 
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											width: '85%', 
											height: '85%', 
											objectFit: 'contain',
											zIndex: 2,
											pointerEvents: 'none'
										}}
									/>
								)}
								{/* Buckle color overlay */}
								{item.buckleColor && getOverlayUrl(item.buckleColor, 'buckle') && (
									<img 
										src={getOverlayUrl(item.buckleColor, 'buckle')!}
										alt=""
										style={{ 
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											width: '85%', 
											height: '85%', 
											objectFit: 'contain',
											zIndex: 2,
											pointerEvents: 'none'
										}}
									/>
								)}
								{/* Adapter color overlay */}
								{item.adapterColor && getOverlayUrl(item.adapterColor, 'adapter') && (
									<img 
										src={getOverlayUrl(item.adapterColor, 'adapter')!}
										alt=""
										style={{ 
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											width: '85%', 
											height: '85%', 
											objectFit: 'contain',
											zIndex: 2,
											pointerEvents: 'none'
										}}
									/>
								)}
							</>
						) : (
							<div style={{ 
								width: '100%', 
								height: '100%', 
								display: 'flex', 
								alignItems: 'center', 
								justifyContent: 'center',
								background: '#f5f5f5',
								color: '#999'
							}}>
								Нет изображения
							</div>
						)}
					</div>
						<div className={s.productInfo}>
							<p className={s.productName}>
								{itemStrapName} / {itemLeatherColor}
							</p>
						<ul className={s.productDetails}>
							<li>Размер корпуса: {itemModelSize} мм</li>
							{itemFrameColor && <li>Цвет часов: {itemFrameColor}</li>}
							<li>Цвет адаптеров: {itemAdapterColor}</li>
							<li>Цвет пряжки: {itemBuckleColor}</li>
							<li>Цвет строчки: {itemStitchingColor}</li>
							<li>Цвет края: {itemEdgeColor}</li>
								{item.strapModel?.attributes?.watch_strap?.strap_params?.has_buckle_butterfly && (
									<li>
										Вид пряжки:{' '}
										{item.buckleButterfly ? 'Пряжка бабочка' : 'Стандартная'}
									</li>
								)}
								<li>
									Инициалы:{' '}
									{item.additionalOptions?.initials?.choosen
										? `${item.additionalOptions?.initials?.text || 'А.А.'} (+390 ₽)`
										: 'нет'}
								</li>
								<li>
									Подарочная коробка:{' '}
									{item.additionalOptions?.presentBox?.choosen ? 'да (+300 ₽)' : 'нет'}
								</li>
								<li>
									Открытка:{' '}
									{item.additionalOptions?.postCard?.choosen
										? `${item.additionalOptions?.postCard?.text || 'Надпись'} (+300 ₽)`
										: 'нет'}
								</li>
							</ul>
						</div>
					<div className={s.productTotals}>
						<span className={s.productTotalsTitle}>Цена</span>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
							{itemPriceWithDiscount < itemPrice ? (
								<>
									<span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>
										{formatCurrency(itemPrice)} ₽
									</span>
									<span className={s.productTotalsValue} style={{ color: '#10b981' }}>
										{formatCurrency(itemPriceWithDiscount)} ₽
									</span>
								</>
							) : (
								<span className={s.productTotalsValue}>{formatCurrency(itemPrice)} ₽</span>
							)}
						</div>
					</div>
					</div>
				)
				})}
				
			<div className={s.productCard}>
				<div className={s.productTotals} style={{ width: '100%', justifyContent: 'flex-end', gap: '8px' }}>
					<span className={s.productTotalsTitle}>Итого за товары:</span>
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						{productsPriceWithDiscount < productsPrice ? (
							<>
								<span style={{ textDecoration: 'line-through', color: '#999', fontSize: '16px' }}>
									{formatCurrency(productsPrice)} ₽
								</span>
								<span className={s.productTotalsValue} style={{ color: '#10b981' }}>
									{formatCurrency(productsPriceWithDiscount)} ₽
								</span>
							</>
						) : (
							<span className={s.productTotalsValue}>{formatCurrency(productsPrice)} ₽</span>
						)}
					</div>
				</div>
			</div>
			</section>

				<section className={s.section}>
					<h4 className={s.sectionTitle}>Контактные данные</h4>
					<div className={s.inputsGrid}>
						<TextField
							label="Email"
							type="email"
							placeholder="example@site.com"
							value={form.email}
							onChange={(e) => updateForm({ email: e.target.value }, ['email'])}
							disabled={isLoading}
							error={!!errors.email}
							helperText={errors.email}
							required
							fullWidth
							size="small"
						/>
						<TextField
							label="Телефон"
							type="tel"
							placeholder="+7 (999) 999-99-99"
							value={form.phone}
							onChange={(e) => updateForm({ phone: e.target.value }, ['phone'])}
							disabled={isLoading}
							error={!!errors.phone}
							helperText={errors.phone}
							required
							fullWidth
							size="small"
						/>
					</div>
				</section>

				<section className={s.section}>
					<h4 className={s.sectionTitle}>Доставка</h4>
					<div className={deliveryStyles.section}>
						<div className={deliveryStyles.field}>
							{(() => {
								console.log('[City Selector] State:', {
									isCityLoading,
									citySuggestionsLength: citySuggestions.length,
									formCity: form.city,
									showSkeleton: isCityLoading && citySuggestions.length <= 1
								})
								return null
							})()}
							<FormControl fullWidth error={!!errors.city} size="small">
								<InputLabel>Город *</InputLabel>
								<Select
										value={citySuggestions.length > 0 && form.city 
											? citySuggestions.find(c => {
												const cityName = c.data?.city || c.data?.settlement || c.value || ''
												return cityName === form.city || c.value === form.city
											})?.value || (citySuggestions.length > 0 ? citySuggestions[0].value : '')
											: (citySuggestions.length > 0 ? citySuggestions[0].value : '')
										}
									onChange={(event) => {
										console.log('[MUI Select] onChange triggered!', event.target.value)
										const selectedValue = event.target.value as string
										console.log('[MUI Select] selectedValue:', selectedValue)
										const city = citySuggestions.find((c) => c.value === selectedValue)
										console.log('[MUI Select] Found city:', city)
										if (city) {
											console.log('[MUI Select] Calling handleCitySelectFromDadata...')
											handleCitySelectFromDadata(city)
										} else {
											console.warn('[MUI Select] City not found in citySuggestions!')
										}
									}}
										disabled={isLoading}
										label="Город *"
									>
										{citySuggestions.length === 0 ? (
											<MenuItem value="">Загрузка...</MenuItem>
										) : (
											citySuggestions.map((city, index) => {
												const cityName = city.data?.city || city.data?.settlement || city.value || ''
												const region = city.data?.region_with_type || city.data?.region || ''
												return (
													<MenuItem key={index} value={city.value}>
														{cityName} {region ? `(${region})` : ''}
													</MenuItem>
												)
											})
									)}
								</Select>
								{errors.city && <FormHelperText>{errors.city}</FormHelperText>}
							</FormControl>
						</div>

						<div className={deliveryStyles.sectionDivider} />

						<div className={deliveryStyles.field}>
							<div className={deliveryStyles.labelRow}>
								<span>Способ доставки*</span>
							</div>
							<div className={deliveryStyles.section}>
								{isTariffsLoading && tariffs.length === 0 ? (
									<>
										<div className={`${deliveryStyles.skeleton} ${deliveryStyles.skeletonDeliveryOption}`} />
										<div className={`${deliveryStyles.skeleton} ${deliveryStyles.skeletonDeliveryOption}`} />
										<div className={`${deliveryStyles.skeleton} ${deliveryStyles.skeletonDeliveryOption}`} />
									</>
								) : (
									filteredDeliveryOptions.map((option) => {
									const isActive = form.deliveryValue === option.value
									
									// Формируем строку с временем и ценой по аналогии с custom (вместе через запятую)
									let timeAndPrice = ''
									if (option.time && typeof option.price === 'number') {
										const priceText = `${option.priceFixed ? '' : 'от '}${formatCurrency(option.price)} ₽`
										timeAndPrice = `${option.time}, ${priceText}`
									} else if (option.time) {
										timeAndPrice = option.time
									} else if (typeof option.price === 'number') {
										timeAndPrice = `${option.priceFixed ? '' : 'от '}${formatCurrency(option.price)} ₽`
									} else {
										timeAndPrice = '—'
									}
									
									return (
										<label
											key={option.value}
											className={[
												deliveryStyles.deliveryOption,
												isActive ? deliveryStyles.deliveryOptionActive : ''
											].join(' ')}
										>
											<input
												type="radio"
												className={deliveryStyles.radio}
												name="delivery-type"
												value={option.value}
												checked={isActive}
												onChange={() =>
													updateForm(
														(prev) => ({
															deliveryValue: option.value,
															pickupPoint: option.requiresPvz ? prev.pickupPoint : '',
															deliveryPointData: option.requiresPvz
																? prev.deliveryPointData
																: null,
															street: option.requiresCourierAddress ? prev.street : '',
															streetFiasId: option.requiresCourierAddress
																? prev.streetFiasId
																: null,
															building: option.requiresCourierAddress ? prev.building : '',
															courierAddress: option.requiresCourierAddress
																? prev.courierAddress
																: '',
															mailAddress: option.requiresMailAddress ? prev.mailAddress : ''
														}),
														['pickupPoint', 'street', 'building', 'courierAddress', 'mailAddress']
													)
												}
												disabled={isLoading}
											/>
											<div className={deliveryStyles.deliveryOptionContent}>
												<span className={deliveryStyles.deliveryOptionTitle}>{option.label}</span>
												<div className={deliveryStyles.deliveryOptionMeta}>
													<span>{timeAndPrice}</span>
												</div>
												{option.note && (
													<p className={deliveryStyles.deliveryOptionNote}>{option.note}</p>
												)}
											</div>
										</label>
									)
								}))}
							</div>
						</div>

						{currentDeliveryOption.requiresPvz && (
							<>
								<div className={deliveryStyles.sectionDivider} />
								<div className={deliveryStyles.field}>
									{(() => {
										console.log('[PVZ Selector] State:', {
											city: form.city,
											cityCode: form.cityCode,
											isPvzLoading,
											pvzListLength: pvzList.length,
											firstPvz: pvzList[0]?.name,
											showSkeleton: (isPvzLoading && pvzList.length === 0) || (!form.cityCode && form.city)
										})
										return null
									})()}
									{form.city ? (
										<FormControl fullWidth error={!!errors.pickupPoint} size="small">
											<InputLabel>Пункт выдачи *</InputLabel>
											<Select
													value={form.deliveryPointData?.code || ''}
													onChange={(event) => {
														const pvzCode = event.target.value as string
														const pvz = pvzList.find((p) => p.code === pvzCode)
														if (pvz) {
															handlePvzSelect(pvz)
														}
													}}
													disabled={isLoading || (pvzList.length === 0 && !!form.cityCode)}
													label="Пункт выдачи *"
												>
													<MenuItem value="">
														{pvzList.length === 0 
															? 'Пункты выдачи не найдены' 
															: 'Выберите пункт выдачи'
														}
													</MenuItem>
													{pvzList.map((pvz) => (
														<MenuItem key={pvz.code} value={pvz.code}>
															{pvz.name}, {pvz.address}
														</MenuItem>
												))}
											</Select>
											{errors.pickupPoint && <FormHelperText>{errors.pickupPoint}</FormHelperText>}
										</FormControl>
									) : (
										<p className={deliveryStyles.helper}>Сначала выберите город.</p>
									)}
									{/* Карта с пунктами выдачи (по аналогии с custom - отображается когда город выбран и карта готова) */}
									{form.city && currentDeliveryOption.requiresPvz && mapReady && (
										<div
											id="cdek-delivery-map"
											ref={mapContainerRef}
											className={deliveryStyles.mapContainer}
											style={{ width: '100%', height: '400px', marginTop: '16px' }}
										/>
									)}
								</div>
							</>
						)}

						{/* ФИО получателя внутри секции доставки */}
						<div className={deliveryStyles.sectionDivider} />
						<div className={deliveryStyles.field}>
							<div className={deliveryStyles.labelRow}>
								<span>Получатель (ФИО полностью)*</span>
							</div>
							<input
								className={[
									deliveryStyles.input,
									errors.name ? deliveryStyles.inputError : ''
								].join(' ')}
								placeholder="Иванов Иван Иванович"
								value={form.name}
								onChange={handleFieldChange('name')}
								disabled={isLoading}
							/>
							{errors.name && <p className={deliveryStyles.errorText}>{errors.name}</p>}
						</div>

						{currentDeliveryOption.requiresCourierAddress && (
							<>
								<div className={deliveryStyles.sectionDivider} />
								<div className={deliveryStyles.field}>
									<div className={deliveryStyles.labelRow}>
										<span>Улица*</span>
										{isStreetLoading && (
											<span className={deliveryStyles.loader}>Подбираем варианты...</span>
										)}
									</div>
									<div className={deliveryStyles.suggestions}>
										<input
											className={[
												deliveryStyles.input,
												errors.street ? deliveryStyles.inputError : ''
											].join(' ')}
											placeholder="Например, Тверская"
											value={streetQuery}
											onChange={(event) => {
												const value = event.target.value
												setStreetQuery(value)
												setStreetSuggestions([])
												updateForm(
													(prev) => ({
														street: value,
														streetFiasId: null,
														courierAddress: [value, prev.building].filter(Boolean).join(', ')
													}),
													['street', 'courierAddress']
												)
											}}
											disabled={isLoading}
										/>
										{streetSuggestions.length > 0 && (
											<div className={deliveryStyles.suggestionsList}>
												{streetSuggestions.map((suggestion, index) => (
													<button
														type="button"
														key={`${suggestion.value}-${index}`}
														className={deliveryStyles.suggestionsItem}
														onClick={() => handleStreetSelect(suggestion)}
													>
														<span>{suggestion.value}</span>
													</button>
												))}
											</div>
										)}
									</div>
									{errors.street && <p className={deliveryStyles.errorText}>{errors.street}</p>}
								</div>

								<div className={deliveryStyles.field}>
									<div className={deliveryStyles.labelRow}>
										<span>Дом*</span>
										{isBuildingLoading && (
											<span className={deliveryStyles.loader}>Ищем дома...</span>
										)}
									</div>
									<div className={deliveryStyles.suggestions}>
										<input
											className={[
												deliveryStyles.input,
												errors.building ? deliveryStyles.inputError : ''
											].join(' ')}
											placeholder="Например, 15"
											value={buildingQuery}
											onChange={(event) => {
												const value = event.target.value
												setBuildingQuery(value)
												setBuildingSuggestions([])
												updateForm(
													(prev) => ({
														building: value,
														courierAddress: [prev.street || streetQuery, value]
															.filter(Boolean)
															.join(', ')
													}),
													['building', 'courierAddress']
												)
											}}
											disabled={isLoading || !form.street}
										/>
										{buildingSuggestions.length > 0 && (
											<div className={deliveryStyles.suggestionsList}>
												{buildingSuggestions.map((suggestion, index) => (
													<button
														type="button"
														key={`${suggestion.value}-${index}`}
														className={deliveryStyles.suggestionsItem}
														onClick={() => handleBuildingSelect(suggestion)}
													>
														<span>{suggestion.value}</span>
													</button>
												))}
											</div>
										)}
									</div>
									{errors.building && <p className={deliveryStyles.errorText}>{errors.building}</p>}
									{errors.courierAddress && (
										<p className={deliveryStyles.errorText}>{errors.courierAddress}</p>
									)}
								</div>
							</>
						)}

						{currentDeliveryOption.requiresMailAddress && (
							<>
								<div className={deliveryStyles.sectionDivider} />
								<div className={deliveryStyles.field}>
									<div className={deliveryStyles.labelRow}>
										<span>Адрес отделения*</span>
									</div>
									<input
										className={[
											deliveryStyles.input,
											errors.mailAddress ? deliveryStyles.inputError : ''
										].join(' ')}
										placeholder="Индекс, улица, отделение"
										value={form.mailAddress}
										onChange={handleFieldChange('mailAddress')}
										disabled={isLoading}
									/>
									{errors.mailAddress && (
										<p className={deliveryStyles.errorText}>{errors.mailAddress}</p>
									)}
								</div>
							</>
						)}

						{currentDeliveryOption.note && (
							<p className={deliveryStyles.deliveryOptionNote}>{currentDeliveryOption.note}</p>
						)}
					</div>
				</section>

				<section className={s.section}>
					<div className={s.field}>
						<label className={s.label}>Комментарий к заказу</label>
						<textarea
							className={s.textarea}
							placeholder="Например, обхват запястья или пожелания к заказу"
							value={form.comment}
							onChange={handleFieldChange('comment')}
							disabled={isLoading}
							rows={3}
						/>
					</div>
				</section>

				<section className={s.section}>
					<h4 className={s.sectionTitle}>Промокод</h4>
					<div className={s.promoRow}>
						<TextField
							placeholder="Введите промокод"
							value={form.promoCode}
							onChange={(e) => updateForm({ promoCode: e.target.value })}
							disabled={isLoading || promoLoading}
							size="small"
							sx={{ flex: 1 }}
						/>
						<Button
							variant="contained"
							onClick={handleApplyPromo}
							disabled={isLoading || promoLoading}
							sx={{ textTransform: 'none' }}
						>
							{promoLoading ? 'Проверяем...' : 'Применить'}
						</Button>
					</div>
					{promoMessage && (
						<p
							className={`${s.promoMessage} ${promoStatus === 'success' ? s.promoMessageSuccess : s.promoMessageError}`}
						>
							{promoMessage}
						</p>
					)}
				</section>

				<section className={s.sectionCheckbox}>
					<label className={s.checkboxLabel}>
						<input
							type="checkbox"
							checked={form.remember}
							onChange={handleRememberToggle}
							className={s.checkbox}
							disabled={isLoading}
						/>
						<span>Запомнить эти контакты в браузере для повторной покупки</span>
					</label>
				</section>

		<section className={s.sectionTotals}>
			<div className={s.totalsRow}>
				<span>Товары ({configuratorStore.cartItems.length} {configuratorStore.cartItems.length === 1 ? 'шт' : 'шт'})</span>
				<strong>{formatCurrency(productsPrice)} ₽</strong>
			</div>
			{configuratorStore.promoAccepted && configuratorStore.usedPromo && productsPriceWithDiscount < productsPrice && (
				<div className={s.totalsRow} style={{ color: '#10b981' }}>
					<span>Скидка по промокоду ({configuratorStore.usedPromo.code})</span>
					<strong>-{formatCurrency(productsPrice - productsPriceWithDiscount)} ₽</strong>
				</div>
			)}
			<div className={s.totalsRow}>
				<span>Доставка</span>
				<strong>{formatCurrency(configuratorStore.deliveryPrice || 0)} ₽</strong>
			</div>
			<div className={s.totalsSummary}>
				<span>Итого</span>
				<div className={s.totalValues}>
					<span
						className={`${s.totalDefault} ${
							totalPriceWithDiscount !== totalPrice ? s.totalDefaultStriked : ''
						}`}
					>
						{formatCurrency(totalPrice)} ₽
					</span>
					{totalPriceWithDiscount !== totalPrice && (
						<span className={s.totalDiscount}>{formatCurrency(totalPriceWithDiscount)} ₽</span>
					)}
				</div>
			</div>
			<p className={s.readyDate}>
				Примерная дата готовности: <span>{configuratorStore.closestReadyDate}</span>
			</p>
			<p className={s.readyDate}>Перед отправкой пришлём подробный видеообзор вашего ремешка.</p>
		</section>

				{errors.general && <div className={s.errorBanner}>{errors.general}</div>}

				<section className={s.actions}>
					<Button
						variant="contained"
						size="large"
						fullWidth
						onClick={submitOrder}
						disabled={isLoading}
						sx={{ py: 1.5, fontSize: '16px', textTransform: 'none' }}
					>
						{isLoading ? 'Отправляем...' : 'Оплатить заказ'}
					</Button>
				</section>

				<footer className={s.footer}>
					<p className={s.policy}>
						Нажимая «Оплатить», вы соглашаетесь с{' '}
						<a href="https://slavalarionov.com/slavalarionovstore/policy" target="_blank" rel="noreferrer">
							политикой конфиденциальности
						</a>
						.
					</p>
				</footer>
			</div>
		</div>
	)
})
