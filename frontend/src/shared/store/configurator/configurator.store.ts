/**
 * Основной стор конфигуратора
 * Композиция всех модулей согласно FSD архитектуре
 */

import { makeAutoObservable } from 'mobx'
import { StepsStore } from './stores/steps.store'
import { CartStore } from './stores/cart.store'
import { OrderStore } from './stores/order.store'
import type {
	WatchModel,
	Strap,
	FrameColor,
	StrapColor,
	Promo,
	AdditionalOptionPayload
} from './types'

export class ConfiguratorStore {
	// Подсторы
	stepsStore: StepsStore
	cartStore: CartStore
	orderStore: OrderStore

	// Базовое состояние
	isLoading: boolean = false
	watchModels: WatchModel[] = []
	watchStraps: Strap[] = []

	constructor() {
		this.stepsStore = new StepsStore()
		this.cartStore = new CartStore()
		this.orderStore = new OrderStore()
		makeAutoObservable(this)
		this.stepsStore.updateModelStepState(null, null)
		this.stepsStore.updateStrapStepState(null)
		this.stepsStore.updateStrapDesignStepState(null, {}, false, false)
	}

	// Геттеры для обратной совместимости
	get currentStepNum() {
		return this.stepsStore.currentStepNum
	}

	set currentStepNum(value: number) {
		this.stepsStore.currentStepNum = value
	}

	get stepsAmount() {
		return this.stepsStore.stepsAmount
	}

	get steps() {
		return this.stepsStore.steps
	}

	get cartItems() {
		return this.cartStore.cartItems
	}

	get cartItemsCount() {
		return this.cartStore.cartItems.length
	}

	get cartTotalPrice() {
		return this.totalPrice
	}

	get editingCartItemId() {
		return this.cartStore.editingCartItemId
	}

	set editingCartItemId(value: string | null) {
		this.cartStore.editingCartItemId = value
	}

	cancelEditCartItem() {
		this.cartStore.setEditingCartItemId(null)
	}

	editCartItem(itemId: string) {
		this.cartStore.setEditingCartItemId(itemId)
	}

	get additionalOption() {
		return this.cartStore.additionalOption
	}

	set additionalOption(value: AdditionalOptionPayload | null) {
		this.cartStore.additionalOption = value
	}

	get productAmount() {
		return this.orderStore.productAmount
	}

	set productAmount(value: number) {
		this.orderStore.productAmount = value
	}

	get deliveryPrice() {
		return this.orderStore.deliveryPrice
	}

	set deliveryPrice(value: number | null) {
		this.orderStore.deliveryPrice = value
	}

	get closestReadyDate() {
		return this.orderStore.closestReadyDate
	}

	get orderNumber() {
		return this.orderStore.orderNumber
	}

	get promoCode() {
		return this.orderStore.promoCode
	}

	get promoAccepted() {
		return this.orderStore.promoAccepted
	}

	get usedPromo() {
		return this.orderStore.usedPromo
	}

	get orderPopupVisible() {
		return this.orderStore.orderPopupVisible
	}

	// Геттеры для выбранных элементов
	get selectedWatchModel() {
		return this.watchModels.find((m) => m.choosen) || null
	}

	get selectedWatchModelAllSizes() {
		return this.selectedWatchModel?.watch_sizes || []
	}

	get selectedWatchModelFrameColors() {
		return this.selectedWatchModel?.frame_colors || []
	}

	get selectedFrameColor() {
		return this.selectedWatchModelFrameColors?.find((c) => c.choosen) || null
	}

	get selectedFrameColorId(): number | null {
		return this.selectedFrameColor?.colorId || null
	}

	get selectedStrapModel() {
		return this.watchStraps.find((s) => s.choosen) || null
	}

	get selectedStrapModelParams() {
		return this.selectedStrapModel?.attributes.watch_strap.strap_params
	}

	get selectedLeatherColor() {
		return this.selectedStrapModelParams?.leather_colors?.find((c) => c.choosen) || null
	}

	get selectedStitchingColor() {
		return this.selectedStrapModelParams?.stitching_colors?.find((c) => c.choosen) || null
	}

	get selectedEdgeColor() {
		return this.selectedStrapModelParams?.edge_colors?.find((c) => c.choosen) || null
	}

	get selectedBuckleColor() {
		return this.selectedStrapModelParams?.buckle_colors?.find((c) => c.choosen) || null
	}

	get selectedAdapterColor() {
		return this.selectedStrapModelParams?.adapter_colors?.find((c) => c.choosen) || null
	}

	get isStrapParamsSelected() {
		const params = this.selectedStrapModelParams
		if (!params) return false
		const checks: boolean[] = []
		const ensureSelected = (list: { choosen?: boolean }[] | undefined, selected: any) => {
			if (Array.isArray(list) && list.length > 0) {
				checks.push(!!selected)
			}
		}
		ensureSelected(params.leather_colors, this.selectedLeatherColor)
		ensureSelected(params.stitching_colors, this.selectedStitchingColor)
		ensureSelected(params.edge_colors, this.selectedEdgeColor)
		ensureSelected(params.buckle_colors, this.selectedBuckleColor)
		ensureSelected(params.adapter_colors, this.selectedAdapterColor)
		return checks.every(Boolean)
	}

	get selectedAdditionalOptions() {
		const opts = this.steps.final.additionalOptions
		const arr: { option_title: string; option_price: number }[] = []
		if (opts.initials.choosen && opts.initials.price) arr.push({ option_title: 'Инициалы', option_price: opts.initials.price })
		if (opts.presentBox.choosen && opts.presentBox.price) arr.push({ option_title: 'Подарочная коробка', option_price: opts.presentBox.price })
		if (opts.postCard.choosen && opts.postCard.price) arr.push({ option_title: 'Открытка', option_price: opts.postCard.price })
		return arr
	}

	get selectedStrapPrice() {
		const strap = this.selectedStrapModel?.attributes.watch_strap
		const base = strap?.price || 0
		const butterflyPrice = this.steps.strapDesign.buckleButterflyChoosen ? strap?.buckle_butterfly_price || 0 : 0
		return base + butterflyPrice
	}

	get selectedStrapPriceWithDiscount() {
		if (!(this.promoAccepted && this.usedPromo)) return this.selectedStrapPrice
		const discount = this.usedPromo.type === 'percent'
			? this.selectedStrapPrice * this.productAmount * (this.usedPromo.discountValue / 100)
			: this.usedPromo.discountValue
		return Math.max(0, this.selectedStrapPrice - discount)
	}

	get additionalOptionsSum() {
		return this.selectedAdditionalOptions.reduce((acc, item) => acc + Number(item.option_price), 0)
	}

	get productsPrice() {
		return this.selectedStrapPrice + this.additionalOptionsSum
	}

	get productsPriceWithDiscount() {
		return this.selectedStrapPriceWithDiscount + this.additionalOptionsSum
	}

	get totalPrice() {
		return this.productsPrice + (this.deliveryPrice || 0)
	}

	get totalPriceWithDiscount() {
		if (!(this.promoAccepted && this.usedPromo)) return this.totalPrice
		return this.productsPriceWithDiscount + (this.deliveryPrice || 0)
	}

	get nextStepReady() {
		return this.stepsStore.isNextStepReady(this.selectedWatchModel, this.selectedStrapModel, this.isStrapParamsSelected)
	}

	get currentAvailableStep() {
		return this.stepsStore.currentAvailableStep
	}

	get prevStepQuery() {
		return this.stepsStore.prevStepQuery
	}

	get nextStepQuery() {
		return this.stepsStore.nextStepQuery
	}

	// Методы навигации
	prevStep() {
		if (this.currentStepNum > 1) {
			this.currentStepNum = this.currentStepNum - 1
		}
	}

	nextStep() {
		if (this.currentStepNum < this.stepsAmount && this.nextStepReady) {
			this.currentStepNum = this.currentStepNum + 1
		}
	}

	// Методы обновления состояния шагов
	updateModelStepState() {
		this.stepsStore.updateModelStepState(this.selectedWatchModel, this.selectedFrameColor)
	}

	updateStrapStepState() {
		this.stepsStore.updateStrapStepState(this.selectedStrapModel)
	}

	updateStrapDesignStepState() {
		this.stepsStore.updateStrapDesignStepState(
			this.selectedStrapModel,
			{
				leather: this.selectedLeatherColor,
				stitching: this.selectedStitchingColor,
				edge: this.selectedEdgeColor,
				buckle: this.selectedBuckleColor,
				adapter: this.selectedAdapterColor
			},
			this.isStrapParamsSelected,
			this.steps.strapDesign.buckleButterflyChoosen
		)
	}

	// Методы для работы с заказом
	showOrderPopup() {
		if (!this.editingCartItemId && this.selectedWatchModel && this.selectedStrapModel) {
			this.addCurrentToCart(false)
		}
		this.orderStore.showOrderPopup()
	}

	closeOrderPopup() {
		this.orderStore.closeOrderPopup()
	}

	setClosestReadyDate(str: string) {
		this.orderStore.setClosestReadyDate(str)
	}

	updatePromoCodeValue(str: string) {
		this.orderStore.setPromoCode(str)
	}

	promoUse(promo: Promo | null) {
		this.orderStore.setUsedPromo(promo)
		this.orderStore.setPromoAccepted(!!promo)
	}

	async applyPromo(code: string) {
		this.updatePromoCodeValue(code)
		if (!code.trim()) {
			this.promoUse(null)
			return
		}

		try {
			const { promocodeApi } = await import('@/shared/api/promocode.api')
			const result = await promocodeApi.check(code)
			if (result.promoFound) {
				this.promoUse({
					promoFound: true,
					type: result.type as 'percent' | 'ruble',
					discountValue: result.discountValue,
					code: result.code
				})
			} else {
				this.promoUse(null)
			}
		} catch (error) {
			console.error('Ошибка проверки промокода:', error)
			this.promoUse(null)
			throw error
		}
	}

	// Методы для работы с дополнительными опциями
	toggleInitials(choosen: boolean) {
		this.steps.final.additionalOptions.initials.choosen = choosen
	}

	setInitialsText(text: string) {
		this.steps.final.additionalOptions.initials.text = text
	}

	togglePresentBox(choosen: boolean) {
		this.steps.final.additionalOptions.presentBox.choosen = choosen
	}

	togglePostCard(choosen: boolean) {
		this.steps.final.additionalOptions.postCard.choosen = choosen
	}

	setPostCardText(text: string) {
		this.steps.final.additionalOptions.postCard.text = text
	}

	// Методы для управления количеством
	increaseProductAmount() {
		if (this.productAmount < 10) this.orderStore.setProductAmount(this.productAmount + 1)
	}

	decreaseProductAmount() {
		if (this.productAmount > 1) this.orderStore.setProductAmount(this.productAmount - 1)
	}

	increaseQuantity() {
		this.increaseProductAmount()
	}

	decreaseQuantity() {
		this.decreaseProductAmount()
	}

	setQuantity(amount: number) {
		if (amount >= 1 && amount <= 10) this.orderStore.setProductAmount(amount)
	}

	// Методы для работы с корзиной
	addCurrentToCart(resetAfter: boolean = true) {
		const cartItem = {
			id: Date.now().toString(),
			watchModel: this.selectedWatchModel,
			frameColor: this.selectedFrameColor,
			strapModel: this.selectedStrapModel,
			leatherColor: this.selectedLeatherColor,
			stitchingColor: this.selectedStitchingColor,
			edgeColor: this.selectedEdgeColor,
			buckleColor: this.selectedBuckleColor,
			adapterColor: this.selectedAdapterColor,
			buckleButterfly: this.steps.strapDesign.buckleButterflyChoosen,
			additionalOptions: { ...this.steps.final.additionalOptions },
			quantity: this.productAmount,
			price: this.productsPrice,
			addedAt: new Date().toISOString()
		}
		
		this.cartStore.addToCart(cartItem)
		if (resetAfter) {
			this.resetConfigurator()
		}
	}

	removeFromCart(itemId: string) {
		this.cartStore.removeFromCart(itemId)
		if (this.editingCartItemId === itemId) {
			this.editingCartItemId = null
			this.resetConfigurator()
		}
	}

	clearCart() {
		this.cartStore.clearCart()
	}

	resetConfigurator() {
		this.currentStepNum = 1
		this.productAmount = 1
		// Сброс выбранных элементов
		this.watchModels.forEach(m => {
			m.choosen = false
			m.watch_sizes.forEach(s => s.choosen = false)
			m.frame_colors.forEach(c => c.choosen = false)
		})
		this.watchStraps.forEach(s => s.choosen = false)
		this.updateModelStepState()
		this.updateStrapStepState()
		this.updateStrapDesignStepState()
	}

	// Методы для работы с моделями часов (основные методы)
	chooseWatchModel(modelIdx: number, sizeIdx: number = 0) {
		this.watchModels.forEach((m, idx) => {
			m.choosen = idx === modelIdx
			m.watch_sizes.forEach((s, sidx) => (s.choosen = idx === modelIdx && sidx === sizeIdx))
		})
		const model = this.watchModels[modelIdx]
		this.steps.model.modelName = model.model_name
		this.steps.model.modelSize = model.watch_sizes[sizeIdx].watch_size
		this.steps.model.isChoosen = true
		this.chooseFrameColor()
		this.updateModelStepState()
		this.saveWatchModelsToStorage() // Сохраняем состояние в localStorage
	}

	chooseFrameColor(name: string = '') {
		if (name === '') {
			const firstColor = this.selectedWatchModelFrameColors?.[0]
			if (firstColor) {
				this.selectedWatchModelFrameColors?.forEach(c => c.choosen = false)
				firstColor.choosen = true
			}
		} else {
			this.selectedWatchModelFrameColors?.forEach(c => c.choosen = c.color_name === name)
		}
		this.updateModelStepState()
		this.saveWatchModelsToStorage() // Сохраняем состояние в localStorage
	}

	// Методы для работы с ремешками
	chooseStrapModel(id: number) {
		this.watchStraps.forEach(s => s.choosen = s.attributes.watch_strap.id === id)
		const strap = this.selectedStrapModel
		if (strap) {
			this.normalizeStrap(strap)
			this.ensureStrapParamsDefaults(strap)
		}
		this.updateStrapStepState()
		this.updateStrapDesignStepState()
		this.saveWatchStrapsToStorage() // Сохраняем состояние в localStorage
	}

	saveWatchStrapsToStorage() {
		if (typeof window === 'undefined') return
		try {
			localStorage.setItem('watchStraps', JSON.stringify(this.watchStraps))
		} catch (error) {
			console.error('Error saving watch straps to storage:', error)
		}
	}

	loadWatchStrapsFromStorage(): Strap[] {
		if (typeof window === 'undefined') return []
		try {
			const stored = localStorage.getItem('watchStraps')
			if (stored) {
				return JSON.parse(stored)
			}
		} catch (error) {
			console.error('Error loading watch straps from storage:', error)
		}
		return []
	}

	chooseStrapLeatherColor(title: string) {
		this.selectedStrapModelParams?.leather_colors?.forEach(c => c.choosen = c.color_title === title)
		this.updateStrapDesignStepState()
		this.saveWatchStrapsToStorage() // Сохраняем изменения параметров
	}

	chooseStitchingColor(title: string) {
		this.selectedStrapModelParams?.stitching_colors?.forEach(c => c.choosen = c.color_title === title)
		this.updateStrapDesignStepState()
		this.saveWatchStrapsToStorage() // Сохраняем изменения параметров
	}

	chooseEdgeColor(title: string) {
		this.selectedStrapModelParams?.edge_colors?.forEach(c => c.choosen = c.color_title === title)
		this.updateStrapDesignStepState()
		this.saveWatchStrapsToStorage() // Сохраняем изменения параметров
	}

	chooseBuckleColor(title: string) {
		this.selectedStrapModelParams?.buckle_colors?.forEach(c => c.choosen = c.color_title === title)
		this.updateStrapDesignStepState()
		this.saveWatchStrapsToStorage() // Сохраняем изменения параметров
	}

	chooseAdapterColor(title: string) {
		this.selectedStrapModelParams?.adapter_colors?.forEach(c => c.choosen = c.color_title === title)
		this.updateStrapDesignStepState()
		this.saveWatchStrapsToStorage() // Сохраняем изменения параметров
	}

	chooseBuckleButterfly() {
		const strap = this.selectedStrapModel
		if (strap && strap.attributes.watch_strap.has_buckle_butterfly) {
			this.steps.strapDesign.buckleButterflyChoosen = !this.steps.strapDesign.buckleButterflyChoosen
			this.updateStrapDesignStepState()
			this.saveWatchStrapsToStorage() // Сохраняем изменения параметров
		}
	}

	// Вспомогательные методы
	private normalizeStrap(strap: Strap | null | undefined) {
		if (!strap) return
		const strapData = strap.attributes?.watch_strap
		if (!strapData) return
		if (!strapData.strap_params) {
			strapData.strap_params = {}
		}
		if (strapData.has_buckle_butterfly === undefined) {
			strapData.has_buckle_butterfly = !!strapData.strap_params.has_buckle_butterfly
		}
		const hasButterfly = !!strapData.has_buckle_butterfly
		strapData.strap_params.has_buckle_butterfly = hasButterfly
		strapData.buckle_butterfly_choosen = hasButterfly ? !!strapData.buckle_butterfly_choosen : false
		if (!hasButterfly) {
			strapData.buckle_butterfly_price = strapData.buckle_butterfly_price || 0
		}
	}

	private ensureStrapParamsDefaults(strap: Strap | null | undefined) {
		this.normalizeStrap(strap)
		if (!strap) return
		const params = strap.attributes.watch_strap.strap_params
		const ensure = (list?: StrapColor[]) => {
			if (!Array.isArray(list) || list.length === 0) return
			if (!list.some((item) => item.choosen)) {
				list.forEach((item, index) => {
					item.choosen = index === 0
				})
			}
		}
		ensure(params?.leather_colors)
		ensure(params?.stitching_colors)
		ensure(params?.edge_colors)
		ensure(params?.buckle_colors)
		ensure(params?.adapter_colors)
	}

	// Методы загрузки данных (основные методы из оригинального стора)
	loadWatchModelsFromStorage(): WatchModel[] {
		if (typeof window === 'undefined') return []
		
		try {
			const stored = localStorage.getItem('watchModels')
			if (stored) {
				return JSON.parse(stored)
			}
		} catch (error) {
			console.error('Error loading watch models from storage:', error)
		}
		return []
	}

	saveWatchModelsToStorage() {
		if (typeof window === 'undefined') return
		try {
			localStorage.setItem('watchModels', JSON.stringify(this.watchModels))
		} catch (error) {
			console.error('Error saving watch models to storage:', error)
		}
	}

	// Публичный метод для сохранения (для использования извне)
	saveModels() {
		this.saveWatchModelsToStorage()
	}

	async loadWatchModelsFromAPI() {
		this.isLoading = true
		try {
			const { watchModelsApi } = await import('@/shared/api/watchModels.api')
			const models = await watchModelsApi.getAll()
			this.watchModels = models.map(m => ({ ...m, choosen: false }))
			this.saveWatchModelsToStorage()
			this.updateModelStepState()
			this.updateStrapStepState()
			this.updateStrapDesignStepState()
		} catch (error) {
			console.error('Error loading watch models from API:', error)
			this.watchModels = this.loadWatchModelsFromStorage()
		} finally {
			this.isLoading = false
		}
	}

	async loadWatchStrapsFromAPI() {
		this.isLoading = true
		try {
			const { watchStrapsApi } = await import('@/shared/api/watchStraps.api')
			const straps = await watchStrapsApi.getAll()
			
			// Сохраняем ID выбранного ремешка перед загрузкой новых данных
			const selectedStrapId = this.selectedStrapModel?.attributes.watch_strap.id
			
			// Загружаем новые данные
			this.watchStraps = straps.map(s => ({ ...s, choosen: false }))
			
			// Восстанавливаем выбор ремешка, если он был выбран
			if (selectedStrapId) {
				const strapToSelect = this.watchStraps.find(s => s.attributes.watch_strap.id === selectedStrapId)
				if (strapToSelect) {
					this.chooseStrapModel(strapToSelect.attributes.watch_strap.id)
				}
			} else {
				// Пытаемся восстановить из localStorage
				try {
					const stored = localStorage.getItem('watchStraps')
					if (stored) {
						const storedStraps = JSON.parse(stored) as any[]
						const chosenStrap = storedStraps.find((s: any) => s.choosen === true)
						if (chosenStrap) {
							const strapId = chosenStrap.attributes?.watch_strap?.id
							if (strapId) {
								const strapToSelect = this.watchStraps.find(s => s.attributes.watch_strap.id === strapId)
								if (strapToSelect) {
									this.chooseStrapModel(strapToSelect.attributes.watch_strap.id)
								}
							}
						}
					}
				} catch (error) {
					console.warn('Failed to restore watch strap from localStorage:', error)
				}
			}
			
			this.updateStrapStepState()
			this.updateStrapDesignStepState()
		} catch (error) {
			console.error('Error loading watch straps from API:', error)
		} finally {
			this.isLoading = false
		}
	}

	async loadConfiguratorSettings() {
		try {
			const { configuratorApi } = await import('@/shared/api/configurator.api')
			const settings = await configuratorApi.getSettings()
			
			if (settings.estimated_date) {
				this.orderStore.setClosestReadyDate(settings.estimated_date)
			}
			
			this.cartStore.additionalOption = {
				data: {
					attributes: {
						title: settings.title,
						description: settings.description,
						additional_options: settings.options.map((option) => ({
							option_name: option.option_name,
							option_title: option.option_title,
							option_price: option.option_price,
							option_image: option.option_image
								? { data: { attributes: { url: option.option_image } } }
							: undefined,
							choosen: false
						}))
					}
				}
			}
			const priceByName = new Map(settings.options.map((option) => [option.option_name, option.option_price]))
			this.steps.final.additionalOptions.initials.price = priceByName.get('initials') ?? 0
			this.steps.final.additionalOptions.presentBox.price = priceByName.get('present_box') ?? 0
			this.steps.final.additionalOptions.postCard.price = priceByName.get('postcard') ?? 0
		} catch (error) {
			console.error('Error loading configurator settings:', error)
		}
	}

	// Методы для админки (основные методы)
	async addWatchModel(model: WatchModel) {
		try {
			const { watchModelsApi } = await import('@/shared/api/watchModels.api')
			const created = await watchModelsApi.create(model)
			this.watchModels.push({ ...created, choosen: false })
			this.saveWatchModelsToStorage()
		} catch (error) {
			console.error('Error adding watch model:', error)
			throw error
		}
	}

	async updateWatchModel(index: number, updates: Partial<WatchModel>) {
		if (index >= 0 && index < this.watchModels.length) {
			const model = this.watchModels[index]
			const modelId = model.id
			
			if (!modelId) {
				const errorMsg = 'Невозможно обновить модель: ID не найден. Попробуйте перезагрузить страницу.'
				console.error('Model ID not found for update', model)
				alert(errorMsg)
				throw new Error(errorMsg)
			}
			
			try {
				const { watchModelsApi } = await import('@/shared/api/watchModels.api')
				const updatedModel = { ...model, ...updates }
				const result = await watchModelsApi.update(modelId, updatedModel)
				this.watchModels[index] = { ...result, choosen: model.choosen }
				this.saveWatchModelsToStorage()
			} catch (error) {
				console.error('Error updating watch model:', error)
				throw error
			}
		}
	}

	async deleteWatchModel(index: number) {
		if (index >= 0 && index < this.watchModels.length) {
			const model = this.watchModels[index]
			const modelId = model.id
			
			if (!modelId) {
				console.error('Model ID not found for delete', model)
				return
			}
			
			try {
				const { watchModelsApi } = await import('@/shared/api/watchModels.api')
				await watchModelsApi.delete(modelId)
				this.watchModels.splice(index, 1)
				this.saveWatchModelsToStorage()
			} catch (error) {
				console.error('Error deleting watch model:', error)
				throw error
			}
		}
	}

	// Дополнительные методы для обратной совместимости
	// (методы, которые используются в компонентах, но не были вынесены в подсторы)
	updateSelectedModel(option: string) {
		this.watchModels.forEach((item) => {
			item.watch_sizes.forEach((s) => (s.choosen = false))
			item.choosen = item.watch_model_name === option
			if (item.choosen) {
				item.watch_sizes[0].choosen = true
				this.steps.model.modelName = item.model_name
				this.steps.model.modelSize = item.watch_sizes[0].watch_size
				this.steps.model.isChoosen = true
				this.chooseFrameColor()
			}
		})
		this.updateModelStepState()
	}

	updateWatchModelSize(option: string) {
		this.watchModels.forEach((model) => {
			model.watch_sizes.forEach((size) => {
				size.choosen = size.watch_size === option
				if (size.choosen) {
					this.steps.model.modelSize = size.watch_size
				}
			})
		})
		this.updateModelStepState()
		this.saveWatchModelsToStorage() // Сохраняем состояние в localStorage
	}

	updateSelectedFrameColor(option: string) {
		this.chooseFrameColor(option)
		// chooseFrameColor уже сохраняет в localStorage
	}

	updateSelectedStrap(title: string = '') {
		const target = this.watchStraps.find((s) => s.attributes.watch_strap.strap_title === title)
		if (target) {
			this.chooseStrapModel(target.attributes.watch_strap.id)
		}
	}

	// Геттеры для доступных ремешков
	get availableWatchStraps() {
		const selectedModel = this.selectedWatchModel
		if (!selectedModel) {
			return []
		}
		// Если у модели нет ограничений по ремешкам, показываем все
		if (!selectedModel.available_strap_ids || selectedModel.available_strap_ids.length === 0) {
			return this.watchStraps
		}
		// Фильтруем ремешки по available_strap_ids
		const filtered = this.watchStraps.filter(strap => 
			selectedModel.available_strap_ids?.includes(strap.attributes.watch_strap.id)
		)
		return filtered
	}

	get selectedWatchModelStraps() {
		return this.availableWatchStraps
	}

	// Геттеры для изображений (упрощенные версии)
	get selectedFrameColorImages() {
		const color = this.selectedFrameColor
		if (!color) {
			return { view1: undefined, view2: undefined, view3: undefined }
		}
		// Упрощенная версия - полная логика в оригинальном файле
		return color.view_images || { view1: undefined, view2: undefined, view3: undefined }
	}

	getStrapBaseImageForFrameColor(strap: Strap): string | null {
		const frameColorId = this.selectedFrameColorId
		if (!frameColorId) return null
		const baseImages = (strap.attributes.watch_strap as any).base_images
		if (!baseImages || !Array.isArray(baseImages)) return null
		const matchingImage = baseImages.find((img: any) => img.colorId === frameColorId)
		if (!matchingImage) return null
		return matchingImage.view1Image || null
	}

	// Методы для работы с корзиной (прокси к CartStore)
	updateCartItem(itemId: string) {
		// Метод для обновления товара в корзине при редактировании
		const item = this.cartItems.find(item => item.id === itemId)
		if (!item) return

		// Обновляем товар текущими выбранными значениями
		item.watchModel = this.selectedWatchModel
		item.frameColor = this.selectedFrameColor
		item.strapModel = this.selectedStrapModel
		item.leatherColor = this.selectedLeatherColor
		item.stitchingColor = this.selectedStitchingColor
		item.edgeColor = this.selectedEdgeColor
		item.buckleColor = this.selectedBuckleColor
		item.adapterColor = this.selectedAdapterColor
		item.buckleButterfly = this.steps.strapDesign.buckleButterflyChoosen
		item.additionalOptions = { ...this.steps.final.additionalOptions }
		item.quantity = this.productAmount
		item.price = this.productsPrice
	}

	// Методы для работы с ремешками (админка)
	async addWatchStrap(strap: Strap) {
		try {
			const { watchStrapsApi } = await import('@/shared/api/watchStraps.api')
			const created = await watchStrapsApi.create(strap)
			this.watchStraps.push({ ...created, choosen: false })
		} catch (error) {
			console.error('Error adding watch strap:', error)
			throw error
		}
	}

	async updateWatchStrap(index: number, updates: Partial<Strap>) {
		if (index >= 0 && index < this.watchStraps.length) {
			const strap = this.watchStraps[index]
			const strapId = strap.attributes.watch_strap.id
			
			if (!strapId) {
				const errorMsg = 'Невозможно обновить ремешок: ID не найден. Попробуйте перезагрузить страницу.'
				console.error('Strap ID not found for update', strap)
				alert(errorMsg)
				throw new Error(errorMsg)
			}
			
			try {
				const { watchStrapsApi } = await import('@/shared/api/watchStraps.api')
				const updatedStrap = { ...strap, ...updates }
				const result = await watchStrapsApi.update(strapId, updatedStrap)
				this.watchStraps[index] = { ...result, choosen: strap.choosen }
			} catch (error) {
				console.error('Error updating watch strap:', error)
				throw error
			}
		}
	}

	async deleteWatchStrap(index: number) {
		if (index >= 0 && index < this.watchStraps.length) {
			const strap = this.watchStraps[index]
			const strapId = strap.attributes.watch_strap.id
			
			if (!strapId) {
				console.error('Strap ID not found for delete', strap)
				return
			}
			
			try {
				const { watchStrapsApi } = await import('@/shared/api/watchStraps.api')
				await watchStrapsApi.delete(strapId)
				this.watchStraps.splice(index, 1)
			} catch (error) {
				console.error('Error deleting watch strap:', error)
				throw error
			}
		}
	}

	async createStrapsBackup() {
		try {
			const { watchStrapsApi } = await import('@/shared/api/watchStraps.api')
			const backup = await watchStrapsApi.backup()
			const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `straps-backup-${new Date().toISOString().split('T')[0]}.json`
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Error creating straps backup:', error)
			throw error
		}
	}

	async createBackup() {
		try {
			const { watchModelsApi } = await import('@/shared/api/watchModels.api')
			const backup = await watchModelsApi.backup()
			const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `models-backup-${new Date().toISOString().split('T')[0]}.json`
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Error creating models backup:', error)
			throw error
		}
	}
}

