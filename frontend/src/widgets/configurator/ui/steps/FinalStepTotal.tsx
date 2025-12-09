"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import styles from './FinalStepTotal.module.css'

interface FinalStepTotalProps {
	className?: string
	totalPrice: number
	readyDate: string
	onPay: () => void
}

export const FinalStepTotal = observer(function FinalStepTotal({ 
	className, 
	totalPrice, 
	readyDate, 
	onPay 
}: FinalStepTotalProps) {
	const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		configuratorStore.updatePromoCodeValue(e.target.value)
	}

	const handleApplyPromo = () => {
		if (configuratorStore.promoCode) {
			configuratorStore.applyPromo(configuratorStore.promoCode)
		}
	}

	return (
		<div className={`${styles.total} ${className || ''}`}>
			<p className={styles.totalPrice}>Итого {totalPrice}₽</p>
			
			<div className={styles.totalAdditional}>
				<input
					type="text"
					className={styles.totalPromoInput}
					placeholder="Промокод"
					value={configuratorStore.promoCode || ''}
					onChange={handlePromoCodeChange}
				/>
				<button 
					className={styles.totalPromoButton}
					onClick={handleApplyPromo}
				>
					Применить
				</button>
				{configuratorStore.promoAccepted && (
					<span className={styles.totalPromoSuccess}>Скидка применена</span>
				)}
			</div>
			
			<div className={styles.totalButtons}>
				{configuratorStore.editingCartItemId ? (
					<button 
						className={styles.totalSaveBtn} 
						onClick={() => {
							const id = configuratorStore.editingCartItemId
							if (id) {
								configuratorStore.updateCartItem(id)
							}
						}}
					>
						Сохранить изменения
					</button>
				) : (
					<button 
						className={styles.totalAddToCartBtn} 
						onClick={() => configuratorStore.addCurrentToCart()}
					>
						Добавить в корзину
					</button>
				)}
				<button className={styles.totalPayBtn} onClick={onPay}>
					Перейти к оформлению
				</button>
			</div>
			
			<div className={styles.stepPayDescription}>
				<p className={styles.stepPayDescriptionReadyDate}>
					Дата отправки вашего заказа: {readyDate}.
				</p>
				<p className={styles.stepPayDescriptionText}>
					Перед отправкой мы пришлём Вам подробный видеообзор вашего ремешка.
				</p>
			</div>
		</div>
	)
})

