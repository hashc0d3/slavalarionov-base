import { configuratorStore } from '@/shared/store/configurator.store'
import { formatCurrency } from '../utils'
import s from '../OrderPopup.module.css'

type Props = {
	productsPrice: number
	productsPriceWithDiscount: number
	totalPrice: number
	totalPriceWithDiscount: number
}

export function OrderPopupTotal({ 
	productsPrice, 
	productsPriceWithDiscount, 
	totalPrice, 
	totalPriceWithDiscount 
}: Props) {
	return (
		<section className={s.sectionTotals}>
			<div className={s.totalsRow}>
				<span>Товары ({configuratorStore.cartItems.length} {configuratorStore.cartItems.length === 1 ? 'шт' : 'шт'})</span>
				<strong>{formatCurrency(productsPrice)} ₽</strong>
			</div>
			{configuratorStore.promoAccepted && configuratorStore.usedPromo && productsPriceWithDiscount < productsPrice && (
				<div className={s.totalsRow} style={{ color: '#10b981' }}>
					<span>Скидка по промокоду ({configuratorStore.usedPromo.code})</span>
					<strong>-{formatCurrency(productsPrice - productsPriceWithDiscount)} ₽</strong>
				</div>
			)}
			<div className={s.totalsRow}>
				<span>Доставка</span>
				<strong>{formatCurrency(configuratorStore.deliveryPrice || 0)} ₽</strong>
			</div>
			<div className={s.totalsSummary}>
				<span>Итого</span>
				<div className={s.totalValues}>
					<span
						className={`${s.totalDefault} ${
							totalPriceWithDiscount !== totalPrice ? s.totalDefaultStriked : ''
						}`}
					>
						{formatCurrency(totalPrice)} ₽
					</span>
					{totalPriceWithDiscount !== totalPrice && (
						<span className={s.totalDiscount}>{formatCurrency(totalPriceWithDiscount)} ₽</span>
					)}
				</div>
			</div>
			<p className={s.readyDate}>
				Дата отправки вашего заказа: <span>{configuratorStore.closestReadyDate}</span>
			</p>
			<p className={s.readyDate}>Перед отправкой пришлём подробный видеообзор вашего ремешка.</p>
		</section>
	)
}


