"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguratorControls = void 0;
const ConfiguratorControls_module_css_1 = __importDefault(require("./ConfiguratorControls.module.css"));
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
exports.ConfiguratorControls = (0, mobx_react_lite_1.observer)(function ConfiguratorControls() {
    return (<div className={ConfiguratorControls_module_css_1.default.configuratorControls}>
			<div>
				{configurator_store_1.configuratorStore.currentStepNum > 1 && (<div className={ConfiguratorControls_module_css_1.default.paramsBox}>
						<div className={ConfiguratorControls_module_css_1.default.paramRow}>Модель: {configurator_store_1.configuratorStore.steps.model.modelName}</div>
						<div className={ConfiguratorControls_module_css_1.default.paramRow}>Размер: {configurator_store_1.configuratorStore.steps.model.modelSize}</div>
					</div>)}
			</div>
			<nav className={ConfiguratorControls_module_css_1.default.configuratorControlsNav}>
				<button onClick={() => configurator_store_1.configuratorStore.prevStep()} disabled={configurator_store_1.configuratorStore.currentStepNum === 1}>Назад</button>
				<button onClick={() => configurator_store_1.configuratorStore.nextStep()} disabled={configurator_store_1.configuratorStore.currentStepNum === configurator_store_1.configuratorStore.stepsAmount || !configurator_store_1.configuratorStore.nextStepReady}>Далее</button>
			</nav>
		</div>);
});
//# sourceMappingURL=ConfiguratorControls.js.map