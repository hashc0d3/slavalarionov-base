"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPopup = void 0;
const OrderPopup_module_css_1 = __importDefault(require("./OrderPopup.module.css"));
const mobx_react_lite_1 = require("mobx-react-lite");
exports.OrderPopup = (0, mobx_react_lite_1.observer)(function OrderPopup({ visible, onClose }) {
    return (<div className={[OrderPopup_module_css_1.default.overlay, !visible ? OrderPopup_module_css_1.default.hidden : ''].join(' ')} role="dialog" aria-modal="true">
			<div className={OrderPopup_module_css_1.default.modal}>
				<div className={OrderPopup_module_css_1.default.header}>
					<div className={OrderPopup_module_css_1.default.title}>Оформление заказа</div>
					<button className={OrderPopup_module_css_1.default.close} onClick={onClose} aria-label="Закрыть">×</button>
				</div>
				<div className={OrderPopup_module_css_1.default.body}>
					<input placeholder="Ваше имя"/>
					<input placeholder="Телефон"/>
					<input placeholder="Email"/>
				</div>
				<div className={OrderPopup_module_css_1.default.footer}>
					<button className={OrderPopup_module_css_1.default.btn} onClick={onClose}>Отмена</button>
					<button className={[OrderPopup_module_css_1.default.btn, OrderPopup_module_css_1.default.btnPrimary].join(' ')}>Оплатить</button>
				</div>
			</div>
		</div>);
});
//# sourceMappingURL=OrderPopup.js.map