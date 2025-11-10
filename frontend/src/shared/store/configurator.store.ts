import { makeAutoObservable } from 'mobx'

export type StepKey = 'model' | 'strap' | 'strapDesign' | 'final'

export type FrameColorViewImages = {
	view1?: string
	view2?: string
	view3?: string
}

export type FrameColor = {
	color_name: string
	color_code?: string
	choosen: boolean
	view_images?: FrameColorViewImages
}
export type WatchSize = { watch_size: string; choosen: boolean }
export type WatchModel = {
	id?: number // ID из БД (опциональный для обратной совместимости)
	model_name: string
	watch_model_name: string
	watch_model_manufacturer?: string
	main_image?: string
	choosen: boolean
	watch_sizes: WatchSize[]
	frame_colors: FrameColor[]
	available_strap_ids?: number[] // ID доступных ремешков для этой модели
}

export type StrapColorImages = {
	view1?: string
	view2?: string
	view3?: string
	icon?: string
	[key: string]: string | undefined
}

export type StrapColor = {
	color_title: string
	color_code?: string
	choosen: boolean
	price?: number
	images?: StrapColorImages
	// исторические поля
	view1?: string
	view2?: string
	view3?: string
	icon?: string
}
export type StrapParams = {
	leather_colors?: StrapColor[]
	stitching_colors?: StrapColor[]
	edge_colors?: StrapColor[]
	buckle_colors?: StrapColor[]
	adapter_colors?: StrapColor[]
	has_buckle_butterfly?: boolean
	view_images?: {
		view1?: string
		view2?: string
		view3?: string
	}
}
export type Strap = {
	choosen: boolean
	dataFetched?: boolean
	attributes: {
		watch_strap: {
			id: number
			strap_name: string
			strap_title: string
			strap_description?: string
			strap_short_description?: string
			price: number
			preview_image?: string
			ultra_preview_image?: string
			has_buckle_butterfly?: boolean
			buckle_butterfly_choosen?: boolean
			buckle_butterfly_price?: number
			buckle_butterfly_image?: string
			strap_params: StrapParams
		}
	}
}

export type Promo = {
	promoFound: boolean
	type: 'percent' | 'ruble'
	discountValue: number
	code: string
}

export type AdditionalOptionMedia = {
	data?: {
		attributes: {
			url: string
		}
	}
}

export type AdditionalOptionItem = {
	option_name: string
	option_title: string
	option_price: number
	option_image?: AdditionalOptionMedia
	choosen: boolean
}

export type AdditionalOptionPayload = {
	data: {
		attributes: {
			title: string
			description: string
			additional_options: AdditionalOptionItem[]
		}
	}
}

export class ConfiguratorStore {
	// base state
	isLoading: boolean = false
	watchModels: WatchModel[] = []
	watchStraps: Strap[] = []
	currentStepNum: number = 1
	stepsAmount: number = 4

	// order state
	productAmount: number = 1
	deliveryPrice: number | null = 0
	closestReadyDate: string = ''
	orderNumber: string | null = null
	promoCode: string | null = null
	promoAccepted: boolean = false
	usedPromo: Promo | null = null
	orderPopupVisible: boolean = false
	
	// cart state
	cartItems: any[] = []
	editingCartItemId: string | null = null
	additionalOption: AdditionalOptionPayload | null = null

	steps: any = {
	model: {
		id: 1,
		title: 'Ваша модель часов',
		queryParam: 'watch-model',
		isChoosen: false,
		completed: false,
		modelName: '',
		modelSize: '',
		color: { name: '', code: '' }
	},
	strap: {
		id: 2,
		title: 'Выберите модель ремешка',
		queryParam: 'strap-model',
		isChoosen: false,
		completed: false,
		strapName: '',
		strapPrice: 0
	},
	strapDesign: {
		id: 3,
		title: 'Создайте уникальный дизайн',
		queryParam: 'strap-design',
		isChoosen: false,
		completed: false,
		leatherColor: { title: 'Кожа', name: '' },
		stitchingColor: { title: 'Строчка', name: '' },
		edgeColor: { title: 'Край', name: '' },
		buckleColor: { title: 'Пряжка', name: '' },
		adapterColor: { title: 'Адаптер', name: '' },
		buckleButterflyChoosen: false,
		price: 0
	},
	final: {
		id: 4,
		title: 'Добавьте надпись на ремешок',
		queryParam: 'final',
		isChoosen: false,
		additionalOptions: {
			totalPrice: 0,
			initials: { choosen: false, price: 0, text: null },
			presentBox: { choosen: false, price: 0 },
			postCard: { choosen: false, price: 0, text: null }
		},
		promo: { code: '', used: false, discountValue: 0, discountValueFull: '' },
		email: '',
		phone: '',
		name: { firstName: '', lastName: '', middleName: '' }
	}
}

	updateModelStepState() {
		const selectedModel = this.selectedWatchModel
		const selectedSize = selectedModel?.watch_sizes.find((size) => size.choosen)?.watch_size
		const selectedColor = this.selectedFrameColor

		this.steps.model.modelName = selectedModel?.model_name || ''
		this.steps.model.modelSize = selectedSize || ''
		this.steps.model.color = {
			name: selectedColor?.color_name || '',
			code: selectedColor?.color_code || '#C0C0C0'
		}
		const isComplete = !!(selectedModel && selectedSize && selectedColor)
		this.steps.model.isChoosen = isComplete
		this.steps.model.completed = isComplete
	}

	updateStrapStepState() {
		const selectedStrap = this.selectedStrapModel
		if (selectedStrap) {
			this.normalizeStrap(selectedStrap)
		}
		const strap = selectedStrap?.attributes.watch_strap
		if (strap) {
			this.steps.strap.strapName = strap.strap_title
			this.steps.strap.strapPrice = strap.price
		} else {
			this.steps.strap.strapName = ''
			this.steps.strap.strapPrice = 0
		}
		const hasStrap = !!strap
		this.steps.strap.isChoosen = hasStrap
		this.steps.strap.completed = hasStrap
	}

	updateStrapDesignStepState() {
		if (!this.selectedStrapModel) {
			this.steps.strapDesign.leatherColor = { ...this.steps.strapDesign.leatherColor, name: '' }
			this.steps.strapDesign.stitchingColor = { ...this.steps.strapDesign.stitchingColor, name: '' }
			this.steps.strapDesign.edgeColor = { ...this.steps.strapDesign.edgeColor, name: '' }
			this.steps.strapDesign.buckleColor = { ...this.steps.strapDesign.buckleColor, name: '' }
			this.steps.strapDesign.adapterColor = { ...this.steps.strapDesign.adapterColor, name: '' }
			this.steps.strapDesign.completed = false
			this.steps.strapDesign.isChoosen = false
			return
		}

		const leather = this.selectedLeatherColor
		const stitching = this.selectedStitchingColor
		const edge = this.selectedEdgeColor
		const buckle = this.selectedBuckleColor
		const adapter = this.selectedAdapterColor

		this.steps.strapDesign.leatherColor = {
			...this.steps.strapDesign.leatherColor,
			name: leather?.color_title || ''
		}
		this.steps.strapDesign.stitchingColor = {
			...this.steps.strapDesign.stitchingColor,
			name: stitching?.color_title || ''
		}
		this.steps.strapDesign.edgeColor = {
			...this.steps.strapDesign.edgeColor,
			name: edge?.color_title || ''
		}
		this.steps.strapDesign.buckleColor = {
			...this.steps.strapDesign.buckleColor,
			name: buckle?.color_title || ''
		}
		this.steps.strapDesign.adapterColor = {
			...this.steps.strapDesign.adapterColor,
			name: adapter?.color_title || ''
		}
		this.steps.strapDesign.completed = this.isStrapParamsSelected
		this.steps.strapDesign.isChoosen = this.steps.strapDesign.completed
	}
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


	constructor() {
		makeAutoObservable(this)
		this.updateModelStepState()
		this.updateStrapStepState()
		this.updateStrapDesignStepState()
	}
	
	// Загрузка моделей из localStorage
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
	
	// Сохранение моделей в localStorage
	saveWatchModelsToStorage() {
		if (typeof window === 'undefined') return
		
		try {
			localStorage.setItem('watchModels', JSON.stringify(this.watchModels))
		} catch (error) {
			console.error('Error saving watch models to storage:', error)
		}
	}

	// modal actions
	showOrderPopup() { this.orderPopupVisible = true }
	closeOrderPopup() { this.orderPopupVisible = false }

	// getters (computed)
	get selectedWatchModel() {
		return this.watchModels.find((m) => m.choosen) || null
	}
	get selectedWatchModelAllSizes() {
		return this.selectedWatchModel?.watch_sizes || null
	}
	get selectedWatchModelFrameColors() {
		return this.selectedWatchModel?.frame_colors || null
	}
	get selectedFrameColor() {
		return this.selectedWatchModelFrameColors?.find((c) => c.choosen) || null
	}
	get selectedFrameColorImages() {
		const color = this.selectedFrameColor
		if (!color) {
			return { view1: undefined as string | undefined, view2: undefined as string | undefined, view3: undefined as string | undefined }
		}
		return {
			view1: color.view_images?.view1 || undefined,
			view2: color.view_images?.view2 || undefined,
			view3: color.view_images?.view3 || undefined
		}
	}
	
	// Фильтрация ремешков по доступным для выбранной модели часов
	get availableWatchStraps() {
		const selectedModel = this.selectedWatchModel
		
		// Если модель не выбрана или у нее нет списка доступных ремешков, показываем все
		if (!selectedModel || !selectedModel.available_strap_ids || selectedModel.available_strap_ids.length === 0) {
			return this.watchStraps
		}
		
		// Фильтруем только доступные ремешки
		return this.watchStraps.filter(strap => 
			selectedModel.available_strap_ids?.includes(strap.attributes.watch_strap.id)
		)
	}
	get selectedWatchModelStraps() {
		return { data: this.watchStraps }
	}
	get selectedStrapModel() {
		return this.watchStraps.find((s) => s.choosen) || null
	}
	get selectedStrapModelParams() {
		return this.selectedStrapModel?.attributes.watch_strap.strap_params || null
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
		const step = this.currentStepNum
		if (step === 1) return this.steps.model.completed
		if (step === 2) return this.steps.strap.completed
		if (step === 3) return this.steps.strapDesign.completed
		return true
	}
	get currentAvailableStep() {
		let count = 1
		const steps = this.steps
		for (const key in steps) {
			const k = key as StepKey
			if (steps[k].isChoosen) count++
		}
		return count
	}
	get prevStepQuery() {
		const stepsById: Record<number, { queryParam: string }> = {}
		;(Object.keys(this.steps) as StepKey[]).forEach((k) => {
			stepsById[this.steps[k].id] = { queryParam: this.steps[k].queryParam }
		})
		const prev = this.currentStepNum - 1 > 0 ? this.currentStepNum - 1 : 1
		return stepsById[prev]?.queryParam || null
	}
	get nextStepQuery() {
		if (this.currentStepNum === this.stepsAmount) return null
		const stepsById: Record<number, { queryParam: string }> = {}
		;(Object.keys(this.steps) as StepKey[]).forEach((k) => {
			stepsById[this.steps[k].id] = { queryParam: this.steps[k].queryParam }
		})
		const next = this.currentStepNum + 1
		return stepsById[next]?.queryParam || null
	}

	// actions
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
	}
	updateSelectedModel(option: string) {
		this.watchModels.forEach((item) => {
			item.watch_sizes.forEach((s) => (s.choosen = false))
			item.choosen = item.watch_model_name === option
			if (item.choosen) {
				item.watch_sizes[0].choosen = true
				// Обновляем информацию в steps
				this.steps.model.modelName = item.model_name
				this.steps.model.modelSize = item.watch_sizes[0].watch_size
				this.steps.model.isChoosen = true
				this.chooseFrameColor()
			}
		})
		this.updateModelStepState()
	}
	updateWatchModelSize(option: string) {
		const clean = option.replace(/\D/g, '')
		this.selectedWatchModelAllSizes?.forEach((size) => {
			size.choosen = size.watch_size === clean
			if (size.choosen) {
				// Обновляем информацию в steps
				this.steps.model.modelSize = size.watch_size
			}
		})
		this.steps.model.isChoosen = true
		this.updateModelStepState()
	}
	updateSelectedFrameColor(option: string) {
		this.selectedWatchModelFrameColors?.forEach((c) => (c.choosen = c.color_name === option))
	}
	chooseFrameColor(name: string = '') {
		if (!this.selectedWatchModel?.frame_colors) return

		if (name === '') {
			this.selectedWatchModel.frame_colors.forEach((c, idx) => {
				c.choosen = idx === 0
			})
		} else {
			this.selectedWatchModel.frame_colors.forEach((c) => (c.choosen = c.color_name === name))
		}
		this.steps.model.isChoosen = !!this.selectedFrameColor
		this.updateModelStepState()
	}
	chooseStrapModel(id: number) {
		this.watchStraps.forEach((s) => (s.choosen = s.attributes.watch_strap.id === id))
		const strap = this.watchStraps.find((s) => s.attributes.watch_strap.id === id)
		if (strap) {
			this.normalizeStrap(strap)
			this.steps.strap.isChoosen = true
			this.steps.strap.strapName = strap.attributes.watch_strap.strap_title
			this.steps.strap.strapPrice = strap.attributes.watch_strap.price
			this.ensureStrapParamsDefaults(strap)
			strap.attributes.watch_strap.buckle_butterfly_choosen = false
			this.steps.strapDesign.buckleButterflyChoosen = false
		}
		this.updateStrapStepState()
		this.updateStrapDesignStepState()
	}
	updateSelectedStrap(title: string = '') {
		const target = title
			? this.watchStraps.find((s) => s.attributes.watch_strap.strap_title === title) || this.watchStraps[0]
			: this.watchStraps[0]
		if (target) {
			this.chooseStrapModel(target.attributes.watch_strap.id)
		}
	}
	chooseStrapLeatherColor(title: string) {
		this.selectedStrapModel?.attributes.watch_strap.strap_params.leather_colors?.forEach((c) => {
			c.choosen = c.color_title === title
		})
		this.updateStrapDesignStepState()
	}
	chooseStitchingColor(title: string) {
		this.selectedStrapModel?.attributes.watch_strap.strap_params.stitching_colors?.forEach((c) => (c.choosen = c.color_title === title))
		this.updateStrapDesignStepState()
	}
	chooseEdgeColor(title: string) {
		this.selectedStrapModel?.attributes.watch_strap.strap_params.edge_colors?.forEach((c) => (c.choosen = c.color_title === title))
		this.updateStrapDesignStepState()
	}
	chooseBuckleColor(title: string) {
		this.selectedStrapModel?.attributes.watch_strap.strap_params.buckle_colors?.forEach((c) => (c.choosen = c.color_title === title))
		this.updateStrapDesignStepState()
	}
	chooseAdapterColor(title: string) {
		this.selectedStrapModel?.attributes.watch_strap.strap_params.adapter_colors?.forEach((c) => (c.choosen = c.color_title === title))
		this.updateStrapDesignStepState()
	}
	chooseBuckleButterfly() {
		const strap = this.selectedStrapModel
		if (strap && strap.attributes.watch_strap.has_buckle_butterfly) {
			this.normalizeStrap(strap)
			strap.attributes.watch_strap.buckle_butterfly_choosen = !strap.attributes.watch_strap.buckle_butterfly_choosen
			this.steps.strapDesign.buckleButterflyChoosen = !!strap.attributes.watch_strap.buckle_butterfly_choosen
		} else {
			this.steps.strapDesign.buckleButterflyChoosen = false
		}
		this.updateStrapDesignStepState()
	}
	setClosestReadyDate(str: string) {
		this.closestReadyDate = str
	}
	increaseProductAmount() {
		this.productAmount++
	}
	decreaseProductAmount() {
		if (this.productAmount > 1) this.productAmount--
	}
	updatePromoCodeValue(str: string) {
		this.promoCode = str
	}
	promoUse(promo: Promo | null) {
		this.promoAccepted = promo !== null
		this.usedPromo = promo
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
	increaseQuantity() {
		if (this.productAmount < 10) this.productAmount += 1
	}
	
	decreaseQuantity() {
		if (this.productAmount > 1) this.productAmount -= 1
	}
	
	setQuantity(amount: number) {
		if (amount >= 1 && amount <= 10) this.productAmount = amount
	}
	
	// Методы для работы с корзиной
	addCurrentToCart() {
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
			price: this.totalPriceWithDiscount,
			addedAt: new Date().toISOString()
		}
		
		this.cartItems.push(cartItem)
		this.resetConfigurator()
	}
	
	removeFromCart(itemId: string) {
		this.cartItems = this.cartItems.filter(item => item.id !== itemId)
	}
	
	clearCart() {
		this.cartItems = []
	}
	
	resetConfigurator() {
		// Сбрасываем все выборы, но оставляем на первом шаге
		this.currentStepNum = 1
		this.productAmount = 1
		
		// Сбрасываем выборы часов
		this.watchModels.forEach(model => {
			model.choosen = false
			model.watch_sizes.forEach(size => size.choosen = false)
		})
		
		// Сбрасываем выборы ремешков
		this.watchStraps.forEach(strap => strap.choosen = false)
		
		// Сбрасываем дополнительные опции
		this.steps.final.additionalOptions.initials.choosen = false
		this.steps.final.additionalOptions.initials.text = null
		this.steps.final.additionalOptions.presentBox.choosen = false
		this.steps.final.additionalOptions.postCard.choosen = false
		this.steps.final.additionalOptions.postCard.text = null
		this.steps.strapDesign.buckleButterflyChoosen = false

		this.steps.model.isChoosen = false
		this.steps.model.completed = false
		this.steps.model.modelName = ''
		this.steps.model.modelSize = ''
		this.steps.model.color = { name: '', code: '' }

		this.steps.strap.isChoosen = false
		this.steps.strap.completed = false
		this.steps.strap.strapName = ''
		this.steps.strap.strapPrice = 0

		this.steps.strapDesign.completed = false
		this.steps.strapDesign.leatherColor = { title: 'Кожа', name: '' }
		this.steps.strapDesign.stitchingColor = { title: 'Строчка', name: '' }
		this.steps.strapDesign.edgeColor = { title: 'Край', name: '' }
		this.steps.strapDesign.buckleColor = { title: 'Пряжка', name: '' }
		this.steps.strapDesign.adapterColor = { title: 'Адаптер', name: '' }

		this.updateModelStepState()
		this.updateStrapStepState()
		this.updateStrapDesignStepState()
	}
	
	get cartTotalPrice() {
		return this.cartItems.reduce((total, item) => total + item.price, 0)
	}
	
	get cartItemsCount() {
		return this.cartItems.reduce((total, item) => total + item.quantity, 0)
	}
	
	// Методы для редактирования товаров из корзины
	editCartItem(itemId: string) {
		const item = this.cartItems.find(cartItem => cartItem.id === itemId)
		if (!item) return
		
		// Если уже редактируем этот товар, ничего не делаем
		if (this.editingCartItemId === itemId) return
		
		this.editingCartItemId = itemId
		
		// Загружаем конфигурацию товара в конфигуратор
		this.loadItemConfiguration(item)
	}
	
	loadItemConfiguration(item: any) {
		// Сбрасываем текущие выборы
		this.resetConfigurator()
		
		// Загружаем выборы часов
		if (item.watchModel) {
			const watchModelIndex = this.watchModels.findIndex(model => 
				model.watch_model_name === item.watchModel.watch_model_name
			)
			if (watchModelIndex !== -1) {
				this.chooseWatchModel(watchModelIndex, 0)
			}
		}
		
		// Загружаем цвет корпуса
		if (item.frameColor) {
			this.chooseFrameColor(item.frameColor.color_name)
		}
		
		// Переходим на следующий шаг
		this.nextStep()
		
		// Загружаем модель ремешка
		if (item.strapModel) {
			this.chooseStrapModel(item.strapModel.attributes.watch_strap.id)
		}
		
		// Переходим на следующий шаг
		this.nextStep()
		
		// Загружаем цвета ремешка
		if (item.leatherColor) {
			this.chooseStrapLeatherColor(item.leatherColor.color_title)
		}
		if (item.stitchingColor) {
			this.chooseStitchingColor(item.stitchingColor.color_title)
		}
		if (item.edgeColor) {
			this.chooseEdgeColor(item.edgeColor.color_title)
		}
		if (item.buckleColor) {
			this.chooseBuckleColor(item.buckleColor.color_title)
		}
		if (item.adapterColor) {
			this.chooseAdapterColor(item.adapterColor.color_title)
		}
		
		// Загружаем butterfly пряжку
		if (item.buckleButterfly) {
			this.chooseBuckleButterfly()
		}
		
		// Переходим на финальный шаг
		this.nextStep()
		
		// Загружаем дополнительные опции
		if (item.additionalOptions) {
			if (item.additionalOptions.initials.choosen) {
				this.toggleInitials(true)
				if (item.additionalOptions.initials.text) {
					this.setInitialsText(item.additionalOptions.initials.text)
				}
			}
			if (item.additionalOptions.presentBox.choosen) {
				this.togglePresentBox(true)
			}
			if (item.additionalOptions.postCard.choosen) {
				this.togglePostCard(true)
				if (item.additionalOptions.postCard.text) {
					this.setPostCardText(item.additionalOptions.postCard.text)
				}
			}
		}
		
		// Загружаем количество
		this.productAmount = item.quantity

		this.updateModelStepState()
		this.updateStrapStepState()
		this.updateStrapDesignStepState()
	}
	
	updateCartItem(itemId: string) {
		const itemIndex = this.cartItems.findIndex(item => item.id === itemId)
		if (itemIndex === -1) return
		
		// Обновляем товар в корзине с текущей конфигурацией
		this.cartItems[itemIndex] = {
			...this.cartItems[itemIndex],
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
			price: this.totalPriceWithDiscount,
			updatedAt: new Date().toISOString()
		}
		
		this.editingCartItemId = null
	}
	
	cancelEditCartItem() {
		this.editingCartItemId = null
		this.resetConfigurator()
	}
	
	nextStep() {
		if (this.currentStepNum < this.stepsAmount && this.nextStepReady) this.currentStepNum += 1
	}
	prevStep() {
		if (this.currentStepNum > 1) this.currentStepNum -= 1
	}
	
	// Загрузка моделей из API
	async loadWatchModelsFromAPI() {
		try {
			this.isLoading = true
			const { watchModelsApi } = await import('../api/watchModels.api')
			const models = await watchModelsApi.getAll()
			this.watchModels = models
			
			// Если ни одна модель не выбрана, выбираем первую
			if (!this.selectedWatchModel && this.watchModels.length > 0) {
				this.watchModels[0].choosen = true
				if (this.watchModels[0].watch_sizes.length > 0) {
					this.watchModels[0].watch_sizes[0].choosen = true
				}
				this.chooseFrameColor()
			}
			
			// Также сохраняем в localStorage для оффлайн режима
			this.saveWatchModelsToStorage()
			
			// Обновляем информацию в steps для выбранной модели
			const selectedModel = this.selectedWatchModel
			if (selectedModel) {
				this.steps.model.modelName = selectedModel.model_name
				const selectedSize = selectedModel.watch_sizes.find(s => s.choosen)
				if (selectedSize) {
					this.steps.model.modelSize = selectedSize.watch_size
				}
			}
			this.updateModelStepState()
			this.updateStrapStepState()
			this.updateStrapDesignStepState()
		} catch (error) {
			console.error('Error loading watch models from API:', error)
			// Если API недоступен, используем localStorage
			this.watchModels = this.loadWatchModelsFromStorage()
		} finally {
			this.isLoading = false
		}
	}
	
	async loadConfiguratorSettings() {
		try {
			const { configuratorApi } = await import('../api/configurator.api')
			const settings = await configuratorApi.getSettings()
			this.additionalOption = {
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

	// Admin methods for managing watch models (с сохранением в API)
	async addWatchModel(model: WatchModel) {
		try {
			const { watchModelsApi } = await import('../api/watchModels.api')
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
				const { watchModelsApi } = await import('../api/watchModels.api')
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
				const errorMsg = 'Невозможно удалить модель: ID не найден. Попробуйте перезагрузить страницу.'
				console.error('Model ID not found for deletion', model)
				alert(errorMsg)
				throw new Error(errorMsg)
			}
			
			try {
				const { watchModelsApi } = await import('../api/watchModels.api')
				await watchModelsApi.delete(modelId)
				this.watchModels.splice(index, 1)
				this.saveWatchModelsToStorage()
			} catch (error) {
				console.error('Error deleting watch model:', error)
				throw error
			}
		}
	}
	
	// Создание бэкапа
	async createBackup() {
		try {
			const { watchModelsApi } = await import('../api/watchModels.api')
			const backup = await watchModelsApi.backup()
			
			// Скачиваем как JSON файл
			const dataStr = JSON.stringify(backup, null, 2)
			const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
			const exportFileDefaultName = `watch-models-backup-${backup.timestamp.split('T')[0]}.json`
			
			const linkElement = document.createElement('a')
			linkElement.setAttribute('href', dataUri)
			linkElement.setAttribute('download', exportFileDefaultName)
			linkElement.click()
			
			return backup
		} catch (error) {
			console.error('Error creating backup:', error)
			throw error
		}
	}
	
	// Восстановление из бэкапа
	async restoreFromBackup(backupFile: File) {
		try {
			this.isLoading = true
			
			// Читаем файл
			const fileContent = await backupFile.text()
			const backup = JSON.parse(fileContent)
			
			// Проверяем структуру бэкапа
			if (!backup.data || !Array.isArray(backup.data)) {
				throw new Error('Неверный формат файла бэкапа')
			}
			
			// Отправляем на сервер для восстановления
			const { watchModelsApi } = await import('../api/watchModels.api')
			const result = await watchModelsApi.restore(backup.data)
			
			// Перезагружаем данные
			await this.loadWatchModelsFromAPI()
			
			return result
		} catch (error) {
			console.error('Error restoring from backup:', error)
			throw error
		} finally {
			this.isLoading = false
		}
	}
	
	
	// ========== Методы для управления ремешками ==========
	
	// Загрузка ремешков из API
	async loadWatchStrapsFromAPI() {
		try {
			this.isLoading = true
			const { watchStrapsApi } = await import('../api/watchStraps.api')
			const straps = await watchStrapsApi.getAll()
			straps.forEach((strap) => this.normalizeStrap(strap))
			this.watchStraps = straps
			if (!this.selectedStrapModel && this.watchStraps.length > 0) {
				this.watchStraps[0].choosen = true
			}
			this.ensureStrapParamsDefaults(this.selectedStrapModel)
			this.updateStrapStepState()
			this.updateStrapDesignStepState()
		} catch (error) {
			console.error('Error loading watch straps from API:', error)
		} finally {
			this.isLoading = false
		}
	}
	
	async addWatchStrap(strap: Strap) {
		try {
			const { watchStrapsApi } = await import('../api/watchStraps.api')
			const created = await watchStrapsApi.create(strap)
			this.normalizeStrap(created)
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
				const { watchStrapsApi } = await import('../api/watchStraps.api')
				const updatedStrap = { ...strap, ...updates }
				const result = await watchStrapsApi.update(strapId, updatedStrap)
				this.normalizeStrap(result)
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
				const errorMsg = 'Невозможно удалить ремешок: ID не найден. Попробуйте перезагрузить страницу.'
				console.error('Strap ID not found for deletion', strap)
				alert(errorMsg)
				throw new Error(errorMsg)
			}
			
			try {
				const { watchStrapsApi } = await import('../api/watchStraps.api')
				await watchStrapsApi.delete(strapId)
				this.watchStraps.splice(index, 1)
			} catch (error) {
				console.error('Error deleting watch strap:', error)
				throw error
			}
		}
	}
	
	// Создание бэкапа ремешков
	async createStrapsBackup() {
		try {
			const { watchStrapsApi } = await import('../api/watchStraps.api')
			const backup = await watchStrapsApi.backup()
			
			// Скачиваем файл
			const blob = new Blob([JSON.stringify(backup.data, null, 2)], { type: 'application/json' })
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `watch-straps-backup-${new Date().toISOString().split('T')[0]}.json`
			a.click()
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Error creating straps backup:', error)
			throw error
		}
	}
	
	// Восстановление ремешков из бэкапа
	async restoreStrapsFromBackup(backupFile: File) {
		try {
			this.isLoading = true
			const text = await backupFile.text()
			const backupData = JSON.parse(text)
			
			const { watchStrapsApi } = await import('../api/watchStraps.api')
			await watchStrapsApi.restore(backupData)
			
			// Перезагружаем данные
			await this.loadWatchStrapsFromAPI()
		} catch (error) {
			console.error('Error restoring straps from backup:', error)
			throw error
		} finally {
			this.isLoading = false
		}
	}
	
	// Создание полного бэкапа всех данных админки
	async createFullBackup() {
		try {
			this.isLoading = true
			
			// Получаем данные моделей часов
			const { watchModelsApi } = await import('../api/watchModels.api')
			const modelsBackup = await watchModelsApi.backup()
			
			// Получаем данные ремешков
			const { watchStrapsApi } = await import('../api/watchStraps.api')
			const strapsBackup = await watchStrapsApi.backup()
			
			// Получаем данные промокодов
			const { promocodeApi } = await import('../api/promocode.api')
			const promoCodesBackup = await promocodeApi.backup()
			
			// Создаем полный бэкап
			const fullBackup = {
				timestamp: new Date().toISOString(),
				version: '1.1',
				models: modelsBackup,
				straps: strapsBackup,
				promoCodes: promoCodesBackup,
				description: 'Полный бэкап всех данных админки (модели, ремешки, промокоды)'
			}
			
			// Скачиваем как JSON файл
			const dataStr = JSON.stringify(fullBackup, null, 2)
			const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
			const exportFileDefaultName = `admin-full-backup-${fullBackup.timestamp.split('T')[0]}.json`
			
			const linkElement = document.createElement('a')
			linkElement.setAttribute('href', dataUri)
			linkElement.setAttribute('download', exportFileDefaultName)
			linkElement.click()
			
			return fullBackup
		} catch (error) {
			console.error('Error creating full backup:', error)
			throw error
		} finally {
			this.isLoading = false
		}
	}
	
	// Восстановление из полного бэкапа
	async restoreFromFullBackup(backupFile: File) {
		try {
			this.isLoading = true
			
			// Проверяем тип файла
			if (!backupFile.name.endsWith('.json')) {
				throw new Error('Файл должен быть в формате JSON')
			}
			
			const text = await backupFile.text()
			let backupData
			
			try {
				backupData = JSON.parse(text)
			} catch (parseError) {
				throw new Error('Неверный формат JSON файла')
			}
			
			// Проверяем структуру бэкапа (модели и ремешки обязательны, промокоды опциональны для старых бэкапов)
			if (!backupData.models || !backupData.straps) {
				throw new Error('Неверный формат файла бэкапа. Отсутствуют данные моделей или ремешков.')
			}
			
			// Проверяем версию бэкапа
			if (backupData.version && backupData.version !== '1.0' && backupData.version !== '1.1') {
				console.warn('Версия бэкапа отличается от текущей:', backupData.version)
			}
			
			console.log('Начинаем восстановление из бэкапа:', backupData.timestamp)
			
			// Восстанавливаем модели часов
			const { watchModelsApi } = await import('../api/watchModels.api')
			await watchModelsApi.restore(backupData.models)
			console.log('Модели часов восстановлены')
			
			// Восстанавливаем ремешки
			const { watchStrapsApi } = await import('../api/watchStraps.api')
			await watchStrapsApi.restore(backupData.straps)
			console.log('Ремешки восстановлены')
			
			// Восстанавливаем промокоды (если есть в бэкапе)
			if (backupData.promoCodes?.data) {
				const { promocodeApi } = await import('../api/promocode.api')
				await promocodeApi.restore(backupData.promoCodes.data)
				console.log('Промокоды восстановлены')
			}
			
			// Перезагружаем все данные
			await this.loadWatchModelsFromAPI()
			await this.loadWatchStrapsFromAPI()
			
			console.log('Все данные успешно восстановлены')
			
		} catch (error) {
			console.error('Error restoring from full backup:', error)
			throw error
		} finally {
			this.isLoading = false
		}
	}
}

export const configuratorStore = new ConfiguratorStore()
