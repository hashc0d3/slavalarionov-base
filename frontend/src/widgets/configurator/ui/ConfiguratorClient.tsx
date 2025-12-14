'use client'

import { SectionConfigurator } from '@/widgets/configurator/ui/SectionConfigurator'
import { configuratorStore } from '@/shared/store/configurator.store'
import { AdminButton } from '@/features/admin/ui/AdminButton'
import { useEffect } from 'react'
import type { WatchModelDB } from '@/shared/api/watchModels.api'
import type { WatchStrapDB } from '@/shared/api/watchStraps.api'
import type { ConfiguratorSettingsResponse } from '@/shared/api/configurator.api'
import { mapDBToStore as mapModelDBToStore } from '@/shared/api/watchModels.api'
import { mapDBToStore as mapStrapDBToStore } from '@/shared/api/watchStraps.api'

interface InitialData {
	models: WatchModelDB[]
	straps: WatchStrapDB[]
	settings: ConfiguratorSettingsResponse | null
}

interface ConfiguratorClientProps {
	initialData?: InitialData
}

export function ConfiguratorClient({ initialData }: ConfiguratorClientProps) {
	useEffect(() => {
		// Если данные уже загружены на сервере (SSR), используем их
		if (initialData) {
			// Проверяем текущий шаг - если мы на шаге > 1, нужно восстановить выбранную модель
			const currentStep = configuratorStore.currentStepNum
			// Инициализируем стор с данными из SSR
			if (initialData.models.length > 0) {
				const mappedModels = initialData.models.map(mapModelDBToStore)
				// Убеждаемся, что у всех моделей есть необходимые данные
				mappedModels.forEach(model => {
					// Если нет размеров, добавляем пустой массив
					if (!model.watch_sizes || model.watch_sizes.length === 0) {
						model.watch_sizes = []
					}
					// Если нет цветов, добавляем пустой массив
					if (!model.frame_colors || model.frame_colors.length === 0) {
						model.frame_colors = []
					}
				})
				
				// Сначала устанавливаем модели в стор (чтобы MobX начал отслеживать)
				configuratorStore.watchModels = mappedModels
				
				// Пытаемся восстановить выбранную модель из localStorage
				let modelRestored = false
				try {
					const stored = localStorage.getItem('watchModels')
					if (stored) {
						const storedModels = JSON.parse(stored) as any[]
						// Находим выбранную модель в сохраненных данных
						const chosenModel = storedModels.find(m => m.choosen)
						if (chosenModel) {
							// Находим соответствующую модель в загруженных данных (теперь из стора)
							const modelToSelect = configuratorStore.watchModels.find(m => 
								m.id === chosenModel.id || 
								m.model_name === chosenModel.model_name
							)
							if (modelToSelect) {
								// Восстанавливаем выбор модели
								modelToSelect.choosen = true
								// Восстанавливаем выбранный размер
								if (chosenModel.watch_sizes && chosenModel.watch_sizes.length > 0) {
									const chosenSize = chosenModel.watch_sizes.find((s: any) => s.choosen)
									if (chosenSize) {
										const sizeToSelect = modelToSelect.watch_sizes.find(s => s.watch_size === chosenSize.watch_size)
										if (sizeToSelect) {
											sizeToSelect.choosen = true
										} else if (modelToSelect.watch_sizes.length > 0) {
											// Если размер не найден, выбираем первый
											modelToSelect.watch_sizes[0].choosen = true
										}
									} else if (modelToSelect.watch_sizes.length > 0) {
										// Если размер не был выбран, выбираем первый
										modelToSelect.watch_sizes[0].choosen = true
									}
								}
								// Восстанавливаем выбранный цвет
								if (chosenModel.frame_colors && chosenModel.frame_colors.length > 0) {
									const chosenColor = chosenModel.frame_colors.find((c: any) => c.choosen)
									if (chosenColor) {
										const colorToSelect = modelToSelect.frame_colors.find(c => c.color_name === chosenColor.color_name)
										if (colorToSelect) {
											colorToSelect.choosen = true
										} else if (modelToSelect.frame_colors.length > 0) {
											// Если цвет не найден, выбираем первый
											modelToSelect.frame_colors[0].choosen = true
										}
									} else if (modelToSelect.frame_colors.length > 0) {
										// Если цвет не был выбран, выбираем первый
										modelToSelect.frame_colors[0].choosen = true
									}
								}
								modelRestored = true
							}
						}
					}
				} catch (error) {
					console.warn('Failed to restore watch model from localStorage:', error)
				}
				
				// Если модель не была восстановлена, но мы на шаге > 1, выбираем первую модель
				if (!modelRestored && currentStep > 1) {
					const selectedModel = configuratorStore.watchModels.find(m => m.choosen)
					if (!selectedModel && configuratorStore.watchModels.length > 0) {
						// Если нет выбранной модели, но мы на втором шаге, выбираем первую модель
						// Это нужно для того, чтобы селекторы не были пустыми
						const firstModel = configuratorStore.watchModels[0]
						firstModel.choosen = true
						if (firstModel.watch_sizes.length > 0) {
							firstModel.watch_sizes[0].choosen = true
						}
						if (firstModel.frame_colors.length > 0) {
							firstModel.frame_colors[0].choosen = true
						}
						modelRestored = true
					}
				}
				
				// Обновляем состояние шагов после восстановления
				// Это важно для синхронизации MobX
				configuratorStore.updateModelStepState()
				configuratorStore.updateStrapStepState()
				
				// Сохраняем обновленные модели в localStorage
				configuratorStore.saveModels()
			}
			
			if (initialData.straps.length > 0) {
				const mappedStraps = initialData.straps.map(mapStrapDBToStore)
				// Сначала устанавливаем ремешки в стор
				configuratorStore.watchStraps = mappedStraps
				
				// Пытаемся восстановить выбранный ремешок из localStorage
				try {
					const stored = localStorage.getItem('watchStraps')
					if (stored) {
						const storedStraps = JSON.parse(stored) as any[]
						// Находим выбранный ремешок в сохраненных данных
						const chosenStrap = storedStraps.find((s: any) => {
							// Проверяем, выбран ли ремешок
							return s.choosen === true
						})
						
						if (chosenStrap) {
							// Получаем ID ремешка из сохраненных данных
							const strapId = chosenStrap.attributes?.watch_strap?.id
							if (strapId) {
								// Находим соответствующий ремешок в загруженных данных
								const strapToSelect = configuratorStore.watchStraps.find(s => 
									s.attributes.watch_strap.id === strapId
								)
								if (strapToSelect) {
									// Восстанавливаем выбор ремешка через метод, чтобы инициализировать параметры
									configuratorStore.chooseStrapModel(strapToSelect.attributes.watch_strap.id)
									
									// Восстанавливаем выбранные параметры из сохраненных данных
									const savedParams = chosenStrap.attributes?.watch_strap?.strap_params
									if (savedParams && strapToSelect.attributes.watch_strap.strap_params) {
										// Восстанавливаем выбранные цвета
										if (savedParams.leather_colors) {
											savedParams.leather_colors.forEach((savedColor: any) => {
												if (savedColor.choosen) {
													const color = strapToSelect.attributes.watch_strap.strap_params.leather_colors?.find(
														(c: any) => c.color_title === savedColor.color_title
													)
													if (color) color.choosen = true
												}
											})
										}
										if (savedParams.stitching_colors) {
											savedParams.stitching_colors.forEach((savedColor: any) => {
												if (savedColor.choosen) {
													const color = strapToSelect.attributes.watch_strap.strap_params.stitching_colors?.find(
														(c: any) => c.color_title === savedColor.color_title
													)
													if (color) color.choosen = true
												}
											})
										}
										if (savedParams.edge_colors) {
											savedParams.edge_colors.forEach((savedColor: any) => {
												if (savedColor.choosen) {
													const color = strapToSelect.attributes.watch_strap.strap_params.edge_colors?.find(
														(c: any) => c.color_title === savedColor.color_title
													)
													if (color) color.choosen = true
												}
											})
										}
										if (savedParams.buckle_colors) {
											savedParams.buckle_colors.forEach((savedColor: any) => {
												if (savedColor.choosen) {
													const color = strapToSelect.attributes.watch_strap.strap_params.buckle_colors?.find(
														(c: any) => c.color_title === savedColor.color_title
													)
													if (color) color.choosen = true
												}
											})
										}
										if (savedParams.adapter_colors) {
											savedParams.adapter_colors.forEach((savedColor: any) => {
												if (savedColor.choosen) {
													const color = strapToSelect.attributes.watch_strap.strap_params.adapter_colors?.find(
														(c: any) => c.color_title === savedColor.color_title
													)
													if (color) color.choosen = true
												}
											})
										}
										// Восстанавливаем выбор бабочки
										if (savedParams.has_buckle_butterfly !== undefined) {
											configuratorStore.steps.strapDesign.buckleButterflyChoosen = !!chosenStrap.attributes?.watch_strap?.buckle_butterfly_choosen
										}
									}
									
									// Обновляем состояние шагов после восстановления параметров
									configuratorStore.updateStrapDesignStepState()
								}
							}
						}
					}
				} catch (error) {
					console.warn('Failed to restore watch strap from localStorage:', error)
				}
				
				configuratorStore.updateStrapStepState()
			}
			
			if (initialData.settings) {
				// Применяем настройки конфигуратора
				if (initialData.settings.estimated_date) {
					configuratorStore.orderStore.setClosestReadyDate(initialData.settings.estimated_date)
				}
				
				configuratorStore.cartStore.additionalOption = {
					data: {
						attributes: {
							title: initialData.settings.title,
							description: initialData.settings.description,
							additional_options: initialData.settings.options.map((option) => ({
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
				const priceByName = new Map(initialData.settings.options.map((option) => [option.option_name, option.option_price]))
				configuratorStore.steps.final.additionalOptions.initials.price = priceByName.get('initials') ?? 0
				configuratorStore.steps.final.additionalOptions.presentBox.price = priceByName.get('present_box') ?? 0
				configuratorStore.steps.final.additionalOptions.postCard.price = priceByName.get('postcard') ?? 0
			}
		} else {
			// Если SSR данных нет, загружаем на клиенте (fallback)
			Promise.all([
				configuratorStore.loadWatchModelsFromAPI(),
				configuratorStore.loadWatchStrapsFromAPI(),
				configuratorStore.loadConfiguratorSettings()
			]).catch((error) => {
				console.error('Error loading configurator data:', error)
			})
		}
	}, [initialData])

	return (
		<>
			<AdminButton />
			<SectionConfigurator />
		</>
	)
}

