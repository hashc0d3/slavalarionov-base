"use client"

import { ChangeEvent, useEffect, useState } from 'react'
import s from './OrderPopup.module.css'
import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import { OrderItem, retailCrmApi } from '@/shared/api/retailcrm.api'
import { paymentApi } from '@/shared/api/payment.api'
import { StrapDesignPreview } from '@/widgets/configurator/ui/steps/StrapDesignPreview'

type Props = {
	visible: boolean
	onClose: () => void
}

type DeliveryValue =
	| 'point-delivery'
	| 'parcel-locker-omnicdek'
	| 'cdek-door-delivery'
	| 'post-office'
	| 'city-courier-delivery'
	| 'self-pickup'

type DeliveryOption = {
	value: DeliveryValue
	label: string
	time?: string
	price?: number
	priceFixed?: boolean
	note?: string
}

type FormState = {
	name: string
	phone: string
	email: string
	city: string
	courierAddress: string
	mailAddress: string
	pickupPoint: string
	comment: string
	promoCode: string
	remember: boolean
	deliveryValue: DeliveryValue
}

type ValidationErrors = Partial<Record<keyof FormState | 'general', string>>

const DELIVERY_OPTIONS: DeliveryOption[] = [
	{
		value: 'point-delivery',
		label: 'СДЭК до пункта выдачи',
		time: 'от 3 дней',
		price: 235
	},
	{
		value: 'parcel-locker-omnicdek',
		label: 'Постамат OmniCDEK',
		time: 'от 3 дней',
		price: 235
	},
	{
		value: 'cdek-door-delivery',
		label: 'СДЭК курьером до двери',
		time: 'от 3 дней',
		price: 375
	},
	{
		value: 'post-office',
		label: 'Почта России 1 класс',
		time: '4–6 дней',
		price: 250,
		priceFixed: true
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
	city: '',
	courierAddress: '',
	mailAddress: '',
	pickupPoint: '',
	comment: '',
	promoCode: '',
	remember: false,
	deliveryValue: DELIVERY_OPTIONS[0].value
}

export const OrderPopup = observer(function OrderPopup({ visible, onClose }: Props) {
	const [form, setForm] = useState<FormState>(initialFormState)
	const [isLoading, setIsLoading] = useState(false)
	const [errors, setErrors] = useState<ValidationErrors>({})
	const [promoMessage, setPromoMessage] = useState<string | null>(null)
	const [promoStatus, setPromoStatus] = useState<'success' | 'error' | null>(null)
	const [promoLoading, setPromoLoading] = useState(false)
	const [activePayment, setActivePayment] = useState<'card' | 'sbp'>('card')

	// Сбрасываем формы при закрытии
	useEffect(() => {
		if (!visible) {
			setErrors({})
			setPromoMessage(null)
			setPromoStatus(null)
			setIsLoading(false)
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

	// Актуализируем стоимость доставки
	useEffect(() => {
		const option = DELIVERY_OPTIONS.find((item) => item.value === form.deliveryValue)
		configuratorStore.deliveryPrice = option?.price ?? 0
	}, [form.deliveryValue])

	useEffect(() => {
		if (!visible) return
		if (!form.remember && typeof window !== 'undefined') {
			localStorage.removeItem(REMEMBER_KEY)
		}
	}, [form.remember, visible])

	const currentDeliveryOption =
		DELIVERY_OPTIONS.find((item) => item.value === form.deliveryValue) ?? DELIVERY_OPTIONS[0]

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

	const handleFieldChange =
		(key: keyof FormState) =>
		(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const target = event.target
			const value =
				target instanceof HTMLInputElement && target.type === 'checkbox'
					? target.checked
					: target.value

			setForm((prev) => ({
				...prev,
				[key]: value as FormState[typeof key]
			}))
			if (errors[key]) {
				setErrors((prev) => {
					const next = { ...prev }
					delete next[key]
					return next
				})
			}
		}

	const handleRememberToggle = (event: ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked
		setForm((prev) => ({
			...prev,
			remember: checked
		}))
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

		if (form.deliveryValue === 'point-delivery' || form.deliveryValue === 'parcel-locker-omnicdek') {
			if (!form.pickupPoint.trim()) {
				nextErrors.pickupPoint = 'Укажите выбранный пункт выдачи'
			}
		}

		if (form.deliveryValue === 'cdek-door-delivery' || form.deliveryValue === 'city-courier-delivery') {
			if (!form.courierAddress.trim()) {
				nextErrors.courierAddress = 'Укажите адрес доставки'
			}
		}

		if (form.deliveryValue === 'post-office') {
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

		const buckleButterflyAvailable = !!item.strapModel?.attributes?.watch_strap?.strap_params?.has_buckle_butterfly
		const buckleButterflyChoosen = item.buckleButterfly || false
		const basePrice = strapModelData.price || 0
		const butterflyPrice = buckleButterflyChoosen ? 700 : 0
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

		if (form.deliveryValue === 'point-delivery' || form.deliveryValue === 'parcel-locker-omnicdek') {
			return {
				deliveryCity: form.city,
				deliveryType,
				deliveryPoint: form.pickupPoint
					? { name: form.pickupPoint, address: form.pickupPoint }
					: null,
				deliveryAddressInfo: null,
				mailAddress: '',
				curierAddress: '',
				deliveryComment: form.comment
			}
		}

		if (form.deliveryValue === 'cdek-door-delivery' || form.deliveryValue === 'city-courier-delivery') {
			return {
				deliveryCity: form.city,
				deliveryType,
				deliveryPoint: null,
				deliveryAddressInfo: null,
				mailAddress: '',
				curierAddress: form.courierAddress,
				deliveryComment: form.comment
			}
		}

		if (form.deliveryValue === 'post-office') {
			return {
				deliveryCity: form.city,
				deliveryType,
				deliveryPoint: null,
				deliveryAddressInfo: null,
				mailAddress: form.mailAddress,
				curierAddress: '',
				deliveryComment: form.comment
			}
		}

		return {
			deliveryCity: form.city,
			deliveryType,
			deliveryPoint: null,
			deliveryAddressInfo: null,
			mailAddress: '',
			curierAddress: '',
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
				deliveryPoint:
					form.deliveryValue === 'point-delivery' || form.deliveryValue === 'parcel-locker-omnicdek'
						? delivery.deliveryPoint
						: null,
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
					<div className={s.field}>
						<label className={s.label}>Город*</label>
						<input
							className={`${s.input} ${errors.city ? s.inputError : ''}`}
							placeholder="Например, Санкт-Петербург"
							value={form.city}
							onChange={handleFieldChange('city')}
							disabled={isLoading}
						/>
						{errors.city && <p className={s.errorText}>{errors.city}</p>}
					</div>

					<ul className={s.deliveryList}>
						{DELIVERY_OPTIONS.map((option) => (
							<li key={option.value} className={s.deliveryItem}>
								<label className={s.deliveryLabel}>
									<input
										type="radio"
										className={s.radio}
										name="delivery"
										value={option.value}
										checked={form.deliveryValue === option.value}
										onChange={(event) =>
											setForm((prev) => ({
												...prev,
												deliveryValue: event.target.value as DeliveryValue
											}))
										}
										disabled={isLoading}
									/>
									<span className={s.deliveryContent}>
										<span className={s.deliveryTitle}>{option.label}</span>
										<span className={s.deliveryMeta}>
											{option.time && <span>{option.time}</span>}
											{typeof option.price === 'number' && (
												<span>
													{option.priceFixed ? '' : 'от '}
													{formatCurrency(option.price)} ₽
												</span>
											)}
										</span>
									</span>
								</label>
							</li>
						))}
					</ul>

					{(form.deliveryValue === 'point-delivery' || form.deliveryValue === 'parcel-locker-omnicdek') && (
						<div className={s.field}>
							<label className={s.label}>Пункт выдачи*</label>
							<input
								className={`${s.input} ${errors.pickupPoint ? s.inputError : ''}`}
								placeholder="Укажите выбранный пункт выдачи"
								value={form.pickupPoint}
								onChange={handleFieldChange('pickupPoint')}
								disabled={isLoading}
							/>
							{errors.pickupPoint && <p className={s.errorText}>{errors.pickupPoint}</p>}
						</div>
					)}

					{form.deliveryValue === 'cdek-door-delivery' && (
						<div className={s.field}>
							<label className={s.label}>Адрес доставки*</label>
							<input
								className={`${s.input} ${errors.courierAddress ? s.inputError : ''}`}
								placeholder="Город, улица, дом, квартира"
								value={form.courierAddress}
								onChange={handleFieldChange('courierAddress')}
								disabled={isLoading}
							/>
							{errors.courierAddress && <p className={s.errorText}>{errors.courierAddress}</p>}
						</div>
					)}

					{form.deliveryValue === 'city-courier-delivery' && (
						<div className={s.field}>
							<label className={s.label}>Адрес доставки*</label>
							<input
								className={`${s.input} ${errors.courierAddress ? s.inputError : ''}`}
								placeholder="Город, улица, дом, квартира"
								value={form.courierAddress}
								onChange={handleFieldChange('courierAddress')}
								disabled={isLoading}
							/>
							{errors.courierAddress && <p className={s.errorText}>{errors.courierAddress}</p>}
						</div>
					)}

					{form.deliveryValue === 'post-office' && (
						<div className={s.field}>
							<label className={s.label}>Адрес отделения*</label>
							<input
								className={`${s.input} ${errors.mailAddress ? s.inputError : ''}`}
								placeholder="Индекс, улица, отделение"
								value={form.mailAddress}
								onChange={handleFieldChange('mailAddress')}
								disabled={isLoading}
							/>
							{errors.mailAddress && <p className={s.errorText}>{errors.mailAddress}</p>}
						</div>
					)}

					{currentDeliveryOption.note && <p className={s.deliveryNote}>{currentDeliveryOption.note}</p>}
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
