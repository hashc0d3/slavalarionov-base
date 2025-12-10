/**
 * Компонент списка моделей часов
 */

"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import { Card, Group, Stack, Text, Image, Badge, Button } from '@mantine/core'
import { colorsApi, type Color } from '@/shared/api/colors.api'
import { useState, useEffect } from 'react'

interface ModelsListProps {
	onEdit: (index: number) => void
	onDelete: (index: number) => void
}

export const ModelsList = observer(function ModelsList({
	onEdit,
	onDelete
}: ModelsListProps) {
	const [colors, setColors] = useState<Color[]>([])

	useEffect(() => {
		colorsApi.getAll().then(setColors).catch(console.error)
	}, [])

	const getColorById = (colorId: number) => colors.find(c => c.id === colorId)

	return (
		<Stack gap="md">
			{configuratorStore.watchModels.map((model, index) => (
				<Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
					<Group justify="space-between" wrap="nowrap">
						<Group>
							{model.main_image && (
								<Image src={model.main_image} h={80} w={80} fit="contain" alt={model.watch_model_name} />
							)}
							<Stack gap="xs">
								<Text fw={700} size="lg">{model.watch_model_name}</Text>
								<Text size="sm" c="dimmed">{model.model_name}</Text>
								{model.watch_model_manufacturer && (
									<Text size="sm" c="dimmed">{model.watch_model_manufacturer}</Text>
								)}
								<Group gap="xs">
									{model.watch_sizes.map((size, idx) => (
										<Badge key={idx} variant="light">{size.watch_size}mm</Badge>
									))}
								</Group>
								<Group gap="xs">
									{model.frame_colors.map((frameColor, idx) => {
										const color = getColorById(frameColor.colorId)
										return color ? (
											<Badge key={idx} variant="dot" color={color.hex_code}>
												{color.display_name}
											</Badge>
										) : null
									})}
								</Group>
								{model.available_strap_ids && model.available_strap_ids.length > 0 && (
									<Group gap={4}>
										<Text size="xs" c="dimmed">Ремешки:</Text>
										{configuratorStore.watchStraps
											.filter(s => model.available_strap_ids?.includes(s.attributes.watch_strap.id))
											.map((strap, idx) => (
												<Badge key={idx} size="xs" variant="outline" color="violet">
													{strap.attributes.watch_strap.strap_title}
												</Badge>
											))
										}
									</Group>
								)}
							</Stack>
						</Group>
						<Group>
							<Button size="sm" variant="light" onClick={() => onEdit(index)}>
								✏️ Изменить
							</Button>
							<Button size="sm" variant="light" color="red" onClick={() => onDelete(index)}>
								🗑️ Удалить
							</Button>
						</Group>
					</Group>
				</Card>
			))}
		</Stack>
	)
})


