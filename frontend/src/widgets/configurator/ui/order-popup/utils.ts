export const formatCurrency = (value?: number | null) => {
	const numeric = Number.isFinite(value) ? Number(value) : 0
	return new Intl.NumberFormat('ru-RU').format(Math.max(0, Math.round(numeric)))
}

export const digitsOnly = (value: string) => value.replace(/\D/g, '')

export const getRemeshokWord = (count: number) => {
	if (count === 1) return 'ремешка'
	if (count > 1 && count < 5) return 'ремешка'
	return 'ремешков'
}


