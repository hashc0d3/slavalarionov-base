/**
 * Стор для управления корзиной
 * Вынесен в отдельный файл согласно FSD архитектуре
 */

import { makeAutoObservable } from 'mobx'
import type { AdditionalOptionPayload } from '../types'

export class CartStore {
	cartItems: any[] = []
	editingCartItemId: string | null = null
	additionalOption: AdditionalOptionPayload | null = null

	constructor() {
		makeAutoObservable(this)
	}

	addToCart(item: any) {
		this.cartItems.push(item)
	}

	removeFromCart(itemId: string) {
		this.cartItems = this.cartItems.filter(item => item.id !== itemId)
	}

	updateCartItem(itemId: string, updates: Partial<any>) {
		const index = this.cartItems.findIndex(item => item.id === itemId)
		if (index !== -1) {
			this.cartItems[index] = { ...this.cartItems[index], ...updates }
		}
	}

	clearCart() {
		this.cartItems = []
		this.editingCartItemId = null
	}

	setEditingCartItemId(id: string | null) {
		this.editingCartItemId = id
	}
}


