import { makeAutoObservable } from 'mobx'

export type StepKey = 'model' | 'strap' | 'strapDesign' | 'final'

export type FrameColor = { color_name: string; color_code?: string; choosen: boolean }
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

export type StrapColor = { color_title: string; color_code?: string; choosen: boolean; price?: number }
export type StrapParams = {
	leather_colors: StrapColor[]
	stitching_colors: StrapColor[]
	edge_colors: StrapColor[]
	buckle_colors: StrapColor[]
	adapter_colors: StrapColor[]
	has_buckle_butterfly?: boolean
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
			buckle_butterfly_choosen?: boolean
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

const mockWatchModels: WatchModel[] = [
	{
		model_name: 'Apple Watch',
		watch_model_name: '4-6 серия, SE',
		watch_model_manufacturer: 'Apple Watch',
		main_image: 'https://api.slavalarionov.store/uploads/4_6_series_ab7100cb46.png',
		choosen: true,
		watch_sizes: [
			{ watch_size: '40', choosen: true },
			{ watch_size: '44', choosen: false }
		],
		frame_colors: [
			{ color_name: 'Silver', color_code: '#C0C0C0', choosen: true },
			{ color_name: 'Black', color_code: '#000000', choosen: false }
		]
	},
	{
		model_name: 'Apple Watch',
		watch_model_name: '7-9 серия',
		watch_model_manufacturer: 'Apple Watch',
		main_image: 'https://api.slavalarionov.store/uploads/7_8_series_0de058bb24.png',
		choosen: false,
		watch_sizes: [
			{ watch_size: '41', choosen: false },
			{ watch_size: '45', choosen: false }
		],
		frame_colors: [
			{ color_name: 'Silver', color_code: '#C0C0C0', choosen: false },
			{ color_name: 'Black', color_code: '#000000', choosen: false }
		]
	},
	{
		model_name: 'Apple Watch',
		watch_model_name: '10 серия',
		watch_model_manufacturer: 'Apple Watch',
		main_image: 'https://api.slavalarionov.store/uploads/10_series_7ad739c554.png',
		choosen: false,
		watch_sizes: [
			{ watch_size: '42', choosen: false },
			{ watch_size: '46', choosen: false }
		],
		frame_colors: [
			{ color_name: 'Silver', color_code: '#C0C0C0', choosen: false },
			{ color_name: 'Black', color_code: '#000000', choosen: false }
		]
	},
	{
		model_name: 'Apple Watch',
		watch_model_name: 'Ultra 1-2',
		watch_model_manufacturer: 'Apple Watch',
		main_image: 'https://api.slavalarionov.store/uploads/ultra_06287a958b.png',
		choosen: false,
		watch_sizes: [
			{ watch_size: '49', choosen: false }
		],
		frame_colors: [
			{ color_name: 'Titanium', color_code: '#8A8D8F', choosen: false },
			{ color_name: 'Black', color_code: '#000000', choosen: false }
		]
	}
]

const mockStraps: Strap[] = [
	{
		choosen: false,
		attributes: {
			watch_strap: {
				id: 1,
				strap_name: 'butterfly',
				strap_title: 'Butterfly',
				strap_description: 'Пряжка бабочка для исключительного комфорта',
				price: 8990,
				preview_image: 'https://api.slavalarionov.store/uploads/butterfly_6c5fe88b84.png',
				ultra_preview_image: 'https://api.slavalarionov.store/uploads/butterfly_6c5fe88b84.png',
				buckle_butterfly_choosen: true,
				strap_params: {
					leather_colors: [
						{ color_title: 'Черный', color_code: '#1b1b1b', choosen: false },
						{ color_title: 'Коричневый', color_code: '#7b4b2a', choosen: false }
					],
					stitching_colors: [
						{ color_title: 'Черная', color_code: '#1b1b1b', choosen: false },
						{ color_title: 'Белая', color_code: '#ffffff', choosen: false }
					],
					edge_colors: [
						{ color_title: 'Черный', color_code: '#1b1b1b', choosen: false },
						{ color_title: 'Коричневый', color_code: '#7b4b2a', choosen: false }
					],
					buckle_colors: [
						{ color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
						{ color_title: 'Black', color_code: '#000000', choosen: false }
					],
					adapter_colors: [
						{ color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
						{ color_title: 'Black', color_code: '#000000', choosen: false }
					],
					has_buckle_butterfly: true
				}
			}
		}
	},
	{
		choosen: false,
		attributes: {
			watch_strap: {
				id: 2,
				strap_name: 'classic',
				strap_title: 'Classic',
				strap_description: 'Превосходный классический дизайн и ничего лишнего',
				price: 8490,
				preview_image: 'https://api.slavalarionov.store/uploads/classic_8280babad8.png',
				ultra_preview_image: 'https://api.slavalarionov.store/uploads/classic_8280babad8.png',
				buckle_butterfly_choosen: false,
				strap_params: {
					leather_colors: [
						{ color_title: 'Черный', color_code: '#1b1b1b', choosen: false },
						{ color_title: 'Коричневый', color_code: '#7b4b2a', choosen: false }
					],
					stitching_colors: [
						{ color_title: 'Черная', color_code: '#1b1b1b', choosen: false },
						{ color_title: 'Белая', color_code: '#ffffff', choosen: false }
					],
					edge_colors: [
						{ color_title: 'Черный', color_code: '#1b1b1b', choosen: false }
					],
					buckle_colors: [
						{ color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
						{ color_title: 'Black', color_code: '#000000', choosen: false }
					],
					adapter_colors: [
						{ color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
						{ color_title: 'Black', color_code: '#000000', choosen: false }
					],
					has_buckle_butterfly: false
				}
			}
		}
	},
	{
		choosen: false,
		attributes: {
			watch_strap: {
				id: 3,
				strap_name: 'double-wrap',
				strap_title: 'Double Wrap',
				strap_description: 'С двойным оборотом вокруг запястья',
				price: 9490,
				preview_image: 'https://api.slavalarionov.store/uploads/aw_dabl_6163afb63b.png',
				ultra_preview_image: 'https://api.slavalarionov.store/uploads/aw_dabl_6163afb63b.png',
				buckle_butterfly_choosen: false,
				strap_params: {
					leather_colors: [
						{ color_title: 'Черный', color_code: '#1b1b1b', choosen: false },
						{ color_title: 'Коричневый', color_code: '#7b4b2a', choosen: false }
					],
					stitching_colors: [
						{ color_title: 'Черная', color_code: '#1b1b1b', choosen: false },
						{ color_title: 'Белая', color_code: '#ffffff', choosen: false }
					],
					edge_colors: [
						{ color_title: 'Черный', color_code: '#1b1b1b', choosen: false }
					],
					buckle_colors: [
						{ color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
						{ color_title: 'Black', color_code: '#000000', choosen: false }
					],
					adapter_colors: [
						{ color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
						{ color_title: 'Black', color_code: '#000000', choosen: false }
					],
					has_buckle_butterfly: false
				}
			}
		}
	},
	{
		choosen: true,
		attributes: {
			watch_strap: {
				id: 4,
				strap_name: 'brogue',
				strap_title: 'Brogue',
				strap_description: 'Ремешок «Brogue» с элегантной перфорацией (словно на стильных классических туфлях) позволит вашей руке дышать. Поверьте, с этой моделью ваше запястье будет чувствовать себя в полном комфорте и будет притягивать взгляды.',
				strap_short_description: 'Декоративная перфорация в классическом стиле',
				price: 8990,
				preview_image: 'https://api.slavalarionov.store/uploads/Brogue_4539ae7e9d.png',
				ultra_preview_image: 'https://api.slavalarionov.store/uploads/Brogue_4539ae7e9d.png',
				buckle_butterfly_choosen: false,
				strap_params: {
					leather_colors: [
						{ color_title: 'Белый', color_code: '#ffffff', choosen: true },
						{ color_title: 'Чёрный', color_code: '#000000', choosen: false },
						{ color_title: 'Бежевый', color_code: '#f5f5dc', choosen: false },
						{ color_title: 'Чароит', color_code: '#7c5a9b', choosen: false },
						{ color_title: 'Зеленовато-желтый', color_code: '#949e20', choosen: false },
						{ color_title: 'Шоколадный', color_code: '#684625', choosen: false },
						{ color_title: 'Зелёный', color_code: '#31584a', choosen: false },
						{ color_title: 'Фуксия', color_code: '#a8355a', choosen: false },
						{ color_title: 'Голубой', color_code: '#6b8390', choosen: false },
						{ color_title: 'Марсала', color_code: '#5e4a4f', choosen: false },
						{ color_title: 'Мятный', color_code: '#a2b2a9', choosen: false },
						{ color_title: 'Оранжевый', color_code: '#9f4529', choosen: false },
						{ color_title: 'Пудра', color_code: '#af9d97', choosen: false },
						{ color_title: 'Красный', color_code: '#bb4646', choosen: false },
						{ color_title: 'Королевский синий', color_code: '#373a4d', choosen: false },
						{ color_title: 'Серый', color_code: '#67605e', choosen: false },
						{ color_title: 'Ультрамарин', color_code: '#5966ad', choosen: false },
						{ color_title: 'Фиолетовый', color_code: '#64396b', choosen: false },
						{ color_title: 'Жёлтый', color_code: '#c79a30', choosen: false }
					],
					stitching_colors: [
						{ color_title: 'Белый', color_code: '#ffffff', choosen: true },
						{ color_title: 'Бежевый', color_code: '#f5f5dc', choosen: false },
						{ color_title: 'Чёрный', color_code: '#000000', choosen: false },
						{ color_title: 'Коричневый', color_code: '#684625', choosen: false },
						{ color_title: 'Чароит', color_code: '#7c5a9b', choosen: false },
						{ color_title: 'Зелёный', color_code: '#31584a', choosen: false },
						{ color_title: 'Фуксия', color_code: '#a8355a', choosen: false },
						{ color_title: 'Голубой', color_code: '#6b8390', choosen: false },
						{ color_title: 'Марсала', color_code: '#5e4a4f', choosen: false },
						{ color_title: 'Мятный', color_code: '#a2b2a9', choosen: false },
						{ color_title: 'Оранжевый', color_code: '#9f4529', choosen: false },
						{ color_title: 'Пудра', color_code: '#af9d97', choosen: false },
						{ color_title: 'Красный', color_code: '#bb4646', choosen: false },
						{ color_title: 'Королевский синий', color_code: '#373a4d', choosen: false },
						{ color_title: 'Серый', color_code: '#67605e', choosen: false },
						{ color_title: 'Ультрамарин', color_code: '#5966ad', choosen: false },
						{ color_title: 'Фиолетовый', color_code: '#64396b', choosen: false },
						{ color_title: 'Жёлтый', color_code: '#c79a30', choosen: false },
						{ color_title: 'Зеленовато-желтый', color_code: '#949e20', choosen: false }
					],
					edge_colors: [
						{ color_title: 'Белый', color_code: '#ffffff', choosen: true },
						{ color_title: 'Бежевый', color_code: '#f5f5dc', choosen: false },
						{ color_title: 'Чёрный', color_code: '#000000', choosen: false },
						{ color_title: 'Коричневый', color_code: '#684625', choosen: false },
						{ color_title: 'Чароит', color_code: '#7c5a9b', choosen: false },
						{ color_title: 'Зеленовато-желтый', color_code: '#949e20', choosen: false },
						{ color_title: 'Зелёный', color_code: '#31584a', choosen: false },
						{ color_title: 'Фуксия', color_code: '#a8355a', choosen: false },
						{ color_title: 'Голубой', color_code: '#6b8390', choosen: false },
						{ color_title: 'Марсала', color_code: '#5e4a4f', choosen: false },
						{ color_title: 'Мятный', color_code: '#a2b2a9', choosen: false },
						{ color_title: 'Оранжевый', color_code: '#9f4529', choosen: false },
						{ color_title: 'Пудра', color_code: '#af9d97', choosen: false },
						{ color_title: 'Красный', color_code: '#bb4646', choosen: false },
						{ color_title: 'Королевский синий', color_code: '#373a4d', choosen: false },
						{ color_title: 'Серый', color_code: '#67605e', choosen: false },
						{ color_title: 'Ультрамарин', color_code: '#5966ad', choosen: false },
						{ color_title: 'Фиолетовый', color_code: '#64396b', choosen: false },
						{ color_title: 'Жёлтый', color_code: '#c79a30', choosen: false }
					],
					buckle_colors: [
						{ color_title: 'Чёрный', color_code: '#000000', choosen: false },
						{ color_title: 'Розовое золото', color_code: '#b8977e', choosen: false },
						{ color_title: 'Серебряный', color_code: '#c0c0c0', choosen: true }
					],
					adapter_colors: [
						{ color_title: 'Серебряный', color_code: '#c0c0c0', choosen: true },
						{ color_title: 'Чёрный', color_code: '#000000', choosen: false },
						{ color_title: 'Роз. золото', color_code: '#b8977e', choosen: false },
						{ color_title: 'Синий', color_code: '#4a90e2', choosen: false },
						{ color_title: 'Зелёный', color_code: '#31584a', choosen: false }
					],
					has_buckle_butterfly: false
				}
			}
		}
	},
	{
		choosen: false,
		attributes: {
			watch_strap: {
				id: 5,
				strap_name: 'minimal',
				strap_title: 'Minimal',
				strap_description: 'Элегантно, стильно и безумно аккуратно',
				price: 6990,
				preview_image: 'https://api.slavalarionov.store/uploads/Minimal_6d74c24e75.png',
				ultra_preview_image: 'https://api.slavalarionov.store/uploads/Minimal_6d74c24e75.png',
				buckle_butterfly_choosen: false,
				strap_params: {
					leather_colors: [
						{ color_title: 'Черный', color_code: '#1b1b1b', choosen: false },
						{ color_title: 'Коричневый', color_code: '#7b4b2a', choosen: false }
					],
					stitching_colors: [
						{ color_title: 'Черная', color_code: '#1b1b1b', choosen: false },
						{ color_title: 'Белая', color_code: '#ffffff', choosen: false }
					],
					edge_colors: [
						{ color_title: 'Черный', color_code: '#1b1b1b', choosen: false }
					],
					buckle_colors: [
						{ color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
						{ color_title: 'Black', color_code: '#000000', choosen: false }
					],
					adapter_colors: [
						{ color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
						{ color_title: 'Black', color_code: '#000000', choosen: false }
					],
					has_buckle_butterfly: false
				}
			}
		}
	}
]

export class ConfiguratorStore {
	// base state
	isLoading: boolean = false
	watchModels: WatchModel[] = mockWatchModels // Инициализируем mock данными для SSR
	watchStraps: Strap[] = mockStraps
	currentStepNum: number = 1
	stepsAmount: number = 4

	// order state
	productAmount: number = 1
	deliveryPrice: number | null = 0
	closestReadyDate: string = '13 октября'
	orderNumber: string | null = null
	promoCode: string | null = null
	promoAccepted: boolean = false
	usedPromo: Promo | null = null
	orderPopupVisible: boolean = false
	
	// cart state
	cartItems: any[] = []
	editingCartItemId: string | null = null
	additionalOption: any = {
		data: {
			attributes: {
				title: 'Ремешок почти готов!',
				description: 'Вы создали уникальный ремешок и он просто прекрасен! Сейчас вы можете добавить инициалы (2-3 буквы на русском или английском языке), добавить подарочную упаковку и подписать открытку, которую мы приложим к этому ремешку.',
				additional_options: [
					{
						option_name: 'initials',
						option_title: 'Нанесение инициалов',
						option_price: 390,
						option_image: {
							data: {
								attributes: {
									url: '/uploads/caption_88dca0bed8.jpg'
								}
							}
						},
						choosen: false
					},
					{
						option_name: 'present_box',
						option_title: 'Подарочная коробка',
						option_price: 300,
						option_image: {
							data: {
								attributes: {
									url: '/uploads/present_box_75bbc808e1.jpg'
								}
							}
						},
						choosen: false
					},
					{
						option_name: 'postcard',
						option_title: 'Подарочная открытка',
						option_price: 90,
						option_image: {
							data: {
								attributes: {
									url: '/uploads/postcard_4490cc700c.jpg'
								}
							}
						},
						choosen: false
					}
				]
			}
		}
	}

	steps: any = {
		model: {
			id: 1,
			title: 'Ваша модель часов',
			queryParam: 'watch-model',
			isChoosen: true,
			modelName: mockWatchModels[0].model_name,
			modelSize: mockWatchModels[0].watch_sizes[0].watch_size,
			color: { name: 'Silver', code: '#C0C0C0' }
		},
		strap: {
			id: 2,
			title: 'Выберите модель ремешка',
			queryParam: 'strap-model',
			isChoosen: true,
			strapName: 'Brogue',
			strapPrice: 8990
		},
		strapDesign: {
			id: 3,
			title: 'Создайте уникальный дизайн',
			queryParam: 'strap-design',
			isChoosen: true,
			leatherColor: { title: 'Кожа', name: 'Черный' },
			stitchingColor: { title: 'Строчка', name: 'Черная' },
			edgeColor: { title: 'Край', name: 'Черный' },
			buckleColor: { title: 'Пряжка', name: 'Silver' },
			adapterColor: { title: 'Адаптер', name: 'Silver' },
			buckleButterflyChoosen: false,
			price: 3900
		},
		final: {
			id: 4,
			title: 'Добавьте надпись на ремешок',
			queryParam: 'final',
			isChoosen: true,
			additionalOptions: {
				totalPrice: 0,
				initials: { choosen: false, price: 500, text: null },
				presentBox: { choosen: false, price: 700 },
				postCard: { choosen: false, price: 300, text: null }
			},
			promo: { code: '', used: false, discountValue: 0, discountValueFull: '' },
			email: '',
			phone: '',
			name: { firstName: '', lastName: '', middleName: '' }
		}
	}

	constructor() {
		makeAutoObservable(this)
	}
	
	// Загрузка моделей из localStorage или использование mock данных
	loadWatchModelsFromStorage(): WatchModel[] {
		if (typeof window === 'undefined') return mockWatchModels
		
		try {
			const stored = localStorage.getItem('watchModels')
			if (stored) {
				return JSON.parse(stored)
			}
		} catch (error) {
			console.error('Error loading watch models from storage:', error)
		}
		
		return mockWatchModels
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
		return this.selectedStrapModelParams?.leather_colors.find((c) => c.choosen) || null
	}
	get selectedStitchingColor() {
		return this.selectedStrapModelParams?.stitching_colors.find((c) => c.choosen) || null
	}
	get selectedEdgeColor() {
		return this.selectedStrapModelParams?.edge_colors.find((c) => c.choosen) || null
	}
	get selectedBuckleColor() {
		return this.selectedStrapModelParams?.buckle_colors.find((c) => c.choosen) || null
	}
	get selectedAdapterColor() {
		return this.selectedStrapModelParams?.adapter_colors.find((c) => c.choosen) || null
	}
	get isStrapParamsSelected() {
		return this.selectedLeatherColor !== null
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
		const base = this.selectedStrapModel?.attributes.watch_strap.price || 0
		const butterfly = this.steps.strapDesign.buckleButterflyChoosen ? 700 : 0 // mock price for butterfly buckle
		return base + butterfly
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
		if (step === 1) return !!this.steps.model.modelName
		if (step === 2) return this.steps.strap.isChoosen
		if (step === 3) return this.isStrapParamsSelected
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
		this.chooseFrameColor()
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
				this.chooseFrameColor()
			}
		})
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
	}
	chooseStrapModel(id: number) {
		this.watchStraps.forEach((s) => (s.choosen = s.attributes.watch_strap.id === id))
		const strap = this.watchStraps.find((s) => s.attributes.watch_strap.id === id)
		if (strap) {
			this.steps.strap.isChoosen = true
			this.steps.strap.strapName = strap.attributes.watch_strap.strap_title
			this.steps.strap.strapPrice = strap.attributes.watch_strap.price

			const params = strap.attributes.watch_strap.strap_params
			const setFirstChoosen = (arr?: { choosen?: boolean }[]) => {
				if (Array.isArray(arr) && arr.length > 0) {
					arr.forEach((item, idx) => {
						item.choosen = idx === 0
					})
				}
			}
			setFirstChoosen(params?.leather_colors)
			setFirstChoosen(params?.stitching_colors)
			setFirstChoosen(params?.edge_colors)
			setFirstChoosen(params?.buckle_colors)
			setFirstChoosen(params?.adapter_colors)
			this.steps.strapDesign.buckleButterflyChoosen = !!strap.attributes.watch_strap.buckle_butterfly_choosen
		}
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
		console.log('Choosing leather color:', title)
		this.selectedStrapModel?.attributes.watch_strap.strap_params.leather_colors.forEach((c) => {
			c.choosen = c.color_title === title
			console.log('Color:', c.color_title, 'choosen:', c.choosen)
		})
	}
	chooseStitchingColor(title: string) {
		this.selectedStrapModel?.attributes.watch_strap.strap_params.stitching_colors.forEach((c) => (c.choosen = c.color_title === title))
	}
	chooseEdgeColor(title: string) {
		this.selectedStrapModel?.attributes.watch_strap.strap_params.edge_colors.forEach((c) => (c.choosen = c.color_title === title))
	}
	chooseBuckleColor(title: string) {
		this.selectedStrapModel?.attributes.watch_strap.strap_params.buckle_colors.forEach((c) => (c.choosen = c.color_title === title))
	}
	chooseAdapterColor(title: string) {
		this.selectedStrapModel?.attributes.watch_strap.strap_params.adapter_colors.forEach((c) => (c.choosen = c.color_title === title))
	}
	chooseBuckleButterfly() {
		const strap = this.selectedStrapModel
		if (strap) {
			strap.attributes.watch_strap.buckle_butterfly_choosen = !strap.attributes.watch_strap.buckle_butterfly_choosen
			this.steps.strapDesign.buckleButterflyChoosen = !!strap.attributes.watch_strap.buckle_butterfly_choosen
		}
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
		} catch (error) {
			console.error('Error loading watch models from API:', error)
			// Если API недоступен, используем localStorage
			this.watchModels = this.loadWatchModelsFromStorage()
		} finally {
			this.isLoading = false
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
	
	// Сброс моделей к начальным (mock) данным - через re-seed БД
	async resetWatchModelsToDefault() {
		if (confirm('Это пересоздаст базу данных с начальными данными. Продолжить?')) {
			try {
				this.isLoading = true
				const { watchModelsApi } = await import('../api/watchModels.api')
				
				// Преобразуем mockWatchModels в формат БД для restore
				const mockDataForRestore = mockWatchModels.map((model, index) => ({
					id: index + 1,
					model_name: model.model_name,
					watch_model_name: model.watch_model_name,
					watch_model_manufacturer: model.watch_model_manufacturer || null,
					main_image: model.main_image || null,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					watch_sizes: model.watch_sizes.map((size, sizeIdx) => ({
						id: sizeIdx + 1,
						watch_size: size.watch_size,
						watchModelId: index + 1
					})),
					frame_colors: model.frame_colors.map((color, colorIdx) => ({
						id: colorIdx + 1,
						color_name: color.color_name,
						color_code: color.color_code || null,
						watchModelId: index + 1
					}))
				}))
				
				// Используем backend restore endpoint, который удаляет все и создает заново
				await watchModelsApi.restore(mockDataForRestore)
				
				// Загружаем обновленные данные с сервера
				await this.loadWatchModelsFromAPI()
			} catch (error) {
				console.error('Error resetting to defaults:', error)
				throw error
			} finally {
				this.isLoading = false
			}
		}
	}
	
	// ========== Методы для управления ремешками ==========
	
	// Загрузка ремешков из API
	async loadWatchStrapsFromAPI() {
		try {
			this.isLoading = true
			const { watchStrapsApi } = await import('../api/watchStraps.api')
			const straps = await watchStrapsApi.getAll()
			this.watchStraps = straps
		} catch (error) {
			console.error('Error loading watch straps from API:', error)
			// При ошибке оставляем mock данные
		} finally {
			this.isLoading = false
		}
	}
	
	async addWatchStrap(strap: Strap) {
		try {
			const { watchStrapsApi } = await import('../api/watchStraps.api')
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
				const { watchStrapsApi } = await import('../api/watchStraps.api')
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
