/**
 * Компонент формы редактирования модели часов
 */

"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import type { WatchModel } from '@/shared/store/configurator.store'
import type { Color } from '@/shared/api/colors.api'
import {
	Stack, TextInput, Box, Text, Card, Image, Button, Group, Pill, MultiSelect
} from '@mantine/core'

interface ModelEditFormProps {
	formData: Partial<WatchModel>
	setFormData: React.Dispatch<React.SetStateAction<Partial<WatchModel>>>
	colors: Color[]
	onAddSize: () => void
	onDeleteSize: (index: number) => void
	onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ModelEditForm = observer(function ModelEditForm({
	formData,
	setFormData,
	colors,
	onAddSize,
	onDeleteSize,
	onImageUpload
}: ModelEditFormProps) {
	const strapOptions = configuratorStore.watchStraps.map(strap => ({
		value: String(strap.attributes.watch_strap.id),
		label: strap.attributes.watch_strap.strap_name
	}))

	return (
		<Stack>
			<TextInput
				label="Название модели"
				placeholder="Apple Watch"
				value={formData.model_name || ''}
				onChange={(e) => setFormData((prev) => ({ ...prev, model_name: e.target.value }))}
				required
			/>

			<TextInput
				label="Серия модели"
				placeholder="4-6 серия, SE"
				value={formData.watch_model_name || ''}
				onChange={(e) => setFormData((prev) => ({ ...prev, watch_model_name: e.target.value }))}
				required
			/>

			<TextInput
				label="Производитель"
				placeholder="Apple Watch"
				value={formData.watch_model_manufacturer || ''}
				onChange={(e) => setFormData((prev) => ({ ...prev, watch_model_manufacturer: e.target.value }))}
			/>

			<Box>
				<Text size="sm" fw={500} mb="xs">Изображение модели</Text>
				{formData.main_image && (
					<Card withBorder p="xs" mb="xs" style={{ width: 'fit-content' }}>
						<Image src={formData.main_image} h={120} w={120} fit="contain" alt="Preview" />
					</Card>
				)}
				<Stack gap="xs">
					<Group>
						<Button
							component="label"
							variant="filled"
							size="sm"
						>
							📁 Выбрать изображение с устройства
							<input
								type="file"
								accept="image/*"
								onChange={onImageUpload}
								style={{ display: 'none' }}
							/>
						</Button>
						{formData.main_image && (
							<Button
								variant="light"
								color="red"
								size="sm"
								onClick={() => setFormData((prev) => ({ ...prev, main_image: '' }))}
							>
								🗑️ Удалить
							</Button>
						)}
					</Group>
					<TextInput
						label="или введите URL изображения"
						placeholder="https://api.slavalarionov.store/uploads/..."
						value={formData.main_image || ''}
						onChange={(e) => setFormData((prev) => ({ ...prev, main_image: e.target.value }))}
					/>
				</Stack>
			</Box>

			<Box>
				<Group justify="space-between" mb="xs">
					<Text size="sm" fw={500}>Размеры</Text>
					<Button onClick={onAddSize} size="xs" variant="light">Добавить</Button>
				</Group>
				<Group gap="xs">
					{formData.watch_sizes?.map((size, idx) => (
						<Pill key={idx} withRemoveButton onRemove={() => onDeleteSize(idx)}>
							{size.watch_size}mm
						</Pill>
					))}
				</Group>
			</Box>

			<MultiSelect
				label="Доступные цвета корпуса"
				placeholder="Выберите цвета"
				data={colors.map(c => ({
					value: String(c.id),
					label: c.display_name
				}))}
				value={formData.frame_colors?.map(fc => String(fc.colorId)) || []}
				onChange={(values) => {
					const newFrameColors = values.map(colorId => {
						const existingColor = formData.frame_colors?.find(fc => fc.colorId === Number(colorId))
						return existingColor || {
							colorId: Number(colorId),
							choosen: false,
							view_images: undefined
						}
					})
					setFormData((prev) => ({ ...prev, frame_colors: newFrameColors }))
				}}
				searchable
				clearable
				renderOption={({ option }) => {
					const color = colors.find(c => c.id === Number(option.value))
					return (
						<Group gap="xs">
							<div
								style={{
									width: 16,
									height: 16,
									borderRadius: '50%',
									backgroundColor: color?.hex_code || '#000',
									border: '1px solid #dee2e6'
								}}
							/>
							<span>{option.label}</span>
						</Group>
					)
				}}
			/>

			<MultiSelect
				label="Доступные ремешки"
				placeholder="Выберите ремешки"
				data={strapOptions}
				value={formData.available_strap_ids?.map(String) || []}
				onChange={(values) => setFormData((prev) => ({ ...prev, available_strap_ids: values.map(Number) }))}
				searchable
				clearable
			/>
		</Stack>
	)
})


