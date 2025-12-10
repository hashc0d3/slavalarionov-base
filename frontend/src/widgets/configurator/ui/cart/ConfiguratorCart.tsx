"use client"

import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { configuratorStore } from '@/shared/store/configurator.store'
import styles from './ConfiguratorCart.module.css'

export const ConfiguratorCart = observer(function ConfiguratorCart() {
	const [isOpen, setIsOpen] = useState(false)

	const totalPrice = configuratorStore.totalPriceWithDiscount
	const productAmount = configuratorStore.productAmount
	const selectedWatchModel = configuratorStore.selectedWatchModel
	const selectedFrameColor = configuratorStore.selectedFrameColor
	const selectedStrapModel = configuratorStore.selectedStrapModel
	const selectedButterflyPrice = selectedStrapModel?.attributes.watch_strap.buckle_butterfly_price ?? 0
	const selectedButterflyLabel =
		selectedButterflyPrice > 0
			? `Butterfly пряжка (+ ${selectedButterflyPrice.toLocaleString('ru-RU')}₽)`
			: 'Butterfly пряжка (в комплекте)'
	const selectedLeatherColor = configuratorStore.selectedLeatherColor
	const selectedStitchingColor = configuratorStore.selectedStitchingColor
	const selectedEdgeColor = configuratorStore.selectedEdgeColor
	const selectedBuckleColor = configuratorStore.selectedBuckleColor
	const selectedAdapterColor = configuratorStore.selectedAdapterColor
	const buckleButterfly = configuratorStore.steps.strapDesign.buckleButterflyChoosen
	const additionalOptions = configuratorStore.steps.final.additionalOptions

	const getSelectedOptionsCount = () => {
		// Считаем только количество товаров в корзине (без текущего)
		return configuratorStore.cartItems.length
	}

	const handleOrderClick = () => {
		configuratorStore.showOrderPopup()
		setIsOpen(false)
	}

	// Не показываем корзину, если она пустая
	if (configuratorStore.cartItems.length === 0) {
		return null
	}

	return (
		<>
			{/* Кнопка корзины */}
			<div 
				className={`${styles.cartButton} ${isOpen ? styles.cartButtonOpen : ''}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className={styles.cartButtonIcon}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
						<path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17A2 2 0 0 1 15 19H9A2 2 0 0 1 7 17V13M9 21V19M15 21V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</div>
				{getSelectedOptionsCount() > 0 && (
					<div className={styles.cartButtonBadge}>
						{getSelectedOptionsCount()}
					</div>
				)}
			</div>

			{/* Всплывающее окно корзины */}
			{isOpen && (
				<div className={styles.cartOverlay} onClick={() => setIsOpen(false)}>
					<div className={styles.cartPopup} onClick={(e) => e.stopPropagation()}>
						<div className={styles.cartHeader}>
							<h3 className={styles.cartTitle}>Ваша конфигурация</h3>
							<button 
								className={styles.cartClose}
								onClick={() => setIsOpen(false)}
							>
								×
							</button>
						</div>

						<div className={styles.cartContent}>
							{/* Отладочная информация */}
							{process.env.NODE_ENV === 'development' && (
								<div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px', fontSize: '12px' }}>
									Товаров в корзине: {configuratorStore.cartItems.length}
								</div>
							)}
							
							{/* Товары в корзине */}
							{configuratorStore.cartItems.length === 0 ? (
								<div className={styles.cartEmpty}>
									<p>Корзина пуста</p>
									<p>Добавьте товары, чтобы увидеть их здесь</p>
								</div>
							) : (
								configuratorStore.cartItems.map((item, index) => {
									const itemButterflyPrice = item.strapModel?.attributes?.watch_strap?.buckle_butterfly_price ?? 0
									const itemButterflyLabel =
										itemButterflyPrice > 0
											? `Butterfly пряжка (+ ${itemButterflyPrice.toLocaleString('ru-RU')}₽)`
											: 'Butterfly пряжка (в комплекте)'
									return (
								<div 
									key={item.id} 
									className={`${styles.cartItemCard} ${configuratorStore.editingCartItemId === item.id ? styles.cartItemCardEditing : ''}`}
									onClick={() => {
										// Если уже редактируем другой товар, сначала отменяем редактирование
										if (configuratorStore.editingCartItemId && configuratorStore.editingCartItemId !== item.id) {
											configuratorStore.cancelEditCartItem()
										}
										configuratorStore.editCartItem(item.id)
									}}
								>
									<div className={styles.cartItemHeader}>
										<h4 className={styles.cartItemTitle}>
											Ремешок #{index + 1}
											{configuratorStore.editingCartItemId === item.id && (
												<span className={styles.cartItemEditingLabel}>Редактируется</span>
											)}
										</h4>
									</div>
									
									<div className={styles.cartItemDetails}>
										{/* Модель часов */}
										{item.watchModel && (
											<div className={styles.cartItemDetail}>
												<span className={styles.cartItemDetailLabel}>Часы:</span>
												<span className={styles.cartItemDetailValue}>
													{item.watchModel.watch_model_manufacturer} {item.watchModel.watch_model_name}
												</span>
											</div>
										)}
										
										{/* Цвет корпуса */}
										{item.frameColor && (
											<div className={styles.cartItemDetail}>
												<span className={styles.cartItemDetailLabel}>Цвет корпуса:</span>
												<span className={styles.cartItemDetailValue}>
													<span 
														className={styles.cartColorPreview}
														style={{ backgroundColor: item.frameColor.color_code || '#e9e9e9' }}
													/>
													{item.frameColor.color_name}
												</span>
											</div>
										)}
										
										{/* Модель ремешка */}
										{item.strapModel && (
											<div className={styles.cartItemDetail}>
												<span className={styles.cartItemDetailLabel}>Ремешок:</span>
												<span className={styles.cartItemDetailValue}>
													{item.strapModel.attributes.watch_strap.strap_title}
												</span>
											</div>
										)}
										
										{/* Цвет кожи */}
										{item.leatherColor && (
											<div className={styles.cartItemDetail}>
												<span className={styles.cartItemDetailLabel}>Кожа:</span>
												<span className={styles.cartItemDetailValue}>
													<span 
														className={styles.cartColorPreview}
														style={{ backgroundColor: item.leatherColor.color_code || '#e9e9e9' }}
													/>
													{item.leatherColor.color_title}
												</span>
											</div>
										)}
										
										{/* Цвет строчки */}
										{item.stitchingColor && (
											<div className={styles.cartItemDetail}>
												<span className={styles.cartItemDetailLabel}>Строчка:</span>
												<span className={styles.cartItemDetailValue}>
													<span 
														className={styles.cartColorPreview}
														style={{ backgroundColor: item.stitchingColor.color_code || '#e9e9e9' }}
													/>
													{item.stitchingColor.color_title}
												</span>
											</div>
										)}
										
										{/* Цвет края */}
										{item.edgeColor && (
											<div className={styles.cartItemDetail}>
												<span className={styles.cartItemDetailLabel}>Край:</span>
												<span className={styles.cartItemDetailValue}>
													<span 
														className={styles.cartColorPreview}
														style={{ backgroundColor: item.edgeColor.color_code || '#e9e9e9' }}
													/>
													{item.edgeColor.color_title}
												</span>
											</div>
										)}
										
										{/* Цвет пряжки */}
										{item.buckleColor && (
											<div className={styles.cartItemDetail}>
												<span className={styles.cartItemDetailLabel}>Пряжка:</span>
												<span className={styles.cartItemDetailValue}>
													<span 
														className={styles.cartColorPreview}
														style={{ backgroundColor: item.buckleColor.color_code || '#e9e9e9' }}
													/>
													{item.buckleColor.color_title}
												</span>
											</div>
										)}
										
										{/* Цвет адаптера */}
										{item.adapterColor && (
											<div className={styles.cartItemDetail}>
												<span className={styles.cartItemDetailLabel}>Адаптер:</span>
												<span className={styles.cartItemDetailValue}>
													<span 
														className={styles.cartColorPreview}
														style={{ backgroundColor: item.adapterColor.color_code || '#e9e9e9' }}
													/>
													{item.adapterColor.color_title}
												</span>
											</div>
										)}
										
										{/* Butterfly пряжка */}
										{item.buckleButterfly && (
											<div className={styles.cartItemDetail}>
												<span className={styles.cartItemDetailLabel}>Дополнительно:</span>
												<span className={styles.cartItemDetailValue}>
													{itemButterflyLabel}
												</span>
											</div>
										)}
										
									{/* Дополнительные опции */}
									{item.additionalOptions?.initials?.choosen && (
										<div className={styles.cartItemDetail}>
											<span className={styles.cartItemDetailLabel}>Инициалы:</span>
											<span className={styles.cartItemDetailValue}>
												{item.additionalOptions.initials.text || 'А.А.'} (+390₽)
											</span>
										</div>
									)}
									
									{item.additionalOptions?.presentBox?.choosen && (
										<div className={styles.cartItemDetail}>
											<span className={styles.cartItemDetailLabel}>Подарочная коробка:</span>
											<span className={styles.cartItemDetailValue}>
												да (+300₽)
											</span>
										</div>
									)}
									
									{item.additionalOptions?.postCard?.choosen && (
										<div className={styles.cartItemDetail}>
											<span className={styles.cartItemDetailLabel}>Подарочная открытка:</span>
											<span className={styles.cartItemDetailValue}>
												{item.additionalOptions.postCard.text || 'Надпись'} (+300₽)
											</span>
										</div>
									)}
										
										<div className={styles.cartItemDetail}>
											<span className={styles.cartItemDetailLabel}>Цена:</span>
											<span className={styles.cartItemDetailValue}>{item.price}₽</span>
										</div>
									</div>
									
									<div className={styles.cartItemActions}>
										<button 
											className={styles.cartItemDeleteButton}
											onClick={(e) => {
												e.stopPropagation()
												configuratorStore.removeFromCart(item.id)
											}}
										>
											Удалить товар
										</button>
									</div>
								</div>
									)
								})
							)}

						</div>

						<div className={styles.cartFooter}>
							<div className={styles.cartTotal}>
								<div className={styles.cartTotalLabel}>
									Итого ({configuratorStore.cartItems.length} товаров):
								</div>
								<div className={styles.cartTotalPrice}>{configuratorStore.totalPrice}₽</div>
							</div>
							
							<div className={styles.cartButtons}>
								{configuratorStore.editingCartItemId ? (
									<>
										<button 
											className={styles.cartSaveButton}
											onClick={() => {
												configuratorStore.updateCartItem(configuratorStore.editingCartItemId!)
												setIsOpen(false)
											}}
										>
											Сохранить изменения
										</button>
										<button 
											className={styles.cartCancelButton}
											onClick={() => {
												configuratorStore.cancelEditCartItem()
												setIsOpen(false)
											}}
										>
											Отменить
										</button>
									</>
								) : (
									<>
										<button 
											className={styles.cartAddMoreButton}
											onClick={() => {
												configuratorStore.resetConfigurator()
												setIsOpen(false)
											}}
										>
											Добавить еще товар
										</button>
										<button 
											className={styles.cartOrderButton}
											onClick={handleOrderClick}
											disabled={configuratorStore.cartItems.length === 0}
										>
											Оформить заказ
										</button>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
})
