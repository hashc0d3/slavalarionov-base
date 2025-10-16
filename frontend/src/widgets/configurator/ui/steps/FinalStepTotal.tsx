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
	const sharesPrice = Math.round(totalPrice / 4) || 0

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
			
			<div className={styles.totalShares}>
				<img
					className={styles.totalSharesImg}
					src="data:image/jpeg;base64,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"
					alt=""
				/>
				<p className={styles.totalSharesText}>
					4 платежа по {sharesPrice} ₽
				</p>
				<svg 
					xmlns="http://www.w3.org/2000/svg" 
					width="24" 
					height="24" 
					viewBox="0 0 20 26" 
					className={styles.totalSharesIcon}
				>
					<path 
						d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" 
						fill="#9399A1"
					/>
				</svg>
			</div>
			
			<div className={styles.totalButtons}>
				{configuratorStore.editingCartItemId ? (
					<button 
						className={styles.totalSaveBtn} 
						onClick={() => configuratorStore.updateCartItem(configuratorStore.editingCartItemId)}
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
					Примерная дата готовности {readyDate}.
				</p>
				<p className={styles.stepPayDescriptionText}>
					Перед отправкой мы пришлём Вам подробный видеообзор вашего ремешка.
				</p>
			</div>
		</div>
	)
})

