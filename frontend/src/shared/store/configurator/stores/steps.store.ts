/**
 * Стор для управления шагами конфигуратора
 * Вынесен в отдельный файл согласно FSD архитектуре
 */

import { makeAutoObservable } from 'mobx'
import type { WatchModel, Strap, StepKey } from '../types'

export class StepsStore {
	currentStepNum: number = 1
	stepsAmount: number = 4

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
			title: 'Персонализируйте ремешок',
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

	constructor() {
		makeAutoObservable(this)
	}

	updateModelStepState(selectedModel: WatchModel | null, selectedColor: any) {
		const selectedSize = selectedModel?.watch_sizes.find((size) => size.choosen)?.watch_size

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

	updateStrapStepState(selectedStrap: Strap | null) {
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

	updateStrapDesignStepState(selectedStrap: Strap | null, selectedColors: {
		leather?: any
		stitching?: any
		edge?: any
		buckle?: any
		adapter?: any
	}, isStrapParamsSelected: boolean, buckleButterflyChoosen: boolean) {
		if (!selectedStrap) {
			this.steps.strapDesign.leatherColor = { ...this.steps.strapDesign.leatherColor, name: '' }
			this.steps.strapDesign.stitchingColor = { ...this.steps.strapDesign.stitchingColor, name: '' }
			this.steps.strapDesign.edgeColor = { ...this.steps.strapDesign.edgeColor, name: '' }
			this.steps.strapDesign.buckleColor = { ...this.steps.strapDesign.buckleColor, name: '' }
			this.steps.strapDesign.adapterColor = { ...this.steps.strapDesign.adapterColor, name: '' }
			this.steps.strapDesign.completed = false
			this.steps.strapDesign.isChoosen = false
			return
		}

		this.steps.strapDesign.leatherColor = {
			...this.steps.strapDesign.leatherColor,
			name: selectedColors.leather?.color_title || ''
		}
		this.steps.strapDesign.stitchingColor = {
			...this.steps.strapDesign.stitchingColor,
			name: selectedColors.stitching?.color_title || ''
		}
		this.steps.strapDesign.edgeColor = {
			...this.steps.strapDesign.edgeColor,
			name: selectedColors.edge?.color_title || ''
		}
		this.steps.strapDesign.buckleColor = {
			...this.steps.strapDesign.buckleColor,
			name: selectedColors.buckle?.color_title || ''
		}
		this.steps.strapDesign.adapterColor = {
			...this.steps.strapDesign.adapterColor,
			name: selectedColors.adapter?.color_title || ''
		}
		this.steps.strapDesign.buckleButterflyChoosen = buckleButterflyChoosen
		this.steps.strapDesign.completed = isStrapParamsSelected
		this.steps.strapDesign.isChoosen = this.steps.strapDesign.completed
	}

	isNextStepReady(selectedModel: WatchModel | null, selectedStrap: Strap | null, isStrapParamsSelected: boolean): boolean {
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
}


