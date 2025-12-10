/**
 * Хук для управления состоянием AdminModelsMantine
 */

import { useState, useEffect } from 'react'
import { configuratorStore } from '@/shared/store/configurator.store'
import type { WatchModel } from '@/shared/store/configurator.store'
import { notifications } from '@mantine/notifications'
import { colorsApi, type Color } from '@/shared/api/colors.api'
import { INITIAL_FORM_DATA } from '../constants'
import { handleImageUpload } from '../utils/handleImageUpload'

export function useAdminModels() {
	const [editingIndex, setEditingIndex] = useState<number | null>(null)
	const [isAdding, setIsAdding] = useState(false)
	const [opened, setOpened] = useState(false)
	const [colors, setColors] = useState<Color[]>([])
	const [formData, setFormData] = useState<Partial<WatchModel>>(INITIAL_FORM_DATA)

	useEffect(() => {
		configuratorStore.loadWatchModelsFromAPI()
		configuratorStore.loadWatchStrapsFromAPI()
		loadColors()
	}, [])

	const loadColors = async () => {
		try {
			const data = await colorsApi.getAll()
			setColors(data)
		} catch (error) {
			console.error('Failed to load colors:', error)
		}
	}

	const startEdit = (index: number) => {
		const model = configuratorStore.watchModels[index]
		setFormData({
			model_name: model.model_name,
			watch_model_name: model.watch_model_name,
			watch_model_manufacturer: model.watch_model_manufacturer,
			main_image: model.main_image,
			watch_sizes: [...model.watch_sizes],
			frame_colors: [...model.frame_colors],
			available_strap_ids: model.available_strap_ids || []
		})
		setEditingIndex(index)
		setIsAdding(false)
		setOpened(true)
	}

	const startAdd = () => {
		setFormData(INITIAL_FORM_DATA)
		setIsAdding(true)
		setEditingIndex(null)
		setOpened(true)
	}

	const cancelEdit = () => {
		setOpened(false)
		setEditingIndex(null)
		setIsAdding(false)
	}

	const saveModel = async () => {
		const modelData: WatchModel = {
			model_name: formData.model_name || '',
			watch_model_name: formData.watch_model_name || '',
			watch_model_manufacturer: formData.watch_model_manufacturer,
			main_image: formData.main_image,
			choosen: false,
			watch_sizes: formData.watch_sizes || [],
			frame_colors: formData.frame_colors || [],
			available_strap_ids: formData.available_strap_ids || []
		}

		try {
			if (isAdding) {
				await configuratorStore.addWatchModel(modelData)
				notifications.show({
					title: 'Успешно',
					message: 'Модель добавлена',
					color: 'green'
				})
			} else if (editingIndex !== null) {
				await configuratorStore.updateWatchModel(editingIndex, modelData)
				notifications.show({
					title: 'Успешно',
					message: 'Модель обновлена',
					color: 'green'
				})
			}
			cancelEdit()
		} catch (error) {
			notifications.show({
				title: 'Ошибка',
				message: 'Не удалось сохранить модель',
				color: 'red'
			})
		}
	}

	const deleteModel = async (index: number) => {
		if (confirm('Вы уверены, что хотите удалить эту модель?')) {
			try {
				await configuratorStore.deleteWatchModel(index)
				notifications.show({
					title: 'Успешно',
					message: 'Модель удалена',
					color: 'green'
				})
			} catch (error) {
				notifications.show({
					title: 'Ошибка',
					message: 'Не удалось удалить модель',
					color: 'red'
				})
			}
		}
	}

	const addSize = () => {
		const size = prompt('Размер (например, 40):')
		if (size) {
			setFormData((prev) => ({
				...prev,
				watch_sizes: [...(prev.watch_sizes || []), { watch_size: size, choosen: false }]
			}))
		}
	}

	const deleteSize = (index: number) => {
		setFormData((prev) => {
			const newSizes = [...(prev.watch_sizes || [])]
			newSizes.splice(index, 1)
			return { ...prev, watch_sizes: newSizes }
		})
	}

	const handleImageUploadWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null
		handleImageUpload(file, setFormData)
	}

	const handleBackup = async () => {
		try {
			await configuratorStore.createBackup()
			notifications.show({
				title: 'Успешно',
				message: 'Бэкап скачан',
				color: 'green'
			})
		} catch (error) {
			notifications.show({
				title: 'Ошибка',
				message: 'Не удалось создать бэкап',
				color: 'red'
			})
		}
	}

	return {
		editingIndex,
		isAdding,
		opened,
		colors,
		formData,
		setFormData,
		startEdit,
		startAdd,
		cancelEdit,
		saveModel,
		deleteModel,
		addSize,
		deleteSize,
		handleImageUpload: handleImageUploadWrapper,
		handleBackup
	}
}


