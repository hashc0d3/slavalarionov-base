/**
 * Стор для управления заказом
 * Вынесен в отдельный файл согласно FSD архитектуре
 */

import { makeAutoObservable } from 'mobx'
import type { Promo } from '../types'

export class OrderStore {
	productAmount: number = 1
	deliveryPrice: number | null = 0
	closestReadyDate: string = ''
	orderNumber: string | null = null
	promoCode: string | null = null
	promoAccepted: boolean = false
	usedPromo: Promo | null = null
	orderPopupVisible: boolean = false

	constructor() {
		makeAutoObservable(this)
	}

	setProductAmount(amount: number) {
		this.productAmount = amount
	}

	setDeliveryPrice(price: number | null) {
		this.deliveryPrice = price
	}

	setClosestReadyDate(date: string) {
		this.closestReadyDate = date
	}

	setOrderNumber(number: string | null) {
		this.orderNumber = number
	}

	setPromoCode(code: string | null) {
		this.promoCode = code
	}

	setPromoAccepted(accepted: boolean) {
		this.promoAccepted = accepted
	}

	setUsedPromo(promo: Promo | null) {
		this.usedPromo = promo
	}

	showOrderPopup() {
		this.orderPopupVisible = true
	}

	closeOrderPopup() {
		this.orderPopupVisible = false
	}
}


