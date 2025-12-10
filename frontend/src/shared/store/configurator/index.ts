/**
 * Главный экспорт для configurator store
 * Создает единый экземпляр стора с композицией всех модулей
 */

import { ConfiguratorStore } from './configurator.store'

export const configuratorStore = new ConfiguratorStore()

// Экспортируем типы
export * from './types'

// Экспортируем отдельные сторы для прямого доступа при необходимости
export { StepsStore } from './stores/steps.store'
export { CartStore } from './stores/cart.store'
export { OrderStore } from './stores/order.store'


