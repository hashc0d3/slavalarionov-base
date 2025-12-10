/**
 * Утилита для создания копии ремешка
 */

import type { Strap } from '@/shared/store/configurator.store'

export const createCopiedStrap = (strap: Strap): Partial<Strap> => {
	// Глубокое копирование всех данных ремешка
	const copiedStrap = JSON.parse(JSON.stringify(strap.attributes.watch_strap))
	
	// Изменяем название, чтобы отличить копию
	copiedStrap.strap_name = `${copiedStrap.strap_name}_copy_${Date.now()}`
	copiedStrap.strap_title = `${copiedStrap.strap_title} (копия)`
	copiedStrap.id = 0 // Новый ID будет присвоен при сохранении
	
	return { attributes: { watch_strap: copiedStrap } }
}


