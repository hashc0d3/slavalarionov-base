import type { CdekPvz } from '@/shared/api/delivery.api'
import { DeliveryValue } from './orderPopup.types'

export type Props = {
	visible: boolean
	onClose: () => void
}

export type FormState = {
	name: string
	phone: string
	email: string
	city: string
	cityCode: number | null
	cityUuid: string | null
	cityPostalCode: string | null
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

export type ValidationErrors = Partial<Record<keyof FormState | 'general', string>>


