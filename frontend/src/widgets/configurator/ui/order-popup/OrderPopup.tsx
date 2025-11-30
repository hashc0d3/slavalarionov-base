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
import type { CDEKWidgetInstance, CDEKWidgetPoint } from '@/types/cdek-widget'

declare global {
	interface Window {
		CDEKWidget?: new (options: any) => CDEKWidgetInstance
	}
}

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
		price: 250,
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
		note: 'По готовности заказа согласуем удобное время. Забор с производства по адресу Масляный переулок, 7.'
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
	city: DEFAULT_CITY_NAME,
	cityCode: DEFAULT_CITY_CODE,
	cityUuid: DEFAULT_CITY_UUID,
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
	const [activePayment, setActivePayment] = useState<'card' | 'sbp'>('card')
	const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>(initialDeliveryOptions)
	const [cityQuery, setCityQuery] = useState('')
	const [citySuggestions, setCitySuggestions] = useState<CdekCity[]>([])
	const [isCityLoading, setIsCityLoading] = useState(false)
	const [pvzList, setPvzList] = useState<CdekPvz[]>([])
	const [pvzQuery, setPvzQuery] = useState('')
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

	// Актуализируем стоимость доставки
	useEffect(() => {
		const option = deliveryOptions.find((item) => item.value === form.deliveryValue)
		configuratorStore.deliveryPrice = option?.price ?? 0
	}, [deliveryOptions, form.deliveryValue])

	useEffect(() => {
		if (!visible) return
		if (!form.remember && typeof window !== 'undefined') {
			localStorage.removeItem(REMEMBER_KEY)
		}
	}, [form.remember, visible])

useEffect(() => {
	if (!visible) return
	if (defaultCityAppliedRef.current) return
	
	// Если город уже установлен и это не дефолтный, просто помечаем как примененный
	if (form.cityCode && form.city.trim() && form.city !== DEFAULT_CITY_NAME) {
		defaultCityAppliedRef.current = true
		return
	}
	
	// Устанавливаем город по умолчанию сразу
	setCityQuery(DEFAULT_CITY_NAME)
	if (!form.cityCode || form.city !== DEFAULT_CITY_NAME) {
		updateForm(
			() => ({
				city: DEFAULT_CITY_NAME,
				cityCode: DEFAULT_CITY_CODE,
				cityUuid: DEFAULT_CITY_UUID
			}),
			['city']
		)
	}

	// Пытаемся получить актуальные данные из API (но не блокируем работу)
	let cancelled = false
	setIsCityLoading(true)
	isSettingDefaultCityRef.current = true

	deliveryApi
		.searchCities(DEFAULT_CITY_NAME)
		.then((cities) => {
			if (cancelled || !visible) return
			let target =
				cities.find(
					(city) =>
						city.cityName?.toLowerCase().includes('санкт') ||
						city.cityName?.toLowerCase().includes('spb'),
				) || cities[0]

			if (target) {
				setCityQuery(target.cityName)
				updateForm(
					() => ({
						city: target.cityName,
						cityCode: target.cityCode ?? DEFAULT_CITY_CODE,
						cityUuid: target.cityUuid || DEFAULT_CITY_UUID
					}),
					['city']
				)
			}
		})
		.catch((error) => {
			console.error('Failed to preload default city', error)
			// Город уже установлен по умолчанию, просто игнорируем ошибку
		})
		.finally(() => {
			if (!cancelled) {
				setIsCityLoading(false)
				isSettingDefaultCityRef.current = false
				defaultCityAppliedRef.current = true
			}
		})

	return () => {
		cancelled = true
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
}, [visible])

	useEffect(() => {
		if (!visible) return
		if (!cityQuery || cityQuery.length < 2 || cityQuery === form.city) {
			setCitySuggestions([])
			setIsCityLoading(false)
			return
		}

		setIsCityLoading(true)
		const handler = setTimeout(async () => {
			try {
				const suggestions = await deliveryApi.searchCities(cityQuery)
				setCitySuggestions(suggestions)
			} catch (error) {
				console.error('Failed to load CDEK cities', error)
				setCitySuggestions([])
			} finally {
				setIsCityLoading(false)
			}
		}, 300)

		return () => clearTimeout(handler)
	}, [cityQuery, form.city, visible])

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

	useEffect(() => {
		if (!form.cityCode) {
			setPvzList([])
			setTariffs([])
			return
		}

		setIsPvzLoading(true)
		setPvzQuery('')
		setForm((prev) => ({ ...prev, deliveryPointData: null, pickupPoint: '' }))
		setErrors((prev) => {
			if (!prev.pickupPoint) return prev
			const next = { ...prev }
			delete next.pickupPoint
			return next
		})

		deliveryApi
			.getPvzList(form.cityCode)
			.then((points) => {
				setPvzList(points)
			})
			.catch((error) => {
				console.error('Failed to load CDEK PVZ list', error)
				setPvzList([])
			})
			.finally(() => setIsPvzLoading(false))

		setIsTariffsLoading(true)
		deliveryApi
			.calculateTariffs(form.cityCode)
			.then((items) => {
				setTariffs(items)
			})
			.catch((error) => {
				console.error('Failed to calculate CDEK tariffs', error)
				setTariffs([])
			})
			.finally(() => setIsTariffsLoading(false))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.cityCode])

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
			return {
				...option,
				price: matched.price,
				time: `от ${days} ${days === 1 ? 'дня' : 'дней'}`
			}
		})

		setDeliveryOptions(nextOptions)
	}, [tariffs])

	const currentDeliveryOption =
		deliveryOptions.find((item) => item.value === form.deliveryValue) ??
		deliveryOptions[0] ??
		initialDeliveryOptions[0]

	const productsPrice = configuratorStore.productsPrice || 0
	const productsPriceWithDiscount = configuratorStore.productsPriceWithDiscount || productsPrice
	const totalPrice = configuratorStore.totalPrice || productsPrice
	const totalPriceWithDiscount = configuratorStore.totalPriceWithDiscount || productsPriceWithDiscount
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

	const filteredPvzList = useMemo(() => {
		if (!pvzQuery.trim()) return pvzList
		const lower = pvzQuery.trim().toLowerCase()
		return pvzList.filter((item) => {
			const name = item.name?.toLowerCase() || ''
			const address = item.address?.toLowerCase() || ''
			const code = item.code?.toLowerCase() || ''
			return name.includes(lower) || address.includes(lower) || code.includes(lower)
		})
	}, [pvzList, pvzQuery])

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
			return
		}

		console.log('[CDEK Map] Starting script load...')

		if (window.CDEKWidget) {
			console.log('[CDEK Map] Widget already loaded')
			setMapReady(true)
			return
		}

		// Пробуем несколько вариантов URL для загрузки виджета
		const scriptUrls = [
			'https://widget.cdek.ru/widget/widjet.js',
			'https://widget.cdek.ru/widget/scripts/widjet.js',
			'https://widget.cdek.ru/widjet.js'
		]

		let currentUrlIndex = 0
		const tryLoadScript = () => {
			if (currentUrlIndex >= scriptUrls.length) {
				console.error('[CDEK Map] All script URLs failed. Widget will not be available.')
				// Виджет недоступен, но можно работать со списком ПВЗ
				setMapReady(false)
				return
			}

			const script = document.createElement('script')
			script.id = 'ISDEKscript'
			script.type = 'text/javascript'
			script.src = scriptUrls[currentUrlIndex]
			script.async = true
			script.charset = 'utf-8'
			
			script.onload = () => {
				console.log('[CDEK Map] Script loaded successfully from:', scriptUrls[currentUrlIndex])
				console.log('[CDEK Map] CDEKWidget available:', !!window.CDEKWidget)
				setMapReady(true)
			}
			
			script.onerror = (error) => {
				console.warn(`[CDEK Map] Failed to load from ${scriptUrls[currentUrlIndex]}, trying next...`)
				currentUrlIndex++
				// Удаляем неудачный скрипт
				if (script.parentNode) {
					script.parentNode.removeChild(script)
				}
				// Пробуем следующий URL
				setTimeout(tryLoadScript, 100)
			}
			
			document.body.appendChild(script)
			console.log('[CDEK Map] Attempting to load script from:', scriptUrls[currentUrlIndex])
		}

		tryLoadScript()

		return () => {
			// Удаляем все возможные скрипты виджета
			scriptUrls.forEach(url => {
				const existingScript = document.getElementById('ISDEKscript')
				if (existingScript && existingScript.parentNode) {
					existingScript.parentNode.removeChild(existingScript)
					console.log('[CDEK Map] Script removed from DOM')
				}
			})
		}
	}, [visible, currentDeliveryOption.requiresPvz])

	// Инициализация карты
	useEffect(() => {
		console.log('[CDEK Map] Init effect triggered:', {
			visible,
			mapReady,
			hasWidget: !!window.CDEKWidget,
			city: form.city,
			cityCode: form.cityCode,
			requiresPvz: currentDeliveryOption.requiresPvz,
			hasContainer: !!mapContainerRef.current
		})

		if (!visible || !mapReady || !window.CDEKWidget || !form.city || !currentDeliveryOption.requiresPvz) {
			console.log('[CDEK Map] Skipping map init - conditions not met')
			return
		}

		if (!mapContainerRef.current) {
			console.log('[CDEK Map] Container ref not available')
			return
		}

		// Уничтожаем предыдущий экземпляр карты
		if (mapInstanceRef.current && typeof mapInstanceRef.current.destroy === 'function') {
			console.log('[CDEK Map] Destroying previous map instance')
			mapInstanceRef.current.destroy()
		}

		try {
			const widgetOptions = {
				from: form.city || DEFAULT_CITY_NAME,
				root: 'cdek-delivery-map',
				apiKey: cdekWidgetApiKey,
				postal_code: 190000,
				servicePath: '/api/delivery/cdek',
				defaultLocation: form.city || DEFAULT_CITY_NAME,
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
					console.log('[CDEK Map] Widget ready callback fired')
				}
			}

			console.log('[CDEK Map] Initializing widget with options:', {
				...widgetOptions,
				apiKey: widgetOptions.apiKey ? `${widgetOptions.apiKey.substring(0, 10)}...` : 'missing'
			})

			const widgetInstance = new window.CDEKWidget(widgetOptions)
			mapInstanceRef.current = widgetInstance
			console.log('[CDEK Map] Widget instance created:', widgetInstance)
		} catch (error) {
			console.error('[CDEK Map] Failed to initialize CDEK Widget:', error)
		}

		return () => {
			if (mapInstanceRef.current && typeof mapInstanceRef.current.destroy === 'function') {
				console.log('[CDEK Map] Cleaning up map instance')
				mapInstanceRef.current.destroy()
				mapInstanceRef.current = null
			}
		}
	}, [visible, mapReady, form.city, form.cityCode, currentDeliveryOption.requiresPvz, cdekWidgetApiKey, pvzList])

	// Обновление локации карты при изменении города
	useEffect(() => {
		if (mapInstanceRef.current && form.cityCode && form.city) {
			console.log('[CDEK Map] Updating location:', { cityCode: form.cityCode, city: form.city })
			// Находим координаты города из списка городов или используем координаты первого ПВЗ
			const cityCoords = citySuggestions.find((c) => c.cityCode === form.cityCode)
			if (cityCoords && cityCoords.latitude && cityCoords.longitude) {
				console.log('[CDEK Map] Using city coordinates:', [cityCoords.longitude, cityCoords.latitude])
				mapInstanceRef.current.updateLocation([cityCoords.longitude, cityCoords.latitude])
			} else if (pvzList.length > 0 && pvzList[0].coordX && pvzList[0].coordY) {
				console.log('[CDEK Map] Using PVZ coordinates:', [pvzList[0].coordX, pvzList[0].coordY])
				mapInstanceRef.current.updateLocation([pvzList[0].coordX, pvzList[0].coordY])
			} else {
				console.log('[CDEK Map] No coordinates available for update')
			}
		}
	}, [form.cityCode, form.city, citySuggestions, pvzList])

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
			deliveryOptions.find((item) => item.value === form.deliveryValue) ?? currentDeliveryOption

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

	const submitOrder = async (payment: 'card' | 'sbp') => {
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

			if (configuratorStore.steps.strap.isChoosen && configuratorStore.selectedStrapModel) {
				allItems.push({
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
				})
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
			const paymentType = payment === 'card' ? 'Банковской картой' : 'Оплата через СБП'

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
			const paymentMode = payment === 'sbp' ? ['sbp'] : ['card']
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
				<button className={s.close} onClick={onClose} aria-label="Закрыть попап" disabled={isLoading}>
					<span aria-hidden="true">×</span>
				</button>

				<header className={s.header}>
					<h3 className={s.title}>Оформление заказа</h3>
				</header>

				<section className={s.section}>
					<h4 className={s.sectionTitle}>Ваш заказ</h4>
					<div className={s.productCard}>
						<div className={s.productPreview}>
							<StrapDesignPreview className={s.productPreviewCanvas} layout="flex" variant="final" />
						</div>
						<div className={s.productInfo}>
							<p className={s.productName}>
								{selectedStrapName} / {selectedLeatherColorTitle}
							</p>
							<ul className={s.productDetails}>
								<li>Размер корпуса: {configuratorStore.steps.model.modelSize} мм</li>
								<li>Цвет адаптеров: {selectedAdapterColorTitle}</li>
								<li>Цвет пряжки: {selectedBuckleColorTitle}</li>
								<li>Цвет строчки: {selectedStitchingColorTitle}</li>
								<li>Цвет края: {selectedEdgeColorTitle}</li>
								{configuratorStore.selectedStrapModel?.attributes.watch_strap.strap_params?.has_buckle_butterfly && (
									<li>
										Вид пряжки:{' '}
										{configuratorStore.steps.strapDesign.buckleButterflyChoosen
											? 'Пряжка бабочка'
											: 'Стандартная'}
									</li>
								)}
								<li>
									Инициалы:{' '}
									{configuratorStore.steps.final.additionalOptions.initials.choosen
										? `да (+${configuratorStore.steps.final.additionalOptions.initials.price} ₽)`
										: 'нет'}
								</li>
								<li>
									Подарочная коробка:{' '}
									{configuratorStore.steps.final.additionalOptions.presentBox.choosen
										? `да (+${configuratorStore.steps.final.additionalOptions.presentBox.price} ₽)`
										: 'нет'}
								</li>
								<li>
									Открытка:{' '}
									{configuratorStore.steps.final.additionalOptions.postCard.choosen
										? `да (+${configuratorStore.steps.final.additionalOptions.postCard.price} ₽)`
										: 'нет'}
								</li>
							</ul>
						</div>
						<div className={s.productTotals}>
							<span className={s.productTotalsTitle}>Сумма</span>
							<span className={s.productTotalsValue}>{formatCurrency(productsPrice)} ₽</span>
						</div>
					</div>
				</section>

				<section className={s.section}>
					<h4 className={s.sectionTitle}>Контактные данные</h4>
					<div className={s.inputsGrid}>
						<div className={s.field}>
							<label className={s.label}>ФИО*</label>
							<input
								className={`${s.input} ${errors.name ? s.inputError : ''}`}
								placeholder="Иванов Иван Иванович"
								value={form.name}
								onChange={handleFieldChange('name')}
								disabled={isLoading}
							/>
							{errors.name && <p className={s.errorText}>{errors.name}</p>}
						</div>
						<div className={s.field}>
							<label className={s.label}>Телефон*</label>
							<input
								className={`${s.input} ${errors.phone ? s.inputError : ''}`}
								placeholder="+7 (999) 999-99-99"
								value={form.phone}
								onChange={handleFieldChange('phone')}
								disabled={isLoading}
							/>
							{errors.phone && <p className={s.errorText}>{errors.phone}</p>}
						</div>
						<div className={s.field}>
							<label className={s.label}>Email*</label>
							<input
								className={`${s.input} ${errors.email ? s.inputError : ''}`}
								type="email"
								placeholder="example@site.com"
								value={form.email}
								onChange={handleFieldChange('email')}
								disabled={isLoading}
							/>
							{errors.email && <p className={s.errorText}>{errors.email}</p>}
						</div>
					</div>
				</section>

				<section className={s.section}>
					<h4 className={s.sectionTitle}>Доставка</h4>
					<div className={deliveryStyles.section}>
						<div className={deliveryStyles.field}>
							<div className={deliveryStyles.labelRow}>
								<span>Город*</span>
								{isCityLoading && <span className={deliveryStyles.loader}>Загрузка...</span>}
							</div>
							<div className={deliveryStyles.suggestions}>
								<input
									className={[
										deliveryStyles.input,
										errors.city ? deliveryStyles.inputError : ''
									].join(' ')}
									placeholder="Начните вводить город"
									value={cityQuery}
									onChange={(event) => {
										const value = event.target.value
										setCityQuery(value)
										setCitySuggestions([])
										updateForm(
											() => ({
												city: value,
												cityCode: null,
												cityUuid: null
											}),
											['city']
										)
									}}
									disabled={isLoading}
								/>
								{citySuggestions.length > 0 && (
									<div className={deliveryStyles.suggestionsList}>
										{citySuggestions.map((city) => (
											<button
												type="button"
												key={`${city.cityCode}-${city.cityName}`}
												className={deliveryStyles.suggestionsItem}
												onClick={() => handleCitySelect(city)}
											>
												<span>{city.cityName}</span>
												{city.region && (
													<span className={deliveryStyles.helper}>{city.region}</span>
												)}
											</button>
										))}
									</div>
								)}
							</div>
							{!isCityLoading &&
								cityQuery.length >= 2 &&
								citySuggestions.length === 0 &&
								cityQuery !== form.city && (
									<p className={deliveryStyles.helper}>Выберите город из списка CDEK.</p>
								)}
							{errors.city && <p className={deliveryStyles.errorText}>{errors.city}</p>}
						</div>

						<div className={deliveryStyles.sectionDivider} />

						<div className={deliveryStyles.field}>
							<div className={deliveryStyles.labelRow}>
								<span>Способ доставки*</span>
								{isTariffsLoading && (
									<span className={deliveryStyles.loader}>Обновляем тарифы...</span>
								)}
							</div>
							<div className={deliveryStyles.section}>
								{deliveryOptions.map((option) => {
									const isActive = form.deliveryValue === option.value
									const priceLabel =
										typeof option.price === 'number'
											? `${option.priceFixed ? '' : 'от '}${formatCurrency(option.price)} ₽`
											: '—'
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
													{option.time && <span>{option.time}</span>}
													<span>{priceLabel}</span>
												</div>
												{option.note && (
													<p className={deliveryStyles.deliveryOptionNote}>{option.note}</p>
												)}
											</div>
										</label>
									)
								})}
							</div>
						</div>

						{currentDeliveryOption.requiresPvz && (
							<>
								<div className={deliveryStyles.sectionDivider} />
								<div className={deliveryStyles.field}>
									<div className={deliveryStyles.labelRow}>
										<span>Пункт выдачи*</span>
										{isPvzLoading && (
											<span className={deliveryStyles.loader}>Загрузка пунктов...</span>
										)}
									</div>
									{form.cityCode && form.city ? (
										<>
											{!mapReady && (
												<p className={deliveryStyles.helper}>Загрузка карты...</p>
											)}
											<div
												id="cdek-delivery-map"
												ref={mapContainerRef}
												className={deliveryStyles.deliveryMap}
												style={{
													display: mapReady ? 'block' : 'none',
													width: '100%',
													height: '500px',
													marginTop: '20px',
													background: '#f0f0f0'
												}}
											/>
											{form.deliveryPointData && (
												<div className={deliveryStyles.selectedPoint}>
													<p className={deliveryStyles.selectedPointTitle}>Выбранный пункт:</p>
													<p className={deliveryStyles.selectedPointName}>
														{form.deliveryPointData.name}
													</p>
													<p className={deliveryStyles.selectedPointAddress}>
														{form.deliveryPointData.address}
													</p>
													{form.deliveryPointData.workTime && (
														<p className={deliveryStyles.selectedPointWorktime}>
															Время работы: {form.deliveryPointData.workTime}
														</p>
													)}
													{form.deliveryPointData.phone && (
														<p className={deliveryStyles.selectedPointPhone}>
															Телефон: {form.deliveryPointData.phone}
														</p>
													)}
													{form.deliveryPointData.code && (
														<p className={deliveryStyles.selectedPointCode}>
															Код: {form.deliveryPointData.code}
														</p>
													)}
												</div>
											)}
										</>
									) : (
										<p className={deliveryStyles.helper}>Сначала выберите город.</p>
									)}
									{errors.pickupPoint && (
										<p className={deliveryStyles.errorText}>{errors.pickupPoint}</p>
									)}
								</div>
							</>
						)}

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
						<input
							className={`${s.input} ${s.inputPromo}`}
							placeholder="Введите промокод"
							value={form.promoCode}
							onChange={handleFieldChange('promoCode')}
							disabled={isLoading || promoLoading}
						/>
						<button
							className={s.promoButton}
							onClick={handleApplyPromo}
							disabled={isLoading || promoLoading}
						>
							{promoLoading ? 'Проверяем...' : 'Применить'}
						</button>
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
						<span>Стоимость ремешка</span>
						<strong>{formatCurrency(configuratorStore.selectedStrapPrice)} ₽</strong>
					</div>
					<div className={s.totalsRow}>
						<span>Дополнительные опции</span>
						<strong>{formatCurrency(configuratorStore.additionalOptionsSum)} ₽</strong>
					</div>
					<div className={s.totalsRow}>
						<span>Доставка</span>
						<strong>{formatCurrency(configuratorStore.deliveryPrice)} ₽</strong>
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
					<button
						className={`${s.button} ${s.buttonPrimary} ${activePayment === 'card' ? s.buttonActive : ''}`}
						onClick={() => {
							setActivePayment('card')
							submitOrder('card')
						}}
						disabled={isLoading}
					>
						{isLoading && activePayment === 'card' ? 'Отправляем...' : 'Оплатить заказ'}
					</button>
					<button
						className={`${s.button} ${s.buttonSecondary} ${activePayment === 'sbp' ? s.buttonActive : ''}`}
						onClick={() => {
							setActivePayment('sbp')
							submitOrder('sbp')
						}}
						disabled={isLoading}
					>
						{isLoading && activePayment === 'sbp' ? 'Отправляем...' : 'Оплатить через СБП'}
					</button>
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
