"use client"

import { observer } from 'mobx-react-lite'
import { useState, useEffect } from 'react'
import { configuratorStore } from '@/shared/store/configurator.store'
import styles from './OrderPopup.module.css'

interface OrderPopupProps {
	visible: boolean
	onClose: () => void
}

export const OrderPopup = observer(function OrderPopup({ visible, onClose }: OrderPopupProps) {
	const [formData, setFormData] = useState({
		email: '',
		phone: '',
		receiver: '',
		deliveryCity: '',
		deliveryAddress: '',
		deliveryComment: '',
		promoCode: ''
	})

	const [errors, setErrors] = useState<Record<string, string>>({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Загружаем сохраненные данные при открытии
	useEffect(() => {
		if (visible) {
			setFormData({
				email: configuratorStore.steps.final.email || '',
				phone: configuratorStore.steps.final.phone || '',
				receiver: `${configuratorStore.steps.final.name.firstName} ${configuratorStore.steps.final.name.lastName}`.trim(),
				deliveryCity: '',
				deliveryAddress: '',
				deliveryComment: '',
				promoCode: configuratorStore.promoCode || ''
			})
		}
	}, [visible])

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		// Email validation
		if (!formData.email) {
			newErrors.email = 'Пожалуйста, введите email'
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = 'Пожалуйста, введите корректный email'
		}

		// Phone validation
		if (!formData.phone) {
			newErrors.phone = 'Пожалуйста, введите номер телефона'
		} else if (formData.phone.replace(/\D/g, '').length !== 11) {
			newErrors.phone = 'Пожалуйста, введите полный номер телефона'
		}

		// Receiver validation
		if (!formData.receiver) {
			newErrors.receiver = 'Пожалуйста, введите имя получателя'
		}

		// Delivery city validation
		if (!formData.deliveryCity) {
			newErrors.deliveryCity = 'Пожалуйста, введите город доставки'
		}

		// Delivery address validation
		if (!formData.deliveryAddress) {
			newErrors.deliveryAddress = 'Пожалуйста, введите адрес доставки'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
		
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: '' }))
		}

		// Save to store
		switch (field) {
			case 'email':
				configuratorStore.steps.final.email = value
				break
			case 'phone':
				configuratorStore.steps.final.phone = '+' + value.replace(/\D/g, '')
				break
			case 'receiver':
				const nameParts = value.split(' ')
				configuratorStore.steps.final.name = {
					firstName: nameParts[1] || '',
					lastName: nameParts[0] || '',
					middleName: nameParts[2] || ''
				}
				break
			case 'promoCode':
				configuratorStore.updatePromoCodeValue(value)
				break
		}
	}

	const handlePromoCodeApply = async () => {
		if (!formData.promoCode) {
			configuratorStore.promoUse(null)
			return
		}

		try {
			// Здесь будет API вызов для проверки промокода
			// Пока что просто симулируем успех
			configuratorStore.applyPromo(formData.promoCode)
		} catch (error) {
			console.error('Ошибка при применении промокода:', error)
		}
	}

	const handleSubmit = async () => {
		if (!validateForm()) {
			return
		}

		setIsSubmitting(true)

		try {
			// Генерируем номер заказа
			const orderNumber = Date.now().toString()
			configuratorStore.orderNumber = orderNumber

			// Здесь будет отправка данных заказа
			console.log('Отправка заказа:', {
				orderNumber,
				formData,
				cartItems: configuratorStore.cartItems,
				totalPrice: configuratorStore.cartTotalPrice
			})

			// Симулируем успешную отправку
			await new Promise(resolve => setTimeout(resolve, 1000))

			// Переходим к оплате
			configuratorStore.cardPay()
			onClose()
		} catch (error) {
			console.error('Ошибка при оформлении заказа:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!visible) return null

	return (
		<div className={styles.order}>
			<div className={styles.orderContent}>
				<button className={styles.closeOrderPopupBtn} onClick={onClose}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</button>

				<h3 className={styles.orderTitle}>Ваш заказ:</h3>

				{/* Товары в заказе */}
				<div className={styles.orderProducts}>
					{configuratorStore.cartItems.map((item, index) => (
						<div key={item.id} className={styles.orderProduct}>
							<div className={styles.orderProductInfo}>
								<h4 className={styles.orderProductTitle}>Ремешок #{index + 1}</h4>
								<div className={styles.orderProductDetails}>
									{item.watchModel && (
										<div className={styles.orderProductDetail}>
											<span>Часы:</span> {item.watchModel.watch_model_manufacturer} {item.watchModel.watch_model_name}
										</div>
									)}
									{item.strapModel && (
										<div className={styles.orderProductDetail}>
											<span>Ремешок:</span> {item.strapModel.attributes.watch_strap.strap_title}
										</div>
									)}
									{item.leatherColor && (
										<div className={styles.orderProductDetail}>
											<span>Кожа:</span> {item.leatherColor.color_title}
										</div>
									)}
								</div>
							</div>
							<div className={styles.orderProductPrice}>
								{item.price}₽
							</div>
						</div>
					))}
				</div>

				<p className={styles.orderProductsSum}>
					Сумма: {configuratorStore.cartTotalPrice} руб.
				</p>

				{/* Контактная информация */}
				<div className={styles.orderContacts}>
					<div className={styles.inputField}>
						<label className={styles.inputLabel}>E-mail:</label>
						<input
							type="email"
							className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
							placeholder="example@site.com"
							value={formData.email}
							onChange={(e) => handleInputChange('email', e.target.value)}
						/>
						{errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
					</div>

					<div className={styles.inputField}>
						<label className={styles.inputLabel}>Телефон:</label>
						<input
							type="tel"
							className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
							placeholder="+7 (999) 999-99-99"
							value={formData.phone}
							onChange={(e) => handleInputChange('phone', e.target.value)}
						/>
						{errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
					</div>
				</div>

				{/* Доставка */}
				<div className={styles.orderDelivery}>
					<div className={styles.inputField}>
						<label className={styles.inputLabel}>Получатель:</label>
						<input
							type="text"
							className={`${styles.input} ${errors.receiver ? styles.inputError : ''}`}
							placeholder="Иванов Иван Иванович"
							value={formData.receiver}
							onChange={(e) => handleInputChange('receiver', e.target.value)}
						/>
						{errors.receiver && <span className={styles.errorMessage}>{errors.receiver}</span>}
					</div>

					<div className={styles.inputField}>
						<label className={styles.inputLabel}>Город доставки:</label>
						<input
							type="text"
							className={`${styles.input} ${errors.deliveryCity ? styles.inputError : ''}`}
							placeholder="Москва"
							value={formData.deliveryCity}
							onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
						/>
						{errors.deliveryCity && <span className={styles.errorMessage}>{errors.deliveryCity}</span>}
					</div>

					<div className={styles.inputField}>
						<label className={styles.inputLabel}>Адрес доставки:</label>
						<input
							type="text"
							className={`${styles.input} ${errors.deliveryAddress ? styles.inputError : ''}`}
							placeholder="ул. Примерная, д. 1, кв. 1"
							value={formData.deliveryAddress}
							onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
						/>
						{errors.deliveryAddress && <span className={styles.errorMessage}>{errors.deliveryAddress}</span>}
					</div>
				</div>

				{/* Комментарий */}
				<div className={styles.inputField}>
					<label className={styles.inputLabel}>Комментарий к заказу:</label>
					<textarea
						className={styles.textarea}
						placeholder="Например, обхват запястья"
						value={formData.deliveryComment}
						onChange={(e) => handleInputChange('deliveryComment', e.target.value)}
					/>
				</div>

				{/* Промокод */}
				<div className={styles.promoWrapper}>
					<div className={styles.inputField}>
						<label className={styles.inputLabel}>Промокод:</label>
						<div className={styles.promoInputWrapper}>
							<input
								type="text"
								className={styles.input}
								placeholder="Введите промокод"
								value={formData.promoCode}
								onChange={(e) => handleInputChange('promoCode', e.target.value)}
							/>
							<button
								className={styles.promoButton}
								onClick={handlePromoCodeApply}
								disabled={!formData.promoCode}
							>
								Применить
							</button>
						</div>
						{configuratorStore.promoAccepted && (
							<span className={styles.promoSuccess}>Промокод применен</span>
						)}
					</div>
				</div>

				{/* Итоговая цена */}
				<div className={styles.orderTotalPrice}>
					<p className={styles.orderTotalPriceTitle}>Итого:</p>
					<p className={styles.orderTotalPriceValue}>
						{configuratorStore.cartTotalPrice} руб.
					</p>
				</div>

				{/* Описание */}
				<div className={styles.orderDescription}>
					<p className={styles.orderDescriptionText}>
						Примерная дата готовности: <span>{configuratorStore.closestReadyDate}</span>
					</p>
					<p className={styles.orderDescriptionText}>
						Перед отправкой мы пришлём вам подробный видеообзор вашего ремешка.
					</p>
				</div>

				{/* Кнопка оплаты */}
				<button
					className={styles.orderPayBtn}
					onClick={handleSubmit}
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Обработка...' : 'Оплатить заказ'}
				</button>

				{/* Политика */}
				<p className={styles.orderPolicy}>
					Нажимая на "Оплатить заказ", вы соглашаетесь с{' '}
					<a href="https://slavalarionov.com/slavalarionovstore/policy">
						политикой конфиденциальности
					</a>.
				</p>
			</div>
		</div>
	)
})