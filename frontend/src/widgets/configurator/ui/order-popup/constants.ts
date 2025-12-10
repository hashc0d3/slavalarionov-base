import { DeliveryOption } from './orderPopup.types'
import type { FormState } from './types'

export const DEFAULT_CITY_NAME = 'Санкт-Петербург'
export const DEFAULT_CITY_CODE = 137
export const DEFAULT_CITY_UUID = ''

export const PHONE_MIN_DIGITS = 11
export const REMEMBER_KEY = 'configurator-order-popup'

export const initialDeliveryOptions: DeliveryOption[] = [
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

export const initialFormState: FormState = {
	name: '',
	phone: '',
	email: '',
	city: '',
	cityCode: null,
	cityUuid: null,
	cityPostalCode: null,
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

