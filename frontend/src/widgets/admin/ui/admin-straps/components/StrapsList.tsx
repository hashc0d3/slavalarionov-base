/**
 * Компонент списка ремешков
 */

"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import { Card, Group, Stack, Text, Image, Badge, Button } from '@mantine/core'

interface StrapsListProps {
	onEdit: (index: number) => void
	onCopy: (index: number) => void
	onDelete: (index: number) => void
}

export const StrapsList = observer(function StrapsList({
	onEdit,
	onCopy,
	onDelete
}: StrapsListProps) {
	return (
		<Stack gap="md">
			{configuratorStore.watchStraps.map((strap, index) => (
				<Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
					<Group justify="space-between" wrap="nowrap">
						<Group>
							{strap.attributes.watch_strap.preview_image && (
								<Image 
									src={strap.attributes.watch_strap.preview_image} 
									h={80} 
									w={80} 
									fit="contain" 
									alt={strap.attributes.watch_strap.strap_title} 
								/>
							)}
							<Stack gap="xs">
								<Text fw={700} size="lg">{strap.attributes.watch_strap.strap_title}</Text>
								<Text size="sm" c="dimmed">{strap.attributes.watch_strap.strap_name}</Text>
								<Badge color="blue">{strap.attributes.watch_strap.price} ₽</Badge>
								{strap.attributes.watch_strap.has_buckle_butterfly && (
									<Badge color="violet">С пряжкой-бабочкой</Badge>
								)}
								<Group gap="xs">
									<Badge size="sm" color="blue">
										Кожа: {strap.attributes.watch_strap.strap_params.leather_colors?.length || 0}
									</Badge>
									<Badge size="sm" color="green">
										Строчка: {strap.attributes.watch_strap.strap_params.stitching_colors?.length || 0}
									</Badge>
									<Badge size="sm" color="orange">
										Край: {strap.attributes.watch_strap.strap_params.edge_colors?.length || 0}
									</Badge>
									<Badge size="sm" color="violet">
										Пряжка: {strap.attributes.watch_strap.strap_params.buckle_colors?.length || 0}
									</Badge>
									<Badge size="sm" color="cyan">
										Адаптер: {strap.attributes.watch_strap.strap_params.adapter_colors?.length || 0}
									</Badge>
								</Group>
							</Stack>
						</Group>
						<Group>
							<Button size="sm" variant="light" onClick={() => onEdit(index)}>
								✏️ Изменить
							</Button>
							<Button size="sm" variant="light" color="blue" onClick={() => onCopy(index)}>
								📋 Копировать
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


