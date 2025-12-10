/**
 * Хук useOrderPopup содержит всю логику для компонента OrderPopup
 * Вынесен в отдельный файл согласно FSD архитектуре
 */

import { ChangeEvent, useMemo, useRef, useState } from 'react'
import { configuratorStore } from '@/shared/store/configurator.store'
import { OrderItem, retailCrmApi } from '@/shared/api/retailcrm.api'
import { paymentApi } from '@/shared/api/payment.api'
import { DeliveryOption } from '../orderPopup.types'
import {
	deliveryApi,
	type CdekCalculation,
	type CdekCity,
	type CdekPvz,
	type DadataSuggestion
} from '@/shared/api/delivery.api'
import type { CDEKWidgetInstance, CDEKWidgetPoint } from '@/types/cdek-widget'
import { resolveMediaUrl, getMediaBaseUrl } from '@/shared/lib/media'
import type { FormState, ValidationErrors, Props } from '../types'
import { initialFormState, initialDeliveryOptions, DEFAULT_CITY_CODE, DEFAULT_CITY_NAME, DEFAULT_CITY_UUID, REMEMBER_KEY, PHONE_MIN_DIGITS } from '../constants'
import { formatCurrency, digitsOnly, getRemeshokWord } from '../utils'
import { useOrderPopupEffects } from './useOrderPopupEffects'

export function useOrderPopup({ visible, onClose }: Props) {
	// Состояния формы
	const [form, setForm] = useState<FormState>(initialFormState)
	const [isLoading, setIsLoading] = useState(false)
	const [errors, setErrors] = useState<ValidationErrors>({})
	
	// Состояния промокода
	const [promoMessage, setPromoMessage] = useState<string | null>(null)
	const [promoStatus, setPromoStatus] = useState<'success' | 'error' | null>(null)
	const [promoLoading, setPromoLoading] = useState(false)
	
	// Состояния доставки
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
	
	// Refs
	const defaultCityAppliedRef = useRef(false)
	const isSettingDefaultCityRef = useRef(false)
	const mapInstanceRef = useRef<CDEKWidgetInstance | null>(null)
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const [mapReady, setMapReady] = useState(false)
	
	// Константы
	const cdekWidgetApiKey = process.env.NEXT_PUBLIC_YANDEX_API_KEY || process.env.NEXT_PUBLIC_CDEK_WIDGET_API_KEY || '6f29a26c-6dd5-42b8-a755-83a4d6d75b6c'

	// Утилиты для работы с формой
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

	// Вычисляемые значения
	const filteredDeliveryOptions = useMemo(() => {
		const isSpb = form.cityCode === DEFAULT_CITY_CODE
		
		if (!isSpb) {
			return deliveryOptions.filter(
				(option) => option.value !== 'self-pickup' && option.value !== 'city-courier-delivery'
			)
		}
		
		return deliveryOptions
	}, [deliveryOptions, form.cityCode])

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
	}
	
	const totalPrice = productsPrice + (form.deliveryValue ? (currentDeliveryOption?.price || 0) : 0)
	const totalPriceWithDiscount = productsPriceWithDiscount + (form.deliveryValue ? (currentDeliveryOption?.price || 0) : 0)

	// Обработчики полей формы
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

	// Обработчики доставки
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

	const handleCitySelectFromDadata = async (dadataCity: DadataSuggestion) => {
		const cityName = dadataCity.data?.city || dadataCity.data?.settlement || dadataCity.value || ''
		const cityLat = dadataCity.data?.geo_lat ? parseFloat(dadataCity.data.geo_lat) : null
		const cityLon = dadataCity.data?.geo_lon ? parseFloat(dadataCity.data.geo_lon) : null
		const postalCode = dadataCity.data?.postal_code || ''
		const isDefaultCity = cityName.toLowerCase().includes('санкт') || cityName.toLowerCase().includes('петербург')
		
		let finalCityCode: number | null = isDefaultCity ? DEFAULT_CITY_CODE : null
		let finalCityUuid: string | null = isDefaultCity ? DEFAULT_CITY_UUID : null
		
		try {
			const cdekCities = await deliveryApi.searchCdekCities(cityName, postalCode)
			
			if (cdekCities && cdekCities.length > 0) {
				const cdekCity = cdekCities.find(c => 
					c.cityName?.toLowerCase().includes(cityName.toLowerCase()) ||
					cityName.toLowerCase().includes(c.cityName?.toLowerCase() || '')
				) || cdekCities[0]
				
				if (cdekCity.cityCode) {
					finalCityCode = cdekCity.cityCode
					finalCityUuid = cdekCity.cityUuid || null
				}
			}
		} catch (error) {
			console.error('[City Select] Failed to find cityCode for city:', cityName, error)
		}
		
		updateForm(
			(prev) => ({
				...prev,
				city: cityName,
				cityCode: finalCityCode,
				cityUuid: finalCityUuid,
				cityPostalCode: postalCode || null,
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
		
		if (postalCode) {
			await loadPvzByPostalCode(postalCode)
		}
		
		if (mapInstanceRef.current && cityLat && cityLon && !isNaN(cityLat) && !isNaN(cityLon)) {
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

	const loadPvzByPostalCode = async (postalCode: string) => {
		setPvzList([])
		setTariffs([])
		setIsPvzLoading(true)
		setIsTariffsLoading(true)
		
		try {
			const points = await deliveryApi.getPvzListByPostalCode(postalCode)
			setPvzList(points)
		} catch (error) {
			console.error('[Load PVZ] Failed to load CDEK PVZ list', error)
			setPvzList([])
		} finally {
			setIsPvzLoading(false)
		}
		
		try {
			const items = await deliveryApi.calculateTariffsByPostalCode(postalCode)
			setTariffs(items)
		} catch (error) {
			console.error('[Load PVZ] Failed to calculate CDEK tariffs', error)
			setTariffs([])
		} finally {
			setIsTariffsLoading(false)
		}
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

	// Валидация формы
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

	// Сохранение данных формы
	const persistFormData = () => {
		if (typeof window === 'undefined') return
		if (!form.remember) {
			localStorage.removeItem(REMEMBER_KEY)
			return
		}
		const { remember, ...data } = form
		localStorage.setItem(REMEMBER_KEY, JSON.stringify(data))
	}

	// Обработчик промокода
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

	// Утилиты для работы с товарами
	const getItemView1ImageUrl = (item: any) => {
		const baseImageUrl = `${getMediaBaseUrl()}/uploads`
		const strapData = item.strapModel?.attributes?.watch_strap
		
		if (!strapData) return null
		
		const dynamicView1 = resolveMediaUrl(strapData.strap_params?.view_images?.view1)
		if (dynamicView1) return dynamicView1
		
		return `${baseImageUrl}/base_${strapData.strap_name}_1_739ae2aa10.png`
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

	// Отправка заказа
	const submitOrder = async () => {
		if (!validateForm()) return

		setIsLoading(true)
		setErrors({})

		try {
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
			const paymentType = 'Будет выбран на странице оплаты'

			const finalTotalPrice = totalPriceWithDiscount !== totalPrice ? totalPriceWithDiscount : totalPrice

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
				totalPrice: finalTotalPrice,
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

	// Используем эффекты
	useOrderPopupEffects({
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
		defaultCityAppliedRef,
		cdekWidgetApiKey,
		handleCitySelectFromDadata,
		loadPvzByPostalCode,
		updateForm
	})

	// Возвращаем все необходимые значения и функции
	return {
		// Состояния
		form,
		isLoading,
		errors,
		promoMessage,
		promoStatus,
		promoLoading,
		deliveryOptions,
		cityQuery,
		citySuggestions,
		isCityLoading,
		pvzList,
		isPvzLoading,
		tariffs,
		isTariffsLoading,
		streetQuery,
		streetSuggestions,
		isStreetLoading,
		buildingQuery,
		buildingSuggestions,
		isBuildingLoading,
		mapReady,
		mapContainerRef,
		
		// Вычисляемые значения
		filteredDeliveryOptions,
		currentDeliveryOption,
		productsPrice,
		productsPriceWithDiscount,
		totalPrice,
		totalPriceWithDiscount,
		
		// Функции
		updateForm,
		clearError,
		handleFieldChange,
		handleRememberToggle,
		handleCitySelect,
		handleCitySelectFromDadata,
		handlePvzSelect,
		handleStreetSelect,
		handleBuildingSelect,
		handleApplyPromo,
		submitOrder,
		getItemView1ImageUrl,
		
		// Setters для эффектов
		setCityQuery,
		setCitySuggestions,
		setIsCityLoading,
		setPvzList,
		setIsPvzLoading,
		setTariffs,
		setIsTariffsLoading,
		setStreetQuery,
		setStreetSuggestions,
		setIsStreetLoading,
		setBuildingQuery,
		setBuildingSuggestions,
		setIsBuildingLoading,
		setDeliveryOptions,
		setMapReady,
		mapInstanceRef,
		defaultCityAppliedRef,
		isSettingDefaultCityRef,
		cdekWidgetApiKey
	}
}

