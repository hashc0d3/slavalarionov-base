"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPopup = void 0;
const mobx_react_lite_1 = require("mobx-react-lite");
const react_1 = require("react");
const configurator_store_1 = require("@/shared/store/configurator.store");
const OrderPopup_module_css_1 = __importDefault(require("./OrderPopup.module.css"));
exports.OrderPopup = (0, mobx_react_lite_1.observer)(function OrderPopup({ visible, onClose }) {
    const [formData, setFormData] = (0, react_1.useState)({
        email: '',
        phone: '',
        receiver: '',
        deliveryCity: '',
        deliveryAddress: '',
        deliveryComment: '',
        promoCode: ''
    });
    const [errors, setErrors] = (0, react_1.useState)({});
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (visible) {
            setFormData({
                email: configurator_store_1.configuratorStore.steps.final.email || '',
                phone: configurator_store_1.configuratorStore.steps.final.phone || '',
                receiver: `${configurator_store_1.configuratorStore.steps.final.name.firstName} ${configurator_store_1.configuratorStore.steps.final.name.lastName}`.trim(),
                deliveryCity: '',
                deliveryAddress: '',
                deliveryComment: '',
                promoCode: configurator_store_1.configuratorStore.promoCode || ''
            });
        }
    }, [visible]);
    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Пожалуйста, введите email';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Пожалуйста, введите корректный email';
        }
        if (!formData.phone) {
            newErrors.phone = 'Пожалуйста, введите номер телефона';
        }
        else if (formData.phone.replace(/\D/g, '').length !== 11) {
            newErrors.phone = 'Пожалуйста, введите полный номер телефона';
        }
        if (!formData.receiver) {
            newErrors.receiver = 'Пожалуйста, введите имя получателя';
        }
        if (!formData.deliveryCity) {
            newErrors.deliveryCity = 'Пожалуйста, введите город доставки';
        }
        if (!formData.deliveryAddress) {
            newErrors.deliveryAddress = 'Пожалуйста, введите адрес доставки';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        switch (field) {
            case 'email':
                configurator_store_1.configuratorStore.steps.final.email = value;
                break;
            case 'phone':
                configurator_store_1.configuratorStore.steps.final.phone = '+' + value.replace(/\D/g, '');
                break;
            case 'receiver':
                const nameParts = value.split(' ');
                configurator_store_1.configuratorStore.steps.final.name = {
                    firstName: nameParts[1] || '',
                    lastName: nameParts[0] || '',
                    middleName: nameParts[2] || ''
                };
                break;
            case 'promoCode':
                configurator_store_1.configuratorStore.updatePromoCodeValue(value);
                break;
        }
    };
    const handlePromoCodeApply = async () => {
        if (!formData.promoCode) {
            configurator_store_1.configuratorStore.promoUse(null);
            return;
        }
        try {
            configurator_store_1.configuratorStore.applyPromo(formData.promoCode);
        }
        catch (error) {
            console.error('Ошибка при применении промокода:', error);
        }
    };
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {
            const orderNumber = Date.now().toString();
            configurator_store_1.configuratorStore.orderNumber = orderNumber;
            console.log('Отправка заказа:', {
                orderNumber,
                formData,
                cartItems: configurator_store_1.configuratorStore.cartItems,
                totalPrice: configurator_store_1.configuratorStore.cartTotalPrice
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            configurator_store_1.configuratorStore.cardPay();
            onClose();
        }
        catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (!visible)
        return null;
    return (<div className={OrderPopup_module_css_1.default.order}>
			<div className={OrderPopup_module_css_1.default.orderContent}>
				<button className={OrderPopup_module_css_1.default.closeOrderPopupBtn} onClick={onClose}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</button>

				<h3 className={OrderPopup_module_css_1.default.orderTitle}>Ваш заказ:</h3>

				
				<div className={OrderPopup_module_css_1.default.orderProducts}>
					{configurator_store_1.configuratorStore.cartItems.map((item, index) => (<div key={item.id} className={OrderPopup_module_css_1.default.orderProduct}>
							<div className={OrderPopup_module_css_1.default.orderProductInfo}>
								<h4 className={OrderPopup_module_css_1.default.orderProductTitle}>Ремешок #{index + 1}</h4>
								<div className={OrderPopup_module_css_1.default.orderProductDetails}>
									{item.watchModel && (<div className={OrderPopup_module_css_1.default.orderProductDetail}>
											<span>Часы:</span> {item.watchModel.watch_model_manufacturer} {item.watchModel.watch_model_name}
										</div>)}
									{item.strapModel && (<div className={OrderPopup_module_css_1.default.orderProductDetail}>
											<span>Ремешок:</span> {item.strapModel.attributes.watch_strap.strap_title}
										</div>)}
									{item.leatherColor && (<div className={OrderPopup_module_css_1.default.orderProductDetail}>
											<span>Кожа:</span> {item.leatherColor.color_title}
										</div>)}
								</div>
							</div>
							<div className={OrderPopup_module_css_1.default.orderProductPrice}>
								{item.price}₽
							</div>
						</div>))}
				</div>

				<p className={OrderPopup_module_css_1.default.orderProductsSum}>
					Сумма: {configurator_store_1.configuratorStore.cartTotalPrice} руб.
				</p>

				
				<div className={OrderPopup_module_css_1.default.orderContacts}>
					<div className={OrderPopup_module_css_1.default.inputField}>
						<label className={OrderPopup_module_css_1.default.inputLabel}>E-mail:</label>
						<input type="email" className={`${OrderPopup_module_css_1.default.input} ${errors.email ? OrderPopup_module_css_1.default.inputError : ''}`} placeholder="example@site.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)}/>
						{errors.email && <span className={OrderPopup_module_css_1.default.errorMessage}>{errors.email}</span>}
					</div>

					<div className={OrderPopup_module_css_1.default.inputField}>
						<label className={OrderPopup_module_css_1.default.inputLabel}>Телефон:</label>
						<input type="tel" className={`${OrderPopup_module_css_1.default.input} ${errors.phone ? OrderPopup_module_css_1.default.inputError : ''}`} placeholder="+7 (999) 999-99-99" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)}/>
						{errors.phone && <span className={OrderPopup_module_css_1.default.errorMessage}>{errors.phone}</span>}
					</div>
				</div>

				
				<div className={OrderPopup_module_css_1.default.orderDelivery}>
					<div className={OrderPopup_module_css_1.default.inputField}>
						<label className={OrderPopup_module_css_1.default.inputLabel}>Получатель:</label>
						<input type="text" className={`${OrderPopup_module_css_1.default.input} ${errors.receiver ? OrderPopup_module_css_1.default.inputError : ''}`} placeholder="Иванов Иван Иванович" value={formData.receiver} onChange={(e) => handleInputChange('receiver', e.target.value)}/>
						{errors.receiver && <span className={OrderPopup_module_css_1.default.errorMessage}>{errors.receiver}</span>}
					</div>

					<div className={OrderPopup_module_css_1.default.inputField}>
						<label className={OrderPopup_module_css_1.default.inputLabel}>Город доставки:</label>
						<input type="text" className={`${OrderPopup_module_css_1.default.input} ${errors.deliveryCity ? OrderPopup_module_css_1.default.inputError : ''}`} placeholder="Москва" value={formData.deliveryCity} onChange={(e) => handleInputChange('deliveryCity', e.target.value)}/>
						{errors.deliveryCity && <span className={OrderPopup_module_css_1.default.errorMessage}>{errors.deliveryCity}</span>}
					</div>

					<div className={OrderPopup_module_css_1.default.inputField}>
						<label className={OrderPopup_module_css_1.default.inputLabel}>Адрес доставки:</label>
						<input type="text" className={`${OrderPopup_module_css_1.default.input} ${errors.deliveryAddress ? OrderPopup_module_css_1.default.inputError : ''}`} placeholder="ул. Примерная, д. 1, кв. 1" value={formData.deliveryAddress} onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}/>
						{errors.deliveryAddress && <span className={OrderPopup_module_css_1.default.errorMessage}>{errors.deliveryAddress}</span>}
					</div>
				</div>

				
				<div className={OrderPopup_module_css_1.default.inputField}>
					<label className={OrderPopup_module_css_1.default.inputLabel}>Комментарий к заказу:</label>
					<textarea className={OrderPopup_module_css_1.default.textarea} placeholder="Например, обхват запястья" value={formData.deliveryComment} onChange={(e) => handleInputChange('deliveryComment', e.target.value)}/>
				</div>

				
				<div className={OrderPopup_module_css_1.default.promoWrapper}>
					<div className={OrderPopup_module_css_1.default.inputField}>
						<label className={OrderPopup_module_css_1.default.inputLabel}>Промокод:</label>
						<div className={OrderPopup_module_css_1.default.promoInputWrapper}>
							<input type="text" className={OrderPopup_module_css_1.default.input} placeholder="Введите промокод" value={formData.promoCode} onChange={(e) => handleInputChange('promoCode', e.target.value)}/>
							<button className={OrderPopup_module_css_1.default.promoButton} onClick={handlePromoCodeApply} disabled={!formData.promoCode}>
								Применить
							</button>
						</div>
						{configurator_store_1.configuratorStore.promoAccepted && (<span className={OrderPopup_module_css_1.default.promoSuccess}>Промокод применен</span>)}
					</div>
				</div>

				
				<div className={OrderPopup_module_css_1.default.orderTotalPrice}>
					<p className={OrderPopup_module_css_1.default.orderTotalPriceTitle}>Итого:</p>
					<p className={OrderPopup_module_css_1.default.orderTotalPriceValue}>
						{configurator_store_1.configuratorStore.cartTotalPrice} руб.
					</p>
				</div>

				
				<div className={OrderPopup_module_css_1.default.orderDescription}>
					<p className={OrderPopup_module_css_1.default.orderDescriptionText}>
						Примерная дата готовности: <span>{configurator_store_1.configuratorStore.closestReadyDate}</span>
					</p>
					<p className={OrderPopup_module_css_1.default.orderDescriptionText}>
						Перед отправкой мы пришлём вам подробный видеообзор вашего ремешка.
					</p>
				</div>

				
				<button className={OrderPopup_module_css_1.default.orderPayBtn} onClick={handleSubmit} disabled={isSubmitting}>
					{isSubmitting ? 'Обработка...' : 'Оплатить заказ'}
				</button>

				
				<p className={OrderPopup_module_css_1.default.orderPolicy}>
					Нажимая на "Оплатить заказ", вы соглашаетесь с{' '}
					<a href="https://slavalarionov.com/slavalarionovstore/policy">
						политикой конфиденциальности
					</a>.
				</p>
			</div>
		</div>);
});
//# sourceMappingURL=OrderPopup.js.map