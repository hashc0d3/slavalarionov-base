/**
 * Компонент админки для управления ремешками
 * Рефакторинг по FSD архитектуре
 */

'use client'

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import { Stack, Group, Title, Button, Modal } from '@mantine/core'
import { useAdminStraps } from './hooks/useAdminStraps'
import { StrapsList } from './components/StrapsList'
import { StrapEditForm } from './components/StrapEditForm'

export const AdminStrapsMantine = observer(function AdminStrapsMantine() {
	const {
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
		handleImageUpload,
		handleButterflyImageUpload
	} = useAdminStraps()

	return (
		<Stack>
			<Group justify="space-between">
				<Title order={2}>Ремешки ({configuratorStore.watchStraps.length})</Title>
				<Group>
					<Button variant="light" onClick={handleBackup}>
						💾 Скачать бэкап
					</Button>
					<Button onClick={startAdd}>
						➕ Добавить ремешок
					</Button>
				</Group>
			</Group>

			<StrapsList
				onEdit={startEdit}
				onCopy={startCopy}
				onDelete={deleteStrap}
			/>

			<Modal 
				opened={opened} 
				onClose={cancelEdit} 
				title={isAdding ? 'Новый ремешок' : 'Редактирование ремешка'} 
				size="xl"
			>
				<StrapEditForm
					formData={formData}
					setFormData={setFormData}
					isAdding={isAdding}
					editingIndex={editingIndex}
					isUploadingButterflyImage={isUploadingButterflyImage}
					handleImageUpload={handleImageUpload}
					handleButterflyImageUpload={handleButterflyImageUpload}
				/>

				<Group justify="flex-end" mt="lg">
					<Button variant="light" onClick={cancelEdit}>
						Отмена
					</Button>
					<Button onClick={saveStrap}>
						{isAdding ? '➕ Добавить' : '💾 Сохранить'}
					</Button>
				</Group>
			</Modal>
		</Stack>
	)
})

