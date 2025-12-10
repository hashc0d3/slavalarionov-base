/**
 * Компонент админки для управления моделями часов
 * Рефакторинг по FSD архитектуре
 */

'use client'

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import { Stack, Group, Title, Button, Modal } from '@mantine/core'
import { useAdminModels } from './hooks/useAdminModels'
import { ModelsList } from './components/ModelsList'
import { ModelEditForm } from './components/ModelEditForm'

export const AdminModelsMantine = observer(function AdminModelsMantine() {
	const {
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
		handleImageUpload,
		handleBackup
	} = useAdminModels()

	return (
		<Stack>
			<Group justify="space-between">
				<Title order={2}>Модели часов ({configuratorStore.watchModels.length})</Title>
				<Group>
					<Button variant="light" onClick={handleBackup}>
						💾 Скачать бэкап
					</Button>
					<Button onClick={startAdd}>
						➕ Добавить модель
					</Button>
				</Group>
			</Group>

			<ModelsList
				onEdit={startEdit}
				onDelete={deleteModel}
			/>

			<Modal 
				opened={opened} 
				onClose={cancelEdit} 
				title={isAdding ? 'Новая модель' : 'Редактирование модели'} 
				size="lg"
			>
				<ModelEditForm
					formData={formData}
					setFormData={setFormData}
					colors={colors}
					onAddSize={addSize}
					onDeleteSize={deleteSize}
					onImageUpload={handleImageUpload}
				/>

				<Group justify="flex-end" mt="lg">
					<Button variant="light" onClick={cancelEdit}>
						Отмена
					</Button>
					<Button onClick={saveModel}>
						{isAdding ? '➕ Добавить' : '💾 Сохранить'}
					</Button>
				</Group>
			</Modal>
		</Stack>
	)
})


