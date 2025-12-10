/**
 * Утилита для получения текста цены пряжки-бабочки
 */

export const getButterflyPriceLabel = (price: number): string => {
	return price > 0 ? `+ ${price.toLocaleString('ru-RU')} ₽` : 'В комплекте'
}


