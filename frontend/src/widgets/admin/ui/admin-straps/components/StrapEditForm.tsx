/**
 * Компонент формы редактирования ремешка
 */

"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import type { Strap } from '@/shared/store/configurator.store'
import {
	Stack, TextInput, Textarea, NumberInput, Checkbox, Box, Text, Card, Image,
	Button, Group, Tabs, Skeleton
} from '@mantine/core'
import StrapParamsEditor from '../../StrapParamsEditor'
import { StrapBaseImagesEditor } from '../../StrapBaseImagesEditor'

interface StrapEditFormProps {
	formData: Partial<Strap>
	setFormData: React.Dispatch<React.SetStateAction<Partial<Strap>>>
	isAdding: boolean
	editingIndex: number | null
	isUploadingButterflyImage: boolean
	handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
	handleButterflyImageUpload: (file: File | null) => Promise<void>
}

export const StrapEditForm = observer(function StrapEditForm({
	formData,
	setFormData,
	isAdding,
	editingIndex,
	isUploadingButterflyImage,
	handleImageUpload,
	handleButterflyImageUpload
}: StrapEditFormProps) {
	return (
		<Tabs defaultValue="basic" variant="outline">
			<Tabs.List>
				<Tabs.Tab value="basic">Основные параметры</Tabs.Tab>
				<Tabs.Tab value="base-images">Базовые изображения</Tabs.Tab>
				<Tabs.Tab value="design">Параметры дизайна</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value="basic" pt="md">
				<Stack>
					<TextInput
						label="Название (strap_name)"
						placeholder="brogue"
						value={formData.attributes?.watch_strap.strap_name || ''}
						onChange={(e) => setFormData({
							attributes: { watch_strap: { ...formData.attributes!.watch_strap, strap_name: e.target.value } }
						})}
						required
					/>

					<TextInput
						label="Заголовок"
						placeholder="Brogue"
						value={formData.attributes?.watch_strap.strap_title || ''}
						onChange={(e) => setFormData({
							attributes: { watch_strap: { ...formData.attributes!.watch_strap, strap_title: e.target.value } }
						})}
						required
					/>

					<Textarea
						label="Описание"
						placeholder="Описание ремешка"
						value={formData.attributes?.watch_strap.strap_description || ''}
						onChange={(e) => setFormData({
							attributes: { watch_strap: { ...formData.attributes!.watch_strap, strap_description: e.target.value } }
						})}
						rows={3}
					/>

					<TextInput
						label="Краткое описание (для второго шага)"
						placeholder="Краткое описание ремешка"
						description="Отображается на втором шаге конфигуратора при выборе ремешка"
						value={formData.attributes?.watch_strap.strap_short_description || ''}
						onChange={(e) => setFormData({
							attributes: { watch_strap: { ...formData.attributes!.watch_strap, strap_short_description: e.target.value } }
						})}
					/>

					<NumberInput
						label="Цена"
						placeholder="8990"
						value={formData.attributes?.watch_strap.price || 0}
						onChange={(value) => setFormData({
							attributes: { watch_strap: { ...formData.attributes!.watch_strap, price: Number(value) } }
						})}
						required
					/>

					<Box>
						<Text size="sm" fw={500} mb="xs">Изображение ремешка</Text>
						{formData.attributes?.watch_strap.preview_image && (
							<Card withBorder p="xs" mb="xs" style={{ width: 'fit-content' }}>
								<Image 
									src={formData.attributes.watch_strap.preview_image} 
									h={120} 
									w={120} 
									fit="contain" 
									alt="Preview" 
								/>
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
										onChange={handleImageUpload}
										style={{ display: 'none' }}
									/>
								</Button>
								{formData.attributes?.watch_strap.preview_image && (
									<Button
										variant="light"
										color="red"
										size="sm"
										onClick={() => setFormData({
											attributes: {
												watch_strap: {
													...formData.attributes!.watch_strap,
													preview_image: '',
													ultra_preview_image: ''
												}
											}
										})}
									>
										🗑️ Удалить
									</Button>
								)}
							</Group>
							<TextInput
								label="или введите URL изображения"
								placeholder="https://api.slavalarionov.store/uploads/..."
								value={formData.attributes?.watch_strap.preview_image || ''}
								onChange={(e) => setFormData({
									attributes: {
										watch_strap: {
											...formData.attributes!.watch_strap,
											preview_image: e.target.value,
											ultra_preview_image: e.target.value
										}
									}
								})}
							/>
						</Stack>
					</Box>

					<Checkbox
						label="Есть пряжка-бабочка"
						checked={formData.attributes?.watch_strap.has_buckle_butterfly || false}
						onChange={(e) => {
							const checked = e.currentTarget.checked
							setFormData((prev) => {
								const prevStrap = prev.attributes?.watch_strap
								if (!prevStrap) return prev
								return {
									attributes: {
										watch_strap: {
											...prevStrap,
											has_buckle_butterfly: checked,
											buckle_butterfly_price: checked ? (prevStrap.buckle_butterfly_price ?? 0) : 0,
											buckle_butterfly_image: checked ? prevStrap.buckle_butterfly_image || '' : '',
											strap_params: {
												...prevStrap.strap_params,
												has_buckle_butterfly: checked
											}
										}
									}
								}
							})
						}}
					/>

					{formData.attributes?.watch_strap.has_buckle_butterfly && (
						<Stack gap="sm">
							<NumberInput
								label="Доплата за пряжку-бабочку"
								placeholder="500"
								min={0}
								value={formData.attributes?.watch_strap.buckle_butterfly_price ?? 0}
								onChange={(value) =>
									setFormData((prev) => {
										const prevStrap = prev.attributes?.watch_strap
										if (!prevStrap) return prev
										return {
											attributes: {
												watch_strap: {
													...prevStrap,
													buckle_butterfly_price: Number(value) || 0
												}
											}
										}
									})
								}
							/>

							<Box>
								<Text size="sm" fw={500} mb="xs">
									Изображение пряжки-бабочки
								</Text>
								<Stack gap="xs">
									<Group gap="xs">
										<Button
											component="label"
											variant="filled"
											size="sm"
											disabled={isUploadingButterflyImage}
										>
											{isUploadingButterflyImage ? 'Загрузка...' : '📁 Загрузить'}
											<input
												type="file"
												accept="image/*"
												onChange={(event) => {
													const file = event.target.files?.[0] || null
													handleButterflyImageUpload(file)
													event.target.value = ''
												}}
												style={{ display: 'none' }}
											/>
										</Button>
										{formData.attributes?.watch_strap.buckle_butterfly_image && (
											<Button
												variant="light"
												color="red"
												size="sm"
												onClick={() =>
													setFormData((prev) => {
														const prevStrap = prev.attributes?.watch_strap
														if (!prevStrap) return prev
														return {
															attributes: {
																watch_strap: {
																	...prevStrap,
																	buckle_butterfly_image: ''
																}
															}
														}
													})
												}
											>
												🗑️ Удалить
											</Button>
										)}
									</Group>

									<TextInput
										label="или введите URL изображения"
										placeholder="https://api.slavalarionov.store/uploads/..."
										value={formData.attributes?.watch_strap.buckle_butterfly_image || ''}
										onChange={(e) =>
											setFormData((prev) => {
												const prevStrap = prev.attributes?.watch_strap
												if (!prevStrap) return prev
												return {
													attributes: {
														watch_strap: {
															...prevStrap,
															buckle_butterfly_image: e.target.value
														}
													}
												}
											})
										}
									/>

									{(isUploadingButterflyImage || formData.attributes?.watch_strap.buckle_butterfly_image) && (
										<Card withBorder p="xs" style={{ width: 'fit-content' }}>
											{isUploadingButterflyImage ? (
												<Skeleton h={120} w={120} radius="md" />
											) : (
												<Image
													src={formData.attributes?.watch_strap.buckle_butterfly_image}
													h={120}
													w={120}
													fit="contain"
													alt="Butterfly preview"
												/>
											)}
										</Card>
									)}
								</Stack>
							</Box>
						</Stack>
					)}
				</Stack>
			</Tabs.Panel>

			<Tabs.Panel value="base-images" pt="md">
				{!isAdding && editingIndex !== null && formData.attributes?.watch_strap.id ? (
					<StrapBaseImagesEditor
						strapId={formData.attributes.watch_strap.id}
						strapName={formData.attributes.watch_strap.strap_name}
						baseImages={(formData.attributes.watch_strap as any).base_images || []}
						onUpdate={() => {
							// Reload strap data
							configuratorStore.loadWatchStrapsFromAPI()
							if (editingIndex !== null) {
								const strap = configuratorStore.watchStraps[editingIndex]
								setFormData({ attributes: { watch_strap: { ...strap.attributes.watch_strap } } })
							}
						}}
					/>
				) : (
					<Text c="dimmed">Сохраните ремешок, чтобы добавить базовые изображения</Text>
				)}
			</Tabs.Panel>

			<Tabs.Panel value="design" pt="md">
				<StrapParamsEditor
					strapParams={{
						leather_colors: formData.attributes?.watch_strap.strap_params?.leather_colors ?? [],
						stitching_colors: formData.attributes?.watch_strap.strap_params?.stitching_colors ?? [],
						edge_colors: formData.attributes?.watch_strap.strap_params?.edge_colors ?? [],
						buckle_colors: formData.attributes?.watch_strap.strap_params?.buckle_colors ?? [],
						adapter_colors: formData.attributes?.watch_strap.strap_params?.adapter_colors ?? [],
						has_buckle_butterfly: formData.attributes?.watch_strap.strap_params?.has_buckle_butterfly ?? false,
						view_images: formData.attributes?.watch_strap.strap_params?.view_images,
						frame_color_configs: (formData.attributes?.watch_strap.strap_params as any)?.frame_color_configs ?? []
					}}
					onUpdate={(updatedParams) => {
						setFormData({
							attributes: {
								watch_strap: {
									...formData.attributes!.watch_strap,
									strap_params: updatedParams
								}
							}
						})
					}}
				/>
			</Tabs.Panel>
		</Tabs>
	)
})


