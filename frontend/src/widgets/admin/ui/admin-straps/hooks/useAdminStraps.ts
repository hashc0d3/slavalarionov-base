/**
 * Хук для управления состоянием AdminStrapsMantine
 */

import { useState, useEffect } from 'react'
import { configuratorStore } from '@/shared/store/configurator.store'
import type { Strap } from '@/shared/store/configurator.store'
import { notifications } from '@mantine/notifications'
import { uploadStrapColorImage } from '@/shared/api/uploads.api'
import { INITIAL_FORM_DATA } from '../constants'
import { createCopiedStrap } from '../utils/createCopiedStrap'
import { handleImageUpload } from '../utils/handleImageUpload'

export function useAdminStraps() {
	const [editingIndex, setEditingIndex] = useState<number | null>(null)
	const [isAdding, setIsAdding] = useState(false)
	const [opened, setOpened] = useState(false)
	const [isUploadingButterflyImage, setIsUploadingButterflyImage] = useState(false)
	const [formData, setFormData] = useState<Partial<Strap>>(INITIAL_FORM_DATA)

	useEffect(() => {
		configuratorStore.loadWatchStrapsFromAPI()
	}, [])

	const startEdit = (index: number) => {
		const strap = configuratorStore.watchStraps[index]
		setFormData({ attributes: { watch_strap: { ...strap.attributes.watch_strap } } })
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

	const startCopy = (index: number) => {
		const strap = configuratorStore.watchStraps[index]
		const copiedStrap = createCopiedStrap(strap)
		
		setFormData(copiedStrap)
		setIsAdding(true)
		setEditingIndex(null)
		setOpened(true)
		
		notifications.show({
			title: 'Копирование',
			message: 'Ремешок скопирован. Измените название и сохраните.',
			color: 'blue',
			autoClose: 3000
		})
	}

	const saveStrap = async () => {
		const strapData: Strap = {
			choosen: false,
			attributes: {
				watch_strap: {
					...formData.attributes!.watch_strap
				}
			}
		}

		try {
			if (isAdding) {
				await configuratorStore.addWatchStrap(strapData)
				await configuratorStore.loadWatchStrapsFromAPI()
				notifications.show({ title: 'Успешно', message: 'Ремешок добавлен', color: 'green' })
			} else if (editingIndex !== null) {
				await configuratorStore.updateWatchStrap(editingIndex, strapData)
				await configuratorStore.loadWatchStrapsFromAPI()
				notifications.show({ title: 'Успешно', message: 'Ремешок обновлён', color: 'green' })
			}
			cancelEdit()
		} catch (error) {
			notifications.show({ title: 'Ошибка', message: 'Не удалось сохранить ремешок', color: 'red' })
		}
	}

	const deleteStrap = async (index: number) => {
		if (confirm('Вы уверены, что хотите удалить этот ремешок?')) {
			try {
				await configuratorStore.deleteWatchStrap(index)
				notifications.show({ title: 'Успешно', message: 'Ремешок удалён', color: 'green' })
			} catch (error) {
				notifications.show({ title: 'Ошибка', message: 'Не удалось удалить ремешок', color: 'red' })
			}
		}
	}

	const handleBackup = async () => {
		try {
			await configuratorStore.createStrapsBackup()
			notifications.show({ title: 'Успешно', message: 'Бэкап скачан', color: 'green' })
		} catch (error) {
			notifications.show({ title: 'Ошибка', message: 'Не удалось создать бэкап', color: 'red' })
		}
	}

	const handleImageUploadWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null
		handleImageUpload(file, setFormData)
	}

	const handleButterflyImageUpload = async (file: File | null) => {
		if (!file) return
		try {
			setIsUploadingButterflyImage(true)
			const response = await uploadStrapColorImage({
				file,
				group: 'buckle',
				view: 'butterfly',
				colorTitle: formData.attributes?.watch_strap.strap_title || 'butterfly'
			})
			setFormData((prev) => ({
				attributes: {
					watch_strap: {
						...prev.attributes!.watch_strap,
						buckle_butterfly_image: response.url
					}
				}
			}))
			notifications.show({ title: 'Успешно', message: 'Изображение загружено', color: 'green' })
		} catch (error: any) {
			console.error('Ошибка загрузки изображения butterfly:', error)
			notifications.show({ title: 'Ошибка', message: error?.message || 'Не удалось загрузить изображение', color: 'red' })
		} finally {
			setIsUploadingButterflyImage(false)
		}
	}

	return {
		editingIndex,
		isAdding,
		opened,
		isUploadingButterflyImage,
		formData,
		setFormData,
		startEdit,
		startAdd,
		cancelEdit,
		startCopy,
		saveStrap,
		deleteStrap,
		handleBackup,
		handleImageUpload: handleImageUploadWrapper,
		handleButterflyImageUpload
	}
}


