"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguratorCart = void 0;
const mobx_react_lite_1 = require("mobx-react-lite");
const react_1 = require("react");
const configurator_store_1 = require("@/shared/store/configurator.store");
const ConfiguratorCart_module_css_1 = __importDefault(require("./ConfiguratorCart.module.css"));
exports.ConfiguratorCart = (0, mobx_react_lite_1.observer)(function ConfiguratorCart() {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const totalPrice = configurator_store_1.configuratorStore.totalPriceWithDiscount;
    const productAmount = configurator_store_1.configuratorStore.productAmount;
    const selectedWatchModel = configurator_store_1.configuratorStore.selectedWatchModel;
    const selectedFrameColor = configurator_store_1.configuratorStore.selectedFrameColor;
    const selectedStrapModel = configurator_store_1.configuratorStore.selectedStrapModel;
    const selectedLeatherColor = configurator_store_1.configuratorStore.selectedLeatherColor;
    const selectedStitchingColor = configurator_store_1.configuratorStore.selectedStitchingColor;
    const selectedEdgeColor = configurator_store_1.configuratorStore.selectedEdgeColor;
    const selectedBuckleColor = configurator_store_1.configuratorStore.selectedBuckleColor;
    const selectedAdapterColor = configurator_store_1.configuratorStore.selectedAdapterColor;
    const buckleButterfly = configurator_store_1.configuratorStore.steps.strapDesign.buckleButterflyChoosen;
    const additionalOptions = configurator_store_1.configuratorStore.steps.final.additionalOptions;
    const getSelectedOptionsCount = () => {
        const cartItemsCount = configurator_store_1.configuratorStore.cartItemsCount;
        const currentItemCount = configurator_store_1.configuratorStore.productAmount;
        return cartItemsCount + currentItemCount;
    };
    const handleOrderClick = () => {
        configurator_store_1.configuratorStore.showOrderPopup();
        setIsOpen(false);
    };
    return (<>
			
			<div className={`${ConfiguratorCart_module_css_1.default.cartButton} ${isOpen ? ConfiguratorCart_module_css_1.default.cartButtonOpen : ''}`} onClick={() => setIsOpen(!isOpen)}>
				<div className={ConfiguratorCart_module_css_1.default.cartButtonIcon}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17A2 2 0 0 1 15 19H9A2 2 0 0 1 7 17V13M9 21V19M15 21V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</div>
				{getSelectedOptionsCount() > 0 && (<div className={ConfiguratorCart_module_css_1.default.cartButtonBadge}>
						{getSelectedOptionsCount()}
					</div>)}
			</div>

			
			{isOpen && (<div className={ConfiguratorCart_module_css_1.default.cartOverlay} onClick={() => setIsOpen(false)}>
					<div className={ConfiguratorCart_module_css_1.default.cartPopup} onClick={(e) => e.stopPropagation()}>
						<div className={ConfiguratorCart_module_css_1.default.cartHeader}>
							<h3 className={ConfiguratorCart_module_css_1.default.cartTitle}>Ваша конфигурация</h3>
							<button className={ConfiguratorCart_module_css_1.default.cartClose} onClick={() => setIsOpen(false)}>
								×
							</button>
						</div>

						<div className={ConfiguratorCart_module_css_1.default.cartContent}>
							
							{process.env.NODE_ENV === 'development' && (<div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px', fontSize: '12px' }}>
									Товаров в корзине: {configurator_store_1.configuratorStore.cartItems.length}
								</div>)}
							
							
							{configurator_store_1.configuratorStore.cartItems.length === 0 ? (<div className={ConfiguratorCart_module_css_1.default.cartEmpty}>
									<p>Корзина пуста</p>
									<p>Добавьте товары, чтобы увидеть их здесь</p>
								</div>) : (configurator_store_1.configuratorStore.cartItems.map((item, index) => (<div key={item.id} className={`${ConfiguratorCart_module_css_1.default.cartItemCard} ${configurator_store_1.configuratorStore.editingCartItemId === item.id ? ConfiguratorCart_module_css_1.default.cartItemCardEditing : ''}`} onClick={() => {
                    if (configurator_store_1.configuratorStore.editingCartItemId && configurator_store_1.configuratorStore.editingCartItemId !== item.id) {
                        configurator_store_1.configuratorStore.cancelEditCartItem();
                    }
                    configurator_store_1.configuratorStore.editCartItem(item.id);
                }}>
									<div className={ConfiguratorCart_module_css_1.default.cartItemHeader}>
										<h4 className={ConfiguratorCart_module_css_1.default.cartItemTitle}>
											Ремешок #{index + 1}
											{configurator_store_1.configuratorStore.editingCartItemId === item.id && (<span className={ConfiguratorCart_module_css_1.default.cartItemEditingLabel}>Редактируется</span>)}
										</h4>
									</div>
									
									<div className={ConfiguratorCart_module_css_1.default.cartItemDetails}>
										
										{item.watchModel && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Часы:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													{item.watchModel.watch_model_manufacturer} {item.watchModel.watch_model_name}
												</span>
											</div>)}
										
										
										{item.frameColor && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Цвет корпуса:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													<span className={ConfiguratorCart_module_css_1.default.cartColorPreview} style={{ backgroundColor: item.frameColor.color_code || '#e9e9e9' }}/>
													{item.frameColor.color_name}
												</span>
											</div>)}
										
										
										{item.strapModel && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Ремешок:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													{item.strapModel.attributes.watch_strap.strap_title}
												</span>
											</div>)}
										
										
										{item.leatherColor && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Кожа:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													<span className={ConfiguratorCart_module_css_1.default.cartColorPreview} style={{ backgroundColor: item.leatherColor.color_code || '#e9e9e9' }}/>
													{item.leatherColor.color_title}
												</span>
											</div>)}
										
										
										{item.stitchingColor && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Строчка:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													<span className={ConfiguratorCart_module_css_1.default.cartColorPreview} style={{ backgroundColor: item.stitchingColor.color_code || '#e9e9e9' }}/>
													{item.stitchingColor.color_title}
												</span>
											</div>)}
										
										
										{item.edgeColor && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Край:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													<span className={ConfiguratorCart_module_css_1.default.cartColorPreview} style={{ backgroundColor: item.edgeColor.color_code || '#e9e9e9' }}/>
													{item.edgeColor.color_title}
												</span>
											</div>)}
										
										
										{item.buckleColor && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Пряжка:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													<span className={ConfiguratorCart_module_css_1.default.cartColorPreview} style={{ backgroundColor: item.buckleColor.color_code || '#e9e9e9' }}/>
													{item.buckleColor.color_title}
												</span>
											</div>)}
										
										
										{item.adapterColor && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Адаптер:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													<span className={ConfiguratorCart_module_css_1.default.cartColorPreview} style={{ backgroundColor: item.adapterColor.color_code || '#e9e9e9' }}/>
													{item.adapterColor.color_title}
												</span>
											</div>)}
										
										
										{item.buckleButterfly && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Дополнительно:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													Butterfly пряжка (+ 500₽)
												</span>
											</div>)}
										
										
										{item.additionalOptions?.initials?.choosen && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Инициалы:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													{item.additionalOptions.initials.text || 'А.А.'} (+ 500₽)
												</span>
											</div>)}
										
										{item.additionalOptions?.presentBox?.choosen && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Подарочная коробка:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													+ 700₽
												</span>
											</div>)}
										
										{item.additionalOptions?.postCard?.choosen && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Подарочная открытка:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													{item.additionalOptions.postCard.text || 'Надпись'} (+ 300₽)
												</span>
											</div>)}
										
										<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
											<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Цена:</span>
											<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>{item.price}₽</span>
										</div>
									</div>
									
									<div className={ConfiguratorCart_module_css_1.default.cartItemActions}>
										<button className={ConfiguratorCart_module_css_1.default.cartItemDeleteButton} onClick={(e) => {
                    e.stopPropagation();
                    configurator_store_1.configuratorStore.removeFromCart(item.id);
                }}>
											Удалить товар
										</button>
									</div>
								</div>)))}

							
							{(selectedWatchModel || selectedStrapModel) && (<div className={ConfiguratorCart_module_css_1.default.cartItemCard}>
									<div className={ConfiguratorCart_module_css_1.default.cartItemHeader}>
										<h4 className={ConfiguratorCart_module_css_1.default.cartItemTitle}>
											Текущий ремешок
											{configurator_store_1.configuratorStore.editingCartItemId && (<span className={ConfiguratorCart_module_css_1.default.cartItemEditingLabel}>Редактируется</span>)}
										</h4>
									</div>
									
									<div className={ConfiguratorCart_module_css_1.default.cartItemDetails}>
										
										{selectedWatchModel && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Часы:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													{selectedWatchModel.watch_model_manufacturer} {selectedWatchModel.watch_model_name}
												</span>
											</div>)}
										
										
										{selectedFrameColor && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Цвет корпуса:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													<span className={ConfiguratorCart_module_css_1.default.cartColorPreview} style={{ backgroundColor: selectedFrameColor.color_code || '#e9e9e9' }}/>
													{selectedFrameColor.color_name}
												</span>
											</div>)}
										
										
										{selectedStrapModel && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Ремешок:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													{selectedStrapModel.attributes.watch_strap.strap_title}
												</span>
											</div>)}
										
										
										{selectedLeatherColor && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Кожа:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													<span className={ConfiguratorCart_module_css_1.default.cartColorPreview} style={{ backgroundColor: selectedLeatherColor.color_code || '#e9e9e9' }}/>
													{selectedLeatherColor.color_title}
												</span>
											</div>)}
										
										
										{selectedStitchingColor && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Строчка:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													<span className={ConfiguratorCart_module_css_1.default.cartColorPreview} style={{ backgroundColor: selectedStitchingColor.color_code || '#e9e9e9' }}/>
													{selectedStitchingColor.color_title}
												</span>
											</div>)}
										
										
										{selectedEdgeColor && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Край:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													<span className={ConfiguratorCart_module_css_1.default.cartColorPreview} style={{ backgroundColor: selectedEdgeColor.color_code || '#e9e9e9' }}/>
													{selectedEdgeColor.color_title}
												</span>
											</div>)}
										
										
										{selectedBuckleColor && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Пряжка:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													<span className={ConfiguratorCart_module_css_1.default.cartColorPreview} style={{ backgroundColor: selectedBuckleColor.color_code || '#e9e9e9' }}/>
													{selectedBuckleColor.color_title}
												</span>
											</div>)}
										
										
										{selectedAdapterColor && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Адаптер:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													<span className={ConfiguratorCart_module_css_1.default.cartColorPreview} style={{ backgroundColor: selectedAdapterColor.color_code || '#e9e9e9' }}/>
													{selectedAdapterColor.color_title}
												</span>
											</div>)}
										
										
										{buckleButterfly && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Дополнительно:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													Butterfly пряжка (+ 500₽)
												</span>
											</div>)}
										
										
										{additionalOptions.initials.choosen && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Инициалы:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													{additionalOptions.initials.text || 'А.А.'} (+ 500₽)
												</span>
											</div>)}
										
										{additionalOptions.presentBox.choosen && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Подарочная коробка:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													+ 700₽
												</span>
											</div>)}
										
										{additionalOptions.postCard.choosen && (<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Подарочная открытка:</span>
												<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>
													{additionalOptions.postCard.text || 'Надпись'} (+ 300₽)
												</span>
											</div>)}
										
										
										<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
											<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Количество:</span>
											<div className={ConfiguratorCart_module_css_1.default.cartQuantityControls}>
												<button className={ConfiguratorCart_module_css_1.default.cartQuantityButton} onClick={() => configurator_store_1.configuratorStore.decreaseQuantity()} disabled={productAmount <= 1}>
													−
												</button>
												<span className={ConfiguratorCart_module_css_1.default.cartQuantityValue}>{productAmount}</span>
												<button className={ConfiguratorCart_module_css_1.default.cartQuantityButton} onClick={() => configurator_store_1.configuratorStore.increaseQuantity()} disabled={productAmount >= 10}>
													+
												</button>
											</div>
										</div>
										
										
										<div className={ConfiguratorCart_module_css_1.default.cartItemDetail}>
											<span className={ConfiguratorCart_module_css_1.default.cartItemDetailLabel}>Цена:</span>
											<span className={ConfiguratorCart_module_css_1.default.cartItemDetailValue}>{totalPrice}₽</span>
										</div>
									</div>
									
									
									{configurator_store_1.configuratorStore.editingCartItemId && (<div className={ConfiguratorCart_module_css_1.default.cartItemActions}>
											<button className={ConfiguratorCart_module_css_1.default.cartItemCancelEditButton} onClick={(e) => {
                        e.stopPropagation();
                        configurator_store_1.configuratorStore.cancelEditCartItem();
                    }}>
												Отменить редактирование
											</button>
										</div>)}
								</div>)}

						</div>

						<div className={ConfiguratorCart_module_css_1.default.cartFooter}>
							<div className={ConfiguratorCart_module_css_1.default.cartTotal}>
								<div className={ConfiguratorCart_module_css_1.default.cartTotalLabel}>
									Итого ({configurator_store_1.configuratorStore.cartItemsCount + productAmount} товаров):
								</div>
								<div className={ConfiguratorCart_module_css_1.default.cartTotalPrice}>{configurator_store_1.configuratorStore.cartTotalPrice + totalPrice}₽</div>
							</div>
							
							<div className={ConfiguratorCart_module_css_1.default.cartButtons}>
								{configurator_store_1.configuratorStore.editingCartItemId ? (<>
										<button className={ConfiguratorCart_module_css_1.default.cartSaveButton} onClick={() => {
                    configurator_store_1.configuratorStore.updateCartItem(configurator_store_1.configuratorStore.editingCartItemId);
                    setIsOpen(false);
                }}>
											Сохранить изменения
										</button>
										<button className={ConfiguratorCart_module_css_1.default.cartCancelButton} onClick={() => {
                    configurator_store_1.configuratorStore.cancelEditCartItem();
                    setIsOpen(false);
                }}>
											Отменить
										</button>
									</>) : (<>
										<button className={ConfiguratorCart_module_css_1.default.cartAddMoreButton} onClick={() => {
                    configurator_store_1.configuratorStore.resetConfigurator();
                    setIsOpen(false);
                }}>
											Добавить еще товар
										</button>
										<button className={ConfiguratorCart_module_css_1.default.cartOrderButton} onClick={handleOrderClick} disabled={configurator_store_1.configuratorStore.cartItemsCount === 0}>
											Оформить заказ
										</button>
									</>)}
							</div>
						</div>
					</div>
				</div>)}
		</>);
});
//# sourceMappingURL=ConfiguratorCart.js.map