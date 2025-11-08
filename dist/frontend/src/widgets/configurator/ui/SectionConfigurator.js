"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionConfigurator = void 0;
const SectionConfigurator_module_css_1 = __importDefault(require("./SectionConfigurator.module.css"));
const mobx_react_lite_1 = require("mobx-react-lite");
const ConfiguratorSteps_1 = require("./steps/ConfiguratorSteps");
const ConfiguratorControls_1 = require("./controls/ConfiguratorControls");
const StepsProgress_1 = require("./steps/StepsProgress");
const OrderPopup_1 = require("./order-popup/OrderPopup");
const ConfiguratorCart_1 = require("./cart/ConfiguratorCart");
const configurator_store_1 = require("@/shared/store/configurator.store");
exports.SectionConfigurator = (0, mobx_react_lite_1.observer)(function SectionConfigurator() {
    return (<section className={SectionConfigurator_module_css_1.default.configuratorSection}>
			<div className={["container", SectionConfigurator_module_css_1.default.container, SectionConfigurator_module_css_1.default.configuratorSectionContainer].join(' ')}>
				<h2 className={SectionConfigurator_module_css_1.default.configuratorTitle}>Создай уникальный ремешок для своих Apple Watch</h2>
				<div className={SectionConfigurator_module_css_1.default.configuratorContent}>
					<StepsProgress_1.StepsProgress />
					<div className={SectionConfigurator_module_css_1.default.configuratorFixedViewLayer}></div>
					<ConfiguratorControls_1.ConfiguratorControls />
					<ConfiguratorSteps_1.ConfiguratorSteps />
				</div>
			</div>
			<OrderPopup_1.OrderPopup visible={configurator_store_1.configuratorStore.orderPopupVisible} onClose={() => configurator_store_1.configuratorStore.closeOrderPopup()}/>
			<ConfiguratorCart_1.ConfiguratorCart />
		</section>);
});
//# sourceMappingURL=SectionConfigurator.js.map